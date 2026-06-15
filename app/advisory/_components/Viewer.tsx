'use client';

// 청중(목사님) 화면 — 순수 뷰어.
// 직접 넘기는 버튼/스와이프/키보드 없음. 오직 발표자(present)가 보내는 슬라이드만 실시간으로 따라간다.

import { useEffect, useRef, useState } from 'react';
import { SLIDES } from '../_content';
import { SlideBody, SYNC_CHANNEL, DARK_BG } from './Deck';
import { supabase } from '../../../lib/supabase';

const BLUE = '#60a5fa';

export default function Viewer() {
    const [idx, setIdx] = useState(0);
    const [connected, setConnected] = useState(false);
    const [isFs, setIsFs] = useState(false);
    const [showFsBtn, setShowFsBtn] = useState(true);
    // 발표자 송출 시퀀스 — 인수인계 순간 오래된 하트비트가 화면을 되돌리지 않도록
    const seqRef = useRef(0);

    useEffect(() => {
        const ch = supabase.channel(SYNC_CHANNEL, { config: { broadcast: { self: false } } });
        ch.on('broadcast', { event: 'slide' }, ({ payload }: any) => {
            const n = payload?.slide;
            const s = typeof payload?.seq === 'number' ? payload.seq : 0;
            if (typeof n !== 'number' || n < 0 || n >= SLIDES.length) return;
            if (s < seqRef.current) return; // 오래된 송출 무시 (같은 seq의 하트비트는 허용)
            seqRef.current = s;
            setIdx(n);
        });
        ch.subscribe((s: string) => { if (s === 'SUBSCRIBED') setConnected(true); });
        return () => { supabase.removeChannel(ch); };
    }, []);

    // 전체화면 상태 추적 + 마우스 움직일 때만 버튼 노출(평소엔 깔끔하게 숨김)
    useEffect(() => {
        const onFs = () => setIsFs(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
        document.addEventListener('fullscreenchange', onFs);
        document.addEventListener('webkitfullscreenchange', onFs);
        let t: any;
        const onMove = () => { setShowFsBtn(true); clearTimeout(t); t = setTimeout(() => setShowFsBtn(false), 3000); };
        window.addEventListener('mousemove', onMove);
        t = setTimeout(() => setShowFsBtn(false), 3500);
        return () => {
            document.removeEventListener('fullscreenchange', onFs);
            document.removeEventListener('webkitfullscreenchange', onFs);
            window.removeEventListener('mousemove', onMove);
            clearTimeout(t);
        };
    }, []);

    // 전체화면 시 화면 밖(100dvh 아래) 영역이 흰색으로 보이지 않도록 html/body 배경을 어둡게 고정
    useEffect(() => {
        const html = document.documentElement, body = document.body;
        const pHtml = html.style.background, pBody = body.style.background;
        html.style.background = '#06151b';
        body.style.background = '#06151b';
        return () => { html.style.background = pHtml; body.style.background = pBody; };
    }, []);

    const toggleFs = () => {
        const d: any = document;
        const el: any = document.documentElement;
        if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen)?.call(d);
        else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    };

    const slide = SLIDES[idx];
    const dark = slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'closing';

    return (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: DARK_BG, overflow: 'hidden' }}>
            {/* 전체화면 버튼 (프로젝터 PC용 — 마우스 움직이면 우상단에 잠깐 나타남) */}
            <button onClick={toggleFs} title="전체화면 켜기/끄기"
                style={{ position: 'fixed', top: 12, right: 12, zIndex: 60, height: 38, padding: '0 13px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.55)', color: '#e2e8f0', fontSize: 12.5, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, opacity: showFsBtn ? 0.92 : 0, pointerEvents: showFsBtn ? 'auto' : 'none', transition: 'opacity 0.4s', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    {isFs
                        ? <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
                        : <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />}
                </svg>
                {isFs ? '전체화면 종료' : '전체화면'}
            </button>
            {/* 진행 바 (발표자 위치 표시 — 청중은 조작 불가) */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }}>
                <div style={{ height: '100%', width: `${((idx + 1) / SLIDES.length) * 100}%`, background: BLUE, transition: 'width 0.3s' }} />
            </div>

            {/* 슬라이드 본문 (읽기 전용) */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: dark ? 'center' : 'flex-start', justifyContent: 'center', padding: '24px 22px 28px' }}>
                <SlideBody slide={slide} answer="" setAnswer={() => {}} ministry={[]} setMinistry={() => {}} info={{}} setInfo={() => {}} />
            </div>

            {/* 하단 — 발표자가 진행함을 안내 (청중용 네비 버튼 없음) */}
            <div style={{ flexShrink: 0, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 800, color: '#94a3b8' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 8, background: connected ? '#22c55e' : '#f59e0b', boxShadow: connected ? '0 0 6px #22c55e' : 'none' }} />
                    {connected ? '발표자가 화면을 진행합니다' : '연결 중…'} · {idx + 1} / {SLIDES.length}
                </span>
            </div>
        </div>
    );
}
