import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oklgzhkkqbziwoyhypom.supabase.co';

/**
 * Service Role 클라이언트 (RLS 우회)
 * ⚠️ 반드시 서버 사이드에서만 사용. 클라이언트 번들에 노출 금지.
 * ⚠️ SUPABASE_SERVICE_ROLE_KEY 환경변수 필수 (Vercel 환경변수 설정)
 */
export function getAdminSupabase() {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
    }
    return createClient(SUPABASE_URL, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}
