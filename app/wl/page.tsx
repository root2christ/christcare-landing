'use client';

/**
 * QR 웹 로그인 착지 페이지 — christcare.us/wl?c=<channel>
 * 데스크톱 /church 에서 띄운 QR을 폰 카메라로 찍으면 이 페이지가 열린다.
 * 즉시 soluma 앱 딥링크(christ-app://weblogin?c=…)로 이동을 시도하고,
 * 앱이 안 열릴 때를 대비해 수동 버튼 + 설치 안내를 제공한다.
 */
import { useEffect, useState } from 'react';

const APP_STORE = 'https://apps.apple.com/app/id6779090825';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.root2christ.christapp';

export default function WebLoginLanding() {
    const [channel, setChannel] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const c = new URLSearchParams(window.location.search).get('c');
        setChannel(c);
        setReady(true);
        if (c) {
            // 착지 즉시 앱 열기 시도
            window.location.href = `christ-app://weblogin?c=${encodeURIComponent(c)}`;
        }
    }, []);

    const openApp = () => {
        if (channel) window.location.href = `christ-app://weblogin?c=${encodeURIComponent(channel)}`;
    };

    return (
        <div style={S.wrap}>
            <div style={S.card}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app-icon.png" alt="soluma" width={64} height={64} style={S.icon} />
                <h1 style={S.h1}>soluma 앱으로 로그인</h1>

                {ready && !channel ? (
                    <p style={S.err}>잘못된 링크입니다. 데스크톱에서 QR을 다시 표시해 주세요.</p>
                ) : (
                    <>
                        <p style={S.sub}>
                            잠시 후 <b>soluma 앱</b>이 자동으로 열립니다.<br />
                            열리면 앱에서 <b>로그인 승인</b>을 눌러 주세요.
                        </p>
                        <button style={S.btn} onClick={openApp}>soluma 앱에서 열기</button>
                        <p style={S.hint}>앱이 열리지 않으면 먼저 설치가 필요합니다.</p>
                        <div style={S.stores}>
                            <a href={APP_STORE} style={S.storeLink} target="_blank" rel="noopener noreferrer">App Store</a>
                            <span style={S.dot}>·</span>
                            <a href={PLAY_STORE} style={S.storeLink} target="_blank" rel="noopener noreferrer">Google Play</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const S: Record<string, React.CSSProperties> = {
    wrap: { minHeight: '100dvh', background: '#f7f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' },
    card: { width: '100%', maxWidth: 380, background: '#fff', border: '1px solid #eef2f7', borderRadius: 18, padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 14px rgba(15,23,42,.05)' },
    icon: { borderRadius: 15, marginBottom: 16 },
    h1: { fontSize: 22, fontWeight: 900, color: '#1e293b', margin: '0 0 12px' },
    sub: { color: '#475569', fontSize: 15, lineHeight: 1.7, margin: '0 0 22px' },
    btn: { width: '100%', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer' },
    hint: { color: '#94a3b8', fontSize: 13, marginTop: 20, marginBottom: 6 },
    stores: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
    storeLink: { color: '#0f766e', fontSize: 14, fontWeight: 800, textDecoration: 'none' },
    dot: { color: '#cbd5e1' },
    err: { color: '#dc2626', fontSize: 14.5, lineHeight: 1.6, margin: 0 },
};
