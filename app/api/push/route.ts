import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://oklgzhkkqbziwoyhypom.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbGd6aGtrcWJ6aXdveWh5cG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc2OTEsImV4cCI6MjA4NDM3MzY5MX0.rTCBqVNIjdkaWcMcOGBkgQyQlDop4B3lz4kqyGSGb1c'
);

const ADMIN_PASSWORD = 'Seiehjw1!@';

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
    try {
        const { password, title, body, scheduledAt } = await req.json();

        if (password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: '인증 실패' }, { status: 401 });
        }

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

// GET: 발송 이력 조회 + 예약 알림 발송 처리 (cron에서 호출)
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // 예약 알림 처리 (cron 호출용)
    if (action === 'process-scheduled') {
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

    // 기본: 발송 이력 조회
    const { data, error } = await supabase
        .from('push_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    return NextResponse.json({ notifications: data || [] });
}
