import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

// 관리자 비밀번호 (서버 전용 — 클라이언트 번들에 노출 안 됨)
const ADMIN_KEY = 'soluma2026!';

// 전체 응답 취합 조회 — 비밀번호 게이트
export async function GET(req: NextRequest) {
    try {
        const key = req.nextUrl.searchParams.get('key') || req.headers.get('x-admin-key') || '';
        if (key !== ADMIN_KEY) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
        }
        const sb = getAdminSupabase();
        const { data, error } = await sb
            .from('survey_responses')
            .select('respondent_uid,name,church,role,phone,email,ministry,career,answers,christ_memos,updated_at,created_at')
            .order('updated_at', { ascending: false });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ responses: data || [] });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}

// 응답 1건 삭제 (respondent_uid 기준) — 비밀번호 게이트. 테스트/스팸 정리용.
export async function DELETE(req: NextRequest) {
    try {
        const key = req.nextUrl.searchParams.get('key') || req.headers.get('x-admin-key') || '';
        if (key !== ADMIN_KEY) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
        }
        const uid = req.nextUrl.searchParams.get('uid') || '';
        if (!uid) return NextResponse.json({ error: 'uid required' }, { status: 400 });

        const sb = getAdminSupabase();
        const { error } = await sb.from('survey_responses').delete().eq('respondent_uid', uid);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}
