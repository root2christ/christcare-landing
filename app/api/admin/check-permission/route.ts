import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * GET /api/admin/check-permission
 * Authorization: Bearer <token>
 *
 * 토큰이 admin 화이트리스트에 있는 사용자인지 확인.
 * 200: admin
 * 401/403: 비admin → 클라이언트는 자동 로그아웃
 */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;
    return NextResponse.json({ ok: true, email: auth.admin.email });
}
