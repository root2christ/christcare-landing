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
        const qlc = q.toLowerCase();

        // profiles 검색 — 이름 OR 이메일 (모든 사용자 대상, 100명 한계 없음)
        const { data: byName, error: byNameErr } = await supabase
            .from('profiles')
            .select('id, full_name, email, church_id, avatar_url')
            .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
            .limit(30);
        if (byNameErr) {
            console.error('user-search profiles query failed:', byNameErr.message);
        }

        // auth.users 검색 — 이메일 OR 메타데이터 이름(name/full_name).
        // profiles.full_name 이 비어 있고 이름이 auth 메타데이터에만 있는 사용자까지 잡기 위함.
        // 100명 초과 대비 페이지를 끝까지(최대 2000명) 순회한다.
        const byEmail: any[] = [];
        try {
            for (let page = 1; page <= 20; page++) {
                const { data } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
                const users = data?.users || [];
                for (const u of users) {
                    const metaName = ((u.user_metadata as any)?.name || (u.user_metadata as any)?.full_name || '') as string;
                    if (
                        (u.email && u.email.toLowerCase().includes(qlc)) ||
                        (metaName && metaName.toLowerCase().includes(qlc))
                    ) {
                        byEmail.push({ id: u.id, full_name: metaName, email: u.email });
                    }
                }
                if (users.length < 100) break; // 마지막 페이지
            }
        } catch (e: any) {
            console.error('user-search listUsers failed:', e?.message);
        }

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
