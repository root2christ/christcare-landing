'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import {
    SURVEY_SECTIONS, FREE_SUFFIX, CHRIST_QUESTIONS, SurveyQuestion,
} from '../_content';

const NAVY = '#0f172a';
const BLUE = '#4f6ef2';
const BORDER = '#e2e8f0';

// 관리자 이메일 화이트리스트 (매직링크 발송 대상 판별용 — 서버에서 재검증됨)
const ADMIN_EMAILS_CLIENT = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'master@root2christ.com')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

type AuthedFetch = (url: string, init?: RequestInit) => Promise<Response>;

interface ResponseRow {
    respondent_uid: string;
    name: string | null; church: string | null; role: string | null;
    phone: string | null; email: string | null;
    ministry: string[] | null; career: string | null;
    answers: Record<string, string | string[]> | null;
    christ_memos: Record<string, string> | null;
    updated_at: string; created_at: string;
}

// 모든 본설문 문항을 평탄화 (CSV 컬럼/표 헤더용)
const ALL_QUESTIONS: SurveyQuestion[] = SURVEY_SECTIONS.flatMap((s) => s.questions);

function val(v: string | string[] | undefined | null): string {
    if (v == null) return '';
    return Array.isArray(v) ? v.join(' | ') : String(v);
}

function csvEscape(s: string): string {
    const needsQuote = /[",\n\r]/.test(s);
    const e = s.replace(/"/g, '""');
    return needsQuote ? `"${e}"` : e;
}

// 서울(KST) 기준 시각 표기 — "YYYY-MM-DD HH:MM"
function fmtSeoul(iso: string | null | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    const p = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(d).reduce((a: Record<string, string>, x) => { a[x.type] = x.value; return a; }, {});
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

export default function SurveyAdminPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginNotice, setLoginNotice] = useState('');

    const [rows, setRows] = useState<ResponseRow[]>([]);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<'stats' | 'ai' | 'list' | 'christ'>('stats');

    // 세션 확인 + 서버측 관리자 권한 검증 (비관리자는 즉시 로그아웃)
    useEffect(() => {
        const verifyAndSet = async (s: Session | null) => {
            if (!s) { setSession(null); setCheckingSession(false); return; }
            try {
                const res = await fetch('/api/admin/check-permission', {
                    headers: { Authorization: `Bearer ${s.access_token}` },
                });
                if (res.ok) {
                    setSession(s);
                } else {
                    await supabase.auth.signOut();
                    setSession(null);
                    setLoginNotice('관리자 권한이 없는 계정입니다.');
                }
            } catch {
                setSession(s); // 네트워크 오류면 일단 두고 API 호출 시 재검증
            } finally {
                setCheckingSession(false);
            }
        };

        supabase.auth.getSession().then(({ data }) => verifyAndSet(data.session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => verifyAndSet(s));
        return () => subscription.unsubscribe();
    }, []);

    // 공통 fetch (관리자 토큰 자동 첨부)
    const authedFetch = useCallback<AuthedFetch>(async (url, init) => {
        const token = session?.access_token;
        if (!token) throw new Error('세션이 만료되었습니다. 다시 로그인해 주세요.');
        return fetch(url, {
            ...init,
            headers: { ...(init?.headers || {}), Authorization: `Bearer ${token}` },
        });
    }, [session]);

    const load = useCallback(async () => {
        setLoading(true); setErr('');
        try {
            const res = await authedFetch('/api/survey/admin');
            if (res.status === 401 || res.status === 403) {
                setErr('관리자 권한이 없거나 세션이 만료되었습니다. 다시 로그인해 주세요.');
                return;
            }
            const d = await res.json();
            if (d.error) { setErr(d.error); return; }
            setRows(d.responses || []);
        } catch (e: any) {
            setErr(e?.message || '네트워크 오류');
        } finally {
            setLoading(false);
        }
    }, [authedFetch]);

    // 로그인(또는 토큰 갱신) 시 1회 자동 로드
    const loadedTokenRef = useRef<string | null>(null);
    useEffect(() => {
        if (!session) return;
        if (loadedTokenRef.current === session.access_token) return;
        loadedTokenRef.current = session.access_token;
        load();
    }, [session, load]);

    // ── 매직링크 로그인 (응답은 관리자/비관리자 동일 — 이메일 enumeration 방지) ──
    const handleLogin = async () => {
        const email = loginEmail.trim().toLowerCase();
        setLoggingIn(true);
        setLoginNotice('');

        const startTime = Date.now();
        if (ADMIN_EMAILS_CLIENT.includes(email)) {
            try {
                await fetch('/api/admin/send-magic-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
            } catch { /* 정보 노출 방지 — 에러 표시 X */ }
        }
        const elapsed = Date.now() - startTime;
        const minDuration = 700 + Math.random() * 200;
        if (elapsed < minDuration) await new Promise((r) => setTimeout(r, minDuration - elapsed));

        setLoginEmail('');
        setLoggingIn(false);
        setLoginNotice('관리자 계정이라면 로그인 링크를 메일로 보냈습니다. 메일의 링크로 로그인한 뒤 이 페이지로 돌아와 주세요.');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        loadedTokenRef.current = null;
        setRows([]);
        setSession(null);
    };

    // ── CSV 내보내기 ──
    const exportCsv = useCallback(() => {
        const headers = [
            '응답ID', '성함', '교회', '직분', '연락처', '이메일', '담당사역', '목회경력', '최종수정(KST)',
        ];
        ALL_QUESTIONS.forEach((q) => {
            headers.push(`Q${q.no} 답변`);
            if (q.freeText) headers.push(`Q${q.no} 자유의견`);
        });
        CHRIST_QUESTIONS.forEach((q) => headers.push(`크라이스트 Q${q.id} 메모`));

        const lines = [headers.map(csvEscape).join(',')];
        rows.forEach((r) => {
            const cells: string[] = [
                r.respondent_uid, r.name || '', r.church || '', r.role || '', r.phone || '', r.email || '',
                (r.ministry || []).join(' | '), r.career || '', fmtSeoul(r.updated_at),
            ];
            ALL_QUESTIONS.forEach((q) => {
                cells.push(val(r.answers?.[q.id]));
                if (q.freeText) cells.push(val(r.answers?.[q.id + FREE_SUFFIX]));
            });
            CHRIST_QUESTIONS.forEach((q) => cells.push(val(r.christ_memos?.[String(q.id)])));
            lines.push(cells.map(csvEscape).join(','));
        });

        // BOM 으로 한글 엑셀 호환
        const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `soluma_survey_${fmtSeoul(new Date().toISOString()).slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [rows]);

    // ── 관리자 로그인 게이트 (Supabase 매직링크 + 서버 화이트리스트 검증) ──
    if (checkingSession) {
        return (
            <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#0b1220,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
                <p style={{ color: '#94a3b8', fontSize: 15 }}>세션 확인 중…</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#0b1220,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
                <div style={{ background: '#fff', borderRadius: 22, padding: '32px 24px', width: '100%', maxWidth: 380 }}>
                    <h1 style={{ fontSize: 21, fontWeight: 900, color: NAVY, margin: '0 0 6px' }}>설문 관리자</h1>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 18px' }}>관리자 이메일로 로그인 링크를 받으세요.</p>
                    <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !loggingIn) handleLogin(); }}
                        placeholder="이메일"
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        style={{ width: '100%', height: 50, borderRadius: 12, border: `1.5px solid ${BORDER}`, padding: '0 14px', fontSize: 16, boxSizing: 'border-box', marginBottom: 12 }}
                    />
                    {loginNotice && <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: '0 0 10px' }}>{loginNotice}</p>}
                    <button
                        onClick={handleLogin}
                        disabled={loggingIn}
                        style={{ width: '100%', height: 50, borderRadius: 12, border: 'none', background: NAVY, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: loggingIn ? 0.6 : 1 }}
                    >
                        {loggingIn ? '처리 중…' : '로그인 링크 받기'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100dvh', background: '#f8fafc', color: NAVY }}>
            {/* 헤더 */}
            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: `1px solid ${BORDER}`, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>설문 응답 취합</h1>
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>
                        총 {rows.length}명 응답 · {session.user.email}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => load()} disabled={loading} style={btn('#eef2ff', BLUE)}>
                        {loading ? '불러오는 중…' : '새로고침'}
                    </button>
                    <button onClick={exportCsv} style={btn(BLUE, '#fff')}>CSV 내보내기</button>
                    <button onClick={handleLogout} style={btn('#f1f5f9', '#475569')}>로그아웃</button>
                </div>
            </div>

            {err && (
                <div style={{ maxWidth: 1100, margin: '12px auto 0', padding: '0 16px' }}>
                    <p style={{ color: '#dc2626', fontSize: 13.5, margin: 0 }}>{err}</p>
                </div>
            )}

            {/* 탭 */}
            <div style={{ display: 'flex', gap: 8, padding: '12px 16px 0', maxWidth: 1100, margin: '0 auto', flexWrap: 'wrap' }}>
                <Tab active={tab === 'stats'} onClick={() => setTab('stats')}>문항별 통계</Tab>
                <Tab active={tab === 'ai'} onClick={() => setTab('ai')}>AI 요약</Tab>
                <Tab active={tab === 'list'} onClick={() => setTab('list')}>응답자별 보기</Tab>
                <Tab active={tab === 'christ'} onClick={() => setTab('christ')}>크라이스트 메모</Tab>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 16px 60px' }}>
                {rows.length === 0 && <p style={{ color: '#64748b', fontSize: 15, padding: 20 }}>아직 응답이 없습니다.</p>}

                {tab === 'stats' && <StatsView rows={rows} />}
                {tab === 'ai' && <AiSummaryView authedFetch={authedFetch} />}

                {tab === 'list' && rows.map((r) => <RespondentCard key={r.respondent_uid} r={r} />)}

                {tab === 'christ' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {CHRIST_QUESTIONS.map((q) => {
                            const memos = rows
                                .map((r) => ({ name: r.name || '(이름없음)', church: r.church || '', memo: (r.christ_memos?.[String(q.id)] || '').trim() }))
                                .filter((m) => m.memo);
                            return (
                                <div key={q.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 16px' }}>
                                    <p style={{ fontSize: 15.5, fontWeight: 800, margin: '0 0 4px' }}>
                                        <span style={{ color: BLUE, marginRight: 6 }}>Q{q.id}.</span>{q.question}
                                    </p>
                                    <div style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 10 }}>의견 {memos.length}건</div>
                                    {memos.length === 0 ? (
                                        <p style={{ fontSize: 14, color: '#cbd5e1', margin: 0 }}>— 작성된 의견 없음</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {memos.map((m, i) => (
                                                <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', fontSize: 14.5, lineHeight: 1.6 }}>
                                                    <span style={{ fontWeight: 800, color: NAVY }}>{m.name}{m.church ? ` · ${m.church}` : ''}</span>
                                                    <div style={{ color: '#334155', marginTop: 3, whiteSpace: 'pre-wrap' }}>{m.memo}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function RespondentCard({ r }: { r: ResponseRow }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
            <button onClick={() => setOpen((o) => !o)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <div>
                        <span style={{ fontSize: 16.5, fontWeight: 900, color: NAVY }}>{r.name || '(이름없음)'}</span>
                        {r.church && <span style={{ fontSize: 14, color: '#64748b', marginLeft: 8 }}>{r.church}</span>}
                        {r.role && <span style={{ fontSize: 13, color: BLUE, marginLeft: 8, fontWeight: 700 }}>{r.role}</span>}
                    </div>
                    <span style={{ fontSize: 18, color: '#94a3b8' }}>{open ? '▲' : '▼'}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 4 }}>
                    {[r.phone, r.email, (r.ministry || []).join('/'), r.career].filter(Boolean).join(' · ')}
                    {' · '}수정 {fmtSeoul(r.updated_at)} (KST)
                </div>
            </button>

            {open && (
                <div style={{ marginTop: 14, borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
                    <SectionTitle>본설문 84문항</SectionTitle>
                    {ALL_QUESTIONS.map((q) => {
                        const a = val(r.answers?.[q.id]);
                        const f = val(r.answers?.[q.id + FREE_SUFFIX]);
                        if (!a && !f) return null;
                        return (
                            <div key={q.id} style={{ marginBottom: 10, fontSize: 14.5, lineHeight: 1.6 }}>
                                <div style={{ color: '#64748b', fontWeight: 700 }}>Q{q.no}. {q.label ? `[${q.label}] ` : ''}{q.question.split('\n')[0]}</div>
                                {a && <div style={{ color: NAVY, fontWeight: 700, marginTop: 2 }}>▸ {a}</div>}
                                {f && <div style={{ color: '#475569', marginTop: 2, whiteSpace: 'pre-wrap' }}>💬 {f}</div>}
                            </div>
                        );
                    })}

                    <SectionTitle>크라이스트 30문항 메모</SectionTitle>
                    {CHRIST_QUESTIONS.map((q) => {
                        const m = (r.christ_memos?.[String(q.id)] || '').trim();
                        if (!m) return null;
                        return (
                            <div key={q.id} style={{ marginBottom: 10, fontSize: 14.5, lineHeight: 1.6 }}>
                                <div style={{ color: '#64748b', fontWeight: 700 }}>Q{q.id}. {q.question}</div>
                                <div style={{ color: '#475569', marginTop: 2, whiteSpace: 'pre-wrap' }}>💬 {m}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <div style={{ fontSize: 13, fontWeight: 900, color: BLUE, margin: '12px 0 8px', letterSpacing: 0.4 }}>{children}</div>;
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick} style={{
            border: 'none', background: active ? '#fff' : 'transparent', color: active ? NAVY : '#94a3b8',
            fontWeight: 800, fontSize: 14.5, padding: '10px 16px', borderRadius: '12px 12px 0 0', cursor: 'pointer',
            borderBottom: active ? `3px solid ${BLUE}` : '3px solid transparent',
        }}>{children}</button>
    );
}

function btn(bg: string, color: string): React.CSSProperties {
    return { border: 'none', background: bg, color, fontWeight: 800, fontSize: 14, padding: '10px 14px', borderRadius: 11, cursor: 'pointer' };
}

// ───────────── 문항별 통계 ─────────────
const sCard: React.CSSProperties = { background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10 };
const sMeta: React.CSSProperties = { fontSize: 12, color: '#94a3b8', marginBottom: 10 };
const sToggle: React.CSSProperties = { border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 13, padding: '7px 12px', borderRadius: 9, cursor: 'pointer' };
const sMemo: React.CSSProperties = { background: '#f8fafc', borderRadius: 10, padding: '10px 12px', fontSize: 14, lineHeight: 1.6 };

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: NAVY, marginTop: 2 }}>{value}</div>
        </div>
    );
}

function QTitle({ q }: { q: SurveyQuestion }) {
    return (
        <p style={{ fontSize: 15, fontWeight: 800, margin: '0 0 2px', lineHeight: 1.45, color: NAVY }}>
            <span style={{ color: BLUE, marginRight: 6 }}>Q{q.no}.</span>{q.label ? `[${q.label}] ` : ''}{q.question.split('\n')[0]}
        </p>
    );
}

function StatsView({ rows }: { rows: ResponseRow[] }) {
    const total = rows.length;
    if (total === 0) return null;
    const christCount = rows.filter((r) => Object.values(r.christ_memos || {}).some((m) => (m || '').trim())).length;
    const completed = rows.filter((r) => Object.keys(r.answers || {}).filter((k) => !k.endsWith(FREE_SUFFIX)).length >= 40).length;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px,1fr))', gap: 12, marginBottom: 20 }}>
                <Metric label="총 응답" value={`${total}명`} />
                <Metric label="본설문 완료(40문항+)" value={`${completed}명`} />
                <Metric label="크라이스트 메모" value={`${christCount}명`} />
            </div>
            {SURVEY_SECTIONS.map((sec) => (
                <div key={sec.id} style={{ marginBottom: 22 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: BLUE, margin: '0 0 10px', letterSpacing: 0.3 }}>{sec.title}</div>
                    {sec.questions.map((q) => <QuestionStat key={q.id} q={q} rows={rows} />)}
                </div>
            ))}
        </div>
    );
}

function QuestionStat({ q, rows }: { q: SurveyQuestion; rows: ResponseRow[] }) {
    const [open, setOpen] = useState(false);

    // 서술형
    if (q.kind === 'text') {
        const answers = rows
            .map((r) => ({ name: r.name || '(이름없음)', church: r.church || '', text: val(r.answers?.[q.id]).trim() }))
            .filter((a) => a.text);
        return (
            <div style={sCard}>
                <QTitle q={q} />
                <div style={sMeta}>서술형 · {answers.length}건</div>
                {answers.length > 0 && (
                    <button onClick={() => setOpen((o) => !o)} style={sToggle}>{open ? '접기 ▲' : `답변 ${answers.length}건 펼쳐보기 ▼`}</button>
                )}
                {open && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        {answers.map((a, i) => (
                            <div key={i} style={sMemo}>
                                <span style={{ fontWeight: 800, color: NAVY }}>{a.name}{a.church ? ` · ${a.church}` : ''}</span>
                                <div style={{ color: '#334155', marginTop: 3, whiteSpace: 'pre-wrap' }}>{a.text}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // 객관식 (radio / checkbox)
    const counts: Record<string, number> = {};
    let answered = 0;
    for (const r of rows) {
        const v = r.answers?.[q.id];
        if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
        answered++;
        if (Array.isArray(v)) v.forEach((o) => { counts[o] = (counts[o] || 0) + 1; });
        else counts[String(v)] = (counts[String(v)] || 0) + 1;
    }
    const opts = [...((q.options && q.options.length) ? q.options : Object.keys(counts))];
    Object.keys(counts).forEach((k) => { if (!opts.includes(k)) opts.push(k); }); // 기타 자유입력 값 포함

    const comments = rows
        .map((r) => ({ name: r.name || '(이름없음)', church: r.church || '', text: val(r.answers?.[q.id + FREE_SUFFIX]).trim() }))
        .filter((c) => c.text);

    return (
        <div style={sCard}>
            <QTitle q={q} />
            <div style={sMeta}>{q.kind === 'checkbox' ? '복수선택' : '객관식'} · {answered}명 응답</div>
            <div style={{ marginTop: 2 }}>
                {opts.map((o) => {
                    const c = counts[o] || 0;
                    const pct = answered ? Math.round((c / answered) * 100) : 0;
                    return (
                        <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                            <span title={o} style={{ width: 100, fontSize: 12.5, color: c ? '#475569' : '#cbd5e1', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o}</span>
                            <div style={{ flex: 1, background: '#eef2f7', borderRadius: 4, height: 18 }}>
                                <div style={{ width: `${pct}%`, background: c ? BLUE : 'transparent', height: '100%', borderRadius: 4, minWidth: c ? 3 : 0 }} />
                            </div>
                            <span style={{ width: 62, fontSize: 12.5, fontWeight: c ? 800 : 400, color: c ? NAVY : '#cbd5e1', flexShrink: 0 }}>{c}명·{pct}%</span>
                        </div>
                    );
                })}
            </div>
            {comments.length > 0 && (
                <>
                    <button onClick={() => setOpen((o) => !o)} style={{ ...sToggle, marginTop: 8 }}>{open ? '자유의견 접기 ▲' : `자유의견 ${comments.length}건 ▼`}</button>
                    {open && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                            {comments.map((c, i) => (
                                <div key={i} style={sMemo}>
                                    <span style={{ fontWeight: 800, color: NAVY }}>{c.name}{c.church ? ` · ${c.church}` : ''}</span>
                                    <div style={{ color: '#334155', marginTop: 3, whiteSpace: 'pre-wrap' }}>{c.text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ───────────── AI 자동 요약 ─────────────
function renderSummary(text: string): React.ReactNode {
    return text.split('\n').map((raw, i) => {
        const t = raw.replace(/\*\*/g, '').trimEnd();
        const tr = t.trim();
        if (tr.startsWith('## ')) return <div key={i} style={{ fontSize: 15.5, fontWeight: 900, color: NAVY, margin: '16px 0 6px' }}>{tr.slice(3)}</div>;
        if (tr.startsWith('# ')) return <div key={i} style={{ fontSize: 17, fontWeight: 900, color: NAVY, margin: '14px 0 8px' }}>{tr.slice(2)}</div>;
        if (tr.startsWith('- ') || tr.startsWith('• ') || tr.startsWith('* ')) return <div key={i} style={{ display: 'flex', gap: 8, margin: '4px 0' }}><span style={{ color: BLUE, flexShrink: 0 }}>•</span><span>{tr.replace(/^[-•*]\s/, '')}</span></div>;
        if (!tr) return <div key={i} style={{ height: 6 }} />;
        return <div key={i} style={{ margin: '4px 0' }}>{t}</div>;
    });
}

function AiSummaryView({ authedFetch }: { authedFetch: AuthedFetch }) {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [err, setErr] = useState('');
    const [meta, setMeta] = useState<{ count?: number; opinions?: number }>({});

    const run = async () => {
        setLoading(true); setErr('');
        try {
            const res = await authedFetch('/api/survey/summarize', { method: 'POST' });
            if (res.status === 401 || res.status === 403) {
                setErr('관리자 권한이 없거나 세션이 만료되었습니다. 다시 로그인해 주세요.');
                return;
            }
            const d = await res.json();
            if (d.error) { setErr(d.error); return; }
            setSummary(d.summary || '');
            setMeta({ count: d.count, opinions: d.opinions });
        } catch (e: any) {
            setErr(e?.message || '네트워크 오류');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 18px' }}>
                <p style={{ fontSize: 16, fontWeight: 900, margin: '0 0 4px', color: NAVY }}>AI 자동 요약</p>
                <p style={{ fontSize: 13.5, color: '#64748b', margin: '0 0 14px', lineHeight: 1.6 }}>
                    목사님들의 서술형 답변·자유의견·크라이스트 메모를 AI가 분석해 핵심 주제·공통 우려·제안으로 정리합니다.
                </p>
                <button onClick={run} disabled={loading} style={{ border: 'none', background: loading ? '#94a3b8' : NAVY, color: '#fff', fontWeight: 800, fontSize: 15, padding: '12px 18px', borderRadius: 12, cursor: loading ? 'default' : 'pointer' }}>
                    {loading ? 'AI가 분석 중… (~15초)' : (summary ? '다시 요약하기' : 'AI 요약 생성하기')}
                </button>
                {err && <p style={{ color: '#dc2626', fontSize: 13.5, marginTop: 12 }}>{err}</p>}
                {meta.count != null && !err && <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 10 }}>응답자 {meta.count}명 · 의견 {meta.opinions}건 분석</p>}
            </div>
            {summary && (
                <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px', marginTop: 14, fontSize: 15, lineHeight: 1.75, color: '#1e293b' }}>
                    {renderSummary(summary)}
                </div>
            )}
        </div>
    );
}
