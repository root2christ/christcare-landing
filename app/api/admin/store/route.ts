import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin-auth';
import {
    appleDaily, appleReviews, appleRating,
    appleConfigured, appleSalesConfigured, APPLE_APP_ID,
    type Review,
} from '../../../../lib/appstore';
import {
    googleReviews, googleInstalls, ratingFromReviews,
    googleConfigured, googleInstallsConfigured, ANDROID_PACKAGE,
} from '../../../../lib/googleplay';

/**
 * GET /api/admin/store?days=14
 * 애플·구글 스토어 지표를 한 번에. 설정 안 된 부분은 빈 값 + setup 플래그로 알려준다.
 */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const raw = Number(req.nextUrl.searchParams.get('days') || 14);
    const days = Number.isFinite(raw) ? Math.min(35, Math.max(1, Math.floor(raw))) : 14;
    const month = new Date().toISOString().slice(0, 7).replace('-', '');
    const prevMonth = (() => {
        const d = new Date(); d.setMonth(d.getMonth() - 1);
        return d.toISOString().slice(0, 7).replace('-', '');
    })();

    // 하나가 실패해도 나머지는 보이도록 전부 개별 방어
    const [daily, aReviews, aRating, gReviews, gInst, gInstPrev] = await Promise.all([
        appleDaily(days).catch(() => []),
        appleReviews(10).catch(() => []),
        appleRating('kr').catch(() => null),
        googleReviews(10).catch(() => []),
        googleInstalls(month).catch(() => null),
        googleInstalls(prevMonth).catch(() => null),
    ]);

    const rows = daily as any[];
    const sum = (f: (r: any) => number) => { let n = 0; for (const r of rows) n += f(r); return n; };
    const reviews: Review[] = [...aReviews, ...gReviews]
        .sort((a, b) => (b.at || '').localeCompare(a.at || ''))
        .slice(0, 15);

    return NextResponse.json({
        days,
        apple: {
            appId: APPLE_APP_ID,
            rating: aRating,
            daily,
            totals: {
                downloads: sum(r => r.downloads),
                updates: sum(r => r.updates),
                iapUnits: sum(r => r.iapUnits),
                proceeds: Math.round(sum(r => r.proceeds) * 100) / 100,
                currency: daily[0]?.currency || 'USD',
            },
        },
        google: {
            packageName: ANDROID_PACKAGE,
            rating: ratingFromReviews(gReviews),
            installs: gInst,
            installsPrev: gInstPrev,
        },
        reviews,
        setup: {
            apple: appleConfigured(),
            appleSales: appleSalesConfigured(),
            google: googleConfigured(),
            googleInstalls: googleInstallsConfigured(),
        },
        generatedAt: new Date().toISOString(),
    });
}
