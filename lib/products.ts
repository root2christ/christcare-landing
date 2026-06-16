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

export type BibleTranslation = 'korean_krv' | 'korean_new' | 'english_niv' | 'english_esv';

export const BIBLE_TRANSLATIONS: Record<BibleTranslation, string> = {
    korean_krv:  '개역개정',
    korean_new:  '새번역',
    english_niv: 'NIV',
    english_esv: 'ESV',
};

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
    { productId: PRODUCT_IDS.BIBLE_LIFETIME_PREFIX,label: '성경 평생 소장권',         priceUSD: 6.0, needsBibleTranslation: true },
];

export function bibleProductId(translation: BibleTranslation) {
    return `${PRODUCT_IDS.BIBLE_LIFETIME_PREFIX}${translation}`;
}

export function getProductLabel(productId: string, bibleTranslation?: string): string {
    if (productId.startsWith(PRODUCT_IDS.BIBLE_LIFETIME_PREFIX)) {
        const tid = (bibleTranslation || productId.slice(PRODUCT_IDS.BIBLE_LIFETIME_PREFIX.length)) as BibleTranslation;
        return `성경 평생 소장권 (${BIBLE_TRANSLATIONS[tid] || tid})`;
    }
    const p = GIFTABLE_PRODUCTS.find(x => x.productId === productId);
    return p?.label || productId;
}
