import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';
import { PRODUCT_IDS, bibleProductId, getProductLabel, BibleTranslation } from '../../../../lib/products';
import { sendPushToUser } from '../../../../lib/push';

const VALID_PRODUCT_IDS = new Set<string>([
    PRODUCT_IDS.TEST_FAITH,
    PRODUCT_IDS.TEST_CHRIST_BASIC,
    PRODUCT_IDS.ANALYSIS_DEEP,
    PRODUCT_IDS.SUBSCRIPTION_MONTHLY,
    PRODUCT_IDS.SUBSCRIPTION_YEARLY,
]);
// 앱이 인식하는 한글 유료 성경 번들 번역본 ID ($3 = 개역개정·새번역·새한글성경 3종 전체).
// mobile-app SubscriptionService.KOREAN_BIBLE_BUNDLE_TRANSLATION === 'korean_all'
const VALID_BIBLE_TRANSLATIONS = new Set<string>(['korean_all']);

interface GiftItem {
    productId: string;
    quantity: number;
    bibleTranslation?: string;
}

interface ItemResult {
    productId: string;
    productLabel: string;
    quantity: number;
    success: boolean;
    error?: string;
}

/**
 * POST /api/admin/gift-inventory
 * Authorization: Bearer <token>
 *
 * 단일 발급 (구형):
 *   body: { targetUserId, targetEmail?, productId, bibleTranslation?, quantity, note? }
 *
 * 다중 발급 (신형):
 *   body: { targetUserId, targetEmail?, items: [{productId, quantity, bibleTranslation?}, ...], note? }
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

        // items 배열 정규화 (구형 단일 발급도 items 배열로 변환)
        let items: GiftItem[] = [];
        if (Array.isArray(body.items)) {
            items = body.items;
        } else if (body.productId) {
            items = [{
                productId: body.productId,
                quantity: body.quantity,
                bibleTranslation: body.bibleTranslation,
            }];
        }

        if (items.length === 0) {
            return NextResponse.json({ error: '발급할 이용권이 없습니다' }, { status: 400 });
        }

        const supabase = getAdminSupabase();

        // 대상 사용자 존재 확인 (한 번만)
        const { data: targetUser, error: userErr } = await supabase.auth.admin.getUserById(targetUserId);
        if (userErr || !targetUser?.user) {
            return NextResponse.json({ error: '대상 사용자를 찾을 수 없습니다' }, { status: 404 });
        }
        const resolvedEmail = targetEmail || targetUser.user.email || null;

        const itemsResult: ItemResult[] = [];
        let totalGranted = 0;

        // 각 item 순차 처리 (실패해도 다른 item은 계속 진행)
        for (const item of items) {
            const qty = parseInt(String(item.quantity), 10);
            if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
                itemsResult.push({
                    productId: item.productId,
                    productLabel: getProductLabel(item.productId, item.bibleTranslation),
                    quantity: qty || 0,
                    success: false,
                    error: '수량은 1-99 사이',
                });
                continue;
            }

            // 상품 검증
            let finalProductId = item.productId;
            const isBible = item.productId === PRODUCT_IDS.BIBLE_LIFETIME_PREFIX
                || item.productId?.startsWith(PRODUCT_IDS.BIBLE_LIFETIME_PREFIX);

            if (isBible) {
                if (!item.bibleTranslation || !VALID_BIBLE_TRANSLATIONS.has(item.bibleTranslation)) {
                    itemsResult.push({
                        productId: item.productId,
                        productLabel: '성경 평생 소장권',
                        quantity: qty,
                        success: false,
                        error: '번역본 필수',
                    });
                    continue;
                }
                finalProductId = bibleProductId(item.bibleTranslation as BibleTranslation);
            } else if (!VALID_PRODUCT_IDS.has(item.productId)) {
                itemsResult.push({
                    productId: item.productId,
                    productLabel: item.productId,
                    quantity: qty,
                    success: false,
                    error: '알 수 없는 productId',
                });
                continue;
            }

            // 보관함 insert (qty 만큼)
            const rows = Array.from({ length: qty }).map(() => ({
                user_id: targetUserId,
                product_id: finalProductId,
                bible_translation: isBible ? item.bibleTranslation : null,
                source: 'admin_grant',
                source_note: note?.trim() || null,
                granted_by_admin: adminEmail,
                status: 'available',
            }));

            const { error: insertErr } = await supabase.from('gift_inventory').insert(rows);

            if (insertErr) {
                itemsResult.push({
                    productId: finalProductId,
                    productLabel: getProductLabel(finalProductId, item.bibleTranslation),
                    quantity: qty,
                    success: false,
                    error: insertErr.message,
                });
                continue;
            }

            // 감사 로그
            await supabase.from('admin_gift_grants').insert({
                admin_email: adminEmail,
                target_user_id: targetUserId,
                target_email: resolvedEmail,
                product_id: finalProductId,
                bible_translation: isBible ? item.bibleTranslation : null,
                quantity: qty,
                note: note?.trim() || null,
            });

            totalGranted += qty;
            itemsResult.push({
                productId: finalProductId,
                productLabel: getProductLabel(finalProductId, item.bibleTranslation),
                quantity: qty,
                success: true,
            });
        }

        const anySuccess = itemsResult.some(r => r.success);
        const anyFail = itemsResult.some(r => !r.success);

        // 발급 성공 시 대상 사용자에게 푸시 (실패해도 발급은 정상)
        if (totalGranted > 0) {
            try {
                const successItems = itemsResult.filter(r => r.success);
                const first = successItems[0];
                const extra = successItems.length - 1;
                let summary = '선물이 도착했어요';
                if (first) {
                    summary = `${first.productLabel} ${first.quantity}장`;
                    if (extra > 0) summary += ` 외 ${extra}건`;
                }
                await sendPushToUser(
                    supabase,
                    targetUserId,
                    '🎁 선물이 도착했어요',
                    summary,
                    { type: 'gift' },
                );
            } catch {
                // 푸시 실패는 무시
            }
        }

        return NextResponse.json({
            success: anySuccess,
            partial: anySuccess && anyFail,
            granted: totalGranted,
            targetEmail: resolvedEmail,
            items: itemsResult,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}

/**
 * GET /api/admin/gift-inventory
 */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const supabase = getAdminSupabase();
        const { data, error } = await supabase
            .from('admin_gift_grants')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        return NextResponse.json({ grants: data || [] });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
