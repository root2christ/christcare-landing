import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * POST /api/admin/register-device  { token, label? }
 * 관리자 앱이 자기 FCM 토큰을 등록한다. (관리자 세션 필요)
 */
export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const { token, label } = await req.json();
        if (!token || typeof token !== 'string' || token.length < 20) {
            return NextResponse.json({ error: '토큰 형식 오류' }, { status: 400 });
        }
        const supabase = getAdminSupabase();
        const { error } = await supabase
            .from('admin_devices')
            .upsert({ token, label: label || null, updated_at: new Date().toISOString() },
                    { onConflict: 'token' });
        if (error) {
            console.error('register-device 실패:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || '서버 오류' }, { status: 500 });
    }
}
