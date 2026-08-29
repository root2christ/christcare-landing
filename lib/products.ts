/**
 * Product 카탈로그
 * mobile-app/src/services/SubscriptionService.ts 의 PRODUCT_IDS 와 1:1 일치 유지
 */

export const PRODUCT_IDS = {
    TEST_FAITH:           'test_faith_checkup_v2',
    TEST_CHRIST_BASIC:    'test_christ_basic_v2',
    ANALYSIS_DEEP:        'analysis_deep',
    SUBSCRIPTION_MONTHLY: 'sub_monthly',
    SUBSCRIPTION_YEARLY:  'sub_yearly',
    BIBLE_LIFETIME_PREFIX:'bible_lifetime_',
} as const;

// 앱은 한글 유료 성경 3종(개역개정·새번역·새한글성경)을 $3 번들('korean_all')로 판매.
// mobile-app/src/services/SubscriptionService.ts:
//   KOREAN_BIBLE_BUNDLE_TRANSLATION = 'korean_all', BIBLE_PRICE_USD = 3.0
export type BibleTranslation = 'korean_all';

export const BIBLE_TRANSLATIONS: Record<BibleTranslation, string> = {
    korean_all: '한글 3종 (개역개정·새번역·새한글)',
};

export const KOREAN_BIBLE_BUNDLE_TRANSLATION: BibleTranslation = 'korean_all';
// ── 가격: 앱(mobile-app/src/services/pricing.ts)과 동일한 SoT ──
// 런칭 특가 종료: 2027-01-01 00:00 KST (= 2026-12-31 까지 특가)
const LAUNCH_PRICE_ENDS_AT = new Date('2027-01-01T00:00:00+09:00');
const isLaunchPeriod = () => new Date() < LAUNCH_PRICE_ENDS_AT;
const PRICE_TABLE: Record<string, { normal: number; launch: number }> = {
    test_faith_checkup_v2: { normal: 0,    launch: 0 },     // 항상 무료
    test_christ_basic_v2:  { normal: 1.49, launch: 1.49 },  // legacy(판매 중단)
    analysis_deep:         { normal: 2,    launch: 1 },
    sub_monthly:           { normal: 2,    launch: 1.49 },
    sub_yearly:            { normal: 20,   launch: 15 },
    BIBLE:                 { normal: 2,    launch: 1 },
};
/** 현재 적용가(런칭 특가 기간이면 특가, 이후 정상가) */
export function currentPriceUSD(id: string): number {
    const e = PRICE_TABLE[id];
    if (!e) return 0;
    return isLaunchPeriod() ? e.launch : e.normal;
}

export const BIBLE_PRICE_USD = currentPriceUSD('BIBLE');

export interface ProductCatalogItem {
    productId: string;
    label: string;
    priceUSD: number;
    needsBibleTranslation?: boolean;
}

export const GIFTABLE_PRODUCTS: ProductCatalogItem[] = [
    // 신앙의 계절(test_faith_checkup_v2)은 무료 — 선물 대상에서 제외 (2026-08-29 사장님 지시)
    { productId: PRODUCT_IDS.TEST_CHRIST_BASIC,    label: '크라이스트 테스트',       priceUSD: currentPriceUSD(PRODUCT_IDS.TEST_CHRIST_BASIC) },
    { productId: PRODUCT_IDS.ANALYSIS_DEEP,        label: '심층 분석',               priceUSD: currentPriceUSD(PRODUCT_IDS.ANALYSIS_DEEP) },
    { productId: PRODUCT_IDS.SUBSCRIPTION_MONTHLY, label: '월 구독',                 priceUSD: currentPriceUSD(PRODUCT_IDS.SUBSCRIPTION_MONTHLY) },
    { productId: PRODUCT_IDS.SUBSCRIPTION_YEARLY,  label: '연 구독 (심층분석 2회)',  priceUSD: currentPriceUSD(PRODUCT_IDS.SUBSCRIPTION_YEARLY) },
    // 성경 한글 3종 평생소장 번들 ($3) — 앱이 인식하는 단일 SKU (bible_lifetime_korean_all / korean_all)
    { productId: PRODUCT_IDS.BIBLE_LIFETIME_PREFIX, label: '성경 한글 3종 평생소장 (개역개정·새번역·새한글)', priceUSD: BIBLE_PRICE_USD, needsBibleTranslation: true },
];

export function bibleProductId(translation: BibleTranslation) {
    return `${PRODUCT_IDS.BIBLE_LIFETIME_PREFIX}${translation}`;
}

export function getProductLabel(productId: string, bibleTranslation?: string): string {
    if (productId.startsWith(PRODUCT_IDS.BIBLE_LIFETIME_PREFIX)) {
        const tid = (bibleTranslation || productId.slice(PRODUCT_IDS.BIBLE_LIFETIME_PREFIX.length)) as BibleTranslation;
        return `성경 평생소장 (${BIBLE_TRANSLATIONS[tid] || tid})`;
    }
    const p = GIFTABLE_PRODUCTS.find(x => x.productId === productId);
    return p?.label || productId;
}
