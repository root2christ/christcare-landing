import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../../../lib/admin-auth';

const supabase = createClient(
    'https://oklgzhkkqbziwoyhypom.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbGd6aGtrcWJ6aXdveWh5cG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc2OTEsImV4cCI6MjA4NDM3MzY5MX0.rTCBqVNIjdkaWcMcOGBkgQyQlDop4B3lz4kqyGSGb1c'
);

/** 길이 노출 없는 상수시간 비교 */
function safeEqual(a: string, b: string): boolean {
    const ab = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ab.length !== bb.length) return false;
    return timingSafeEqual(ab, bb);
}

/**
 * Vercel Cron 전용 인증.
 * CRON_SECRET 이 설정돼 있지 않으면 무조건 거부한다 (폴백 허용 금지).
 */
function verifyCron(req: NextRequest): NextResponse | null {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        console.error('[push] CRON_SECRET 미설정 — process-scheduled 거부');
        return NextResponse.json({ error: 'cron이 설정되지 않았습니다' }, { status: 503 });
    }
    const header = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    if (!header.startsWith('Bearer ') || !safeEqual(header.slice(7).trim(), secret)) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    return null;
}

async function sendExpoPush(tokens: string[], title: string, body: string, data?: any) {
    const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title,
        body,
        data: data || {},
    }));

    // Expo Push API는 100개씩 배치 발송
    const chunks = [];
    for (let i = 0; i < messages.length; i += 100) {
        chunks.push(messages.slice(i, i + 100));
    }

    let totalSent = 0;
    const errors: any[] = [];
    for (const chunk of chunks) {
        const res = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
            },
            body: JSON.stringify(chunk),
        });
        const resData = await res.json();
        if (resData.data) {
            for (const ticket of resData.data) {
                if (ticket.status === 'ok') totalSent++;
                else errors.push(ticket);
            }
        }
    }
    return { totalSent, errors };
}

// POST: 즉시 발송 또는 예약 저장
export async function POST(req: NextRequest) {
    // 관리자 토큰 검증 (Authorization: Bearer ...)
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    try {
        const { title, body, scheduledAt } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: '제목과 내용을 입력해주세요' }, { status: 400 });
        }

        // 예약 발송
        if (scheduledAt) {
            const { error } = await supabase.from('push_notifications').insert({
                title,
                body,
                status: 'scheduled',
                scheduled_at: scheduledAt,
            });
            if (error) throw error;
            return NextResponse.json({ success: true, message: '예약 완료', scheduledAt });
        }

        // 즉시 발송
        const { data: tokens, error: tokenError } = await supabase
            .from('push_tokens')
            .select('token');

        if (tokenError) throw tokenError;
        if (!tokens || tokens.length === 0) {
            return NextResponse.json({ error: '등록된 기기가 없습니다' }, { status: 400 });
        }

        const tokenList = tokens.map((t: any) => t.token);
        const result = await sendExpoPush(tokenList, title, body);

        // 발송 기록 저장
        await supabase.from('push_notifications').insert({
            title,
            body,
            status: 'sent',
            sent_at: new Date().toISOString(),
            sent_count: result.totalSent,
        });

        return NextResponse.json({ success: true, sentCount: result.totalSent, errors: result.errors, tokens: tokenList });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || '서버 오류' }, { status: 500 });
    }
}

// GET: 발송 이력 조회(관리자) + 예약 알림 발송 처리(Vercel Cron)
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // 예약 알림 처리 — Vercel Cron 전용 (Authorization: Bearer ${CRON_SECRET})
    if (action === 'process-scheduled') {
        const cronErr = verifyCron(req);
        if (cronErr) return cronErr;

        const now = new Date().toISOString();
        const { data: scheduled } = await supabase
            .from('push_notifications')
            .select('*')
            .eq('status', 'scheduled')
            .lte('scheduled_at', now);

        if (!scheduled || scheduled.length === 0) {
            return NextResponse.json({ processed: 0 });
        }

        const { data: tokens } = await supabase.from('push_tokens').select('token');
        const tokenList = (tokens || []).map((t: any) => t.token);

        let processed = 0;
        for (const notif of scheduled) {
            if (tokenList.length > 0) {
                const result = await sendExpoPush(tokenList, notif.title, notif.body);
                await supabase.from('push_notifications').update({
                    status: 'sent',
                    sent_at: new Date().toISOString(),
                    sent_count: result.totalSent,
                }).eq('id', notif.id);
                processed++;
            }
        }
        return NextResponse.json({ processed });
    }

    // 기본: 발송 이력 조회 — 관리자 토큰 검증 (Authorization: Bearer ...)
    const auth = await requireAdmin(req);
    if ('response' in auth) return auth.response;

    const { data, error } = await supabase
        .from('push_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    return NextResponse.json({ notifications: data || [] });
}
