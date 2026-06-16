'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    SURVEY_SECTIONS, FREE_SUFFIX, CHRIST_QUESTIONS, SurveyQuestion,
} from '../_content';

const NAVY = '#0f172a';
const BLUE = '#4f6ef2';
const BORDER = '#e2e8f0';

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
    return (
        <Suspense fallback={<div style={{ minHeight: '100dvh', background: '#f8fafc' }} />}>
            <AdminInner />
        </Suspense>
    );
}

function AdminInner() {
    const params = useSearchParams();
    const [keyInput, setKeyInput] = useState('');
    const [authed, setAuthed] = useState(false);
    const [rows, setRows] = useState<ResponseRow[]>([]);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<'list' | 'christ'>('list');

    const load = useCallback(async (key: string) => {
        setLoading(true); setErr('');
        try {
            const res = await fetch(`/api/survey/admin?key=${encodeURIComponent(key)}`);
            if (res.status === 401) { setErr('비밀번호가 올바르지 않습니다.'); setAuthed(false); return; }
            const d = await res.json();
            if (d.error) { setErr(d.error); return; }
            setRows(d.responses || []);
            setAuthed(true);
            try { localStorage.setItem('survey_admin_key', key); } catch { /* noop */ }
        } catch (e: any) {
            setErr(e?.message || '네트워크 오류');
        } finally {
            setLoading(false);
        }
    }, []);

    // ?key= 또는 저장된 키로 자동 로그인 (한 번 들어오면 그 브라우저에선 다시 비번 안 물어봄)
    useEffect(() => {
        const qk = params.get('key');
        if (qk) { setKeyInput(qk); load(qk); return; }
        let saved = '';
        try { saved = localStorage.getItem('survey_admin_key') || ''; } catch { /* noop */ }
        if (saved) { setKeyInput(saved); load(saved); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // ── 비밀번호 게이트 ──
    if (!authed) {
        return (
            <div style={{ minHeight: '100dvh', background: 'linear-gradient(160deg,#0b1220,#1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 22 }}>
                <div style={{ background: '#fff', borderRadius: 22, padding: '32px 24px', width: '100%', maxWidth: 380 }}>
                    <h1 style={{ fontSize: 21, fontWeight: 900, color: NAVY, margin: '0 0 6px' }}>설문 관리자</h1>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 18px' }}>관리자 비밀번호를 입력해 주세요.</p>
                    <input
                        type="password"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') load(keyInput); }}
                        placeholder="비밀번호"
                        style={{ width: '100%', height: 50, borderRadius: 12, border: `1.5px solid ${BORDER}`, padding: '0 14px', fontSize: 16, boxSizing: 'border-box', marginBottom: 12 }}
                    />
                    {err && <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 10px' }}>{err}</p>}
                    <button
                        onClick={() => load(keyInput)}
                        disabled={loading}
                        style={{ width: '100%', height: 50, borderRadius: 12, border: 'none', background: NAVY, color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? '확인 중…' : '입장'}
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
                    <span style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>총 {rows.length}명 응답</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => load(keyInput)} style={btn('#eef2ff', BLUE)}>새로고침</button>
                    <button onClick={exportCsv} style={btn(BLUE, '#fff')}>CSV 내보내기</button>
                </div>
            </div>

            {/* 탭 */}
            <div style={{ display: 'flex', gap: 8, padding: '12px 16px 0', maxWidth: 1100, margin: '0 auto' }}>
                <Tab active={tab === 'list'} onClick={() => setTab('list')}>응답자별 보기</Tab>
                <Tab active={tab === 'christ'} onClick={() => setTab('christ')}>크라이스트 문항별 메모</Tab>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 16px 60px' }}>
                {rows.length === 0 && <p style={{ color: '#64748b', fontSize: 15, padding: 20 }}>아직 응답이 없습니다.</p>}

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
