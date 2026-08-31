import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';
import { sendPushToUser } from '../../../../lib/push';

/**
 * POST /api/admin/push-user
 * body: { userId?: string, email?: string, title: string, body: string }
 *
 * 특정 사용자 한 명에게만 푸시를 보낸다. (전체 발송은 /api/push)
 * userId 가 없으면 email 로 찾는다.
 */
export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const { userId, email, title, body } = await req.json();
        if (!title?.trim() || !body?.trim()) {
            return NextResponse.json({ error: '제목과 내용을 입력해주세요.' }, { status: 400 });
        }
        if (!userId && !email) {
            return NextResponse.json({ error: '대상(userId 또는 email)이 필요합니다.' }, { status: 400 });
        }

        const supabase = getAdminSupabase();

        // 대상 확정 — userId 우선, 없으면 이메일로 찾는다
        let targetId: string | null = userId || null;
        let targetLabel = email || userId;
        if (!targetId) {
            const { data: rows } = await supabase.rpc('admin_search_users', { q: String(email).trim() });
            const exact = (rows as any[] | null)?.find(
                (r) => (r.email || '').toLowerCase() === String(email).trim().toLowerCase(),
            );
            if (!exact) {
                return NextResponse.json({ error: `사용자를 찾지 못했습니다: ${email}` }, { status: 404 });
            }
            targetId = exact.id;
            targetLabel = exact.email;
        }

        // 토큰이 없으면 보낼 곳이 없다 — 조용히 0 이 아니라 이유를 알려준다
        const { count } = await supabase
            .from('push_tokens')
            .select('token', { count: 'exact', head: true })
            .eq('user_id', targetId);

        if (!count) {
            return NextResponse.json({
                error: `${targetLabel} 님의 푸시 토큰이 없습니다. (앱에서 알림을 허용한 적이 없거나 로그아웃 상태)`,
            }, { status: 404 });
        }

        const res = await sendPushToUser(supabase, targetId!, title.trim(), body.trim(), { type: 'admin_direct' });

        return NextResponse.json({
            ok: true,
            sent: res.sent,
            tokens: count,
            target: targetLabel,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
