'use client';

import { useEffect, useRef, useState } from 'react';
import { SLIDES } from '../_content';
import { SlideBody, SYNC_CHANNEL } from '../_components/Deck';
import { supabase } from '../../../lib/supabase';

const PRESENT_KEY = 'soluma-present-2026';
const BLUE = '#4f6ef2';

export default function PresentPage() {
    const [authed, setAuthed] = useState(false);
    const [pass, setPass] = useState('');
    const [idx, setIdx] = useState(0);
    const [live, setLive] = useState(false);
    const chRef = useRef<any>(null);
    const idxRef = useRef(0);
    idxRef.current = idx;

    // URL ?key= 로도 인증
    useEffect(() => {
        try {
            const k = new URLSearchParams(window.location.search).get('key');
            if (k === PRESENT_KEY) setAuthed(true);
        } catch {}
    }, []);

    // 채널 연결
    useEffect(() => {
        if (!authed) return;
        const ch = supabase.channel(SYNC_CHANNEL);
        ch.subscribe((status: string) => { if (status === 'SUBSCRIBED') setLive(true); });
        chRef.current = ch;
        return () => { supabase.removeChannel(ch); setLive(false); };
    }, [authed]);

    const send = (n: number) => { chRef.current?.send({ type: 'broadcast', event: 'slide', payload: { slide: n } }); };

    // 슬라이드 바뀌면 송출
    useEffect(() => { if (authed && live) send(idx); }, [idx, authed, live]);
    // 하트비트 (늦게 접속한 폰도 2초 내 동기화)
    useEffect(() => {
        if (!authed || !live) return;
        const t = setInterval(() => send(idxRef.current), 2000);
        return () => clearInterval(t);
    }, [authed, live]);

    // 키보드
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (!authed) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); setIdx(i => Math.min(i + 1, SLIDES.length - 1)); }
            if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [authed]);

    if (!authed) {
        return (
            <div style={{ minHeight: '100dvh', background: '#0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 340 }}>
                    <h1 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 6px' }}>발표자 모드</h1>
                    <p style={{ fontSize: 13.5, color: '#64748b', margin: '0 0 16px' }}>발표 진행용 비밀번호를 입력하세요.</p>
                    <input value={pass} onChange={e => setPass(e.target.value)} placeholder="비밀번호" type="password"
                        onKeyDown={e => { if (e.key === 'Enter' && pass === PRESENT_KEY) setAuthed(true); }}
                        style={{ width: '100%', height: 48, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, marginBottom: 10, boxSizing: 'border-box' }} />
                    <button onClick={() => { if (pass === PRESENT_KEY) setAuthed(true); }}
                        style={{ width: '100%', height: 48, borderRadius: 12, border: 'none', background: '#0f172a', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>입장</button>
                </div>
            </div>
        );
    }

    const slide = SLIDES[idx];
    const dark = slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'closing';

    return (
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: dark ? 'linear-gradient(160deg,#0b1220,#1e293b)' : '#fbfbfd', overflow: 'hidden' }}>
            {/* 발표자 상단 바 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: '#0f172a', flexShrink: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 900, color: '#fff' }}>
                    <span style={{ width: 9, height: 9, borderRadius: 9, background: live ? '#22c55e' : '#ef4444', boxShadow: live ? '0 0 8px #22c55e' : 'none' }} />
                    발표자 모드 {live ? 'LIVE' : '연결 중…'}
                </span>
                <select value={idx} onChange={e => setIdx(Number(e.target.value))}
                    style={{ maxWidth: 200, height: 34, borderRadius: 8, border: 'none', padding: '0 8px', fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                    {SLIDES.map((s, i) => (
                        <option key={s.id} value={i}>{i + 1}. {(s.title || s.question || s.kind).slice(0, 22)}</option>
                    ))}
                </select>
            </div>

            {/* 현재 슬라이드 미리보기 */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: dark ? 'center' : 'flex-start', justifyContent: 'center', padding: '20px 22px 28px' }}>
                <SlideBody slide={slide} answer="" setAnswer={() => {}} ministry={[]} setMinistry={() => {}} info={{}} setInfo={() => {}} />
            </div>

            {/* 발표자 컨트롤 */}
            <div style={{ display: 'flex', gap: 10, padding: '12px 16px calc(14px + env(safe-area-inset-bottom))', background: '#0f172a', flexShrink: 0 }}>
                <button onClick={() => setIdx(i => Math.max(i - 1, 0))} disabled={idx === 0}
                    style={{ width: 80, height: 56, borderRadius: 14, border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>‹ 이전</button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 15, fontWeight: 800 }}>{idx + 1} / {SLIDES.length}</div>
                <button onClick={() => setIdx(i => Math.min(i + 1, SLIDES.length - 1))} disabled={idx === SLIDES.length - 1}
                    style={{ flex: 1.4, height: 56, borderRadius: 14, border: 'none', background: BLUE, color: '#fff', fontSize: 18, fontWeight: 900, cursor: 'pointer', opacity: idx === SLIDES.length - 1 ? 0.5 : 1 }}>다음 ▶</button>
            </div>
        </div>
    );
}
