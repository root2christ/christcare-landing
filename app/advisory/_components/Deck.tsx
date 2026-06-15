'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { SLIDES, Slide } from '../_content';
import { supabase } from '../../../lib/supabase';
import FeatureIcon, { hasFeatureIcon } from './FeatureIcons';

type Pastor = { id: string; name: string; church?: string | null };

export const SYNC_CHANNEL = 'advisory-room';
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
                {err && <p style={{ color: '#dc2626', fontSize: 14, margin: '4px 0 10px' }}>{err}</p>}
                <button onClick={start} disabled={busy}
                    style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', background: NAVY, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: busy ? 0.6 : 1 }}>
                    {busy ? '입장 중…' : '시작하기 →'}
                </button>
            </div>
        </div>
    );
}

// ───────────────── 다크 에디토리얼 디자인 시스템 ─────────────────
export const DARK_BG = 'linear-gradient(165deg, #0c2a30 0%, #0a2028 55%, #06151b 100%)';
const T_WHITE = '#f8fafc', T_BODY = '#cbd5e1', T_MUTE = '#94a3b8', GOLD = '#e7b75f';

function hexA(hex: string, a: number) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
}

// 섹션(eyebrow)별 강조색 — 다크 배경에서 빛나는 밝은 톤
const SECTION_ACCENT: Record<string, string> = {
    'ROOT 이야기': '#34d399',
    '솔루마 이야기': '#60a5fa',
    'ROOT 조직도': '#38bdf8',
    'ROOT의 비전': '#a78bfa',
    '비전 선언문': '#a78bfa',
    '크라이스트 테스트': '#f472b6',
    '주요 기능': '#60a5fa',
    '한 줄 정의': GOLD,
    '부탁의 말씀': '#2dd4bf',
};
function sectionAccent(eyebrow?: string) { return (eyebrow && SECTION_ACCENT[eyebrow]) || '#60a5fa'; }

// 상단 일러스트 배너 (생성된 분위기 일러스트)
const ILLUS_MAP: Record<string, string> = { 'ask-1': 'ask', 'ask-2': 'ask' };
const ILLUS_IDS = new Set(['root-1', 'root-2', 'root-3', 'root-4', 'soluma-1', 'soluma-2', 'soluma-3', 'soluma-4', 'vision-1', 'vision-2', 'vision-3', 'ct-1', 'ct-2', 'ct-3', 'ask-1', 'ask-2']);
function illusFor(id: string) { return ILLUS_IDS.has(id) ? `/slide/illus/${ILLUS_MAP[id] || id}.jpg` : null; }
function SlideBanner({ id, accent }: { id: string; accent: string }) {
    const src = illusFor(id);
    if (!src) return null;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ width: '50%', maxWidth: 220, aspectRatio: '1 / 1', borderRadius: '50%', overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.45)', border: `2px solid ${hexA(accent, 0.35)}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
        </div>
    );
}

// 불릿 → 다크 글래스 카드/칩/조직 노드
function BulletList({ bullets, accent }: { bullets: string[]; accent: string }) {
    const allShort = bullets.every((b) => b.trim().length <= 7 && !b.includes('—') && !b.includes('→'));
    if (allShort) {
        return (
            <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {bullets.map((b, i) => (
                    <span key={i} style={{ fontSize: 17.5, fontWeight: 800, color: accent, background: hexA(accent, 0.14), border: `1px solid ${hexA(accent, 0.3)}`, padding: '8px 15px', borderRadius: 999 }}>{b}</span>
                ))}
            </div>
        );
    }
    return (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bullets.map((b, i) => {
                if (b.includes('→')) {
                    const [head, rest] = b.split('→');
                    const children = (rest || '').split(/[·,]/).map((s) => s.trim()).filter(Boolean);
                    return (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '13px 15px' }}>
                            <div style={{ fontSize: 18.5, fontWeight: 800, color: T_WHITE }}>{head.trim()}</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
                                {children.map((c, j) => (
                                    <span key={j} style={{ fontSize: 16, fontWeight: 700, color: accent, background: hexA(accent, 0.14), padding: '4px 10px', borderRadius: 8 }}>{c}</span>
                                ))}
                            </div>
                        </div>
                    );
                }
                if (b.includes('—')) {
                    const idx = b.indexOf('—');
                    const head = b.slice(0, idx).trim();
                    const desc = b.slice(idx + 1).trim();
                    return (
                        <div key={i} style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '13px 15px' }}>
                            <span style={{ width: 5, borderRadius: 6, background: accent, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 18.5, fontWeight: 800, color: T_WHITE, lineHeight: 1.4 }}>{head}</div>
                                <div style={{ fontSize: 17.5, color: T_MUTE, lineHeight: 1.6, marginTop: 4 }}>{desc}</div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: '12px 15px' }}>
                        <span style={{ width: 22, height: 22, borderRadius: 999, background: hexA(accent, 0.2), color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 18, color: T_BODY, fontWeight: 600, lineHeight: 1.5 }}>{b}</span>
                    </div>
                );
            })}
        </div>
    );
}

// 기능 아이콘 그리드 (앱 아웃라인 라인 아이콘) — 다크 타일
function FeatureGrid({ items, accent }: { items: { icon?: string; emoji?: string; label: string }[]; accent: string }) {
    return (
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(108px, 1fr))', gap: 10 }}>
            {items.map((it, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '16px 8px' }}>
                    {it.icon && hasFeatureIcon(it.icon) ? (
                        <div style={{ width: 54, height: 54, borderRadius: 14, background: hexA(accent, 0.14), border: `1px solid ${hexA(accent, 0.22)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                            <FeatureIcon name={it.icon} size={30} strokeWidth={1.9} />
                        </div>
                    ) : (
                        <div style={{ width: 54, height: 54, borderRadius: 14, background: hexA(accent, 0.16), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{it.emoji}</div>
                    )}
                    <span style={{ fontSize: 16, fontWeight: 700, color: T_WHITE, textAlign: 'center', lineHeight: 1.3 }}>{it.label}</span>
                </div>
            ))}
        </div>
    );
}

// ───────────────── 슬라이드별 앱 아웃라인 아이콘(기능) / 성경 인물 갤러리 ─────────────────
// 값은 FeatureIcons.tsx 의 아이콘 key (앱 glyph 와 1:1)
const SLIDE_ICON: Record<string, string> = {
    'feat-test': 'sparkles', 'feat-deep': 'brain', 'feat-faith': 'heart', 'feat-bible': 'bible',
    'feat-qt': 'qt', 'feat-prayer': 'prayer', 'feat-testimony': 'megaphone',
    'feat-meditation': 'meditation', 'feat-readthrough': 'calendar', 'feat-transcribe': 'pen',
    'feat-quiz': 'quiz', 'feat-heresy': 'shield', 'feat-ai': 'robot', 'feat-jobbox': 'jobbox',
    'feat-summary': 'sparkles', 'feat-overview': 'sparkles',
};
const CHAR_FILES = ['paul', 'david', 'esther', 'moses', 'peter', 'daniel', 'ruth', 'joshua', 'john', 'mary', 'samuel', 'nehemiah'];
const SLIDE_GALLERY: Record<string, string[]> = {
    'ct-4': CHAR_FILES.map((c) => `/slide/char/${c}.png`),
};

// 헤더 아이콘 — 앱 아웃라인 라인 아이콘(기능 슬라이드) / 없으면 이모지
function SlideIcon({ slide, accent }: { slide: Slide; accent: string }) {
    const ic = SLIDE_ICON[slide.id];
    if (ic && hasFeatureIcon(ic)) {
        return (
            <div style={{ width: 104, height: 104, borderRadius: 28, background: hexA(accent, 0.14), border: `1px solid ${hexA(accent, 0.25)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: accent }}>
                <FeatureIcon name={ic} size={56} strokeWidth={1.8} />
            </div>
        );
    }
    if (slide.emoji) {
        return <div style={{ width: 60, height: 60, borderRadius: 17, background: hexA(accent, 0.14), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 14 }}>{slide.emoji}</div>;
    }
    return null;
}

// 성경 인물 캐릭터 갤러리
function SlideGallery({ slide, accent }: { slide: Slide; accent: string }) {
    const imgs = SLIDE_GALLERY[slide.id];
    if (!imgs) return null;
    return (
        <div style={{ marginTop: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: 8 }}>
                {imgs.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt="" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 12, border: `2px solid ${hexA(accent, 0.3)}`, background: 'rgba(255,255,255,0.05)' }} />
                ))}
            </div>
            <p style={{ fontSize: 16, color: T_MUTE, marginTop: 9, fontWeight: 600 }}>64명의 성경 인물 캐릭터 중 일부</p>
        </div>
    );
}

// 표 (조직 구성 등)
function SlideTable({ table, accent }: { table: { headers: string[]; rows: string[][] }; accent: string }) {
    const cols = '1fr 0.7fr 1.9fr';
    return (
        <div style={{ marginTop: 18, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: cols, background: hexA(accent, 0.2) }}>
                {table.headers.map((h, i) => (<div key={i} style={{ padding: '11px 13px', fontSize: 16, fontWeight: 800, color: T_WHITE }}>{h}</div>))}
            </div>
            {table.rows.map((row, r) => (
                <div key={r} style={{ display: 'grid', gridTemplateColumns: cols, background: r % 2 ? 'rgba(255,255,255,0.03)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    {row.map((cell, c) => (<div key={c} style={{ padding: '11px 13px', fontSize: c === 0 ? 15.5 : 15, fontWeight: c === 0 ? 800 : 600, color: c === 0 ? accent : (c === 1 ? T_WHITE : T_BODY), lineHeight: 1.5 }}>{cell}</div>))}
                </div>
            ))}
        </div>
    );
}

// ───────────────── QR (cover/divider 어두운 슬라이드용 흰 카드) ─────────────────
function SlideQR({ slide }: { slide: Slide }) {
    if (!slide.qr) return null;
    return (
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#fff', padding: 14, borderRadius: 18, boxShadow: '0 14px 38px rgba(0,0,0,0.35)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.qr} alt="QR" width={200} height={200} style={{ display: 'block', width: 200, height: 200, imageRendering: 'pixelated' }} />
            </div>
            {slide.qrCaption && (
                <p style={{ fontSize: 17.5, color: '#cbd5e1', fontWeight: 700, lineHeight: 1.55, maxWidth: 340, margin: 0 }}>{slide.qrCaption}</p>
            )}
        </div>
    );
}

// ───────────────── 슬라이드 본문 ─────────────────
export function SlideBody({
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
            <div style={{ textAlign: 'center', maxWidth: 720, width: '100%' }}>
                <h1 style={{ fontSize: 54, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.12, letterSpacing: 1.5 }}>ROOT <span style={{ color: GOLD }}>&</span> SOLUMA</h1>
                {slide.title && <div style={{ fontSize: 22, fontWeight: 800, color: GOLD, letterSpacing: 1, marginTop: 20 }}>{slide.title}</div>}
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 18.5, color: T_BODY, marginTop: 16, lineHeight: 1.7 }}>{b}</p>)}
            </div>
        );
    }

    if (k === 'divider') {
        return (
            <div style={{ textAlign: 'center', maxWidth: 520 }}>
                {slide.emoji && <div style={{ fontSize: 52, marginBottom: 14 }}>{slide.emoji}</div>}
                <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: 0 }}>{slide.title}</h1>
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 18.5, color: '#cbd5e1', marginTop: 14, lineHeight: 1.7 }}>{b}</p>)}
                <SlideQR slide={slide} />
                {slide.cta && (
                    <a href={slide.cta.href} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-block', marginTop: 18, background: BLUE, color: '#fff', fontSize: 16, fontWeight: 800, padding: '14px 24px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 10px 26px rgba(79,110,242,0.4)' }}>
                        {slide.cta.label}
                    </a>
                )}
            </div>
        );
    }

    if (k === 'closing') {
        return (
            <div style={{ textAlign: 'center', maxWidth: 520 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.4 }}>{slide.title}</h1>
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 18, color: '#cbd5e1', marginTop: 14, lineHeight: 1.7 }}>{b}</p>)}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/slide/logo-soluma.png" alt="soluma" style={{ width: 130, height: 'auto', display: 'block', margin: '24px auto 0', filter: 'invert(1)', opacity: 0.85 }} />
            </div>
        );
    }

    // 섹션별 강조색
    const accent = sectionAccent(slide.eyebrow);

    // 헤더: 일러스트 배너(있으면) 또는 3D 아이콘 + eyebrow 알약 + 타이틀
    const Head = (
        <>
            {illusFor(slide.id) ? <SlideBanner id={slide.id} accent={accent} /> : <SlideIcon slide={slide} accent={accent} />}
            {slide.eyebrow && (
                <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 800, color: accent, letterSpacing: 0.5, background: hexA(accent, 0.16), border: `1px solid ${hexA(accent, 0.3)}`, padding: '5px 13px', borderRadius: 999, marginBottom: 12 }}>{slide.eyebrow}</span>
            )}
            {slide.title && <h2 style={{ fontSize: 26, fontWeight: 900, color: T_WHITE, margin: 0, lineHeight: 1.32 }}>{slide.title}</h2>}
        </>
    );

    if (k === 'narrative' || k === 'feature' || k === 'grid') {
        return (
            <div style={{ maxWidth: 640, width: '100%' }}>
                {Head}
                {slide.body?.map((b, i) => <p key={i} style={{ fontSize: 19, color: T_BODY, lineHeight: 1.8, margin: '14px 0 0' }}>{b}</p>)}
                <SlideGallery slide={slide} accent={accent} />
                {slide.table && <SlideTable table={slide.table} accent={accent} />}
                {k === 'grid' && slide.grid && <FeatureGrid items={slide.grid} accent={accent} />}
                {slide.bullets && <BulletList bullets={slide.bullets} accent={accent} />}
                {slide.quote && (
                    <div style={{ marginTop: 20, background: hexA(accent, 0.1), border: `1px solid ${hexA(accent, 0.22)}`, borderLeft: `4px solid ${accent}`, borderRadius: 14, padding: '15px 18px' }}>
                        <p style={{ margin: 0, fontSize: 19, color: '#fff', fontWeight: 700, lineHeight: 1.65 }}>“{slide.quote}”</p>
                    </div>
                )}
            </div>
        );
    }

    if (k === 'info') {
        const field = (label: string, key: string, ph: string) => (
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 14.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>{label}</label>
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
                    <label style={{ fontSize: 14.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8 }}>담당 사역 분야 (복수 선택)</label>
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
                {k === 'q-multi' && <p style={{ fontSize: 14, color: '#94a3b8', marginTop: -10, marginBottom: 14 }}>복수 선택 가능</p>}
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
    // 발표자 실시간 동기화
    const [following, setFollowing] = useState(true);
    const [remoteIdx, setRemoteIdx] = useState<number | null>(null);
    const followingRef = useRef(true);
    const setFollow = useCallback((v: boolean) => { followingRef.current = v; setFollowing(v); }, []);

    useEffect(() => {
        try { const raw = localStorage.getItem(LS_KEY); if (raw) setPastor(JSON.parse(raw)); } catch {}
        setLoaded(true);
    }, []);

    // 발표자 broadcast 수신 → 따라가기 ON이면 자동 이동
    useEffect(() => {
        if (!pastor) return;
        const ch = supabase.channel(SYNC_CHANNEL, { config: { broadcast: { self: false } } });
        ch.on('broadcast', { event: 'slide' }, ({ payload }: any) => {
            const n = payload?.slide;
            if (typeof n === 'number' && n >= 0 && n < SLIDES.length) {
                setRemoteIdx(n);
                if (followingRef.current) setIdx(n);
            }
        });
        ch.subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [pastor]);

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

    const go = useCallback((d: number) => { setFollow(false); setIdx(i => Math.min(Math.max(i + d, 0), SLIDES.length - 1)); }, [setFollow]);
    const resync = useCallback(() => { if (remoteIdx != null) { setFollow(true); setIdx(remoteIdx); } }, [remoteIdx, setFollow]);

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
            style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: DARK_BG, overflow: 'hidden' }}
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
                <span style={{ fontSize: 13.5, fontWeight: 800, color: dark ? '#cbd5e1' : '#64748b' }}>{pastor.name}{pastor.church ? ` · ${pastor.church}` : ''}</span>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: dark ? '#94a3b8' : '#94a3b8' }}>{idx + 1} / {SLIDES.length}{savedTick > 0 ? '  ·  ✓저장됨' : ''}</span>
            </div>

            {/* 발표 따라가기 배너 (발표자가 한 번이라도 송출했을 때만) */}
            {remoteIdx != null && (
                following ? (
                    <button onClick={() => setFollow(false)}
                        style={{ flexShrink: 0, margin: '0 16px 6px', border: 'none', background: '#fee2e2', color: '#b91c1c', borderRadius: 10, padding: '7px 12px', fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}>
                        🔴 발표 화면 따라가는 중 — 직접 보려면 탭
                    </button>
                ) : (
                    <button onClick={resync}
                        style={{ flexShrink: 0, margin: '0 16px 6px', border: 'none', background: '#dcfce7', color: '#15803d', borderRadius: 10, padding: '7px 12px', fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}>
                        ▶ 발표자 화면(슬라이드 {remoteIdx + 1})으로 돌아가기
                    </button>
                )
            )}

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
