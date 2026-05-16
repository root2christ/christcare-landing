import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword } from '../../../../lib/auth';

/**
 * POST /api/admin/verify
 * body: { password: string }
 * 비밀번호 검증만 — 토큰 발급 X (sessionStorage 저장은 클라이언트가 직접)
 */
export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();
        if (!verifyAdminPassword(password)) {
            return NextResponse.json({ error: '비밀번호가 올바르지 않습니다' }, { status: 401 });
        }
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
