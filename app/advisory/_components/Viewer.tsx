'use client';

// 청중(목사님) 화면 — 순수 뷰어.
// 직접 넘기는 버튼/스와이프/키보드 없음. 오직 발표자(present)가 보내는 슬라이드만 실시간으로 따라간다.

import { useEffect, useState } from 'react';
import { SLIDES } from '../_content';
import { SlideBody, SYNC_CHANNEL } from './Deck';
import { supabase } from '../../../lib/supabase';

const BLUE = '#4f6ef2';

export default function Viewer() {
    const [idx, setIdx] = useState(0);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const ch = supabase.channel(SYNC_CHANNEL, { config: { broadcast: { self: false } } });
        ch.on('broadcast', { event: 'slide' }, ({ payload }: any) => {
            const n = payload?.slide;
            if (typeof n === 'number' && n >= 0 && n < SLIDES.length) setIdx(n);
        });
        ch.subscribe((s: string) => { if (s === 'SUBSCRIBED') setConnected(true); });
        return () => { supabase.removeChannel(ch); };
    }, []);

    const slide = SLIDES[idx];
    const dark = slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'closing';

    return (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: dark ? 'linear-gradient(160deg,#0b1220,#1e293b)' : '#fbfbfd', overflow: 'hidden' }}>
            {/* 진행 바 (발표자 위치 표시 — 청중은 조작 불가) */}
            <div style={{ height: 3, background: dark ? 'rgba(255,255,255,0.12)' : '#eef0f6', flexShrink: 0 }}>
                <div style={{ height: '100%', width: `${((idx + 1) / SLIDES.length) * 100}%`, background: BLUE, transition: 'width 0.3s' }} />
            </div>

            {/* 슬라이드 본문 (읽기 전용) */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: dark ? 'center' : 'flex-start', justifyContent: 'center', padding: '24px 22px 28px' }}>
                <SlideBody slide={slide} answer="" setAnswer={() => {}} ministry={[]} setMinistry={() => {}} info={{}} setInfo={() => {}} />
            </div>

            {/* 하단 — 발표자가 진행함을 안내 (청중용 네비 버튼 없음) */}
            <div style={{ flexShrink: 0, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))', textAlign: 'center', borderTop: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #eef0f6' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 800, color: '#94a3b8' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 8, background: connected ? '#22c55e' : '#f59e0b', boxShadow: connected ? '0 0 6px #22c55e' : 'none' }} />
                    {connected ? '발표자가 화면을 진행합니다' : '연결 중…'} · {idx + 1} / {SLIDES.length}
                </span>
            </div>
        </div>
    );
}
