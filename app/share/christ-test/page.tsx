'use client';
import { useEffect } from 'react';

export default function ChristTestShare() {
  useEffect(() => {
    // 앱 열기 시도
    window.location.href = 'christ-app://christ-test';
    const timer = setTimeout(() => {
      const isAndroid = /android/i.test(navigator.userAgent);
      if (isAndroid) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.root2christ.christapp';
      } else {
        window.location.href = 'https://apps.apple.com/app/id000000000';
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #EEF2FF 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🛡️</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>
        크라이스트 테스트
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>
        나의 영적 유형을 발견하세요<br />
        성경 속 64명의 인물 중 나와 닮은 인물은?
      </p>
      <a
        href="https://play.google.com/store/apps/details?id=com.root2christ.christapp"
        style={{
          background: '#6366f1', color: '#fff', padding: '16px 32px',
          borderRadius: 16, fontWeight: 700, textDecoration: 'none', fontSize: 16,
        }}
      >
        예닮 앱에서 테스트하기
      </a>
    </div>
  );
}
