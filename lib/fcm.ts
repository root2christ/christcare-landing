import crypto from 'crypto';

/**
 * FCM HTTP v1 발송 — Firebase Admin SDK 없이 서비스 계정으로 직접 호출한다.
 * (의존성 추가 없이 동작하게 JWT 를 직접 서명)
 *
 * 필요한 환경변수: FIREBASE_SERVICE_ACCOUNT_JSON (서비스 계정 JSON 전문)
 */

type ServiceAccount = { client_email: string; private_key: string; project_id: string };

function serviceAccount(): ServiceAccount | null {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) return null;
    try {
        const sa = JSON.parse(raw);
        if (!sa.client_email || !sa.private_key || !sa.project_id) return null;
        // Vercel 환경변수에 줄바꿈이 \n 문자열로 들어간 경우 복원
        sa.private_key = String(sa.private_key).replace(/\\n/g, '\n');
        return sa as ServiceAccount;
    } catch {
        return null;
    }
}

const b64u = (v: string | object) =>
    Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');

let cachedToken: { token: string; exp: number } | null = null;

async function accessToken(sa: ServiceAccount): Promise<string | null> {
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;

    const header = b64u({ alg: 'RS256', typ: 'JWT' });
    const claim = b64u({
        iss: sa.client_email,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    });
    const sig = crypto.createSign('RSA-SHA256').update(`${header}.${claim}`).sign(sa.private_key).toString('base64url');
    const jwt = `${header}.${claim}.${sig}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });
    const json: any = await res.json();
    if (!json.access_token) return null;
    cachedToken = { token: json.access_token, exp: now + 3500 };
    return json.access_token;
}

/** 여러 기기에 같은 알림 발송. 반환: {sent, failed, invalidTokens} */
export async function sendFcm(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
): Promise<{ sent: number; failed: number; invalidTokens: string[] }> {
    const sa = serviceAccount();
    if (!sa || tokens.length === 0) return { sent: 0, failed: tokens.length, invalidTokens: [] };

    const token = await accessToken(sa);
    if (!token) return { sent: 0, failed: tokens.length, invalidTokens: [] };

    const url = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;
    let sent = 0, failed = 0;
    const invalidTokens: string[] = [];

    await Promise.all(tokens.map(async (t) => {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: {
                        token: t,
                        notification: { title, body },
                        data: data || {},
                        android: { priority: 'HIGH', notification: { channel_id: 'soluma_admin_events' } },
                    },
                }),
            });
            if (res.ok) sent++;
            else {
                failed++;
                // 만료·삭제된 토큰은 정리 대상으로 표시
                if (res.status === 404 || res.status === 400) invalidTokens.push(t);
            }
        } catch {
            failed++;
        }
    }));

    return { sent, failed, invalidTokens };
}
