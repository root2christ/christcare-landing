import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/admin-auth';

/**
 * DM 선물 코드 디스펜서 (결과 공유 이벤트, 2026-09-01)
 *
 * 사전 발행된 월 구독권 선물(gifts)에서 "아직 DM으로 나가지 않은" 코드를
 * 하나씩 꺼내 준다. 꺼낸 코드는 recipient_email 에 발송 마킹을 남겨
 * 같은 코드가 두 번 나가지 않는다.
 *
 * 발행 배치 식별: sender_id + message LIKE '결과 공유 이벤트%'
 *   (supabase/event_20260901_gift_100_monthly.sql — mobile-app repo)
 */

// madism@naver.com (프로필명 soluma) — 이벤트 선물 발행 계정
const EVENT_SENDER_ID = 'ed4e5b94-90c0-4f9e-a8e4-4a379ecda3d8';
const EVENT_MESSAGE_PREFIX = '결과 공유 이벤트%';
const DISPENSED_PREFIX = 'dm_dispensed ';

/** GET: 현황 (남은/발송됨/수령됨) */
export async function GET(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const supabase = getAdminSupabase();
    const { data, error } = await supabase
        .from('gifts')
        .select('id, status, recipient_email, claimed_at')
        .eq('sender_id', EVENT_SENDER_ID)
        .like('message', EVENT_MESSAGE_PREFIX);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = data || [];
    const claimed = rows.filter((r) => r.status === 'claimed').length;
    const dispensed = rows.filter(
        (r) => r.status === 'pending' && (r.recipient_email || '').startsWith(DISPENSED_PREFIX),
    ).length;
    const remaining = rows.filter((r) => r.status === 'pending' && !r.recipient_email).length;
    return NextResponse.json({ total: rows.length, remaining, dispensed, claimed });
}

/** POST: 다음 코드 1개 꺼내기 (발송 마킹 후 반환) */
export async function POST(req: NextRequest) {
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const supabase = getAdminSupabase();

    // 미발송 코드 중 가장 오래된 것부터. 마킹 update 가 0건이면(동시 클릭 등) 다음 후보로 재시도.
    for (let attempt = 0; attempt < 5; attempt++) {
        const { data: candidates, error: selError } = await supabase
            .from('gifts')
            .select('id, token')
            .eq('sender_id', EVENT_SENDER_ID)
            .like('message', EVENT_MESSAGE_PREFIX)
            .eq('status', 'pending')
            .is('recipient_email', null)
            .order('token', { ascending: true })
            .limit(1);
        if (selError) return NextResponse.json({ error: selError.message }, { status: 500 });
        if (!candidates || candidates.length === 0) {
            return NextResponse.json({ error: '남은 코드가 없습니다.' }, { status: 404 });
        }

        const pick = candidates[0];
        const marker = DISPENSED_PREFIX + new Date().toISOString();
        const { data: updated, error: updError } = await supabase
            .from('gifts')
            .update({ recipient_email: marker })
            .eq('id', pick.id)
            .is('recipient_email', null) // 조건부 — 이미 다른 요청이 가져갔으면 0건
            .select('id, token');
        if (updError) return NextResponse.json({ error: updError.message }, { status: 500 });
        if (updated && updated.length === 1) {
            // 남은 수 재계산
            const { count } = await supabase
                .from('gifts')
                .select('id', { count: 'exact', head: true })
                .eq('sender_id', EVENT_SENDER_ID)
                .like('message', EVENT_MESSAGE_PREFIX)
                .eq('status', 'pending')
                .is('recipient_email', null);
            return NextResponse.json({
                token: updated[0].token,
                link: `https://christcare.us/g/${updated[0].token}`,
                remaining: count ?? null,
            });
        }
        // 경합으로 0건 갱신 → 다음 후보 재시도
    }
    return NextResponse.json({ error: '코드 확보 실패 — 다시 시도해주세요.' }, { status: 409 });
}
