import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

// 목사 명단 조회 (드롭다운용)
export async function GET() {
    try {
        const sb = getAdminSupabase();
        const { data, error } = await sb
            .from('advisory_pastors')
            .select('id,name,church')
            .order('created_at', { ascending: true });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ pastors: data || [] });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}

// 목사 등록(없으면) — 이름+교회. 이미 있으면 그 행 반환.
export async function POST(req: NextRequest) {
    try {
        const { name, church } = await req.json();
        const cleanName = (name || '').trim();
        const cleanChurch = (church || '').trim();
        if (!cleanName) return NextResponse.json({ error: '성함을 입력해 주세요.' }, { status: 400 });

        const sb = getAdminSupabase();
        const findMatch = async () => {
            const { data } = await sb.from('advisory_pastors').select('id,name,church').ilike('name', cleanName);
            return (data || []).find(p => (p.church || '').toLowerCase() === cleanChurch.toLowerCase());
        };

        const existing = await findMatch();
        if (existing) return NextResponse.json({ pastor: existing });

        const { data, error } = await sb
            .from('advisory_pastors')
            .insert({ name: cleanName, church: cleanChurch || null })
            .select('id,name,church')
            .single();
        if (error) {
            // 동시 등록 경합 → 다시 조회
            const again = await findMatch();
            if (again) return NextResponse.json({ pastor: again });
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ pastor: data });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}
