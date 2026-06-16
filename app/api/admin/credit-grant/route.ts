import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';
import { sendPushToUser } from '../../../../lib/push';

/**
 * POST /api/admin/credit-grant
 * Authorization: Bearer <token>
 *
 * body: { targetUserId, targetEmail?, amount (USD number), note? }
 *
 * 관리자가 사용자에게 USD 크레딧을 "선물"한다 (service role → RLS 우회).
 * 즉시 충전하지 않고, 받은 선물함(gift_inventory)에 미사용 크레딧 선물로 넣어둔다.
 * 사용자가 앱 받은 선물함에서 탭 → 충전하기 → redeem_credit_gift RPC 로 그때 잔액 반영.
 *   - gift_inventory 에 product_id='credit_usd', credit_amount=amount, status='available' insert
 *   - admin_gift_grants 에 product_id='credit_usd' 로 로그 (이력 GET에 노출)
 *   - 대상 사용자에게 푸시 (실패해도 지급은 정상)
 */
export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;
    const adminEmail = auth.admin.email;

    try {
        const body = await req.json();
        const { targetUserId, targetEmail, note } = body;

        if (!targetUserId) {
            return NextResponse.json({ error: 'targetUserId 필수' }, { status: 400 });
        }

        const amount = Number(body.amount);
        if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
            return NextResponse.json({ error: '금액은 0보다 크고 100000 이하인 숫자여야 합니다' }, { status: 400 });
        }

        const supabase = getAdminSupabase();

        // 대상 사용자 존재 확인
        const { data: targetUser, error: userErr } = await supabase.auth.admin.getUserById(targetUserId);
        if (userErr || !targetUser?.user) {
            return NextResponse.json({ error: '대상 사용자를 찾을 수 없습니다' }, { status: 404 });
        }
        const resolvedEmail = targetEmail || targetUser.user.email || null;

        // ── 받은 선물함에 미사용 크레딧 선물 적재 (service role → RLS 우회) ──
        // 즉시 충전하지 않고, 사용자가 앱에서 직접 받아야 잔액에 반영된다.
        const { error: invErr } = await supabase.from('gift_inventory').insert({
            user_id: targetUserId,
            product_id: 'credit_usd',
            credit_amount: amount,
            source: 'admin_grant',
            source_note: note?.trim() || null,
            granted_by_admin: adminEmail,
            status: 'available',
        });
        if (invErr) {
            return NextResponse.json({ error: '크레딧 선물 적재 실패: ' + invErr.message }, { status: 500 });
        }

        // 발급 로그 (이력 GET에 노출되도록 admin_gift_grants 에 기록)
        await supabase.from('admin_gift_grants').insert({
            admin_email: adminEmail,
            target_user_id: targetUserId,
            target_email: resolvedEmail,
            product_id: 'credit_usd',
            quantity: amount,
            note: note?.trim() || null,
        });

        // 대상 사용자에게 푸시 (실패해도 적재는 정상)
        try {
            await sendPushToUser(
                supabase,
                targetUserId,
                '🎁 크레딧 선물이 도착했어요',
                '$' + amount + ' 크레딧 — 받은 선물함에서 받으세요',
                { type: 'gift' },
            );
        } catch {
            // 푸시 실패 무시
        }

        return NextResponse.json({
            success: true,
            queued: true,
            amount,
            targetEmail: resolvedEmail,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
