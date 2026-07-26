import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

export const dynamic = 'force-dynamic';

// 전체 응답 취합 조회 (응답자 PII 포함) — 관리자 토큰 검증
// Authorization: Bearer <supabase-access-token>
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
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

// 응답 1건 삭제 (respondent_uid 기준) — 관리자 토큰 검증. 테스트/스팸 정리용.
export async function DELETE(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
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
