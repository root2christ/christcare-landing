import crypto from 'crypto';

/**
 * 관리자 비밀번호 로그인 (2026-07-31 사장님 지시).
 *
 * ⚠️ 보안상 알고 계셔야 하는 것
 *   매직링크는 "사장님 메일함을 가진 사람"만 들어올 수 있었다. 공용 비밀번호는
 *   **그 문자열을 아는 사람 누구나** 크레딧 지급·회원 검색·전체 푸시를 할 수 있다는 뜻이다.
 *   그래서 최소한 아래는 지킨다.
 *     · 비밀번호는 **서버에서만** 검증한다. 브라우저로 절대 내려보내지 않는다
 *       (NEXT_PUBLIC_ 로 두면 앱 번들에 그대로 박혀 누구나 볼 수 있다).
 *     · 코드에는 평문이 아니라 **scrypt 해시**만 둔다. 저장소가 새어도 바로 쓸 수 없다.
 *     · 로그인 시도는 초당 제한을 둔다(무차별 대입 방지).
 *     · 맞았을 때만 **서명된 세션 쿠키**(httpOnly)를 준다. 비밀번호는 쿠키에도 안 들어간다.
 *
 * 운영 환경에서는 ADMIN_PASSWORDS 환경변수(쉼표 구분)를 쓰는 편이 가장 낫다 —
 * 비밀번호를 바꿀 때 배포 없이 Vercel 설정만 고치면 되고, 저장소에는 흔적이 남지 않는다.
 * 설정돼 있지 않으면 아래 내장 해시로 검증한다.
 */

/** salt:hash (scrypt, 32바이트) — 평문은 여기에 없다 (2026-08-24 재설정) */
const BUILTIN_HASHES = [
    'fa03c9068f066c9ad7fd0666200ad844:ad1e52e704bc030eb44a70891e2d917bef048663a8d090c3f0e9ef57ff4aa0fa',
];

/** 타이밍 차이로 정답을 더듬지 못하게 — 길이가 달라도 예외 없이 false */
function safeEqual(a: Buffer, b: Buffer): boolean {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

function envPasswords(): string[] {
    return (process.env.ADMIN_PASSWORDS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

/** 입력한 비밀번호가 맞는지 — 서버에서만 부를 것 */
export function verifyAdminPassword(input: string): boolean {
    const pw = String(input || '');
    if (!pw) return false;

    // ① 환경변수에 평문이 설정돼 있으면 그쪽을 우선 (배포 없이 교체 가능)
    const fromEnv = envPasswords();
    if (fromEnv.length > 0) {
        const given = Buffer.from(pw);
        return fromEnv.some((p) => safeEqual(Buffer.from(p), given));
    }

    // ② 없으면 내장 해시와 대조
    return BUILTIN_HASHES.some((entry) => {
        const [salt, hash] = entry.split(':');
        if (!salt || !hash) return false;
        try {
            return safeEqual(Buffer.from(hash, 'hex'), crypto.scryptSync(pw, salt, 32));
        } catch {
            return false;
        }
    });
}

// ── 세션 토큰 ────────────────────────────────────────────────────────────────
// 쿠키에는 "언제까지 유효한지 + 그 서명"만 담는다. 비밀번호는 담지 않는다.

const SESSION_HOURS = 12;

function sessionSecret(): string {
    // 환경변수가 있으면 그것을, 없으면 내장 해시에서 파생(서버에만 존재하는 값)
    return process.env.ADMIN_SESSION_SECRET
        || crypto.createHash('sha256').update(BUILTIN_HASHES.join('|')).digest('hex');
}

export function createAdminSessionToken(): string {
    const exp = Date.now() + SESSION_HOURS * 3600_000;
    const sig = crypto.createHmac('sha256', sessionSecret()).update(String(exp)).digest('hex');
    return `${exp}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
    if (!token) return false;
    const [expStr, sig] = String(token).split('.');
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || !sig) return false;
    if (Date.now() > exp) return false;
    const expected = crypto.createHmac('sha256', sessionSecret()).update(expStr).digest('hex');
    try {
        return safeEqual(Buffer.from(expected, 'hex'), Buffer.from(sig, 'hex'));
    } catch {
        return false;
    }
}

export const ADMIN_COOKIE = 'soluma_admin';
export const ADMIN_SESSION_MAX_AGE = SESSION_HOURS * 3600;
