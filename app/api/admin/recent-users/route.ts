import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * POST /api/admin/recent-users
 * body: { page?: number }   (100명 단위, 0-based)
 * → auth.users.created_at 기준 최신 가입자 100명
 */
const PAGE_SIZE = 100;

export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const body = await req.json().catch(() => ({}));
        const page = Math.max(0, Math.floor(Number(body?.page) || 0));
        const offset = page * PAGE_SIZE;

        const supabase = getAdminSupabase();
        const { data, error } = await supabase.rpc('admin_recent_users', {
            p_limit: PAGE_SIZE,
            p_offset: offset,
        });

        if (error) {
            console.error('admin_recent_users RPC 실패(미설치?):', error.message);
            return NextResponse.json(
                { error: 'RPC(admin_recent_users) 미설치 — supabase/admin_recent_users.sql 을 먼저 실행해주세요.' },
                { status: 500 },
            );
        }

        const rows = Array.isArray(data) ? data : [];
        const users = rows.map((r: any) => ({
            id: r.id,
            email: r.email,
            full_name: r.full_name || r.meta_name || '',
            avatar_url: r.avatar_url || null,
            church_name: r.church_name || null,
            created_at: r.created_at,
        }));

        return NextResponse.json({
            users,
            page,
            pageSize: PAGE_SIZE,
            hasMore: users.length === PAGE_SIZE,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
