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

        // ── 검색 1순위: RPC admin_search_users — auth.users 를 DB로 직접 조회 ──
        // GoTrue admin.listUsers 가 이 프로젝트에서 'Database error finding users' 로 깨져 있어
        // 우회한다. RPC는 이메일 + 메타데이터 이름(name/full_name) + profiles.full_name 을 한 번에
        // 검색하고, profiles 표시이름을 우선 노출한다. (function 미설치 시 profiles 폴백)
        let combined: any[] = [];
        const { data: rpcRows, error: rpcErr } = await supabase.rpc('admin_search_users', { q });
        if (!rpcErr && Array.isArray(rpcRows)) {
            combined = (rpcRows as any[]).map((r) => ({
                id: r.id,
                email: r.email,
                full_name: r.full_name || r.meta_name || '',
            }));
        } else {
            if (rpcErr) {
                console.error('admin_search_users RPC 실패(미설치?):', rpcErr.message);
            }
            // ── 폴백: profiles 이름 OR 이메일 (RPC 미설치 시) ──
            const { data: byName, error: byNameErr } = await supabase
                .from('profiles')
                .select('id, full_name, email')
                .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
                .limit(30);
            if (byNameErr) console.error('user-search profiles 폴백 실패:', byNameErr.message);
            combined = (byName || []).map((u: any) => ({ id: u.id, email: u.email, full_name: u.full_name }));
        }

        // 중복 제거 + 상위 20명
        const seen = new Set<string>();
        combined = combined.filter((u) => {
            if (!u.id || seen.has(u.id)) return false;
            seen.add(u.id);
            return true;
        }).slice(0, 20);

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
