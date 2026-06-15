'use client';

// 슬라이드 검토 전용 — 각자 휴대폰에서 자기 속도로 넘겨보는 페이지.
// 동기화/리모트 없음(발표자도, 다른 검토자도 영향 없음). 발표자 모드와 완전 분리.

import { useEffect, useRef, useState } from 'react';
import { SLIDES, CUES } from '../_content';
import { SlideBody, DARK_BG } from '../_components/Deck';

const BLUE = '#4f6ef2';

export default function ReviewPage() {
    const [idx, setIdx] = useState(0);
    const [showCue, setShowCue] = useState(true);
    const touchX = useRef<number | null>(null);
    const touchY = useRef<number | null>(null);

    const go = (d: number) => setIdx(i => Math.min(Math.max(i + d, 0), SLIDES.length - 1));

    useEffect(() => {
        // 슬라이드 이동은 좌우 화살표만. 스크롤 키(PageUp/Down/Space)는 가로채지 않음
        const h = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, []);

    const slide = SLIDES[idx];
    const dark = slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'closing';

    return (
        <div
            style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: DARK_BG, overflow: 'hidden' }}
            onTouchStart={e => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY; }}
            onTouchEnd={e => {
                if (touchX.current == null || touchY.current == null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                const dy = e.changedTouches[0].clientY - touchY.current;
                // 수평 스와이프가 확실할 때만 슬라이드 이동 — 세로 스크롤은 무시
                if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
                touchX.current = null; touchY.current = null;
            }}
        >
            {/* 상단 바 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: '#0f172a', flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>슬라이드 검토 <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: 11.5 }}>· 나만 보기(동기화 없음)</span></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setShowCue(s => !s)}
                        style={{ height: 34, padding: '0 11px', borderRadius: 8, border: 'none', background: showCue ? BLUE : 'rgba(255,255,255,0.16)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        🎤 큐 {showCue ? 'ON' : 'OFF'}
                    </button>
                    <select value={idx} onChange={e => setIdx(Number(e.target.value))}
                        style={{ maxWidth: 168, height: 34, borderRadius: 8, border: 'none', padding: '0 8px', fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                        {SLIDES.map((s, i) => (
                            <option key={s.id} value={i}>{i + 1}. {(s.title || s.question || s.kind).slice(0, 22)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 슬라이드 본문 */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: dark ? 'center' : 'flex-start', justifyContent: 'center', padding: '20px 22px 28px' }}>
                <SlideBody slide={slide} answer="" setAnswer={() => {}} ministry={[]} setMinistry={() => {}} info={{}} setInfo={() => {}} />
            </div>

            {/* 발표 큐(검토용) */}
            {showCue && CUES[slide.id] && (
                <div style={{ background: '#15203a', borderTop: `2px solid ${BLUE}`, padding: '11px 16px', flexShrink: 0, maxHeight: '30vh', overflowY: 'auto' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 900, color: '#8aa0ff', letterSpacing: 1, marginBottom: 5 }}>🎤 발표 큐 · 검토용</div>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#eef2ff', fontWeight: 600 }}>{CUES[slide.id]}</p>
                </div>
            )}

            {/* 하단 컨트롤 (내 화면만 이동) */}
            <div style={{ display: 'flex', gap: 10, padding: '12px 16px calc(14px + env(safe-area-inset-bottom))', background: '#0f172a', flexShrink: 0 }}>
                <button onClick={() => go(-1)} disabled={idx === 0}
                    style={{ width: 80, height: 52, borderRadius: 14, border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>‹ 이전</button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 15, fontWeight: 800 }}>{idx + 1} / {SLIDES.length}</div>
                <button onClick={() => go(1)} disabled={idx === SLIDES.length - 1}
                    style={{ flex: 1.4, height: 52, borderRadius: 14, border: 'none', background: BLUE, color: '#fff', fontSize: 17, fontWeight: 900, cursor: 'pointer', opacity: idx === SLIDES.length - 1 ? 0.5 : 1 }}>다음 ▶</button>
            </div>
        </div>
    );
}
