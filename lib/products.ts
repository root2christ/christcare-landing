/**
 * Product 카탈로그
 * mobile-app/src/services/SubscriptionService.ts 의 PRODUCT_IDS 와 1:1 일치 유지
 */

export const PRODUCT_IDS = {
    TEST_FAITH:           'test_faith_checkup',
    TEST_CHRIST_BASIC:    'test_christ_basic',
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
export const BIBLE_PRICE_USD = 3.0;

export interface ProductCatalogItem {
    productId: string;
    label: string;
    priceUSD: number;
    needsBibleTranslation?: boolean;
}

export const GIFTABLE_PRODUCTS: ProductCatalogItem[] = [
    { productId: PRODUCT_IDS.TEST_FAITH,           label: '신앙심 테스트',           priceUSD: 1.0 },
    { productId: PRODUCT_IDS.TEST_CHRIST_BASIC,    label: '크라이스트 테스트',       priceUSD: 1.49 },
    { productId: PRODUCT_IDS.ANALYSIS_DEEP,        label: '심층 분석',               priceUSD: 3.0 },
    { productId: PRODUCT_IDS.SUBSCRIPTION_MONTHLY, label: '월 구독',                 priceUSD: 2.0 },
    { productId: PRODUCT_IDS.SUBSCRIPTION_YEARLY,  label: '연 구독 (심층분석 2회)',  priceUSD: 20.0 },
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
