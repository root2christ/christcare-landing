import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { sendFcm } from '../../../../lib/fcm';

/**
 * POST /api/admin/notify-event
 * header: x-admin-secret
 * body:   { kind: 'signup'|'purchase', title, body }
 *
 * DB 트리거(가입·결제)가 호출한다. 관리자 세션이 아니라 공유 비밀로 인증한다.
 */
export async function POST(req: NextRequest) {
    const secret = process.env.ADMIN_NOTIFY_SECRET;
    if (!secret) return NextResponse.json({ error: 'not configured' }, { status: 503 });
    if (req.headers.get('x-admin-secret') !== secret) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    try {
        const { kind, title, body } = await req.json();
        if (!title || !body) return NextResponse.json({ error: 'bad request' }, { status: 400 });

        const supabase = getAdminSupabase();
        const { data } = await supabase.from('admin_devices').select('token');
        const tokens = (data || []).map((r: any) => r.token).filter(Boolean);
        if (tokens.length === 0) return NextResponse.json({ ok: true, sent: 0 });

        const res = await sendFcm(tokens, title, body, { kind: kind || '' });

        // 만료된 토큰 정리
        if (res.invalidTokens.length) {
            await supabase.from('admin_devices').delete().in('token', res.invalidTokens);
        }
        return NextResponse.json({ ok: true, ...res });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
