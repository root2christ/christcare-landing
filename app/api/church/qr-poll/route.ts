import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

/** 채널 유효시간(분). 이보다 오래된 채널은 무효로 본다. */
const MAX_AGE_MS = 5 * 60 * 1000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/church/qr-poll?c=<channel>
 * 웹이 2초마다 폴링. 앱이 채널을 승인해 token_hash 가 기록됐으면 그 값을 1회용으로
 * 반환(반환과 동시에 행 삭제)한다. 아직이면 {} 반환. 5분 지난 채널은 무효.
 *
 * 응답: { token_hash } | { expired: true } | {} | { error }
 */
export async function GET(req: NextRequest) {
    try {
        const channel = (req.nextUrl.searchParams.get('c') || '').trim();
        if (!channel || !UUID_RE.test(channel)) {
            return NextResponse.json({ error: '잘못된 채널입니다.' }, { status: 400 });
        }

        const sb = getAdminSupabase();
        const { data, error } = await sb
            .from('web_login_channels')
            .select('channel, token_hash, created_at')
            .eq('channel', channel)
            .maybeSingle();

        if (error) {
            console.error('[church/qr-poll] select error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        // 존재하지 않는(또는 이미 소비된) 채널
        if (!data) return NextResponse.json({});

        // 만료 검사 — 5분 지난 채널은 삭제하고 무효 처리
        const createdMs = data.created_at ? new Date(data.created_at).getTime() : 0;
        if (!createdMs || Date.now() - createdMs > MAX_AGE_MS) {
            await sb.from('web_login_channels').delete().eq('channel', channel);
            return NextResponse.json({ expired: true });
        }

        // 아직 승인 전
        if (!data.token_hash) return NextResponse.json({});

        // 승인됨 — 토큰 반환. 행은 즉시 삭제하지 않는다(2026-07-21 설계 변경):
        // verifyOtp 실패 시 재시도·진단이 가능해야 하고, 토큰 자체가 Supabase에서 1회용이라
        // 재사용 위험이 없다. 행 정리는 5분 만료 청소가 담당.
        return NextResponse.json({ token_hash: data.token_hash });
    } catch (e: any) {
        console.error('[church/qr-poll] exception:', e?.message);
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}
