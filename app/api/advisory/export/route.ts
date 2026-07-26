import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

// 관리자: 전체 자문 CSV 다운로드  (/api/advisory/export)
// Authorization: Bearer <supabase-access-token>
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const sb = getAdminSupabase();
        const [{ data: pastors }, { data: fb }] = await Promise.all([
            sb.from('advisory_pastors').select('id,name,church,created_at'),
            sb.from('advisory_feedback').select('pastor_id,item_id,rating,comment,updated_at').order('updated_at', { ascending: true }),
        ]);
        const pmap = new Map((pastors || []).map((p: any) => [p.id, p]));

        const esc = (v: any) => {
            const s = v == null ? '' : String(v);
            return '"' + s.replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
        };
        const rows = [['이름', '교회', '항목ID', '별점', '코멘트', '수정시각'].map(esc).join(',')];
        for (const f of fb || []) {
            const p: any = pmap.get(f.pastor_id) || {};
            rows.push([p.name, p.church, f.item_id, f.rating, f.comment, f.updated_at].map(esc).join(','));
        }
        const csv = '﻿' + rows.join('\r\n'); // BOM (엑셀 한글)
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="advisory_feedback.csv"',
            },
        });
    } catch (e: any) {
        return new NextResponse('Error: ' + (e?.message || ''), { status: 500 });
    }
}
