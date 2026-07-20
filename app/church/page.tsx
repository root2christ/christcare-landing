'use client';

/**
 * 교회 관리자(사역자) 대시보드 — christcare.us/church
 * 앱과 동일한 Supabase 계정으로 매직링크 로그인 → get_my_church_roster() RPC로
 * 자기 교회 등록자(새신자+기존교인) 명부를 데스크톱에서 조회.
 * 데이터 접근은 RPC(인증 사역자만)가 게이트 — 화이트리스트 불필요.
 */
import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { supabase } from '../../lib/supabase';
import type { Session } from '@supabase/supabase-js';

type Row = {
    id: string;
    church_name: string | null;
    reg_type: string | null;
    submitter_name: string | null;
    answers: Record<string, string> | null;
    created_at: string;
};

const FIELD_LABELS: Record<string, string> = {
    name: '이름', phone: '연락처', gender: '성별', age: '나이대',
    area: '거주 지역', visit: '방문 계기', faith: '신앙 배경', message: '기도제목 / 하고 싶은 말',
};

export default function ChurchDashboard() {
    const [session, setSession] = useState<Session | null>(null);
    const [ready, setReady] = useState(false);
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'newcomer' | 'member'>('all');
    const [openId, setOpenId] = useState<string | null>(null);
    const [err, setErr] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
        return () => subscription.unsubscribe();
    }, []);

    const load = useCallback(async () => {
        setLoading(true); setErr('');
        try {
            const { data, error } = await supabase.rpc('get_my_church_roster');
            if (error) throw error;
            setRows((data as Row[]) || []);
        } catch (e: any) {
            setErr(e?.message || '명부를 불러오지 못했습니다.');
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { if (session) load(); }, [session, load]);

    const sendLink = async () => {
        const em = email.trim().toLowerCase();
        if (!em.includes('@')) { setErr('올바른 이메일을 입력해주세요.'); return; }
        setSending(true); setErr('');
        try {
            // 앱에 이미 있는 계정(소셜 로그인 시 저장된 이메일 포함)만 로그인 — 새 계정 생성 안 함
            const { error } = await supabase.auth.signInWithOtp({
                email: em,
                options: { shouldCreateUser: false, emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/church' : undefined },
            });
            // 존재하지 않는 이메일이어도 동일 안내(계정 열람 방지)
            if (error && !/not.*found|user/i.test(error.message)) throw error;
            setSent(true);
        } catch (e: any) {
            setErr(e?.message || '메일 발송에 실패했습니다.');
        } finally {
            setSending(false);
        }
    };

    const logout = async () => { await supabase.auth.signOut(); setSession(null); setRows([]); };

    const filtered = useMemo(() => {
        if (filter === 'all') return rows;
        return rows.filter((r) => (r.reg_type || 'newcomer') === filter);
    }, [rows, filter]);

    const counts = useMemo(() => ({
        all: rows.length,
        newcomer: rows.filter((r) => (r.reg_type || 'newcomer') === 'newcomer').length,
        member: rows.filter((r) => r.reg_type === 'member').length,
    }), [rows]);

    if (!ready) return <Shell><p style={{ color: '#64748b' }}>불러오는 중…</p></Shell>;

    // ── 로그인 전 ──
    if (!session) {
        return (
            <Shell>
                <h1 style={S.h1}>교회 관리자</h1>
                <p style={S.sub}>사역자 인증을 받은 계정의 이메일로 로그인하세요. 앱에서 사용하는 이메일과 동일해야 합니다.</p>
                {sent ? (
                    <div style={S.card}>
                        <p style={{ fontWeight: 700, color: '#0f766e', marginBottom: 6 }}>메일을 확인해주세요 📩</p>
                        <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
                            <b>{email}</b> 으로 로그인 링크를 보냈습니다. 메일의 버튼을 누르면 이 페이지로 돌아옵니다.
                        </p>
                        <button style={S.linkBtn} onClick={() => { setSent(false); setErr(''); }}>다른 이메일로</button>
                    </div>
                ) : (
                    <div style={S.card}>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="pastor@example.com" style={S.input}
                            onKeyDown={(e) => e.key === 'Enter' && sendLink()}
                        />
                        <button style={{ ...S.btn, opacity: sending ? 0.6 : 1 }} disabled={sending} onClick={sendLink}>
                            {sending ? '발송 중…' : '로그인 링크 받기'}
                        </button>
                    </div>
                )}
                {!!err && <p style={S.err}>{err}</p>}
                <p style={S.hint}>사역자 인증은 앱(잡박스 → 사역자 등록)에서 먼저 받아주세요.</p>
            </Shell>
        );
    }

    // ── 로그인 후: 명부 ──
    return (
        <Shell wide>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                <h1 style={S.h1}>우리 교회 명부</h1>
                <button style={S.logout} onClick={logout}>로그아웃</button>
            </div>

            <div style={{ display: 'flex', gap: 8, margin: '14px 0 18px', flexWrap: 'wrap' }}>
                {([['all', '전체'], ['newcomer', '새신자'], ['member', '기존 교인']] as const).map(([k, label]) => (
                    <button key={k} onClick={() => setFilter(k)}
                        style={{ ...S.chip, ...(filter === k ? S.chipOn : {}) }}>
                        {label} <span style={{ opacity: 0.7 }}>{counts[k]}</span>
                    </button>
                ))}
            </div>

            {loading ? <p style={{ color: '#64748b' }}>불러오는 중…</p>
                : err ? <p style={S.err}>{err}</p>
                : filtered.length === 0 ? (
                    <div style={S.empty}>
                        <p style={{ fontWeight: 700, marginBottom: 6 }}>아직 등록자가 없어요</p>
                        <p style={{ color: '#64748b', fontSize: 14 }}>인증 사역자만 조회됩니다. 앱에서 사역자 인증을 마쳤는지 확인해주세요.</p>
                    </div>
                ) : (
                    <div style={S.tableWrap}>
                        <table style={S.table}>
                            <thead>
                                <tr>
                                    <th style={S.th}>이름</th><th style={S.th}>유형</th>
                                    <th style={S.th}>연락처</th><th style={S.th}>등록일</th><th style={S.th}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((r) => {
                                    const a = r.answers || {};
                                    const name = r.submitter_name || a.name || '(이름 미입력)';
                                    const isMember = r.reg_type === 'member';
                                    const open = openId === r.id;
                                    return (
                                        <Fragment key={r.id}>
                                            <tr style={{ cursor: 'pointer' }} onClick={() => setOpenId(open ? null : r.id)}>
                                                <td style={S.td}><b>{name}</b></td>
                                                <td style={S.td}>
                                                    <span style={{ ...S.badge, background: isMember ? '#eef2ff' : '#e3f4ec', color: isMember ? '#4f46e5' : '#0f766e' }}>
                                                        {isMember ? '기존 교인' : '새신자'}
                                                    </span>
                                                </td>
                                                <td style={S.td}>{a.phone || '-'}</td>
                                                <td style={S.td}>{new Date(r.created_at).toLocaleDateString('ko-KR')}</td>
                                                <td style={{ ...S.td, textAlign: 'right', color: '#94a3b8' }}>{open ? '▲' : '▼'}</td>
                                            </tr>
                                            {open && (
                                                <tr>
                                                    <td colSpan={5} style={S.detailCell}>
                                                        {Object.entries(a).map(([k, v]) => (
                                                            <div key={k} style={S.detailRow}>
                                                                <span style={S.detailK}>{FIELD_LABELS[k] || k}</span>
                                                                <span style={S.detailV}>{String(v) || '-'}</span>
                                                            </div>
                                                        ))}
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
        </Shell>
    );
}

function Shell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <div style={{ minHeight: '100vh', background: '#f7f5f0', padding: '40px 20px' }}>
            <div style={{ maxWidth: wide ? 860 : 440, margin: '0 auto' }}>{children}</div>
        </div>
    );
}

const S: Record<string, React.CSSProperties> = {
    h1: { fontSize: 26, fontWeight: 900, color: '#1e293b', margin: 0 },
    sub: { color: '#64748b', fontSize: 14.5, lineHeight: 1.6, margin: '10px 0 20px' },
    card: { background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, padding: 20, boxShadow: '0 4px 14px rgba(15,23,42,.05)' },
    input: { width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '13px 14px', fontSize: 15, marginBottom: 12 },
    btn: { width: '100%', background: '#0f766e', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15.5, fontWeight: 800, cursor: 'pointer' },
    linkBtn: { background: 'none', border: 'none', color: '#0f766e', fontWeight: 700, cursor: 'pointer', marginTop: 12, padding: 0, fontSize: 14 },
    err: { color: '#dc2626', fontSize: 14, marginTop: 12 },
    hint: { color: '#94a3b8', fontSize: 13, marginTop: 18, textAlign: 'center' },
    logout: { background: 'none', border: '1px solid #e2e8f0', borderRadius: 10, padding: '7px 14px', fontSize: 13, fontWeight: 700, color: '#64748b', cursor: 'pointer' },
    chip: { border: '1px solid #e2e8f0', background: '#fff', borderRadius: 999, padding: '8px 16px', fontSize: 14, fontWeight: 700, color: '#64748b', cursor: 'pointer' },
    chipOn: { background: '#0f766e', color: '#fff', borderColor: '#0f766e' },
    empty: { background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, padding: 40, textAlign: 'center' },
    tableWrap: { background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
    th: { textAlign: 'left', padding: '13px 16px', background: '#faf9f6', color: '#94a3b8', fontWeight: 700, fontSize: 12.5, borderBottom: '1px solid #eef2f7' },
    td: { padding: '13px 16px', borderBottom: '1px solid #f1f5f9', color: '#334155' },
    badge: { display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800 },
    detailCell: { padding: '4px 16px 16px', background: '#faf9f6', borderBottom: '1px solid #eef2f7' },
    detailRow: { display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px dashed #e9e4db' },
    detailK: { width: 130, color: '#94a3b8', fontSize: 13, fontWeight: 700, flexShrink: 0 },
    detailV: { color: '#334155', fontSize: 14, whiteSpace: 'pre-wrap' },
};
