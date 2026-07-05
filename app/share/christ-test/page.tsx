'use client';
import { useEffect } from 'react';

// 앱에서 공유된 딥링크(Universal Link /share/*) 진입점.
// 앱이 설치돼 있으면 iOS/Android가 이 URL을 앱으로 가로챈다.
// 미설치 사용자는 웹 크라이스트 테스트(/t)로 유도.
export default function ChristTestShare() {
  useEffect(() => {
    const timer = setTimeout(() => { window.location.href = '/t'; }, 1500);
    try { window.location.href = 'christ-app://christ-test'; } catch { /* noop */ }
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#FAF7F0',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 56, marginBottom: 18 }}>🕊️</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>크라이스트 테스트</h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 30, lineHeight: 1.6 }}>
        성경 속 64명의 인물 중<br />나와 가장 닮은 사람은?
      </p>
      <a
        href="/t"
        style={{
          background: 'linear-gradient(180deg,#38BDF8,#0EA5E9)', color: '#fff',
          padding: '16px 34px', borderRadius: 16, fontWeight: 800, textDecoration: 'none', fontSize: 16,
        }}
      >테스트 시작하기</a>
    </div>
  );
}
