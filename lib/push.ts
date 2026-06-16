/**
 * 특정 사용자에게 푸시 알림 발송 헬퍼.
 *
 * push_tokens 테이블에서 해당 사용자의 토큰을 조회한 뒤
 * Expo Push API(https://exp.host/--/api/v2/push/send)로 100개씩 배치 발송한다.
 *
 * 절대 호출자에게 throw 하지 않는다 (내부에서 try/catch 처리).
 * 푸시 실패가 본 작업(선물/크레딧 발급 등)을 깨뜨리면 안 되기 때문.
 *
 * push_tokens 스키마 참고 (supabase/push_notifications_setup.sql):
 *   - user_id UUID  ← 토큰을 사용자와 연결하는 컬럼
 *   - token   TEXT
 */
import type { SupabaseClient } from '@supabase/supabase-js';

interface ExpoMessage {
    to: string;
    sound: string;
    title: string;
    body: string;
    data: any;
}

/**
 * @param supabase service role 또는 권한 있는 Supabase 클라이언트
 * @param userId   대상 사용자 (auth.users.id)
 * @returns { sent: number } 성공적으로 전송된 메시지 수 (실패해도 0 반환)
 */
export async function sendPushToUser(
    supabase: SupabaseClient,
    userId: string,
    title: string,
    body: string,
    data?: any,
): Promise<{ sent: number }> {
    try {
        if (!userId) return { sent: 0 };

        // 해당 사용자의 푸시 토큰 조회 (user_id 컬럼으로 연결)
        const { data: tokens, error } = await supabase
            .from('push_tokens')
            .select('token')
            .eq('user_id', userId);

        if (error || !tokens || tokens.length === 0) {
            return { sent: 0 };
        }

        const tokenList = tokens
            .map((t: any) => t.token)
            .filter((t: any): t is string => typeof t === 'string' && t.length > 0);

        if (tokenList.length === 0) return { sent: 0 };

        const messages: ExpoMessage[] = tokenList.map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            data: data || {},
        }));

        // Expo Push API는 100개씩 배치 발송
        const chunks: ExpoMessage[][] = [];
        for (let i = 0; i < messages.length; i += 100) {
            chunks.push(messages.slice(i, i + 100));
        }

        let sent = 0;
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
            if (resData?.data) {
                for (const ticket of resData.data) {
                    if (ticket?.status === 'ok') sent++;
                }
            }
        }

        return { sent };
    } catch {
        // 푸시 실패는 호출자에게 전파하지 않음
        return { sent: 0 };
    }
}
