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
            .select('id, full_name, email, church_id, avatar_url')
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

        // 동명이인 구분용 메타 보강: 프로필 사진 + 소속 교회 (best-effort)
        // byEmail(auth.users) 결과는 profiles 정보가 없으므로 일괄 조회로 채운다.
        try {
            const ids = combined.map(u => u.id);
            if (ids.length > 0) {
                const { data: profs } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, church_id')
                    .in('id', ids);
                const pmap = new Map((profs || []).map((p: any) => [p.id, p]));
                for (const u of combined) {
                    const p = pmap.get(u.id);
                    if (p) {
                        u.avatar_url = u.avatar_url ?? p.avatar_url ?? null;
                        u.church_id = u.church_id ?? p.church_id ?? null;
                        if (!u.full_name && p.full_name) u.full_name = p.full_name;
                    }
                }
                const churchIds = Array.from(new Set(combined.map(u => u.church_id).filter(Boolean)));
                if (churchIds.length > 0) {
                    const { data: chs } = await supabase
                        .from('churches')
                        .select('id, name')
                        .in('id', churchIds as string[]);
                    const cmap = new Map((chs || []).map((c: any) => [c.id, c.name]));
                    for (const u of combined) {
                        u.church_name = u.church_id ? (cmap.get(u.church_id) || null) : null;
                    }
                }
            }
        } catch { }

        return NextResponse.json({ users: combined });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
