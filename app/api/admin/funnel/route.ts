import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * GET /api/admin/funnel?days=7
 * 구독 퍼널 — admin_funnel() RPC(service_role).
 */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const daysRaw = Number(req.nextUrl.searchParams.get('days') || 7);
    const days = Number.isFinite(daysRaw) ? Math.min(90, Math.max(1, Math.floor(daysRaw))) : 7;

    try {
        const supabase = getAdminSupabase();
        const { data, error } = await supabase.rpc('admin_funnel', { p_days: days });
        if (error) {
            console.error('admin_funnel RPC 실패(미설치?):', error.message);
            return NextResponse.json(
                { error: 'RPC(admin_funnel) 미설치 — supabase/hotfix_20260830c_app_events.sql 을 먼저 실행해주세요.' },
                { status: 500 },
            );
        }
        return NextResponse.json({ funnel: data });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
