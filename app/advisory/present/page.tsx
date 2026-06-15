'use client';

import { useEffect, useRef, useState } from 'react';
import { SLIDES, CUES } from '../_content';
import { SlideBody, SYNC_CHANNEL, DARK_BG } from '../_components/Deck';
import { supabase } from '../../../lib/supabase';

const PRESENT_KEY = 'soluma-present-2026';
const BLUE = '#4f6ef2';

export default function PresentPage() {
    const [authed, setAuthed] = useState(false);
    const [pass, setPass] = useState('');
    const [idx, setIdx] = useState(0);
    const [live, setLive] = useState(false);
    const [showCue, setShowCue] = useState(true);
    const chRef = useRef<any>(null);
    const idxRef = useRef(0);
    idxRef.current = idx;
    // 운전자(driver) 제어 — 능동적으로 넘긴 발표자만 송출/하트비트.
    // 다른 발표자의 송출을 받으면 운전대를 내려놓고 따라가기만 한다(자동 인수인계).
    const drivingRef = useRef(false);
    // 단조 증가 시퀀스 — 더 최신 조작이 오래된 하트비트에 밀리지 않도록(인수인계 깜빡임 방지)
    const seqRef = useRef(0);
    const drive = (next: number | ((i: number) => number)) => {
        seqRef.current += 1;
        drivingRef.current = true;
        setIdx(prev => (typeof next === 'function' ? (next as (i: number) => number)(prev) : next));
    };

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
        // 다른 발표자(2명 이상)가 넘기면 이 발표자 화면도 같은 위치로 수렴 → 하트비트 충돌(튕김) 방지.
        // 더 최신 시퀀스만 채택(오래된 하트비트 무시). 채택 시 운전대를 내려놓고 따라가기로 전환.
        ch.on('broadcast', { event: 'slide' }, ({ payload }: any) => {
            const n = payload?.slide;
            const s = typeof payload?.seq === 'number' ? payload.seq : 0;
            if (typeof n !== 'number' || n < 0 || n >= SLIDES.length) return;
            if (s <= seqRef.current) return; // 오래된/동급 송출 무시
            seqRef.current = s;
            drivingRef.current = false;      // 다른 발표자가 운전 → 나는 따라가기
            setIdx(prev => (prev === n ? prev : n));
        });
        ch.subscribe((status: string) => { if (status === 'SUBSCRIBED') setLive(true); });
        chRef.current = ch;
        return () => { supabase.removeChannel(ch); setLive(false); };
    }, [authed]);

    const send = (n: number) => { chRef.current?.send({ type: 'broadcast', event: 'slide', payload: { slide: n, seq: seqRef.current } }); };

    // 운전자일 때만 송출 (슬라이드가 바뀌면)
    useEffect(() => { if (authed && live && drivingRef.current) send(idx); }, [idx, authed, live]);
    // 하트비트 — 운전자만 2초마다 재송출 (늦게 접속한 폰/발표자도 따라옴, 발표자 간 충돌 없음)
    useEffect(() => {
        if (!authed || !live) return;
        const t = setInterval(() => { if (drivingRef.current) send(idxRef.current); }, 2000);
        return () => clearInterval(t);
    }, [authed, live]);

    // 키보드
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (!authed) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); drive(i => Math.min(i + 1, SLIDES.length - 1)); }
            if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); drive(i => Math.max(i - 1, 0)); }
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
        <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: DARK_BG, overflow: 'hidden' }}>
            {/* 발표자 상단 바 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px', background: '#0f172a', flexShrink: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 900, color: '#fff' }}>
                    <span style={{ width: 9, height: 9, borderRadius: 9, background: live ? '#22c55e' : '#ef4444', boxShadow: live ? '0 0 8px #22c55e' : 'none' }} />
                    발표자 모드 {live ? 'LIVE' : '연결 중…'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setShowCue(s => !s)}
                        style={{ height: 34, padding: '0 11px', borderRadius: 8, border: 'none', background: showCue ? BLUE : 'rgba(255,255,255,0.16)', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        🎤 큐 {showCue ? 'ON' : 'OFF'}
                    </button>
                    <select value={idx} onChange={e => drive(Number(e.target.value))}
                        style={{ maxWidth: 168, height: 34, borderRadius: 8, border: 'none', padding: '0 8px', fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                        {SLIDES.map((s, i) => (
                            <option key={s.id} value={i}>{i + 1}. {(s.title || s.question || s.kind).slice(0, 22)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 현재 슬라이드 미리보기 */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: dark ? 'center' : 'flex-start', justifyContent: 'center', padding: '20px 22px 28px' }}>
                <SlideBody slide={slide} answer="" setAnswer={() => {}} ministry={[]} setMinistry={() => {}} info={{}} setInfo={() => {}} />
            </div>

            {/* 발표 큐카드 — 발표자만 보임 (목사님 화면엔 안 나감) */}
            {showCue && CUES[slide.id] && (
                <div style={{ background: '#15203a', borderTop: `2px solid ${BLUE}`, padding: '11px 16px', flexShrink: 0, maxHeight: '34vh', overflowY: 'auto' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 900, color: '#8aa0ff', letterSpacing: 1, marginBottom: 5 }}>🎤 발표 큐 · 나만 보임</div>
                    <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.55, color: '#eef2ff', fontWeight: 600 }}>{CUES[slide.id]}</p>
                </div>
            )}

            {/* 발표자 컨트롤 */}
            <div style={{ display: 'flex', gap: 10, padding: '12px 16px calc(14px + env(safe-area-inset-bottom))', background: '#0f172a', flexShrink: 0 }}>
                <button onClick={() => drive(i => Math.max(i - 1, 0))} disabled={idx === 0}
                    style={{ width: 80, height: 56, borderRadius: 14, border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>‹ 이전</button>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 15, fontWeight: 800 }}>{idx + 1} / {SLIDES.length}</div>
                <button onClick={() => drive(i => Math.min(i + 1, SLIDES.length - 1))} disabled={idx === SLIDES.length - 1}
                    style={{ flex: 1.4, height: 56, borderRadius: 14, border: 'none', background: BLUE, color: '#fff', fontSize: 18, fontWeight: 900, cursor: 'pointer', opacity: idx === SLIDES.length - 1 ? 0.5 : 1 }}>다음 ▶</button>
            </div>
        </div>
    );
}
