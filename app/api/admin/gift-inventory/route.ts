import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';
import { PRODUCT_IDS, bibleProductId, getProductLabel, BibleTranslation } from '../../../../lib/products';

const VALID_PRODUCT_IDS = new Set<string>([
    PRODUCT_IDS.TEST_FAITH,
    PRODUCT_IDS.TEST_CHRIST_BASIC,
    PRODUCT_IDS.ANALYSIS_DEEP,
    PRODUCT_IDS.SUBSCRIPTION_MONTHLY,
    PRODUCT_IDS.SUBSCRIPTION_YEARLY,
]);
const VALID_BIBLE_TRANSLATIONS = new Set<string>(['korean_krv', 'korean_new', 'english_niv', 'english_esv']);

/**
 * POST /api/admin/gift-inventory
 * Authorization: Bearer <token>
 * body: { targetUserId, targetEmail?, productId, bibleTranslation?, quantity, note? }
 */
export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;
    const adminEmail = auth.admin.email;

    try {
        const body = await req.json();
        const { targetUserId, targetEmail, productId, bibleTranslation, quantity, note } = body;

        if (!targetUserId) return NextResponse.json({ error: 'targetUserId 필수' }, { status: 400 });

        const qty = parseInt(quantity, 10);
        if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
            return NextResponse.json({ error: '수량은 1-99 사이' }, { status: 400 });
        }

        let finalProductId = productId;
        const isBible = productId === PRODUCT_IDS.BIBLE_LIFETIME_PREFIX || productId?.startsWith(PRODUCT_IDS.BIBLE_LIFETIME_PREFIX);
        if (isBible) {
            if (!bibleTranslation || !VALID_BIBLE_TRANSLATIONS.has(bibleTranslation)) {
                return NextResponse.json({ error: '성경 평생 소장권은 bibleTranslation 필수' }, { status: 400 });
            }
            finalProductId = bibleProductId(bibleTranslation as BibleTranslation);
        } else if (!VALID_PRODUCT_IDS.has(productId)) {
            return NextResponse.json({ error: '알 수 없는 productId' }, { status: 400 });
        }

        const supabase = getAdminSupabase();

        const { data: targetUser, error: userErr } = await supabase.auth.admin.getUserById(targetUserId);
        if (userErr || !targetUser?.user) {
            return NextResponse.json({ error: '대상 사용자를 찾을 수 없습니다' }, { status: 404 });
        }
        const resolvedEmail = targetEmail || targetUser.user.email || null;

        const rows = Array.from({ length: qty }).map(() => ({
            user_id: targetUserId,
            product_id: finalProductId,
            bible_translation: isBible ? bibleTranslation : null,
            source: 'admin_grant',
            source_note: note?.trim() || null,
            granted_by_admin: adminEmail,
            status: 'available',
        }));

        const { error: insertErr } = await supabase.from('gift_inventory').insert(rows);
        if (insertErr) {
            return NextResponse.json({ error: `발급 실패: ${insertErr.message}` }, { status: 500 });
        }

        await supabase.from('admin_gift_grants').insert({
            admin_email: adminEmail,
            target_user_id: targetUserId,
            target_email: resolvedEmail,
            product_id: finalProductId,
            bible_translation: isBible ? bibleTranslation : null,
            quantity: qty,
            note: note?.trim() || null,
        });

        return NextResponse.json({
            success: true,
            granted: qty,
            productLabel: getProductLabel(finalProductId, bibleTranslation),
            targetEmail: resolvedEmail,
        });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}

/**
 * GET /api/admin/gift-inventory
 * Authorization: Bearer <token>
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
