'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SLIDES, Slide } from '../_content';

type Pastor = { id: string; name: string; church?: string | null };
type FB = { rating?: number; comment?: string };

const LS_KEY = 'advisory_pastor_v1';
const NAVY = '#1e293b';
const BLUE = '#4f6ef2';

// ────────────────────────── 별점 + 코멘트 ──────────────────────────
function FeedbackBox({ itemId, pastorId, initial }: { itemId: string; pastorId: string; initial?: FB }) {
    const [rating, setRating] = useState<number>(initial?.rating || 0);
    const [comment, setComment] = useState<string>(initial?.comment || '');
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const timer = useRef<any>(null);

    const save = useCallback((r: number, c: string) => {
        setStatus('saving');
        fetch('/api/advisory/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pastorId, itemId, rating: r || null, comment: c }),
        }).then(() => setStatus('saved')).catch(() => setStatus('idle'));
    }, [pastorId, itemId]);

    const queue = (r: number, c: string) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => save(r, c), 700);
    };

    return (
        <div style={{ marginTop: 22, background: '#fff', border: '1px solid #e7e9f2', borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>📝 이 부분에 대한 자문</span>
                <span style={{ fontSize: 12, color: status === 'saved' ? '#16a34a' : '#94a3b8' }}>
                    {status === 'saving' ? '저장 중…' : status === 'saved' ? '✓ 저장됨' : ''}
                </span>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map(n => (
                    <button
                        key={n}
                        onClick={() => { const r = rating === n ? 0 : n; setRating(r); queue(r, comment); }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 30, lineHeight: 1, padding: 0, color: n <= rating ? '#f5b301' : '#d8dbe6' }}
                        aria-label={`${n}점`}
                    >
                        ★
                    </button>
                ))}
                {rating > 0 && <span style={{ alignSelf: 'center', marginLeft: 8, fontSize: 13, color: '#64748b' }}>{rating}점</span>}
            </div>
            <textarea
                value={comment}
                onChange={e => { setComment(e.target.value); queue(rating, e.target.value); }}
                placeholder="자유롭게 의견을 남겨 주세요. (개선점, 좋은 점, 제안 등)"
                style={{ width: '100%', minHeight: 84, border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', fontSize: 15, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
            />
        </div>
    );
}

// ────────────────────────── 슬라이드 렌더 ──────────────────────────
function SlideView({ slide, idx, pastorId, fb }: { slide: Slide; idx: number; pastorId: string; fb?: FB }) {
    const cover = slide.kind === 'cover';
    return (
        <section style={{
            minHeight: cover ? '100vh' : 'auto',
            padding: cover ? '0 24px' : '40px 22px 30px',
            borderTop: idx === 0 ? 'none' : '1px solid #eef0f6',
            display: 'flex', flexDirection: 'column', justifyContent: cover ? 'center' : 'flex-start',
            background: cover ? `linear-gradient(160deg,#0f172a,#1e293b)` : '#fbfbfd',
            color: cover ? '#fff' : NAVY,
        }}>
            <div style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
                {!cover && (
                    <div style={{ fontSize: 12, fontWeight: 800, color: BLUE, letterSpacing: 1, marginBottom: 8 }}>
                        {String(idx + 1).padStart(2, '0')} / {SLIDES.length}
                    </div>
                )}
                {slide.emoji && <div style={{ fontSize: cover ? 64 : 40, marginBottom: cover ? 18 : 8 }}>{slide.emoji}</div>}
                <h2 style={{ fontSize: cover ? 38 : 25, fontWeight: 900, margin: 0, lineHeight: 1.25, letterSpacing: -0.5 }}>{slide.title}</h2>
                {slide.subtitle && <p style={{ fontSize: cover ? 17 : 15.5, color: cover ? '#cbd5e1' : '#64748b', marginTop: 10, lineHeight: 1.6 }}>{slide.subtitle}</p>}

                {slide.body && slide.body.length > 0 && (
                    <div style={{ marginTop: 18 }}>
                        {slide.body.map((line, i) => (
                            <p key={i} style={{ fontSize: 15.5, color: '#334155', lineHeight: 1.75, margin: '0 0 10px' }}>{line}</p>
                        ))}
                    </div>
                )}

                {slide.table && (
                    <div style={{ marginTop: 18, border: '1px solid #e7e9f2', borderRadius: 14, overflow: 'hidden' }}>
                        {slide.table.map(([k, v], i) => (
                            <div key={i} style={{ display: 'flex', borderTop: i === 0 ? 'none' : '1px solid #eef0f6', background: i % 2 ? '#fff' : '#f8fafc' }}>
                                <div style={{ width: 120, flexShrink: 0, padding: '10px 12px', fontSize: 13, fontWeight: 800, color: '#475569', background: '#f1f5f9' }}>{k}</div>
                                <div style={{ padding: '10px 12px', fontSize: 14, color: '#1e293b' }}>{v}</div>
                            </div>
                        ))}
                    </div>
                )}

                {slide.category && (
                    <div style={{ marginTop: 16 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eef2ff', borderRadius: 999, padding: '6px 14px', marginBottom: 14 }}>
                            <span style={{ fontWeight: 900, color: BLUE, fontSize: 16 }}>{slide.category.code}</span>
                            <span style={{ fontSize: 13, color: '#475569', fontWeight: 700 }}>{slide.category.name} · {slide.category.axis}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {slide.category.samples.map((q, i) => (
                                <div key={i} style={{ background: '#fff', border: '1px solid #e7e9f2', borderRadius: 12, padding: '12px 14px', fontSize: 14.5, color: '#334155', lineHeight: 1.6 }}>
                                    <span style={{ color: BLUE, fontWeight: 800 }}>Q{i + 1}. </span>{q}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {slide.feedback && <FeedbackBox itemId={slide.id} pastorId={pastorId} initial={fb} />}
            </div>
        </section>
    );
}

// ────────────────────────── 로그인 ──────────────────────────
function Login({ onDone }: { onDone: (p: Pastor) => void }) {
    const [pastors, setPastors] = useState<Pastor[]>([]);
    const [sel, setSel] = useState<string>('');     // 선택된 id 또는 'new'
    const [name, setName] = useState('');
    const [church, setChurch] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');

    useEffect(() => {
        fetch('/api/advisory/pastors').then(r => r.json()).then(d => setPastors(d.pastors || [])).catch(() => {});
    }, []);

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
            if (d.pastor) onDone(d.pastor);
            else setErr(d.error || '오류가 발생했습니다.');
        } catch { setErr('네트워크 오류'); }
        finally { setBusy(false); }
    };

    const isNew = sel === 'new' || (pastors.length === 0);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0f172a,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: '34px 26px', width: '100%', maxWidth: 380, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: 22 }}>
                    <img src="/app-icon.png" alt="soluma" width={64} height={64} style={{ borderRadius: 15, marginBottom: 14 }} />
                    <h1 style={{ fontSize: 24, fontWeight: 900, color: NAVY, margin: 0 }}>soluma 목사님 자문회</h1>
                    <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>성함을 선택하거나 입력해 주세요.<br />입력하신 내용은 자동 저장됩니다.</p>
                </div>

                {pastors.length > 0 && (
                    <select
                        value={sel}
                        onChange={e => setSel(e.target.value)}
                        style={{ width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, marginBottom: 12, background: '#fff', color: NAVY, boxSizing: 'border-box' }}
                    >
                        <option value="">— 명단에서 선택 —</option>
                        {pastors.map(p => (
                            <option key={p.id} value={p.id}>{p.name}{p.church ? ` (${p.church})` : ''}</option>
                        ))}
                        <option value="new">+ 명단에 없어요 (직접 입력)</option>
                    </select>
                )}

                {isNew && (
                    <>
                        <input
                            value={name} onChange={e => setName(e.target.value)} placeholder="성함 (예: 홍길동 목사)"
                            style={{ width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, marginBottom: 10, boxSizing: 'border-box' }}
                        />
                        <input
                            value={church} onChange={e => setChurch(e.target.value)} placeholder="소속 교회 (선택)"
                            style={{ width: '100%', height: 50, borderRadius: 12, border: '1.5px solid #e2e8f0', padding: '0 14px', fontSize: 16, marginBottom: 10, boxSizing: 'border-box' }}
                        />
                    </>
                )}

                {err && <p style={{ color: '#dc2626', fontSize: 13, margin: '4px 0 10px' }}>{err}</p>}

                <button
                    onClick={start} disabled={busy}
                    style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', background: NAVY, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}
                >
                    {busy ? '입장 중…' : '자문 시작하기 →'}
                </button>
            </div>
        </div>
    );
}

// ────────────────────────── 메인 ──────────────────────────
export default function Deck() {
    const [pastor, setPastor] = useState<Pastor | null>(null);
    const [fbMap, setFbMap] = useState<Record<string, FB>>({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) setPastor(JSON.parse(raw));
        } catch {}
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!pastor) return;
        try { localStorage.setItem(LS_KEY, JSON.stringify(pastor)); } catch {}
        fetch(`/api/advisory/feedback?pastorId=${pastor.id}`)
            .then(r => r.json())
            .then(d => {
                const m: Record<string, FB> = {};
                (d.feedback || []).forEach((f: any) => { m[f.item_id] = { rating: f.rating, comment: f.comment }; });
                setFbMap(m);
            }).catch(() => {});
    }, [pastor]);

    if (!loaded) return <div style={{ minHeight: '100vh', background: '#0f172a' }} />;
    if (!pastor) return <Login onDone={setPastor} />;

    return (
        <div style={{ background: '#fbfbfd' }}>
            {/* 상단 바 */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #eef0f6', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src="/app-icon.png" width={26} height={26} style={{ borderRadius: 7 }} alt="" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: NAVY }}>soluma 자문회</span>
                </div>
                <span style={{ fontSize: 13, color: '#64748b' }}>{pastor.name}{pastor.church ? ` · ${pastor.church}` : ''}</span>
            </div>

            {SLIDES.map((s, i) => (
                <SlideView key={s.id} slide={s} idx={i} pastorId={pastor.id} fb={fbMap[s.id]} />
            ))}

            <div style={{ textAlign: 'center', padding: '34px 20px 60px', color: '#94a3b8', fontSize: 13 }}>
                소중한 자문에 깊이 감사드립니다 🙏<br />
                © 2026 soluma · 주식회사 루트
            </div>
        </div>
    );
}
