import { NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * POST /api/church/qr-start
 * QR 웹 로그인 채널 생성.
 * service_role 로만 접근 가능한 web_login_channels 에 새 채널(uuid)을 만든다.
 * 앱이 이 채널을 승인하면(Edge Function web-login-approve) token_hash 가 기록되고,
 * qr-poll 이 그것을 받아 웹에서 verifyOtp 로 세션을 만든다.
 *
 * 응답: { channel } | { error }
 */
export async function POST() {
    try {
        const channel = crypto.randomUUID();
        const sb = getAdminSupabase();
        const { error } = await sb
            .from('web_login_channels')
            .insert({ channel });
        if (error) {
            console.error('[church/qr-start] insert error:', error.message);
            return NextResponse.json({ error: '로그인 채널 생성에 실패했습니다.' }, { status: 500 });
        }
        return NextResponse.json({ channel });
    } catch (e: any) {
        console.error('[church/qr-start] exception:', e?.message);
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}
