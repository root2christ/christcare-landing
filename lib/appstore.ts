import crypto from 'crypto';
import zlib from 'zlib';

/**
 * App Store Connect API — 다운로드 · 매출(개발자 수익) · 별점 · 리뷰
 *
 * 인증: ES256 JWT (Issuer ID + Key ID + .p8 개인키)
 *   ⚠️ JWT 의 ES256 서명은 raw r||s 64바이트여야 한다. node 기본은 DER 이라
 *      dsaEncoding:'ieee-p1363' 을 반드시 줘야 한다. (없으면 401 만 계속 난다)
 *
 * 필요한 환경변수
 *   APPLE_ASC_ISSUER_ID      App Store Connect > 통합 > Issuer ID
 *   APPLE_ASC_KEY_ID         생성한 키의 Key ID
 *   APPLE_ASC_PRIVATE_KEY    AuthKey_XXXX.p8 파일 내용 전체
 *   APPLE_ASC_VENDOR_NUMBER  판매 리포트용 벤더 번호 (지급 및 재무 보고서에서 확인)
 *   APPLE_APP_ID             앱의 숫자 ID (기본값 있음)
 */

const ASC = 'https://api.appstoreconnect.apple.com';

/** 마지막 애플 응답 — 왜 비었는지 관리자 화면에서 확인하기 위한 진단용 */
export const lastApple: { sales?: string; reviews?: string; key?: string } = {};
export const APPLE_APP_ID = process.env.APPLE_APP_ID || '6779090825';

type Creds = { issuerId: string; keyId: string; privateKey: string; vendorNumber?: string };

function creds(): Creds | null {
    const issuerId = process.env.APPLE_ASC_ISSUER_ID;
    const keyId = process.env.APPLE_ASC_KEY_ID;
    const rawKey = process.env.APPLE_ASC_PRIVATE_KEY;
    if (!issuerId || !keyId || !rawKey) return null;
    const privateKey = normalizeP8(rawKey);
    if (!privateKey) return null;
    return { issuerId, keyId, privateKey, vendorNumber: process.env.APPLE_ASC_VENDOR_NUMBER };
}


/**
 * .p8 개인키를 어떤 형태로 붙여넣었든 올바른 PEM 으로 되돌린다.
 *
 * 환경변수에 키를 넣을 때 흔히 이렇게 망가진다:
 *  - BEGIN/END 줄을 빼고 가운데 본문만 붙여넣음  ← 실제로 겪음
 *  - 줄바꿈이 사라져 한 줄이 됨
 *  - 줄바꿈이 리터럴 \n 문자열로 들어감
 *  - 앞뒤에 따옴표가 붙음
 * 어느 쪽이든 base64 본문만 살려서 표준 PEM 으로 다시 조립한다.
 */
function normalizeP8(raw: string): string | null {
    let t = raw.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
    const body = t
        .replace(/-----BEGIN [^-]+-----/g, '')
        .replace(/-----END [^-]+-----/g, '')
        .replace(/\s+/g, '');
    if (!body || !/^[A-Za-z0-9+/=]+$/.test(body)) return null;
    const lines = body.match(/.{1,64}/g) || [];
    return `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----\n`;
}

const b64u = (v: string | object) =>
    Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');

let cached: { token: string; exp: number } | null = null;

function token(c: Creds): string {
    const now = Math.floor(Date.now() / 1000);
    if (cached && cached.exp - 60 > now) return cached.token;

    const header = b64u({ alg: 'ES256', kid: c.keyId, typ: 'JWT' });
    const claim = b64u({
        iss: c.issuerId,
        iat: now,
        exp: now + 15 * 60,      // 애플 상한 20분
        aud: 'appstoreconnect-v1',
    });
    let sig: string;
    try {
        sig = crypto
            .sign('sha256', Buffer.from(`${header}.${claim}`), {
                key: c.privateKey,
                dsaEncoding: 'ieee-p1363',   // ★ JWT ES256 은 raw r||s
            })
            .toString('base64url');
    } catch (e: any) {
        // 거의 대부분 .p8 내용이 잘못 들어간 경우다. 어떻게 잘못됐는지까지 남긴다.
        const k = c.privateKey || '';
        lastApple.key = [
            `서명 실패: ${e?.message || e}`,
            `길이 ${k.length}`,
            `BEGIN 헤더 ${k.includes('-----BEGIN PRIVATE KEY-----') ? '있음' : '없음'}`,
            `줄바꿈 ${(k.match(/\n/g) || []).length}개`,
        ].join(' · ');
        throw e;
    }

    const jwt = `${header}.${claim}.${sig}`;
    cached = { token: jwt, exp: now + 15 * 60 };
    return jwt;
}

// ── 판매 리포트 ────────────────────────────────────────────
export type DailyRow = {
    date: string;
    downloads: number;      // 신규 다운로드(첫 설치)
    updates: number;
    iapUnits: number;       // 인앱 결제 건수
    proceeds: number;       // 개발자 수익 (수수료 차감 후)
    currency: string;
};

/** Product Type Identifier 분류 — 애플 문서 기준 */
const isDownload = (t: string) => /^1[EFTP]?$/i.test(t) || t === '1' || t === 'F1';
const isUpdate = (t: string) => /^7[EFT]?$/i.test(t) || t === 'F7';
const isIAP = (t: string) => /^(IA|FI)/i.test(t);

/** 하루치 SALES SUMMARY 리포트 (없으면 null — 리포트 생성 전이거나 매출 0) */
async function salesReport(c: Creds, date: string): Promise<DailyRow | null> {
    if (!c.vendorNumber) return null;
    const qs = new URLSearchParams({
        'filter[frequency]': 'DAILY',
        'filter[reportDate]': date,
        'filter[reportSubType]': 'SUMMARY',
        'filter[reportType]': 'SALES',
        'filter[vendorNumber]': c.vendorNumber,
        'filter[version]': '1_0',
    });
    const res = await fetch(`${ASC}/v1/salesReports?${qs}`, {
        headers: { Authorization: `Bearer ${token(c)}`, Accept: 'application/a-gzip' },
    });
    if (!res.ok) {
        // 404 = 그날 리포트 없음(판매 0) — 정상. 그 외(401/403)는 설정 문제라 남긴다.
        if (res.status !== 404) {
            lastApple.sales = `${res.status} ${(await res.text().catch(() => '')).slice(0, 300)}`;
        } else if (!lastApple.sales) {
            lastApple.sales = '404 (해당 날짜 리포트 없음 — 판매/다운로드 0이면 정상)';
        }
        return null;
    }
    lastApple.sales = 'ok';

    let tsv: string;
    try {
        const buf = Buffer.from(await res.arrayBuffer());
        tsv = zlib.gunzipSync(buf).toString('utf8');
    } catch {
        return null;
    }

    const lines = tsv.split('\n').filter(Boolean);
    if (lines.length < 2) return null;
    const head = lines[0].split('\t').map(s => s.trim());
    const col = (n: string) => head.indexOf(n);
    const cType = col('Product Type Identifier');
    const cUnits = col('Units');
    const cProceeds = col('Developer Proceeds');
    const cCur = col('Currency of Proceeds');
    if (cType < 0 || cUnits < 0) return null;

    const row: DailyRow = { date, downloads: 0, updates: 0, iapUnits: 0, proceeds: 0, currency: 'USD' };
    for (const line of lines.slice(1)) {
        const f = line.split('\t');
        const type = (f[cType] || '').trim();
        const units = parseInt(f[cUnits] || '0', 10) || 0;
        const per = parseFloat((f[cProceeds] || '0').trim()) || 0;
        if (cCur >= 0 && f[cCur]) row.currency = f[cCur].trim();

        if (isDownload(type)) row.downloads += units;
        else if (isUpdate(type)) row.updates += units;
        else if (isIAP(type)) row.iapUnits += units;
        row.proceeds += per * units;
    }
    row.proceeds = Math.round(row.proceeds * 100) / 100;
    return row;
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** 최근 n일 일별 리포트 (애플은 1~2일 지연되므로 어제부터 거슬러 올라간다) */
export async function appleDaily(days: number): Promise<DailyRow[]> {
    const c = creds();
    if (!c || !c.vendorNumber) return [];
    const dates: string[] = [];
    for (let i = 1; i <= Math.min(days, 35); i++) {
        dates.push(ymd(new Date(Date.now() - i * 86400000)));
    }
    const rows = await Promise.all(dates.map(d => salesReport(c, d).catch((e) => {
        if (!lastApple.sales) lastApple.sales = `예외: ${e?.message || e}`;
        return null;
    })));
    return rows.filter((r): r is DailyRow => !!r).sort((a, b) => a.date.localeCompare(b.date));
}

// ── 리뷰 ──────────────────────────────────────────────────
export type Review = {
    store: 'apple' | 'google';
    rating: number;
    title?: string;
    body: string;
    author?: string;
    territory?: string;
    at: string;
};

export async function appleReviews(limit = 10): Promise<Review[]> {
    const c = creds();
    if (!c) return [];
    try {
        const res = await fetch(
            `${ASC}/v1/apps/${APPLE_APP_ID}/customerReviews?limit=${limit}&sort=-createdDate`,
            { headers: { Authorization: `Bearer ${token(c)}` } },
        );
        if (!res.ok) {
            lastApple.reviews = `${res.status} ${(await res.text().catch(() => '')).slice(0, 300)}`;
            return [];
        }
        lastApple.reviews = 'ok';
        const json: any = await res.json();
        return (json.data || []).map((d: any) => ({
            store: 'apple' as const,
            rating: d.attributes?.rating ?? 0,
            title: d.attributes?.title || undefined,
            body: d.attributes?.body || '',
            author: d.attributes?.reviewerNickname || undefined,
            territory: d.attributes?.territory || undefined,
            at: d.attributes?.createdDate || '',
        }));
    } catch (e: any) {
        if (!lastApple.reviews) lastApple.reviews = `예외: ${e?.message || e}`;
        return [];
    }
}

/** 별점 요약 — iTunes lookup(인증 불필요). 스토어프론트별로 다르다. */
export async function appleRating(country = 'kr'): Promise<{ average: number; count: number } | null> {
    try {
        const res = await fetch(`https://itunes.apple.com/lookup?id=${APPLE_APP_ID}&country=${country}`);
        const json: any = await res.json();
        const r = json?.results?.[0];
        if (!r) return null;
        return {
            average: Number(r.averageUserRating || 0),
            count: Number(r.userRatingCount || 0),
        };
    } catch {
        return null;
    }
}

export const appleConfigured = () => !!creds();
export const appleSalesConfigured = () => !!creds()?.vendorNumber;
