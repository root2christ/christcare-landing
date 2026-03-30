'use client';

export default function JoinGroup({ params }: { params: { code: string } }) {
  const appUrl = `christ-app://join/${params.code}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #EEF2FF 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>👥</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>
        소그룹 초대
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 8 }}>
        예닮 앱에서 소그룹에 참여하세요
      </p>
      <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32 }}>
        초대코드: <strong style={{ color: '#6366f1', letterSpacing: 2 }}>{params.code}</strong>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a
          href={appUrl}
          style={{
            background: '#6366f1', color: '#fff', padding: '16px 32px',
            borderRadius: 16, fontWeight: 700, textDecoration: 'none', fontSize: 16,
          }}
        >
          예닮 앱에서 열기
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.root2christ.christapp"
          style={{
            background: '#1e293b', color: '#fff', padding: '14px 28px',
            borderRadius: 14, fontWeight: 700, textDecoration: 'none', fontSize: 15,
          }}
        >
          앱 다운로드 (Android)
        </a>
      </div>
      <p style={{ marginTop: 40, fontSize: 12, color: '#94a3b8', lineHeight: 1.8 }}>
        앱이 설치되어 있다면 "예닮 앱에서 열기"를 누르세요.<br />
        앱이 없다면 먼저 다운로드해주세요.
      </p>
    </div>
  );
}
