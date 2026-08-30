import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * GET /api/admin/events?since=<ISO>
 * 관리자 앱 알림용 — since 이후의 신규 가입 / 결제를 돌려준다.
 * (별도 SQL 없이 기존 admin_recent_users RPC + purchases 조회만 사용)
 */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const sinceParam = req.nextUrl.searchParams.get('since');
    // 기본값: 6시간 전 (앱이 처음 켜졌을 때 과거를 몰아서 알리지 않도록 짧게)
    const since = sinceParam ? new Date(sinceParam) : new Date(Date.now() - 6 * 3600 * 1000);
    const sinceIso = isNaN(since.getTime()) ? new Date(Date.now() - 6 * 3600 * 1000).toISOString() : since.toISOString();

    try {
        const supabase = getAdminSupabase();

        // ── 신규 가입 ──
        const signups: Array<{ name: string; email: string | null; at: string }> = [];
        try {
            const { data } = await supabase.rpc('admin_recent_users', { p_limit: 50, p_offset: 0 });
            for (const r of (Array.isArray(data) ? data : []) as any[]) {
                if (r?.created_at && new Date(r.created_at) > new Date(sinceIso)) {
                    signups.push({
                        name: r.full_name || r.meta_name || '(이름 없음)',
                        email: r.email ?? null,
                        at: r.created_at,
                    });
                }
            }
        } catch { /* RPC 미설치 등 — 가입 알림만 비게 둔다 */ }

        // ── 신규 결제 (선물·이벤트 지급분과 $0 은 제외: 실결제만) ──
        const purchases: Array<{ productId: string; usd: number; at: string }> = [];
        const { data: pRows } = await supabase
            .from('purchases')
            .select('product_id, price_usd, created_at, receipt')
            .gt('created_at', sinceIso)
            .order('created_at', { ascending: false })
            .limit(50);
        for (const p of (pRows || []) as any[]) {
            const src = p?.receipt?.source;
            if (src === 'inventory_use' || Number(p.price_usd) <= 0) continue;
            purchases.push({
                productId: p.product_id,
                usd: Number(p.price_usd) || 0,
                at: p.created_at,
            });
        }

        return NextResponse.json({
            signups,
            purchases,
            counts: { signups: signups.length, purchases: purchases.length },
            now: new Date().toISOString(),
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
