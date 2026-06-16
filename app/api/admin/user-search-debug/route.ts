import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

// ⚠️ 임시 진단 전용 — 메타데이터 이름 검색이 라이브에서 동작하는지 확인용. 진단 후 삭제.
const KEY = 'SOLUMA_ADMIN_2026';

function mask(email?: string | null): string {
    if (!email) return '';
    const at = email.indexOf('@');
    if (at < 1) return '***';
    return email.slice(0, 2) + '***@' + email.slice(at + 1);
}

export async function GET(req: NextRequest) {
    if (req.nextUrl.searchParams.get('key') !== KEY) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const q = (req.nextUrl.searchParams.get('q') || '').trim();
    const qlc = q.toLowerCase();
    const out: any = {
        q,
        serviceRoleOk: false,
        profilesErr: null,
        profileMatches: [],
        listUsersErr: null,
        scanned: 0,
        metaMatches: [],
    };
    try {
        const supabase = getAdminSupabase();
        out.serviceRoleOk = true;

        const { data: byName, error: byNameErr } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
            .limit(30);
        out.profilesErr = byNameErr?.message || null;
        out.profileMatches = (byName || []).map((u: any) => ({ id: String(u.id).slice(0, 8), full_name: u.full_name, email: mask(u.email) }));

        let scanned = 0;
        for (let page = 1; page <= 20; page++) {
            const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
            if (error) { out.listUsersErr = error.message; break; }
            const users = data?.users || [];
            scanned += users.length;
            for (const u of users) {
                const metaName = (((u.user_metadata as any)?.name || (u.user_metadata as any)?.full_name || '') as string);
                if (metaName && metaName.toLowerCase().includes(qlc)) {
                    out.metaMatches.push({ id: String(u.id).slice(0, 8), metaName, email: mask(u.email) });
                }
            }
            if (users.length < 100) break;
        }
        out.scanned = scanned;
    } catch (e: any) {
        out.fatal = e?.message;
    }
    return NextResponse.json(out);
}
