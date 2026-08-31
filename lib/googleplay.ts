import crypto from 'crypto';
import zlib from 'zlib';
import type { Review } from './appstore';

/**
 * Google Play — 리뷰 + 설치 통계
 *
 * 인증: 서비스 계정 JWT(RS256). 결제 검증에 쓰는 GOOGLE_SERVICE_ACCOUNT_JSON 을 그대로 쓴다.
 *
 * 리뷰   : androidpublisher reviews.list  (최근 1주일치만 준다 — 구글 정책)
 * 설치   : Play Console 통계 리포트는 API 가 아니라 GCS 버킷의 CSV 로 제공된다.
 *          Play Console → 다운로드 → 보고서 에 있는 gs:// 버킷 이름을 넣어야 동작한다.
 *          (GOOGLE_PLAY_REPORT_BUCKET). 없으면 설치 통계만 조용히 건너뛴다.
 *
 * 매출은 우리 purchases 테이블이 더 정확하고 즉시라 여기서 따로 안 가져온다.
 * (스토어 리포트는 1~2일 지연 + 월 단위 정산)
 */

export const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE || 'com.root2christ.christapp';

type SA = { client_email: string; private_key: string; project_id: string };

function sa(): SA | null {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) return null;
    try {
        const j = JSON.parse(raw);
        if (!j.client_email || !j.private_key) return null;
        j.private_key = String(j.private_key).replace(/\\n/g, '\n');
        return j as SA;
    } catch {
        return null;
    }
}

const b64u = (v: string | object) =>
    Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');

const tokenCache = new Map<string, { token: string; exp: number }>();

async function accessToken(scope: string): Promise<string | null> {
    const acct = sa();
    if (!acct) return null;
    const now = Math.floor(Date.now() / 1000);
    const hit = tokenCache.get(scope);
    if (hit && hit.exp - 60 > now) return hit.token;

    const header = b64u({ alg: 'RS256', typ: 'JWT' });
    const claim = b64u({
        iss: acct.client_email,
        scope,
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    });
    const sig = crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(acct.private_key).toString('base64url');

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${header}.${claim}.${sig}`,
        }),
    });
    const json: any = await res.json();
    if (!json.access_token) return null;
    tokenCache.set(scope, { token: json.access_token, exp: now + 3500 });
    return json.access_token;
}

// ── 리뷰 ──────────────────────────────────────────────────
export async function googleReviews(limit = 10): Promise<Review[]> {
    const t = await accessToken('https://www.googleapis.com/auth/androidpublisher');
    if (!t) return [];
    try {
        const res = await fetch(
            `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${ANDROID_PACKAGE}/reviews?maxResults=${limit}`,
            { headers: { Authorization: `Bearer ${t}` } },
        );
        if (!res.ok) return [];
        const json: any = await res.json();
        return (json.reviews || []).map((r: any) => {
            const c = r.comments?.[0]?.userComment || {};
            const ms = c.lastModified?.seconds ? Number(c.lastModified.seconds) * 1000 : 0;
            return {
                store: 'google' as const,
                rating: c.starRating ?? 0,
                body: c.text || '',
                author: r.authorName || undefined,
                territory: c.reviewerLanguage || undefined,
                at: ms ? new Date(ms).toISOString() : '',
            };
        });
    } catch {
        return [];
    }
}

// ── 설치 통계 (GCS 버킷 CSV) ───────────────────────────────
export type GoogleInstalls = { month: string; installs: number; uninstalls: number } | null;

/**
 * 월별 설치 overview CSV.
 * 경로: stats/installs/installs_<package>_YYYYMM_overview.csv  (UTF-16LE)
 */
export async function googleInstalls(yyyymm: string): Promise<GoogleInstalls> {
    const bucket = process.env.GOOGLE_PLAY_REPORT_BUCKET;
    if (!bucket) return null;
    const t = await accessToken('https://www.googleapis.com/auth/devstorage.read_only');
    if (!t) return null;

    const object = `stats/installs/installs_${ANDROID_PACKAGE}_${yyyymm}_overview.csv`;
    try {
        const res = await fetch(
            `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(object)}?alt=media`,
            { headers: { Authorization: `Bearer ${t}` } },
        );
        if (!res.ok) return null;
        let buf = Buffer.from(await res.arrayBuffer());
        if (buf[0] === 0x1f && buf[1] === 0x8b) buf = zlib.gunzipSync(buf);
        // Play 리포트는 UTF-16LE (BOM 포함)
        const text = buf.toString(buf[0] === 0xff && buf[1] === 0xfe ? 'utf16le' : 'utf8').replace(/^﻿/, '');

        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) return null;
        const head = lines[0].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        const iInstall = head.findIndex(h => /Daily Device Installs|Daily User Installs/i.test(h));
        const iUninstall = head.findIndex(h => /Daily Device Uninstalls|Daily User Uninstalls/i.test(h));

        let installs = 0, uninstalls = 0;
        for (const line of lines.slice(1)) {
            const f = line.split(',');
            if (iInstall >= 0) installs += parseInt(f[iInstall] || '0', 10) || 0;
            if (iUninstall >= 0) uninstalls += parseInt(f[iUninstall] || '0', 10) || 0;
        }
        return { month: yyyymm, installs, uninstalls };
    } catch {
        return null;
    }
}

/** 별점 요약 — Play 는 공식 API 가 없어 리뷰 평균으로 대신한다(참고용) */
export function ratingFromReviews(reviews: Review[]): { average: number; count: number } | null {
    const rated = reviews.filter(r => r.rating > 0);
    if (rated.length === 0) return null;
    const avg = rated.reduce((s, r) => s + r.rating, 0) / rated.length;
    return { average: Math.round(avg * 10) / 10, count: rated.length };
}

export const googleConfigured = () => !!sa();
export const googleInstallsConfigured = () => !!sa() && !!process.env.GOOGLE_PLAY_REPORT_BUCKET;
