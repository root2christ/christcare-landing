'use client';
import { useState } from 'react';
import Link from 'next/link';
import { pick, UI, C, STORE, type Lang, type ResultData } from '../christTest';

export default function ResultClient({ code, lang, data }: { code: string; lang: Lang; data: ResultData }) {
  const t = UI[lang];
  const [toast, setToast] = useState('');
  const model = pick(data, 'model', lang);
  const reveal = pick(data, 'reveal', lang);
  const comfort = pick(data, 'comfort', lang);
  const god = pick(data, 'god', lang);
  const prayer = pick(data, 'prayer', lang);
  const verse = pick(data, 'verse', lang);
  const reference = pick(data, 'reference', lang);
  const shareUrl = `https://christcare.us/t/${code}?lang=${lang}`;

  const onShare = async () => {
    const shareText = lang === 'en' ? `I'm ${model} — Christ Test` : `나는 ‘${model}’ — 크라이스트 테스트`;
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share({ title: 'Christ Test', text: shareText, url: shareUrl });
        return;
      }
    } catch { /* 취소 등 무시 */ }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast(t.copied);
      setTimeout(() => setToast(''), 2400);
    } catch { /* noop */ }
  };

  const openApp = () => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const store = /android/i.test(ua) ? STORE.android : /iphone|ipad|ipod/i.test(ua) ? STORE.ios : STORE.android;
    try { window.location.href = STORE.deepLink; } catch { /* noop */ }
    setTimeout(() => { window.location.href = store; }, 1200);
  };

  const section = (label: string, body: string, accent?: boolean) => (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1, color: accent ? C.skyDeep : C.faint, marginBottom: 8 }}>{label}</div>
      <p style={{ fontSize: 16, lineHeight: 1.75, color: C.ink, margin: 0, whiteSpace: 'pre-line' }}>{body}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', background: C.cream, color: C.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 56px', boxSizing: 'border-box' }}>
      <style>{`@keyframes rIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

      <div style={{ width: '100%', maxWidth: 480, animation: 'rIn .55s ease' }}>
        {/* 인물 공개 */}
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.skyDeep, letterSpacing: 1 }}>{t.kicker}</div>
          <div style={{
            width: 208, height: 208, margin: '18px auto 0', borderRadius: 40, background: C.card,
            border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            boxShadow: '0 14px 34px rgba(2,132,199,.10)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/ct/${data.id}.webp`} alt={model} width={200} height={200} style={{ width: '92%', height: '92%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: 27, fontWeight: 900, margin: '20px 0 0' }}>{t.are(model)}</h1>
          <div style={{ fontSize: 12.5, color: C.faint, fontWeight: 700, marginTop: 6, letterSpacing: 2 }}>{code}</div>
        </div>

        {/* 오늘 당신에게 (reveal) */}
        <div style={{ marginTop: 28, background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: '26px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: C.skyDeep, marginBottom: 12 }}>{t.revealKicker}</div>
          <p style={{ fontSize: 20, lineHeight: 1.65, fontWeight: 700, margin: 0, whiteSpace: 'pre-line' }}>{reveal}</p>
        </div>

        {/* 잔잔한 결과지 */}
        {section(t.comfortLabel, comfort)}
        {section(t.godLabel, god, true)}

        {/* 기도 */}
        <div style={{ marginTop: 24, background: 'linear-gradient(180deg,#F0F9FF,#FBF7EF)', border: `1px solid ${C.border}`, borderRadius: 20, padding: '20px 20px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1, color: C.skyDeep, marginBottom: 8 }}>{t.prayerLabel}</div>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: C.ink, margin: 0, fontStyle: 'italic', whiteSpace: 'pre-line' }}>{prayer}</p>
        </div>

        {/* 말씀 */}
        {verse && (
          <div style={{ marginTop: 22, textAlign: 'center', padding: '0 8px' }}>
            <p style={{ fontSize: 16.5, lineHeight: 1.7, fontWeight: 700, color: C.skyDeep, margin: 0 }}>“{verse}”</p>
            <div style={{ fontSize: 13, color: C.faint, fontWeight: 700, marginTop: 6 }}>— {reference}</div>
          </div>
        )}

        {/* 공유 */}
        <button
          onClick={onShare}
          style={{ width: '100%', marginTop: 34, background: `linear-gradient(180deg,${C.sky},${C.skyDark})`, color: C.white, border: 'none', borderRadius: 16, padding: '16px', fontSize: 16.5, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 24px rgba(14,165,233,.30)' }}
        >{t.share}</button>

        {/* 앱 설치 유도 */}
        <div style={{ marginTop: 16, background: C.white, border: `1px solid ${C.border}`, borderRadius: 20, padding: '22px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: C.ink }}>{t.ctaTitle}</div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: C.muted, margin: '8px 0 16px', whiteSpace: 'pre-line' }}>{t.ctaBody}</p>
          <button
            onClick={openApp}
            style={{ width: '100%', background: C.ink, color: C.white, border: 'none', borderRadius: 14, padding: '15px', fontSize: 15.5, fontWeight: 800, cursor: 'pointer' }}
          >{t.ctaBtn}</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/t" style={{ color: C.faint, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>↺ {t.retake}</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 26, fontSize: 12, color: C.faint, fontWeight: 700, letterSpacing: 1 }}>soluma</div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)', background: C.ink, color: C.white, padding: '11px 20px', borderRadius: 999, fontSize: 14, fontWeight: 700, zIndex: 10 }}>{toast}</div>
      )}
    </div>
  );
}
