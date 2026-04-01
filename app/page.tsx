export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #EEF2FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: 480,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✝️</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>
          예닮
        </h1>
        <p style={{ fontSize: 18, color: '#64748b', marginBottom: 40, lineHeight: 1.6 }}>
          예수님을 닮아가는 여정<br />
          크리스천을 위한 영적 성장 앱
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <a
            href="https://play.google.com/store/apps/details?id=com.root2christ.christapp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#1e293b',
              color: '#fff',
              padding: '16px 32px',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              width: 260,
              justifyContent: 'center',
            }}
          >
            Google Play에서 다운로드
          </a>
          <a
            href="https://apps.apple.com/app/id000000000"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#fff',
              color: '#1e293b',
              padding: '16px 32px',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              border: '2px solid #e2e8f0',
              width: 260,
              justifyContent: 'center',
            }}
          >
            App Store에서 다운로드
          </a>
        </div>

        <div style={{ marginTop: 60, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {['🧪 크라이스트 테스트', '📖 성경 읽기', '☀️ 매일 큐티', '🙏 기도요청', '🏆 챌린지', '👥 소그룹'].map(f => (
            <div key={f} style={{
              background: '#fff',
              padding: '10px 18px',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              color: '#475569',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              {f}
            </div>
          ))}
        </div>

        <p style={{ marginTop: 60, fontSize: 13, color: '#94a3b8' }}>
          © 2024 예닮. All rights reserved.<br />
          master@christcare.us
        </p>
      </div>
    </div>
  );
}
