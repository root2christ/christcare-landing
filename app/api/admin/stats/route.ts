import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * GET /api/admin/stats
 * 관리자 통계 — admin_stats() RPC(service_role) 한 번으로 집계본을 받는다.
 */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const supabase = getAdminSupabase();
        const { data, error } = await supabase.rpc('admin_stats');

        if (error) {
            console.error('admin_stats RPC 실패(미설치?):', error.message);
            return NextResponse.json(
                { error: 'RPC(admin_stats) 미설치 — supabase/hotfix_20260830_admin_stats.sql 을 먼저 실행해주세요.' },
                { status: 500 },
            );
        }
        return NextResponse.json({ stats: data });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
