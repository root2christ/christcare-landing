'use client';

/**
 * 교회 관리자(사역자) 대시보드 — christcare.us/church
 * 앱과 동일한 Supabase 계정으로 매직링크 로그인 → get_my_church_roster() RPC로
 * 자기 교회 등록자(새신자+기존교인) 명부를 데스크톱에서 조회.
 * 데이터 접근은 RPC(인증 사역자만)가 게이트 — 화이트리스트 불필요.
 */
import { useState, useEffect, useCallback, useMemo, useRef, Fragment } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
    const [mode, setMode] = useState<'qr' | 'email'>('qr'); // 로그인 방식 (QR 기본)
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    // QR 로그인 상태 — channels[0]=현재 QR, [1]=직전(교체 경계에 스캔된 승인도 수신)
    const [channels, setChannels] = useState<string[]>([]);
    const channel = channels[0] || null;
    const [qrLoading, setQrLoading] = useState(false);
    const [qrErr, setQrErr] = useState('');
    const [expired, setExpired] = useState(false);
    const [verifying, setVerifying] = useState(false); // 앱 승인 후 세션 생성 중
    const [dbg, setDbg] = useState(''); // 진단용 폴링 상태
    const [evlog, setEvlog] = useState<string[]>([]); // 진단용 이벤트 로그 (최근 8건)
    const verifyingRef = useRef(false); // verifyOtp 중복 시도 방지
    const logEv = useCallback((m: string) => {
        setEvlog((p) => [...p.slice(-7), `${new Date().toLocaleTimeString()} ${m}`]);
    }, []);
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

    // ── QR 로그인 ──
    // 새 로그인 채널 발급 (uuid). QR = christcare.us/wl?c=<channel>
    // QR은 만료로 죽지 않는다 — 3.5분마다 자동 교체, 직전 채널도 서버 수명(5분) 동안 계속 감시.
    const startQr = useCallback(async () => {
        setQrLoading(true); setQrErr(''); setExpired(false);
        try {
            const res = await fetch('/api/church/qr-start', { method: 'POST', cache: 'no-store' });
            const json = await res.json();
            if (!res.ok || !json?.channel) throw new Error(json?.error || 'QR 생성 실패');
            setChannels((prev) => [json.channel as string, ...prev].slice(0, 2));
            logEv('QR 발급 ' + (json.channel as string).slice(0, 8));
        } catch (e: any) {
            setQrErr(e?.message || 'QR 코드를 만들지 못했습니다.');
        } finally {
            setQrLoading(false);
        }
    }, [logEv]);

    // 앱이 승인하면 token_hash 를 받아 verifyOtp 로 세션 생성 — 현재+직전 채널 모두 감시
    const poll = useCallback(async () => {
        if (channels.length === 0) return;
        for (const ch of channels) {
            try {
                const res = await fetch(`/api/church/qr-poll?c=${encodeURIComponent(ch)}`, { cache: 'no-store' });
                const json = await res.json();
                if (ch === channels[0]) {
                    setDbg(`ch ${ch.slice(0, 8)} · ${json?.token_hash ? 'TOKEN!' : json?.expired ? 'expired' : json?.error ? 'err:' + json.error : 'waiting'} · ${new Date().toLocaleTimeString()}`);
                }
                if (json?.expired) {
                    // 서버 수명(5분) 종료 — 이 채널만 목록에서 제거 (QR 죽음 아님, 자동 교체가 계속 돎)
                    setChannels((prev) => prev.filter((c) => c !== ch));
                    continue;
                }
                if (json?.error) { logEv('poll err: ' + json.error); continue; }
                if (json?.token_hash) {
                    if (verifyingRef.current) return; // 이미 verify 진행 중 — 중복 시도 방지
                    verifyingRef.current = true;
                    logEv('TOKEN 수신(' + ch.slice(0, 8) + ') → 로그인 처리');
                    setVerifying(true);
                    // magiclink 토큰은 버전에 따라 type이 'email'/'magiclink' — 순차 시도
                    let r = await supabase.auth.verifyOtp({ token_hash: json.token_hash, type: 'email' });
                    if (r.error) {
                        logEv('verify(email) 실패: ' + r.error.message);
                        r = await supabase.auth.verifyOtp({ token_hash: json.token_hash, type: 'magiclink' });
                    }
                    if (r.error) {
                        logEv('verify(magiclink) 실패: ' + r.error.message);
                        verifyingRef.current = false;
                        setVerifying(false);
                        setQrErr('로그인 확인 실패: ' + r.error.message);
                    } else {
                        logEv('로그인 성공');
                    }
                    return;
                    // 성공 시 onAuthStateChange 가 session 을 채우고, 아래 effect 들이 폴링을 정리한다.
                }
            } catch (e: any) {
                logEv('poll 예외: ' + String(e?.message || e).slice(0, 60));
            }
        }
    }, [channels, logEv]);

    // QR 모드 진입 시 채널이 없으면 발급
    useEffect(() => {
        if (ready && mode === 'qr' && !session && channels.length === 0 && !qrLoading && !qrErr) startQr();
    }, [ready, mode, session, channels, qrLoading, qrErr, startQr]);

    // QR 자동 교체 (3.5분마다) — 만료로 죽는 QR 없음. 탭이 다시 보일 때도 즉시 갱신.
    useEffect(() => {
        if (mode !== 'qr' || session) return;
        const id = setInterval(() => { startQr(); }, 210000);
        const onVis = () => { if (document.visibilityState === 'visible') startQr(); };
        document.addEventListener('visibilitychange', onVis);
        return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
    }, [mode, session, startQr]);

    // 2초 폴링 (로그인 전 · QR 모드)
    useEffect(() => {
        if (mode !== 'qr' || session || channels.length === 0) return;
        const id = setInterval(poll, 2000);
        return () => clearInterval(id);
    }, [mode, session, channels, poll]);

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
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://christcare.us';
        return (
            <Shell>
                <h1 style={S.h1}>교회 관리자</h1>
                <p style={S.sub}>앱에 로그인된 사역자 계정으로 로그인하세요. QR을 폰으로 스캔하면 가장 빠릅니다.</p>

                {/* 방식 토글 */}
                <div style={S.tabs}>
                    <button onClick={() => setMode('qr')} style={{ ...S.tab, ...(mode === 'qr' ? S.tabOn : {}) }}>QR로 로그인</button>
                    <button onClick={() => setMode('email')} style={{ ...S.tab, ...(mode === 'email' ? S.tabOn : {}) }}>이메일로 로그인</button>
                </div>

                {mode === 'qr' ? (
                    <div style={{ ...S.card, textAlign: 'center' }}>
                        {qrLoading || (!channel && !qrErr) ? (
                            <p style={{ color: '#64748b', padding: '40px 0' }}>QR 준비 중…</p>
                        ) : channel ? (
                            <>
                                <div style={{ position: 'relative', display: 'inline-block', padding: 12, background: '#fff', borderRadius: 14, border: '1px solid #eef2f7' }}>
                                    {/* QR은 항상 apex(https://christcare.us) — www 주소는 앱 딥링크 파서가 못 읽던 버그의 원인.
                                        3.5분마다 자동 교체되므로 만료 오버레이 없음 (죽지 않는 QR). */}
                                    <QRCodeSVG value={`https://christcare.us/wl?c=${channel}`} size={196} level="M" style={{ display: 'block' }} />
                                </div>
                                {verifying ? (
                                    <p style={{ fontWeight: 800, color: '#0f766e', margin: '16px 0 4px' }}>승인 확인됨 — 로그인 중…</p>
                                ) : (
                                    <>
                                        <p style={{ fontWeight: 800, color: '#0f766e', margin: '16px 0 4px' }}>폰 카메라로 스캔하세요</p>
                                        <p style={{ color: '#64748b', fontSize: 13.5, lineHeight: 1.6 }}>
                                            스캔하면 soluma 앱이 열립니다. 앱에서 <b>로그인 승인</b>을 누르면 이 화면이 자동으로 로그인됩니다.
                                        </p>
                                    </>
                                )}
                            </>
                        ) : null}
                        {!!qrErr && (
                            <div style={{ marginTop: 12 }}>
                                <p style={S.err}>{qrErr}</p>
                                {!channel && <button style={{ ...S.btnSm, marginTop: 10 }} onClick={startQr}>다시 시도</button>}
                            </div>
                        )}
                        {/* 진단 로그(dbg/evlog)는 QR 로그인 안정화 후 표시 제거 (2026-07-21) — 상태는 유지(문제 시 재노출 용이) */}
                    </div>
                ) : sent ? (
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
                {!!err && mode === 'email' && <p style={S.err}>{err}</p>}
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
    btnSm: { background: '#0f766e', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 800, cursor: 'pointer' },
    linkBtn: { background: 'none', border: 'none', color: '#0f766e', fontWeight: 700, cursor: 'pointer', marginTop: 12, padding: 0, fontSize: 14 },
    tabs: { display: 'flex', gap: 6, background: '#eef2f7', borderRadius: 12, padding: 4, marginBottom: 16 },
    tab: { flex: 1, border: 'none', background: 'transparent', borderRadius: 9, padding: '10px', fontSize: 14, fontWeight: 800, color: '#64748b', cursor: 'pointer' },
    tabOn: { background: '#fff', color: '#0f766e', boxShadow: '0 1px 3px rgba(15,23,42,.08)' },
    qrExpired: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.86)', borderRadius: 14 },
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
