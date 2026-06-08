import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

// 특정 목사의 기존 자문 불러오기 (재방문 시 이어쓰기)
export async function GET(req: NextRequest) {
    try {
        const pastorId = req.nextUrl.searchParams.get('pastorId');
        if (!pastorId) return NextResponse.json({ feedback: [] });
        const sb = getAdminSupabase();
        const { data, error } = await sb
            .from('advisory_feedback')
            .select('item_id,rating,comment')
            .eq('pastor_id', pastorId);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ feedback: data || [] });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}

// 자문 저장 (upsert: 목사+항목 당 1행)
export async function POST(req: NextRequest) {
    try {
        const { pastorId, itemId, rating, comment } = await req.json();
        if (!pastorId || !itemId) return NextResponse.json({ error: 'pastorId, itemId 필요' }, { status: 400 });
        const sb = getAdminSupabase();
        const { error } = await sb
            .from('advisory_feedback')
            .upsert(
                {
                    pastor_id: pastorId,
                    item_id: itemId,
                    rating: typeof rating === 'number' ? rating : null,
                    comment: comment ?? null,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'pastor_id,item_id' },
            );
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || 'error' }, { status: 500 });
    }
}
