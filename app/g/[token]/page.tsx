'use client';
import { useEffect } from 'react';

export default function RedeemGift({ params }: { params: { token: string } }) {
  useEffect(() => {
    const appUrl = `christ-app://redeem-gift/${params.token}`;
    window.location.href = appUrl;

    const timer = setTimeout(() => {
      const isAndroid = /android/i.test(navigator.userAgent);
      if (isAndroid) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.root2christ.christapp';
      } else {
        window.location.href = 'https://apps.apple.com/app/id000000000';
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [params.token]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #FFF1F2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎁</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>
        선물이 도착했어요!
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>
        예닮 앱에서 선물을 받으세요
      </p>
      <p style={{ fontSize: 13, color: '#94a3b8' }}>
        앱이 자동으로 열립니다...<br />
        열리지 않으면 아래 버튼을 눌러주세요
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <a
          href="https://play.google.com/store/apps/details?id=com.root2christ.christapp"
          style={{
            background: '#f43f5e', color: '#fff', padding: '14px 28px',
            borderRadius: 14, fontWeight: 700, textDecoration: 'none', fontSize: 15,
          }}
        >
          앱 다운로드 (Android)
        </a>
        <a
          href="https://apps.apple.com/app/id000000000"
          style={{
            background: '#fff', color: '#1e293b', padding: '14px 28px',
            borderRadius: 14, fontWeight: 700, textDecoration: 'none', fontSize: 15,
            border: '2px solid #e2e8f0',
          }}
        >
          앱 다운로드 (iOS)
        </a>
      </div>
    </div>
  );
}
