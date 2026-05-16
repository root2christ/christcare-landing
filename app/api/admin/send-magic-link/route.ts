import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminEmail } from '../../../../lib/admin-auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oklgzhkkqbziwoyhypom.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbGd6aGtrcWJ6aXdveWh5cG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc2OTEsImV4cCI6MjA4NDM3MzY5MX0.rTCBqVNIjdkaWcMcOGBkgQyQlDop4B3lz4kqyGSGb1c';

/**
 * POST /api/admin/send-magic-link
 * body: { email }
 *
 * 보안:
 * 1. 화이트리스트(ADMIN_EMAILS)에 없는 이메일은 발송 X
 * 2. 응답은 admin/비admin 동일 (이메일 enumeration 방지)
 * 3. timing attack 방지 (300ms 지연)
 *
 * ⚠️ 중요: signInWithOtp 사용 (admin.generateLink는 이메일 자동 발송 X)
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
            // Timing-attack 방지
            await new Promise(r => setTimeout(r, 300));
            return NextResponse.json({ success: true });
        }

        // admin 이메일 확정 → signInWithOtp로 Magic Link 자동 발송
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const origin = req.headers.get('origin') || 'https://www.christcare.us';

        const { error } = await supabase.auth.signInWithOtp({
            email: normalized,
            options: {
                emailRedirectTo: `${origin}/admin`,
                shouldCreateUser: false, // 미가입자는 가입 X (보안)
            },
        });

        if (error) {
            console.error('[admin/send-magic-link] signInWithOtp error:', error.message);
            // 클라이언트에는 항상 success (enumeration 방지)
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('[admin/send-magic-link] exception:', e?.message);
        return NextResponse.json({ success: true });
    }
}
