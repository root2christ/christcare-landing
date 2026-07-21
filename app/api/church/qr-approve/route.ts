import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /api/church/qr-approve
 * QR 웹 로그인 승인 — Edge Function 대체 (2026-07-21 설계 변경).
 * 채널 생성(qr-start)·소비(qr-poll)와 같은 환경/클라이언트에서 승인까지 처리해
 * 프로젝트/버전 불일치를 원천 차단한다. 배포도 git push로 일원화.
 *
 * 요청: Authorization: Bearer <앱 사용자 access_token>, body { channel }
 * 응답: { ok: true } | { ok: false, error: <구체 코드> } (항상 200 — 앱이 코드를 그대로 표시)
 */
export async function POST(req: NextRequest) {
    const json = (o: unknown) => NextResponse.json(o);
    try {
        const jwt = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
        if (!jwt) return json({ ok: false, error: 'auth_required' });

        const body = await req.json().catch(() => ({}));
        const channel = (body?.channel || '').toString();
        if (!UUID_RE.test(channel)) return json({ ok: false, error: 'bad_channel' });

        const admin = getAdminSupabase();

        // 1) 호출자(앱 사용자) 확인
        const gu = await admin.auth.getUser(jwt);
        if (gu.error || !gu.data?.user) return json({ ok: false, error: 'auth_fail: ' + (gu.error?.message || 'no user') });
        const email = gu.data.user.email;
        if (!email) return json({ ok: false, error: 'no_email' });

        // 2) 채널 존재 확인
        const chq = await admin.from('web_login_channels').select('channel, created_at').eq('channel', channel).maybeSingle();
        if (chq.error) return json({ ok: false, error: 'channel_query: ' + chq.error.message });
        if (!chq.data) return json({ ok: false, error: 'channel_not_found' });

        // 3) 이 사용자용 매직링크 토큰 생성
        const gl = await admin.auth.admin.generateLink({ type: 'magiclink', email });
        const tokenHash = (gl.data as any)?.properties?.hashed_token;
        if (gl.error || !tokenHash) {
            console.error('[qr-approve] generateLink fail:', gl.error?.message);
            return json({ ok: false, error: 'link_failed: ' + (gl.error?.message || 'no hashed_token') });
        }

        // 4) 채널에 기록 — .select()로 실제 갱신 행 수 검증 (0행 조용한 실패 차단)
        const up = await admin.from('web_login_channels')
            .update({ token_hash: tokenHash, email, approved_at: new Date().toISOString() })
            .eq('channel', channel)
            .select('channel');
        if (up.error) return json({ ok: false, error: 'store_failed: ' + up.error.message });
        if (!up.data || up.data.length === 0) return json({ ok: false, error: 'store_failed: 0 rows updated' });

        console.log('[qr-approve] ok:', channel.slice(0, 8), email.slice(0, 3) + '***');
        return json({ ok: true });
    } catch (e: any) {
        console.error('[qr-approve] exception:', e?.message);
        return json({ ok: false, error: 'exception: ' + String(e?.message || e) });
    }
}
