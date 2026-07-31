import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE } from './admin-password';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oklgzhkkqbziwoyhypom.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbGd6aGtrcWJ6aXdveWh5cG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc2OTEsImV4cCI6MjA4NDM3MzY5MX0.rTCBqVNIjdkaWcMcOGBkgQyQlDop4B3lz4kqyGSGb1c';

/**
 * 관리자 이메일 화이트리스트.
 * 환경변수 ADMIN_EMAILS 에 쉼표로 구분해 추가 가능 (예: "a@x.com,b@y.com")
 * 기본값: master@root2christ.com
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'master@root2christ.com')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

export interface AdminContext {
    valid: boolean;
    email?: string;
    userId?: string;
    error?: string;
    status?: number;
}

/**
 * Authorization 헤더의 Bearer 토큰을 Supabase로 검증하고,
 * 토큰의 이메일이 관리자 화이트리스트에 있는지 확인.
 *
 * 보안 흐름:
 *   1. Bearer 토큰 추출
 *   2. Supabase가 토큰 서명·만료 검증 (해시 비교, 시간 검증)
 *   3. 토큰의 user.email이 ADMIN_EMAILS에 있는지 확인
 *   4. 모두 통과 시 valid=true
 */
export async function verifyAdminFromRequest(req: NextRequest): Promise<AdminContext> {
    // ① 비밀번호 로그인으로 받은 세션 쿠키 (2026-07-31 추가)
    //    쿠키는 httpOnly + 서명이라 브라우저에서 위조할 수 없다.
    //    기존 매직링크(Supabase 토큰) 방식도 그대로 통한다 — 둘 중 하나만 맞으면 된다.
    if (verifyAdminSessionToken(req.cookies.get(ADMIN_COOKIE)?.value)) {
        return { valid: true, email: 'admin@password-login', userId: 'password-login' };
    }

    const auth = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
        return { valid: false, error: '인증 토큰이 없습니다', status: 401 };
    }
    const token = auth.slice(7).trim();
    if (!token) {
        return { valid: false, error: '빈 토큰', status: 401 };
    }

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return { valid: false, error: '유효하지 않은 토큰', status: 401 };
        }

        const email = (user.email || '').toLowerCase();
        if (!email) {
            return { valid: false, error: '토큰에 이메일 정보 없음', status: 401 };
        }

        if (!ADMIN_EMAILS.includes(email)) {
            return { valid: false, error: '관리자 권한이 없습니다', status: 403 };
        }

        return { valid: true, email, userId: user.id };
    } catch (e: any) {
        return { valid: false, error: e?.message || '인증 처리 오류', status: 500 };
    }
}

/**
 * Quick helper: 검증 실패 시 자동으로 NextResponse 반환
 * 사용: const auth = await requireAdmin(req); if ('response' in auth) return auth.response;
 */
export async function requireAdmin(req: NextRequest): Promise<
    | { response: NextResponse }
    | { admin: { email: string; userId: string } }
> {
    const result = await verifyAdminFromRequest(req);
    if (!result.valid) {
        return {
            response: NextResponse.json(
                { error: result.error || '인증 실패' },
                { status: result.status || 401 }
            ),
        };
    }
    return { admin: { email: result.email!, userId: result.userId! } };
}

export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getAdminEmails(): string[] {
    return [...ADMIN_EMAILS];
}
