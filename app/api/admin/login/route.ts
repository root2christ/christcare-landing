import { NextRequest, NextResponse } from 'next/server';
import {
    verifyAdminPassword,
    createAdminSessionToken,
    verifyAdminSessionToken,
    ADMIN_COOKIE,
    ADMIN_SESSION_MAX_AGE,
} from '../../../../lib/admin-password';

// 비밀번호 대조에 Node 의 crypto(scrypt)를 쓰므로 Edge 런타임이 아니어야 한다
export const runtime = 'nodejs';

/**
 * 무차별 대입 방지 — IP 당 시도 횟수 제한.
 * 서버리스라 인스턴스마다 따로 세지지만, 자동 도구로 초당 수천 번 두드리는 것은 확실히 막는다.
 */
const WINDOW_MS = 10 * 60_000;   // 10분
const MAX_TRIES = 10;
const hits = new Map<string, number[]>();

function tooManyTries(ip: string): boolean {
    const now = Date.now();
    const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    arr.push(now);
    hits.set(ip, arr);
    if (hits.size > 5000) hits.clear();
    return arr.length > MAX_TRIES;
}

/** POST /api/admin/login  { password } → 맞으면 httpOnly 세션 쿠키 */
export async function POST(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (tooManyTries(ip)) {
        return NextResponse.json({ error: '시도가 너무 많습니다. 10분 뒤에 다시 해주세요.' }, { status: 429 });
    }

    let password = '';
    try {
        const body = await req.json();
        password = String(body?.password || '');
    } catch {
        return NextResponse.json({ error: '요청 형식 오류' }, { status: 400 });
    }

    // 맞든 틀리든 응답 시간을 비슷하게 — 반응 속도로 정답을 더듬지 못하게
    const ok = verifyAdminPassword(password);
    await new Promise((r) => setTimeout(r, 300));

    if (!ok) {
        return NextResponse.json({ error: '비밀번호가 맞지 않습니다.' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, createAdminSessionToken(), {
        httpOnly: true,                                   // 자바스크립트에서 못 읽는다
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return res;
}

/** GET /api/admin/login → 지금 로그인돼 있는지 (페이지 진입 시 확인용) */
export async function GET(req: NextRequest) {
    const ok = verifyAdminSessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}

/** DELETE /api/admin/login → 로그아웃 */
export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
}
