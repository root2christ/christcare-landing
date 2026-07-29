'use client';

export default function JoinTogetherMem({ params }: { params: { code: string } }) {
  const code = (params.code || '').toUpperCase();
  const appUrl = `christ-app://tm/${code}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #E9F5EF 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎙️</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>
        함께 암송 초대
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 8, lineHeight: 1.7 }}>
        매일 한 절씩, 함께 말씀을 마음에 새겨요
      </p>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>
        초대코드: <strong style={{ color: '#2f9e6f', letterSpacing: 3 }}>{code}</strong>
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
        <a
          href={appUrl}
          style={{
            background: '#2f9e6f', color: '#fff', padding: '16px 32px',
            borderRadius: 16, fontWeight: 700, textDecoration: 'none', fontSize: 16,
          }}
        >
          soluma 앱에서 열기
        </a>
        <a
          href="https://apps.apple.com/app/id6748585321"
          style={{
            background: '#1e293b', color: '#fff', padding: '14px 28px',
            borderRadius: 14, fontWeight: 700, textDecoration: 'none', fontSize: 15,
          }}
        >
          앱 다운로드 (iPhone)
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.root2christ.christapp"
          style={{
            background: '#334155', color: '#fff', padding: '14px 28px',
            borderRadius: 14, fontWeight: 700, textDecoration: 'none', fontSize: 15,
          }}
        >
          앱 다운로드 (Android)
        </a>
      </div>

      <p style={{ marginTop: 36, fontSize: 12.5, color: '#94a3b8', lineHeight: 1.9, maxWidth: 340 }}>
        앱이 설치되어 있다면 <b>soluma 앱에서 열기</b>를 누르세요 — 초대코드가 자동으로 입력됩니다.<br />
        앱이 없다면 먼저 설치한 뒤 이 링크를 다시 눌러주세요.
      </p>
    </div>
  );
}
