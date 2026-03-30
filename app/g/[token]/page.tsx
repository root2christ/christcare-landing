'use client';

export default function RedeemGift({ params }: { params: { token: string } }) {
  const appUrl = `christ-app://g/${params.token}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #FFF1F2 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎁</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>
        선물이 도착했어요!
      </h1>
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>
        예닮 앱에서 선물을 받으세요
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a
          href={appUrl}
          style={{
            background: '#f43f5e', color: '#fff', padding: '16px 32px',
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
    </div>
  );
}
