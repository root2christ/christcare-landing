// soluma 앱 아웃라인(라인) 아이콘 — 웹 덱용 인라인 SVG 포팅
//
// 원본: mobile-app/src/components/icons/glyphs_*.tsx (react-native-svg <Path .../>)
// 앱과 동일한 24×24 그리드, fill=none, stroke=currentColor, round cap/join.
// 색상은 stroke(currentColor)로 상속 — 호출부에서 style={{ color: accent }} 로 지정.
//
// 사용:
//   <FeatureIcon name="bible" size={46} />        // currentColor 상속
//   <span style={{ color: accent }}><FeatureIcon name="prayer" /></span>

import React from 'react';

export interface FeatureIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

// 앱 glyph geometry 를 그대로 옮긴 path 노드 (24×24 기준)
const GLYPHS: Record<string, React.ReactNode> = {
  // Sparkles — 크라이스트 테스트 (앱: Sparkles)
  sparkles: (
    <>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2Z" />
      <path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2-2.2-.8 2.2-.8L19 14Z" />
      <path d="M5 17l.5 1.5 1.5.5-1.5.5L5 21l-.5-1.5-1.5-.5 1.5-.5L5 17Z" />
    </>
  ),

  // Brain — 크라이스트 심층분석 (앱: Brain)
  brain: (
    <>
      <path d="M12 6V20" />
      <path d="M12 6c0-2-1.5-3.5-3.5-3.5A3.5 3.5 0 0 0 5 6c-1.5 0-3 1-3 3 0 1.2.6 2.2 1.5 2.8C3 12.8 3 14 3.5 15a3 3 0 0 0 2.5 1.5c.5 1.5 2 3.5 6 3.5" />
      <path d="M12 6c0-2 1.5-3.5 3.5-3.5A3.5 3.5 0 0 1 19 6c1.5 0 3 1 3 3 0 1.2-.6 2.2-1.5 2.8.5 1 .5 2.2 0 3.2a3 3 0 0 1-2.5 1.5c-.5 1.5-2 3.5-6 3.5" />
    </>
  ),

  // Heart — 신앙심 점검 (앱: Heart)
  heart: (
    <path d="M12 20.3C12 20.3 3.8 15 3.8 9.3A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.2 2.3C20.2 15 12 20.3 12 20.3Z" />
  ),

  // BookOpen — 성경 읽기 (앱: BookOpen)
  bible: (
    <>
      <path d="M12 6c-1.6-1.2-3.6-2-6.2-2H3v14h2.8c2.6 0 4.6.8 6.2 2" />
      <path d="M12 6c1.6-1.2 3.6-2 6.2-2H21v14h-2.8c-2.6 0-4.6.8-6.2 2" />
      <line x1="12" y1="6" x2="12" y2="20" />
    </>
  ),

  // Sun — 큐티(QT) (앱: Sun)
  qt: (
    <>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
      <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
      <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
    </>
  ),

  // Hand — 기도 요청 (앱: Hand)
  prayer: (
    <path d="M8 13V6a1.5 1.5 0 0 1 3 0v4.5M11 10.5V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6h-1.2a5 5 0 0 1-4.1-2.1L4.4 14a1.6 1.6 0 0 1 2.6-1.9L8 13.4" />
  ),

  // Megaphone — 간증 나눔 (앱: Megaphone)
  megaphone: (
    <>
      <path d="M20 7L8 10v4l12 3V7Z" />
      <path d="M8 10.5v3" />
      <path d="M4 11a2 2 0 0 0 0 2h4v-2H4Z" />
      <line x1="4" y1="13" x2="6" y2="18" />
      <circle cx="20" cy="7.5" r="1" />
    </>
  ),

  // ScrollText — 말씀 묵상 (앱은 PenLine 공용 사용 → 필사와 구분 위해 ScrollText로 대체, 동일 앱 아이콘셋)
  meditation: (
    <>
      <path d="M8 3H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8" />
      <path d="M6 3a2 2 0 0 0-2 2v1" />
      <line x1="10" y1="12" x2="17" y2="12" />
      <line x1="10" y1="16" x2="15" y2="16" />
    </>
  ),

  // Calendar — 성경 통독 (앱: Calendar)
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </>
  ),

  // PenLine — 성경 필사 (앱: PenLine)
  pen: (
    <>
      <path d="M7 18l9.5-9.5a2 2 0 0 0-3-3L4 15v3h3Z" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </>
  ),

  // HelpCircle — 성경 퀴즈 (앱: HelpCircle)
  quiz: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a3 3 0 0 1 5.5 1.5c0 1.8-2 2.5-2 2.5" />
      <circle cx="12" cy="17" r="0.8" />
    </>
  ),

  // Shield — 이단 점검 (앱: Shield)
  shield: (
    <path d="M12 3L4 6.5v5.5c0 4.5 3.4 8.7 8 9.8 4.6-1.1 8-5.3 8-9.8V6.5L12 3Z" />
  ),

  // Bot — AI 상담 (앱: Bot)
  robot: (
    <>
      <rect x="3.5" y="8" width="17" height="12" rx="2.5" />
      <line x1="12" y1="8" x2="12" y2="4.5" />
      <circle cx="12" cy="4" r="0.8" />
      <circle cx="8.5" cy="14" r="1.5" />
      <circle cx="15.5" cy="14" r="1.5" />
      <path d="M9.5 18.5h5" />
    </>
  ),

  // Briefcase — 잡박스 (앱: Briefcase)
  jobbox: (
    <>
      <rect x="2.5" y="8" width="19" height="13" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="2.5" y1="14" x2="21.5" y2="14" />
    </>
  ),
};

export const FEATURE_ICON_NAMES = Object.keys(GLYPHS);

export function hasFeatureIcon(name: string): boolean {
  return !!GLYPHS[name];
}

/** 앱과 동일한 아웃라인 아이콘을 렌더하는 웹 SVG 컴포넌트 */
export default function FeatureIcon({
  name,
  size = 24,
  strokeWidth = 1.8,
  className,
  style,
}: FeatureIconProps & { name: string }) {
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
