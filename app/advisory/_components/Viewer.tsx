'use client';

// 청중(목사님) 화면.
// 기본은 발표자를 실시간으로 따라가고(projector·목사님 폰 공통),
// 좌우로 넘기면(스와이프/화살표) 자유 열람 모드로 전환 → 원하는 페이지 다 볼 수 있음.
// "발표자 화면으로 돌아가기"로 언제든 현재 발표 위치로 복귀.

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
    // 발표 따라가기(true) / 자유 열람(false)
    const [following, setFollowing] = useState(true);
    const [remoteIdx, setRemoteIdx] = useState<number | null>(null);
    const followingRef = useRef(true);
    const touchX = useRef<number | null>(null);
    const touchY = useRef<number | null>(null);

    const setFollow = (v: boolean) => { followingRef.current = v; setFollowing(v); };
    const go = (d: number) => { setFollow(false); setIdx(i => Math.min(Math.max(i + d, 0), SLIDES.length - 1)); };
    const resync = () => { if (remoteIdx != null) { setFollow(true); setIdx(remoteIdx); } };

    // 발표자 송출 수신 — 따라가기 모드면 자동 이동, 자유 열람이면 위치만 기억
    useEffect(() => {
        const ch = supabase.channel(SYNC_CHANNEL, { config: { broadcast: { self: false } } });
        ch.on('broadcast', { event: 'slide' }, ({ payload }: any) => {
            const n = payload?.slide;
            if (typeof n !== 'number' || n < 0 || n >= SLIDES.length) return;
            setRemoteIdx(n);
            if (followingRef.current) setIdx(prev => (prev === n ? prev : n));
        });
        ch.subscribe((s: string) => { if (s === 'SUBSCRIBED') setConnected(true); });
        return () => { supabase.removeChannel(ch); };
    }, []);

    // 키보드 좌우 = 자유 열람
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
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
        <div
            style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: DARK_BG, overflow: 'hidden' }}
            onTouchStart={e => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY; }}
            onTouchEnd={e => {
                if (touchX.current == null || touchY.current == null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                const dy = e.changedTouches[0].clientY - touchY.current;
                // 수평 스와이프가 확실할 때만 이동 — 세로 스크롤은 무시
                if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
                touchX.current = null; touchY.current = null;
            }}
        >
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

            {/* 진행 바 */}
            <div style={{ height: 3, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }}>
                <div style={{ height: '100%', width: `${((idx + 1) / SLIDES.length) * 100}%`, background: BLUE, transition: 'width 0.3s' }} />
            </div>

            {/* 슬라이드 본문 */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: dark ? 'center' : 'flex-start', justifyContent: 'center', padding: '24px 22px 28px' }}>
                <SlideBody slide={slide} answer="" setAnswer={() => {}} ministry={[]} setMinistry={() => {}} info={{}} setInfo={() => {}} />
            </div>

            {/* 하단 — 따라가는 중이면 안내+힌트, 자유 열람 중이면 돌아가기 버튼 */}
            <div style={{ flexShrink: 0, padding: '10px 16px calc(12px + env(safe-area-inset-bottom))', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {remoteIdx != null && !following ? (
                    <button onClick={resync}
                        style={{ border: 'none', background: '#16a34a', color: '#fff', borderRadius: 10, padding: '9px 16px', fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}>
                        ▶ 발표자 화면(슬라이드 {remoteIdx + 1})으로 돌아가기
                    </button>
                ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 700, color: '#94a3b8' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 8, background: connected ? '#22c55e' : '#f59e0b', boxShadow: connected ? '0 0 6px #22c55e' : 'none' }} />
                        {connected ? '발표 진행 중' : '연결 중…'} · {idx + 1} / {SLIDES.length} · 좌우로 넘겨 자유 열람
                    </span>
                )}
            </div>
        </div>
    );
}
