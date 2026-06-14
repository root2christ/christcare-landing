import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

// 응답자 식별: respondent_uid (브라우저 localStorage 발급 UUID)
// 한 응답자 당 1행 (upsert) — 자동저장이 1.5초 디바운스로 호출

// 기존 응답 불러오기 (재방문 시 서버 복원)
export async function GET(req: NextRequest) {
    try {
        const uid = req.nextUrl.searchParams.get('uid');
        if (!uid) return NextResponse.json({ response: null });
        const sb = getAdminSupabase();
        const { data, error } = await sb
            .from('survey_responses')
            .select('respondent_uid,name,church,role,phone,email,ministry,career,answers,christ_memos,updated_at')
            .eq('respondent_uid', uid)
            .maybeSingle();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ response: data || null });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}

// 자동저장 (upsert: respondent_uid 당 1행)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const uid = (body?.respondent_uid || '').trim();
        if (!uid) return NextResponse.json({ error: 'respondent_uid 필요' }, { status: 400 });

        const row = {
            respondent_uid: uid,
            name: body.name ?? null,
            church: body.church ?? null,
            role: body.role ?? null,
            phone: body.phone ?? null,
            email: body.email ?? null,
            ministry: Array.isArray(body.ministry) ? body.ministry : [],
            career: body.career ?? null,
            answers: body.answers && typeof body.answers === 'object' ? body.answers : {},
            christ_memos: body.christ_memos && typeof body.christ_memos === 'object' ? body.christ_memos : {},
            updated_at: new Date().toISOString(),
        };

        const sb = getAdminSupabase();
        const { error } = await sb
            .from('survey_responses')
            .upsert(row, { onConflict: 'respondent_uid' });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}
