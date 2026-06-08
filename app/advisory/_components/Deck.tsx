'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SLIDES, Slide } from '../_content';

type Pastor = { id: string; name: string; church?: string | null };

const LS_KEY = 'advisory_pastor_v1';
const NAVY = '#0f172a';
const BLUE = '#4f6ef2';
const MULTI_SEP = ' | ';
const MINISTRY = ['담임목회', '부목회', '교육', '청년', '청소년', '선교', '상담', '예배/찬양', '미디어', '교회개척', '기타'];

// ───────────────── 로그인 ─────────────────
function Login({ onDone }: { onDone: (p: Pastor) => void }) {
    const [pastors, setPastors] = useState<Pastor[]>([]);
    const [sel, setSel] = useState('');
    const [name, setName] = useState('');
    const [church, setChurch] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        fetch('/api/advisory/pastors').then(r => r.json()).then(d => setPastors(d.pastors || [])).catch(() => {});
    }, []);

    const isNew = sel === 'new' || pastors.length === 0;

    const start = async () => {
        setErr('');
        if (sel && sel !== 'new') {
            const p = pastors.find(x => x.id === sel);
            if (p) return onDone(p);
        }
        if (!name.trim()) { setErr('성함을 입력해 주세요.'); return; }
        setBusy(true);
        try {
            const res = await fetch('/api/advisory/pastors', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, church }),
            });
            const d = await res.json();
            if (d.pastor) onDone(d.pastor); else setErr(d.error || '오류가 발생했습니다.');
        } catch { setErr('네트워크 오류'); } finally { setBusy(false); }
    };

    return (
        <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#0b1220,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: '34px 24px', width: '100%', maxWidth: 380, boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/app-icon.png" alt="soluma" width={64} height={64} style={{ borderRadius: 15, marginBottom: 14 }} />
                    <h1 style={{ fontSize: 22, fontWeight: 900, color: NAVY, margin: 0 }}>soluma 목회자 자문회</h1>
                    <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>성함을 선택하거나 입력해 주세요.<br />모든 응답은 자동 저장됩니다.</p>
                </div>
                <select value={sel} onChange={e => setSel(e.target.value)}
                    style={{ width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, marginBottom: 12, background: '#fff', color: NAVY, boxSizing: 'border-box' }}>
                    <option value="">{pastors.length > 0 ? '— 명단에서 성함 선택 —' : '— 등록된 명단 없음 —'}</option>
                    {pastors.map(p => <option key={p.id} value={p.id}>{p.name}{p.church ? ` (${p.church})` : ''}</option>)}
                    <option value="new">+ 명단에 없어요 (직접 입력)</option>
                </select>
                {isNew && (
                    <>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="성함 (예: 홍길동 목사)"
                            style={{ width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, marginBottom: 10, boxSizing: 'border-box' }} />
                        <input value={church} onChange={e => setChurch(e.target.value)} placeholder="소속 교회 (선택)"
                            style={{ width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, marginBottom: 10, boxSizing: 'border-box' }} />
                    </>
                )}
                {err && <p style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 10px' }}>{err}</p>}
                <button onClick={start} disabled={busy}
                    style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', background: NAVY, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                    {busy ? '입장 중…' : '시작하기 →'}
                </button>
            </div>
        </div>
    );
}

// ───────────────── 슬라이드 본문 ─────────────────
function SlideBody({
    slide, answer, setAnswer, ministry, setMinistry, info, setInfo,
}: {
    slide: Slide;
    answer: string;
    setAnswer: (v: string) => void;
    ministry: string[];
    setMinistry: (v: string[]) => void;
    info: Record<string, string>;
    setInfo: (k: string, v: string) => void;
}) {
    const k = slide.kind;

    if (k === 'cover') {
        return (
            <div style={{ textAlign: 'center', maxWidth: 520 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/app-icon.png" alt="" width={92} height={92} style={{ borderRadius: 21, marginBottom: 24, boxShadow: '0 16px 40px rgba(79,110,242,0.4)' }} />
                <h1 style={{ fontSize: 34, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.25 }}>{slide.title}</h1>
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 16, color: '#cbd5e1', marginTop: 14, lineHeight: 1.6 }}>{b}</p>)}
            </div>
        );
    }

    if (k === 'divider') {
        return (
            <div style={{ textAlign: 'center', maxWidth: 520 }}>
                {slide.emoji && <div style={{ fontSize: 52, marginBottom: 14 }}>{slide.emoji}</div>}
                <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: 0 }}>{slide.title}</h1>
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 15.5, color: '#cbd5e1', marginTop: 14, lineHeight: 1.7 }}>{b}</p>)}
            </div>
        );
    }

    if (k === 'closing') {
        return (
            <div style={{ textAlign: 'center', maxWidth: 520 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.4 }}>{slide.title}</h1>
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 15, color: '#cbd5e1', marginTop: 14, lineHeight: 1.7 }}>{b}</p>)}
                <p style={{ marginTop: 22, fontSize: 14, color: '#94a3b8', fontWeight: 800, letterSpacing: 1 }}>ROOT / SOLUMA</p>
            </div>
        );
    }

    // 컨텐츠형 공통 헤더
    const Head = (
        <>
            {slide.eyebrow && <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, letterSpacing: 1, marginBottom: 10 }}>{slide.eyebrow}</div>}
            {slide.emoji && <div style={{ fontSize: 42, marginBottom: 8 }}>{slide.emoji}</div>}
            {slide.title && <h2 style={{ fontSize: 23, fontWeight: 900, color: NAVY, margin: 0, lineHeight: 1.3 }}>{slide.title}</h2>}
        </>
    );

    if (k === 'narrative' || k === 'feature') {
        return (
            <div style={{ maxWidth: 560, width: '100%' }}>
                {Head}
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 16, color: '#334155', lineHeight: 1.8, margin: '14px 0 0' }}>{b}</p>)}
                {slide.bullets && (
                    <ul style={{ margin: '16px 0 0', padding: 0, listStyle: 'none' }}>
                        {slide.bullets.map((b, i) => (
                            <li key={i} style={{ display: 'flex', gap: 10, fontSize: 15.5, color: '#334155', lineHeight: 1.6, marginBottom: 9 }}>
                                <span style={{ color: BLUE, fontWeight: 900 }}>·</span><span>{b}</span>
                            </li>
                        ))}
                    </ul>
                )}
                {slide.quote && (
                    <div style={{ marginTop: 18, borderLeft: `4px solid ${BLUE}`, background: '#f5f7ff', borderRadius: '0 12px 12px 0', padding: '14px 16px', fontSize: 16, color: '#1e293b', fontWeight: 700, lineHeight: 1.6 }}>
                        “{slide.quote}”
                    </div>
                )}
            </div>
        );
    }

    if (k === 'info') {
        const field = (label: string, key: string, ph: string) => (
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>{label}</label>
                <input value={info[key] || ''} onChange={e => setInfo(key, e.target.value)} placeholder={ph}
                    style={{ width: '100%', height: 48, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, boxSizing: 'border-box' }} />
            </div>
        );
        return (
            <div style={{ maxWidth: 560, width: '100%' }}>
                {Head}
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '12px 0 18px' }}>{b}</p>)}
                {field('직분', 'info_position', '예: 담임목사, 부목사')}
                {field('연락처', 'info_phone', '전화번호 (선택)')}
                {field('이메일', 'info_email', '이메일 (선택)')}
                <div>
                    <label style={{ fontSize: 13.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8 }}>담당 사역 분야 (복수 선택)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {MINISTRY.map(m => {
                            const on = ministry.includes(m);
                            return (
                                <button key={m} onClick={() => setMinistry(on ? ministry.filter(x => x !== m) : [...ministry, m])}
                                    style={{ border: `1.5px solid ${on ? BLUE : '#e2e8f0'}`, background: on ? '#eef2ff' : '#fff', color: on ? BLUE : '#475569', borderRadius: 999, padding: '8px 14px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // 설문 — 단일/복수 선택
    if (k === 'q-single' || k === 'q-multi') {
        const selected = answer ? answer.split(MULTI_SEP) : [];
        const toggle = (opt: string) => {
            if (k === 'q-single') { setAnswer(answer === opt ? '' : opt); return; }
            const next = selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt];
            setAnswer(next.join(MULTI_SEP));
        };
        return (
            <div style={{ maxWidth: 560, width: '100%' }}>
                {Head}
                <p style={{ fontSize: 18, fontWeight: 800, color: NAVY, lineHeight: 1.5, margin: '12px 0 18px' }}>{slide.question}</p>
                {k === 'q-multi' && <p style={{ fontSize: 13, color: '#94a3b8', marginTop: -10, marginBottom: 14 }}>복수 선택 가능</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(slide.options || []).map(opt => {
                        const on = selected.includes(opt);
                        return (
                            <button key={opt} onClick={() => toggle(opt)}
                                style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', border: `2px solid ${on ? BLUE : '#e7e9f2'}`, background: on ? '#eef2ff' : '#fff', borderRadius: 14, padding: '14px 16px', fontSize: 16, fontWeight: on ? 800 : 600, color: on ? BLUE : '#334155', cursor: 'pointer' }}>
                                <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: k === 'q-multi' ? 6 : 999, border: `2px solid ${on ? BLUE : '#cbd5e1'}`, background: on ? BLUE : '#fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{on ? '✓' : ''}</span>
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    // 설문 — 서술형
    if (k === 'q-text') {
        return (
            <div style={{ maxWidth: 560, width: '100%' }}>
                {Head}
                <p style={{ fontSize: 18, fontWeight: 800, color: NAVY, lineHeight: 1.5, margin: '12px 0 16px' }}>{slide.question}</p>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="자유롭게 작성해 주세요."
                    style={{ width: '100%', minHeight: 150, border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', fontSize: 16, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.7 }} />
            </div>
        );
    }

    return null;
}

// ───────────────── 메인 덱 ─────────────────
export default function Deck() {
    const [pastor, setPastor] = useState<Pastor | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [savedTick, setSavedTick] = useState(0);
    const timers = useRef<Record<string, any>>({});
    const touchX = useRef<number | null>(null);
    const touchY = useRef<number | null>(null);

    useEffect(() => {
        try { const raw = localStorage.getItem(LS_KEY); if (raw) setPastor(JSON.parse(raw)); } catch {}
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!pastor) return;
        try { localStorage.setItem(LS_KEY, JSON.stringify(pastor)); } catch {}
        fetch(`/api/advisory/feedback?pastorId=${pastor.id}`).then(r => r.json()).then(d => {
            const m: Record<string, string> = {};
            (d.feedback || []).forEach((f: any) => { if (f.comment != null) m[f.item_id] = f.comment; });
            setAnswers(m);
        }).catch(() => {});
    }, [pastor]);

    const persist = useCallback((itemId: string, value: string, immediate = false) => {
        const go = () => {
            fetch('/api/advisory/feedback', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pastorId: pastor!.id, itemId, rating: null, comment: value }),
            }).then(() => setSavedTick(t => t + 1)).catch(() => {});
        };
        if (timers.current[itemId]) clearTimeout(timers.current[itemId]);
        if (immediate) go(); else timers.current[itemId] = setTimeout(go, 600);
    }, [pastor]);

    const setAns = useCallback((itemId: string, value: string, immediate = false) => {
        setAnswers(a => ({ ...a, [itemId]: value }));
        if (pastor) persist(itemId, value, immediate);
    }, [pastor, persist]);

    const go = useCallback((d: number) => setIdx(i => Math.min(Math.max(i + d, 0), SLIDES.length - 1)), []);

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [go]);

    if (!loaded) return <div style={{ minHeight: '100dvh', background: '#0b1220' }} />;
    if (!pastor) return <Login onDone={setPastor} />;

    const slide = SLIDES[idx];
    const dark = slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'closing';
    const ministry = (answers['info_ministry'] || '').split(MULTI_SEP).filter(Boolean);

    return (
        <div
            style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: dark ? 'linear-gradient(160deg,#0b1220,#1e293b)' : '#fbfbfd', overflow: 'hidden' }}
            onTouchStart={e => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY; }}
            onTouchEnd={e => {
                if (touchX.current == null || touchY.current == null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                const dy = e.changedTouches[0].clientY - touchY.current;
                if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
                touchX.current = null; touchY.current = null;
            }}
        >
            {/* 진행 바 */}
            <div style={{ height: 3, background: dark ? 'rgba(255,255,255,0.12)' : '#eef0f6', flexShrink: 0 }}>
                <div style={{ height: '100%', width: `${((idx + 1) / SLIDES.length) * 100}%`, background: BLUE, transition: 'width 0.25s' }} />
            </div>

            {/* 상단 바 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', flexShrink: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: dark ? '#cbd5e1' : '#64748b' }}>{pastor.name}{pastor.church ? ` · ${pastor.church}` : ''}</span>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: dark ? '#94a3b8' : '#94a3b8' }}>{idx + 1} / {SLIDES.length}{savedTick > 0 ? '  ·  ✓저장됨' : ''}</span>
            </div>

            {/* 본문 (스크롤 가능) */}
            <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', display: 'flex', alignItems: slide.kind === 'cover' || slide.kind === 'divider' || slide.kind === 'closing' ? 'center' : 'flex-start', justifyContent: 'center', padding: '20px 22px 28px' }}>
                <SlideBody
                    slide={slide}
                    answer={answers[slide.id] || ''}
                    setAnswer={(v) => setAns(slide.id, v, slide.kind === 'q-single' || slide.kind === 'q-multi')}
                    ministry={ministry}
                    setMinistry={(v) => setAns('info_ministry', v.join(MULTI_SEP), true)}
                    info={answers}
                    setInfo={(key, v) => setAns(key, v)}
                />
            </div>

            {/* 하단 네비 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 18px calc(14px + env(safe-area-inset-bottom))', flexShrink: 0, borderTop: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #eef0f6' }}>
                <button onClick={() => go(-1)} disabled={idx === 0}
                    style={{ width: 52, height: 48, borderRadius: 12, border: 'none', background: dark ? 'rgba(255,255,255,0.1)' : '#eef0f6', color: dark ? '#fff' : '#475569', fontSize: 20, cursor: 'pointer', opacity: idx === 0 ? 0.35 : 1 }}>‹</button>
                {idx < SLIDES.length - 1 ? (
                    <button onClick={() => go(1)}
                        style={{ flex: 1, height: 48, borderRadius: 12, border: 'none', background: BLUE, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>다음 →</button>
                ) : (
                    <div style={{ flex: 1, height: 48, borderRadius: 12, background: '#16a34a', color: '#fff', fontSize: 15.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓ 응답 완료 · 감사합니다</div>
                )}
                <button onClick={() => go(1)} disabled={idx === SLIDES.length - 1}
                    style={{ width: 52, height: 48, borderRadius: 12, border: 'none', background: dark ? 'rgba(255,255,255,0.1)' : '#eef0f6', color: dark ? '#fff' : '#475569', fontSize: 20, cursor: 'pointer', opacity: idx === SLIDES.length - 1 ? 0.35 : 1 }}>›</button>
            </div>
        </div>
    );
}
