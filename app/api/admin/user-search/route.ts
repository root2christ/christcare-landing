import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * POST /api/admin/user-search
 * Authorization: Bearer <supabase-access-token>
 * body: { query: string }
 */
export async function POST(req: NextRequest) {
    // 1) 관리자 권한 검증
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const { query } = await req.json();
        const q = (query || '').trim();
        if (q.length < 2) {
            return NextResponse.json({ error: '검색어는 2자 이상' }, { status: 400 });
        }

        const supabase = getAdminSupabase();

        // profiles 검색
        const { data: byName } = await supabase
            .from('profiles')
            .select('id, full_name, email, church_id')
            .ilike('full_name', `%${q}%`)
            .limit(20);

        // auth.users 검색 (이메일)
        let byEmail: any[] = [];
        try {
            const { data: { users } } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
            byEmail = (users || [])
                .filter(u => u.email?.toLowerCase().includes(q.toLowerCase()))
                .slice(0, 20)
                .map(u => ({
                    id: u.id,
                    full_name: (u.user_metadata as any)?.name || (u.user_metadata as any)?.full_name || '',
                    email: u.email,
                }));
        } catch { }

        const seen = new Set<string>();
        const combined: any[] = [];
        for (const u of [...(byName || []), ...byEmail]) {
            if (seen.has(u.id)) continue;
            seen.add(u.id);
            combined.push(u);
            if (combined.length >= 20) break;
        }

        return NextResponse.json({ users: combined });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
