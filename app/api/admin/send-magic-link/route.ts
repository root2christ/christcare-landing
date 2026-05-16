import { NextRequest, NextResponse } from 'next/server';
import { isAdminEmail } from '../../../../lib/admin-auth';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

/**
 * POST /api/admin/send-magic-link
 * body: { email }
 *
 * 보안:
 * 1. 화이트리스트(ADMIN_EMAILS)에 없는 이메일은 발송 X
 * 2. 그러나 응답은 admin/비admin 동일 (이메일 enumeration 방지)
 * 3. timing attack 방지 (300ms 지연)
 */
export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ error: '올바른 이메일을 입력해주세요' }, { status: 400 });
        }

        const normalized = email.trim().toLowerCase();

        // 화이트리스트 확인 — 일치하지 않으면 의도적으로 success 반환
        if (!isAdminEmail(normalized)) {
            // Timing-attack 방지: admin 발송과 동일한 시간 소요
            await new Promise(r => setTimeout(r, 300));
            return NextResponse.json({ success: true });
        }

        // admin 이메일 확정 → service_role로 Magic Link 생성/발송
        const supabase = getAdminSupabase();
        const origin = req.headers.get('origin') || 'https://www.christcare.us';

        // generateLink는 링크 생성과 동시에 사용자에게 이메일 발송
        const { error } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: normalized,
            options: {
                redirectTo: `${origin}/admin`,
            },
        });

        if (error) {
            console.error('[admin/send-magic-link] generateLink error:', error.message);
            // 실패해도 클라이언트에는 success (enumeration 방지)
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('[admin/send-magic-link] exception:', e?.message);
        // 어떤 에러든 success 반환 (enumeration 방지)
        return NextResponse.json({ success: true });
    }
}
