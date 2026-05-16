import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { verifyAdminPassword } from '../../../../lib/auth';
import { PRODUCT_IDS, bibleProductId, getProductLabel, BibleTranslation } from '../../../../lib/products';

const VALID_PRODUCT_IDS = new Set<string>([
    PRODUCT_IDS.TEST_FAITH,
    PRODUCT_IDS.TEST_CHRIST_BASIC,
    PRODUCT_IDS.ANALYSIS_DEEP,
    PRODUCT_IDS.SUBSCRIPTION_MONTHLY,
    PRODUCT_IDS.SUBSCRIPTION_YEARLY,
]);
const VALID_BIBLE_TRANSLATIONS = new Set<string>([
    'korean_krv', 'korean_new', 'english_niv', 'english_esv',
]);

/**
 * POST /api/admin/gift-inventory
 * body: {
 *   password: string,
 *   adminEmail: string,
 *   targetUserId: string,
 *   targetEmail?: string,
 *   productId: string,              // PRODUCT_IDS 중 하나
 *   bibleTranslation?: string,      // BIBLE_LIFETIME_*일 때만
 *   quantity: number,               // 1-99
 *   note?: string,
 * }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            password, adminEmail, targetUserId, targetEmail,
            productId, bibleTranslation, quantity, note,
        } = body;

        if (!verifyAdminPassword(password)) {
            return NextResponse.json({ error: '인증 실패' }, { status: 401 });
        }

        if (!adminEmail) {
            return NextResponse.json({ error: 'adminEmail 필수' }, { status: 400 });
        }
        if (!targetUserId) {
            return NextResponse.json({ error: 'targetUserId 필수' }, { status: 400 });
        }

        const qty = parseInt(quantity, 10);
        if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
            return NextResponse.json({ error: '수량은 1-99 사이' }, { status: 400 });
        }

        // 상품 검증
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

        // 대상 사용자 존재 확인
        const { data: targetUser, error: userErr } = await supabase.auth.admin.getUserById(targetUserId);
        if (userErr || !targetUser?.user) {
            return NextResponse.json({ error: '대상 사용자를 찾을 수 없습니다' }, { status: 404 });
        }
        const resolvedEmail = targetEmail || targetUser.user.email || null;

        // 보관함에 quantity 개수만큼 insert
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

        // 감사 로그 (별도 테이블)
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
 * GET /api/admin/gift-inventory?password=...
 * 최근 발급 이력 (최대 100건)
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const password = searchParams.get('password');
        if (!verifyAdminPassword(password)) {
            return NextResponse.json({ error: '인증 실패' }, { status: 401 });
        }

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
