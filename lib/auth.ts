/**
 * Admin 비밀번호 검증
 * 환경변수가 설정되어 있으면 환경변수 사용, 없으면 fallback (구코드 호환)
 */
const FALLBACK_PW = 'Seiehjw1!@';

export function getAdminPassword(): string {
    return process.env.ADMIN_PW || FALLBACK_PW;
}

export function verifyAdminPassword(input: string | undefined | null): boolean {
    if (!input) return false;
    return input === getAdminPassword();
}
