'use client';

import { useEffect, useState } from 'react';

const IOS_URL = 'https://apps.apple.com/app/id6779090825';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.root2christ.christapp';

export default function RedeemGift({ params }: { params: { token: string } }) {
  const appUrl = `christ-app://g/${params.token}`;
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) setOs('ios');
    else if (/Android/i.test(ua)) setOs('android');
  }, []);

  // 카카오톡 인앱 브라우저는 iOS 유니버설 링크를 열지 않는다.
  // 그래서 아이폰 사용자는 이 페이지에 갇히기 쉬운데, 예전엔 안드로이드 스토어 버튼만
  // 있고 코드를 볼 방법도 없었다. 코드를 눈으로 보고 손으로 옮겨 적는 과정에서
  // 오타·보이지 않는 문자가 섞여 "유효하지 않은 코드" 가 됐다 (2026-09-01 제보).
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(params.token);
    } catch {
      // clipboard API 가 막힌 인앱 브라우저 폴백
      const el = document.createElement('textarea');
      el.value = params.token;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const storeBtn = (href: string, label: string, primary: boolean) => (
    <a
      key={href}
      href={href}
      style={{
        background: primary ? '#1e293b' : '#fff',
        color: primary ? '#fff' : '#1e293b',
        border: primary ? 'none' : '1px solid #cbd5e1',
        padding: '14px 28px', borderRadius: 14, fontWeight: 700,
        textDecoration: 'none', fontSize: 15,
      }}
    >
      {label}
    </a>
  );

  const stores = os === 'ios'
    ? [storeBtn(IOS_URL, '앱 다운로드 (iPhone)', true), storeBtn(ANDROID_URL, 'Android', false)]
    : os === 'android'
      ? [storeBtn(ANDROID_URL, '앱 다운로드 (Android)', true), storeBtn(IOS_URL, 'iPhone', false)]
      : [storeBtn(IOS_URL, '앱 다운로드 (iPhone)', true), storeBtn(ANDROID_URL, '앱 다운로드 (Android)', true)];

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
      <p style={{ fontSize: 16, color: '#64748b', marginBottom: 28 }}>
        soluma 앱에서 선물을 받으세요
      </p>

      <a
        href={appUrl}
        style={{
          background: '#f43f5e', color: '#fff', padding: '16px 32px',
          borderRadius: 16, fontWeight: 700, textDecoration: 'none', fontSize: 16,
          marginBottom: 28,
        }}
      >
        soluma 앱에서 열기
      </a>

      {/* 앱이 자동으로 안 열릴 때(카카오톡 인앱 브라우저 등) 직접 입력할 수 있게 */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
        padding: '18px 20px', maxWidth: 340, width: '100%', marginBottom: 24,
      }}>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 10px' }}>
          앱이 열리지 않으면, 아래 코드를 복사해서<br />
          앱 → 요금제 → 🎁 선물 코드에 붙여넣으세요
        </p>
        <div style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 17, fontWeight: 800, letterSpacing: 1, color: '#1e293b',
          wordBreak: 'break-all', marginBottom: 12,
        }}>
          {params.token}
        </div>
        <button
          onClick={copyCode}
          style={{
            width: '100%', background: copied ? '#10b981' : '#f1f5f9',
            color: copied ? '#fff' : '#1e293b', border: 'none',
            padding: '12px 0', borderRadius: 12, fontWeight: 700, fontSize: 15,
            cursor: 'pointer',
          }}
        >
          {copied ? '복사됐어요 ✓' : '코드 복사'}
        </button>
        {/* 1.0.x 바이너리는 선물 조회 경로가 옛날 방식이라 RLS(2026-07-26)에 막혀
            "유효하지 않은 코드"가 뜬다. 스토어 업데이트가 유일한 해결이라 여기서 안내한다. */}
        <p style={{ fontSize: 12, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a',
                    borderRadius: 10, padding: '10px 12px', margin: '12px 0 0', lineHeight: 1.5 }}>
          ⚠️ &ldquo;유효하지 않은 코드입니다&rdquo; 가 뜨나요?<br />
          앱이 오래된 버전이면 선물을 받을 수 없습니다.<br />
          아래에서 <b>앱을 최신 버전으로 업데이트</b>한 뒤 다시 시도해 주세요.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
        {stores}
      </div>
    </div>
  );
}
