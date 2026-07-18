'use client';

import { useState } from 'react';

type Lang = 'ko' | 'en';

const T = {
  ko: {
    tagline1: '예수님을 닮아가는 여정',
    tagline2: '크리스천을 위한 영적 성장 앱',
    google: 'Google Play에서 다운로드',
    apple: 'App Store에서 다운로드',
    testCta: '🕊️ 크라이스트 테스트 해보기',
    testSub: '성경 속 나와 닮은 인물 찾기 · 무료',
    features: ['🧪 크라이스트 테스트', '📖 성경 읽기', '☀️ 매일 큐티', '🙏 기도요청', '🏆 챌린지', '👥 소그룹'],
    rights: 'All rights reserved.',
  },
  en: {
    tagline1: 'A journey to become more like Jesus',
    tagline2: 'A spiritual growth app for Christians',
    google: 'Get it on Google Play',
    apple: 'Download on the App Store',
    testCta: '🕊️ Take the Christ Test',
    testSub: 'Find the Bible figure you’re most like · Free',
    features: ['🧪 C.H.R.I.S.T Test', '📖 Bible Reading', '☀️ Daily Devotion', '🙏 Prayer Requests', '🏆 Challenges', '👥 Small Groups'],
    rights: 'All rights reserved.',
  },
};

export default function Landing({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = T[lang];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FAF9F6 0%, #EEF2FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
    }}>
      {/* 언어 토글 */}
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 0, border: '1px solid #e2e8f0', borderRadius: 999, overflow: 'hidden', background: '#fff' }}>
        {(['ko', 'en'] as Lang[]).map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              border: 'none',
              background: lang === l ? '#1e293b' : 'transparent',
              color: lang === l ? '#fff' : '#64748b',
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {l === 'ko' ? '한국어' : 'EN'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        {/* 앱 아이콘 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/app-icon.png"
          alt="soluma app icon"
          width={92}
          height={92}
          style={{ borderRadius: 21, marginBottom: 22, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}
        />
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#1e293b', marginBottom: 8, letterSpacing: -1 }}>
          soluma
        </h1>
        <p style={{ fontSize: 18, color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>
          {t.tagline1}<br />
          {t.tagline2}
        </p>

        {/* 크라이스트 테스트 (바이럴 진입점) — 2026-07-18 사장님 요청으로 임시 숨김.
            /t 페이지 자체는 살아있어 직접 URL로는 접근 가능. 되살리려면 아래 블록 주석 해제. */}
        {false && (
        <a
          href="/t"
          style={{
            display: 'block', textDecoration: 'none', width: 300, maxWidth: '100%',
            margin: '0 auto 34px', background: 'linear-gradient(180deg, #38BDF8, #0EA5E9)',
            color: '#fff', padding: '18px 20px', borderRadius: 18,
            boxShadow: '0 12px 26px rgba(14,165,233,.34)',
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 800 }}>{t.testCta}</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.92, marginTop: 3 }}>{t.testSub}</div>
        </a>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <a
            href="https://play.google.com/store/apps/details?id=com.root2christ.christapp"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#1e293b', color: '#fff', padding: '16px 32px',
              borderRadius: 16, fontSize: 16, fontWeight: 700, textDecoration: 'none',
              width: 260, justifyContent: 'center',
            }}
          >
            {t.google}
          </a>
          <a
            href="https://apps.apple.com/app/id6779090825"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#fff', color: '#1e293b', padding: '16px 32px',
              borderRadius: 16, fontSize: 16, fontWeight: 700, textDecoration: 'none',
              border: '2px solid #e2e8f0', width: 260, justifyContent: 'center',
            }}
          >
            {t.apple}
          </a>
        </div>

        <div style={{ marginTop: 60, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {t.features.map(f => (
            <div key={f} style={{
              background: '#fff', padding: '10px 18px', borderRadius: 12,
              fontSize: 14, fontWeight: 600, color: '#475569',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              {f}
            </div>
          ))}
        </div>

        <p style={{ marginTop: 60, fontSize: 13, color: '#94a3b8' }}>
          © 2026 soluma (ROOT CO., Ltd). {t.rights}<br />
          master@christcare.us
        </p>
      </div>
    </div>
  );
}
