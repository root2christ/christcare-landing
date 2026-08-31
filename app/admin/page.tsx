'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 2026-07-31: 매직링크 → **비밀번호 로그인**(사장님 지시).
 *
 * ⚠️ 이 파일은 브라우저로 그대로 내려간다. 그래서 비밀번호도, 세션 토큰도 **여기 두지 않는다.**
 *    로그인은 /api/admin/login 이 서버에서만 대조하고, 통과하면 httpOnly 쿠키를 심어준다.
 *    화면 코드가 아는 것은 "로그인됐다"는 사실 하나뿐이다.
 */

type Notification = {
    id: string;
    title: string;
    body: string;
    status: string;
    scheduled_at: string | null;
    sent_at: string | null;
    sent_count: number;
    created_at: string;
};

type SearchedUser = {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url?: string | null;
    church_id?: string | null;
    church_name?: string | null;
};

type GiftGrant = {
    id: string;
    admin_email: string;
    target_user_id: string;
    target_email: string | null;
    product_id: string;
    bible_translation: string | null;
    quantity: number;
    note: string | null;
    created_at: string;
};

// 발급 가능한 모든 SKU (성경은 번역본별로 펼침)
type GiftableSku = {
    key: string;             // UI/state key
    productId: string;       // API 전송용
    bibleTranslation?: string;
    label: string;
    price: number;
};

const GIFTABLE_SKUS: GiftableSku[] = [
    // 단품
    { key: 'test_christ_basic',  productId: 'test_christ_basic_v2',  label: '크라이스트 테스트', price: 1.49 },
    { key: 'analysis_deep',      productId: 'analysis_deep',      label: '심층 분석', price: 3 },
    // 구독
    { key: 'sub_monthly',        productId: 'sub_monthly',        label: '월 구독', price: 2 },
    { key: 'sub_yearly',         productId: 'sub_yearly',         label: '연 구독 (심층분석 2회)', price: 20 },
    // 성경 한글 3종 평생소장 번들 ($3) — 앱이 인식하는 단일 SKU
    // (bible_lifetime_korean_all / bible_translation 'korean_all')
    { key: 'bible_korean_all', productId: 'bible_lifetime_', bibleTranslation: 'korean_all', label: '성경 한글 3종 평생소장 (개역개정·새번역·새한글)', price: 3 },
];

// SKU 그룹 (UI 섹션 구분용)
const SKU_SECTIONS: Array<{ title: string; keys: string[] }> = [
    { title: '단품 테스트', keys: ['test_christ_basic', 'analysis_deep'] },
    { title: '구독', keys: ['sub_monthly', 'sub_yearly'] },
    { title: '성경 평생소장', keys: ['bible_korean_all'] },
];

type TabKey = 'send' | 'history' | 'gift' | 'pastors' | 'recent' | 'stats' | 'store';

type RecentUser = {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    church_name: string | null;
    created_at: string;
};

type PastorRow = {
    id: string; user_id: string; name: string | null; church_name: string | null;
    church_id: number | null; denomination: string | null; position: string | null;
    phone: string | null; verification_status: string | null; auto_verified: boolean | null;
    submitted_at: string | null; created_at: string | null; email: string | null;
    ordination_certificate_url: string | null; denomination_registration_url: string | null;
    church_bulletin_url: string | null;
};
type UserChurch = {
    id: number; name: string; denomination: string | null; region: string | null;
    address: string | null; member_count: number | null; created_at: string | null;
    applicant_name: string | null; applicant_contact: string | null; pastor_name: string | null;
    creator_email: string | null; lat: number | null; lon: number | null;
};

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    const [loginPassword, setLoginPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [tab, setTab] = useState<TabKey>('send');

    // ── 알림 보내기 ──
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // ── 이용권 보내기 ──
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<SearchedUser | null>(null);
    // SKU별 수량 (key → 문자열 수량. 빈 문자열 또는 0이면 미선택)
    const [quantities, setQuantities] = useState<Record<string, string>>({});
    const [note, setNote] = useState('');
    const [granting, setGranting] = useState(false);
    const [grantResult, setGrantResult] = useState('');
    const [grantHistory, setGrantHistory] = useState<GiftGrant[]>([]);

    // ── 사역자·교회 (2026-08-14) ──
    const [pastorRows, setPastorRows] = useState<PastorRow[]>([]);
    const [userChurches, setUserChurches] = useState<UserChurch[]>([]);
    const [pastorsLoading, setPastorsLoading] = useState(false);
    const [pastorFilter, setPastorFilter] = useState<'all' | 'verified' | 'rejected'>('all');
    const [lightbox, setLightbox] = useState<{ url: string; label: string } | null>(null);

    // ── 통계 (2026-08-30) ──
    const [stats, setStats] = useState<any>(null);
    const [funnel, setFunnel] = useState<any>(null);
    const [store, setStore] = useState<any>(null);
    const [storeLoading, setStoreLoading] = useState(false);
    const [storeError, setStoreError] = useState('');
    const [storeDays, setStoreDays] = useState(14);
    const [funnelDays, setFunnelDays] = useState(7);
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState('');

    // ── 최근 가입자 (2026-08-24) ──
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentPage, setRecentPage] = useState(0);
    const [recentLoading, setRecentLoading] = useState(false);
    const [recentHasMore, setRecentHasMore] = useState(false);
    const [recentError, setRecentError] = useState('');

    const loadPastors = useCallback(async () => {
        setPastorsLoading(true);
        try {
            const res = await fetch('/api/admin/pastors');
            const data = await res.json();
            if (res.ok) {
                setPastorRows(data.pastors || []);
                setUserChurches(data.churches || []);
            }
        } catch { /* noop */ }
        setPastorsLoading(false);
    }, []);

    const setPastorStatusWeb = async (id: string, status: 'verified' | 'rejected') => {
        const res = await fetch('/api/admin/pastors', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });
        if (res.ok) loadPastors();
        else alert('처리 실패');
    };

    // ── 크레딧 보내기 ──
    const [creditAmount, setCreditAmount] = useState('');
    const [creditResult, setCreditResult] = useState('');
    const [grantingCredit, setGrantingCredit] = useState(false);

    const setQty = (key: string, value: string) => {
        // 숫자만 허용, 최대 2자리
        const cleaned = value.replace(/[^0-9]/g, '').slice(0, 2);
        setQuantities(prev => ({ ...prev, [key]: cleaned }));
    };

    const incQty = (key: string) => {
        const cur = parseInt(quantities[key] || '0', 10) || 0;
        setQuantities(prev => ({ ...prev, [key]: String(Math.min(99, cur + 1)) }));
    };
    const decQty = (key: string) => {
        const cur = parseInt(quantities[key] || '0', 10) || 0;
        setQuantities(prev => ({ ...prev, [key]: String(Math.max(0, cur - 1)) }));
    };

    // 선택된 항목 요약
    const selectedItems = GIFTABLE_SKUS
        .map(sku => ({ sku, qty: parseInt(quantities[sku.key] || '0', 10) || 0 }))
        .filter(x => x.qty > 0);
    const totalCount = selectedItems.reduce((s, x) => s + x.qty, 0);
    const totalValue = selectedItems.reduce((s, x) => s + x.sku.price * x.qty, 0);

    // 로그인돼 있는지 — 쿠키가 살아 있는지 서버에 묻는다
    useEffect(() => {
        fetch('/api/admin/login')
            .then((r) => setAuthed(r.ok))
            .catch(() => setAuthed(false))
            .finally(() => setCheckingSession(false));
    }, []);

    // 공통 fetch — 인증은 httpOnly 쿠키가 알아서 실려 간다(same-origin)
    const authedFetch = useCallback(async (url: string, init?: RequestInit) => {
        const res = await fetch(url, {
            ...init,
            credentials: 'same-origin',
            headers: { ...(init?.headers || {}), 'Content-Type': 'application/json' },
        });
        if (res.status === 401) {
            setAuthed(false);
            throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
        return res;
    }, []);

    const loadHistory = useCallback(async () => {
        if (!authed) return;
        try {
            const res = await authedFetch('/api/push'); // GET도 관리자 토큰 필요
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch { }
    }, [authedFetch, authed]);

    const loadGrantHistory = useCallback(async () => {
        if (!authed) return;
        try {
            const res = await authedFetch('/api/admin/gift-inventory');
            const data = await res.json();
            setGrantHistory(data.grants || []);
        } catch { }
    }, [authedFetch, authed]);

    const loadRecent = useCallback(async (page: number) => {
        if (!authed) return;
        setRecentLoading(true);
        setRecentError('');
        try {
            const res = await authedFetch('/api/admin/recent-users', {
                method: 'POST',
                body: JSON.stringify({ page }),
            });
            const data = await res.json();
            if (!res.ok) {
                setRecentError(data.error || '불러오지 못했습니다.');
                setRecentUsers([]);
                setRecentHasMore(false);
            } else {
                setRecentUsers(data.users || []);
                setRecentHasMore(!!data.hasMore);
                setRecentPage(page);
            }
        } catch (e: any) {
            setRecentError(e?.message || '불러오지 못했습니다.');
        } finally {
            setRecentLoading(false);
        }
    }, [authedFetch, authed]);

    const loadStore = useCallback(async () => {
        if (!authed) return;
        setStoreLoading(true); setStoreError('');
        try {
            const res = await authedFetch(`/api/admin/store?days=${storeDays}`);
            const data = await res.json();
            if (!res.ok) { setStoreError(data.error || '불러오지 못했습니다.'); setStore(null); }
            else setStore(data);
        } catch (e: any) {
            setStoreError(e?.message || '불러오지 못했습니다.');
        } finally { setStoreLoading(false); }
    }, [authedFetch, authed, storeDays]);

    const loadStats = useCallback(async () => {
        if (!authed) return;
        setStatsLoading(true); setStatsError('');
        try {
            const res = await authedFetch('/api/admin/stats');
            const data = await res.json();
            if (!res.ok) { setStatsError(data.error || '불러오지 못했습니다.'); setStats(null); }
            else setStats(data.stats);

            // 퍼널은 별도 RPC — 아직 SQL 을 안 돌렸어도 통계는 보이게 실패를 삼킨다
            try {
                const fr = await authedFetch(`/api/admin/funnel?days=${funnelDays}`);
                const fd = await fr.json();
                setFunnel(fr.ok ? fd.funnel : { _error: fd.error || '불러오지 못했습니다.' });
            } catch { setFunnel(null); }
        } catch (e: any) {
            setStatsError(e?.message || '불러오지 못했습니다.');
        } finally { setStatsLoading(false); }
    }, [authedFetch, authed, funnelDays]);

    useEffect(() => {
        if (!authed) return;
        if (tab === 'stats') loadStats();
        if (tab === 'store') loadStore();
        if (tab === 'history') loadHistory();
        if (tab === 'pastors') loadPastors();
        if (tab === 'gift') loadGrantHistory();
        if (tab === 'recent') loadRecent(0);
    }, [authed, tab, loadHistory, loadGrantHistory, loadPastors, loadRecent, loadStats]);

    // ── 로그인 ──
    // 비밀번호는 서버로만 보낸다. 맞으면 서버가 httpOnly 쿠키를 심어준다(여기서는 못 읽는다).
    const handleLogin = async () => {
        if (!loginPassword) return;
        setLoggingIn(true);
        setLoginError('');
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: loginPassword }),
            });
            if (res.ok) {
                setLoginPassword('');
                setAuthed(true);
            } else {
                const j = await res.json().catch(() => ({}));
                setLoginError(j?.error || '비밀번호가 맞지 않습니다.');
            }
        } catch {
            setLoginError('연결에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
        } finally {
            setLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        try { await fetch('/api/admin/login', { method: 'DELETE' }); } catch { /* noop */ }
        setAuthed(false);
    };

    // ── 알림 보내기 ──
    const handleSend = async (isScheduled: boolean) => {
        if (!title.trim() || !body.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }
        if (isScheduled && !scheduledAt) {
            alert('예약 시간을 선택해주세요.');
            return;
        }

        setSending(true);
        setResult('');
        try {
            const res = await authedFetch('/api/push', {
                method: 'POST',
                body: JSON.stringify({
                    title: title.trim(),
                    body: body.trim(),
                    scheduledAt: isScheduled ? new Date(scheduledAt).toISOString() : undefined,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setResult(isScheduled
                    ? `예약 완료! (${new Date(scheduledAt).toLocaleString('ko-KR')})`
                    : `발송 완료! ${data.sentCount}대의 기기에 전송됨`
                );
                setTitle('');
                setBody('');
                setScheduledAt('');
                loadHistory();
            } else {
                setResult(`오류: ${data.error}`);
            }
        } catch (e: any) {
            setResult(`오류: ${e.message}`);
        } finally {
            setSending(false);
        }
    };

    // ── 이용권 보내기 ──
    const handleUserSearch = async () => {
        const q = userSearchQuery.trim();
        if (q.length < 2) { alert('검색어를 2자 이상 입력해주세요.'); return; }
        setSearching(true);
        setSearchResults([]);
        try {
            const res = await authedFetch('/api/admin/user-search', {
                method: 'POST',
                body: JSON.stringify({ query: q }),
            });
            const data = await res.json();
            if (res.ok) {
                setSearchResults(data.users || []);
                if ((data.users || []).length === 0) alert('검색 결과가 없습니다.');
            } else {
                alert(`오류: ${data.error}`);
            }
        } catch (e: any) {
            alert(`오류: ${e.message}`);
        } finally {
            setSearching(false);
        }
    };

    const handleGrant = async () => {
        if (!selectedUser) { alert('대상 사용자를 먼저 선택해주세요.'); return; }
        if (selectedItems.length === 0) { alert('발급할 이용권의 수량을 1장 이상 입력해주세요.'); return; }

        const itemsText = selectedItems.map(x => `  · ${x.sku.label} × ${x.qty}장`).join('\n');
        if (!confirm(
            `[발급 확인]\n\n대상: ${selectedUser.full_name || '(이름 없음)'} (${selectedUser.email || selectedUser.id.slice(0, 8)})\n\n${itemsText}\n\n총 ${totalCount}장 (시장가치 $${totalValue.toFixed(2)})\n메모: ${note.trim() || '(없음)'}\n\n발급하시겠습니까?`
        )) return;

        setGranting(true);
        setGrantResult('');
        try {
            const res = await authedFetch('/api/admin/gift-inventory', {
                method: 'POST',
                body: JSON.stringify({
                    targetUserId: selectedUser.id,
                    targetEmail: selectedUser.email,
                    items: selectedItems.map(x => ({
                        productId: x.sku.productId,
                        bibleTranslation: x.sku.bibleTranslation,
                        quantity: x.qty,
                    })),
                    note: note.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                const successItems = (data.items || []).filter((r: any) => r.success);
                const failItems = (data.items || []).filter((r: any) => !r.success);

                let msg = `✅ 총 ${data.granted}장 발급 완료 → ${selectedUser.email || selectedUser.full_name}\n`;
                msg += successItems.map((r: any) => `  · ${r.productLabel} × ${r.quantity}장`).join('\n');
                if (failItems.length > 0) {
                    msg += '\n⚠️ 일부 실패:\n';
                    msg += failItems.map((r: any) => `  · ${r.productLabel}: ${r.error}`).join('\n');
                }
                setGrantResult(msg);
                setNote('');
                setQuantities({});
                loadGrantHistory();
            } else {
                setGrantResult(`❌ 오류: ${data.error || '알 수 없는 오류'}`);
            }
        } catch (e: any) {
            setGrantResult(`❌ 오류: ${e.message}`);
        } finally {
            setGranting(false);
        }
    };

    // ── 크레딧 보내기 ──
    const handleGrantCredit = async () => {
        if (!selectedUser) { alert('대상 사용자를 먼저 선택해주세요.'); return; }
        const amount = Number(creditAmount);
        if (!Number.isFinite(amount) || amount <= 0) {
            alert('지급할 크레딧 금액(USD)을 0보다 크게 입력해주세요.');
            return;
        }
        if (amount > 100000) {
            alert('크레딧 금액은 100000 이하여야 합니다.');
            return;
        }

        if (!confirm(
            `[크레딧 선물 확인]\n\n대상: ${selectedUser.full_name || '(이름 없음)'} (${selectedUser.email || selectedUser.id.slice(0, 8)})\n\n금액: $${amount.toFixed(2)} 크레딧\n메모: ${note.trim() || '(없음)'}\n\n받은 선물함으로 보내시겠습니까?`
        )) return;

        setGrantingCredit(true);
        setCreditResult('');
        try {
            const res = await authedFetch('/api/admin/credit-grant', {
                method: 'POST',
                body: JSON.stringify({
                    targetUserId: selectedUser.id,
                    targetEmail: selectedUser.email,
                    amount,
                    note: note.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setCreditResult(`✅ $${amount.toFixed(2)} 크레딧 선물 전송 완료 → ${data.targetEmail || selectedUser.email || selectedUser.full_name} · 받은 선물함에서 사용자가 직접 받으면 충전됩니다`);
                setCreditAmount('');
                loadGrantHistory();
            } else {
                setCreditResult(`❌ 오류: ${data.error || '알 수 없는 오류'}`);
            }
        } catch (e: any) {
            setCreditResult(`❌ 오류: ${e.message}`);
        } finally {
            setGrantingCredit(false);
        }
    };

    // ── 렌더 ──

    if (checkingSession) {
        return (
            <div style={styles.container}>
                <div style={styles.loginCard}>
                    <p style={{ color: '#94a3b8' }}>세션 확인 중...</p>
                </div>
            </div>
        );
    }

    if (!authed) {
        return (
            <div style={styles.container}>
                <div style={styles.loginCard}>
                    <h1 style={styles.loginTitle}>soluma 관리자</h1>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !loggingIn && handleLogin()}
                        style={{ ...styles.input, marginTop: 20 }}
                        disabled={loggingIn}
                        autoComplete="current-password"
                        autoCapitalize="off"
                        spellCheck={false}
                    />
                    {loginError ? (
                        <p style={{ color: '#f87171', fontSize: 13, marginTop: 10, marginBottom: 0 }}>{loginError}</p>
                    ) : null}
                    <button onClick={handleLogin} disabled={loggingIn} style={{ ...styles.primaryBtn, marginTop: 16 }}>
                        {loggingIn ? '...' : '로그인'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.main}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                        <h1 style={{ ...styles.pageTitle, marginBottom: 4 }}>soluma 관리자</h1>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>관리자</p>
                    </div>
                    <button onClick={handleLogout} style={styles.refreshBtn}>로그아웃</button>
                </div>

                <div style={styles.tabRow}>
                    <button style={tab === 'send' ? styles.tabActive : styles.tab} onClick={() => setTab('send')}>푸시 알림 보내기</button>
                    <button style={tab === 'history' ? styles.tabActive : styles.tab} onClick={() => setTab('history')}>발송 이력</button>
                    <button style={tab === 'gift' ? styles.tabActive : styles.tab} onClick={() => setTab('gift')}>이용권 보내기</button>
                    <button style={tab === 'pastors' ? styles.tabActive : styles.tab} onClick={() => setTab('pastors')}>사역자·교회</button>
                    <button style={tab === 'recent' ? styles.tabActive : styles.tab} onClick={() => setTab('recent')}>최근 가입자</button>
                    <button style={tab === 'stats' ? styles.tabActive : styles.tab} onClick={() => setTab('stats')}>통계</button>
                    <button style={tab === 'store' ? styles.tabActive : styles.tab} onClick={() => setTab('store')}>스토어</button>
                </div>

                {tab === 'send' && (
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>푸시 알림 보내기</h2>
                        <label style={styles.label}>제목</label>
                        <input placeholder="알림 제목" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
                        <label style={styles.label}>내용</label>
                        <textarea placeholder="알림 내용을 입력하세요" value={body} onChange={e => setBody(e.target.value)} rows={4} style={{ ...styles.input, resize: 'vertical' as any }} />
                        <label style={styles.label}>예약 발송 (선택)</label>
                        <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} style={styles.input} />
                        <div style={styles.btnRow}>
                            <button onClick={() => handleSend(false)} disabled={sending} style={styles.primaryBtn}>
                                {sending ? '발송 중...' : '즉시 발송'}
                            </button>
                            <button onClick={() => handleSend(true)} disabled={sending} style={styles.secondaryBtn}>
                                {sending ? '처리 중...' : '예약 발송'}
                            </button>
                        </div>
                        {result && (
                            <div style={{ ...styles.resultBox, backgroundColor: result.includes('오류') ? '#fef2f2' : '#f0fdf4', color: result.includes('오류') ? '#ef4444' : '#22c55e' }}>
                                {result}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'history' && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={styles.cardTitle}>발송 이력</h2>
                            <button onClick={loadHistory} style={styles.refreshBtn}>새로고침</button>
                        </div>
                        {notifications.length === 0 ? (
                            <p style={styles.empty}>발송 이력이 없습니다.</p>
                        ) : (
                            <div style={styles.historyList}>
                                {notifications.map(n => (
                                    <div key={n.id} style={styles.historyItem}>
                                        <div style={styles.historyHeader}>
                                            <span style={{ ...styles.statusBadge, backgroundColor: n.status === 'sent' ? '#dcfce7' : n.status === 'scheduled' ? '#fef3c7' : '#f1f5f9', color: n.status === 'sent' ? '#16a34a' : n.status === 'scheduled' ? '#d97706' : '#64748b' }}>
                                                {n.status === 'sent' ? '발송완료' : n.status === 'scheduled' ? '예약중' : n.status}
                                            </span>
                                            <span style={styles.historyDate}>{new Date(n.created_at).toLocaleString('ko-KR')}</span>
                                        </div>
                                        <h3 style={styles.historyTitle}>{n.title}</h3>
                                        <p style={styles.historyBody}>{n.body}</p>
                                        <div style={styles.historyMeta}>
                                            {n.sent_count > 0 && <span>{n.sent_count}대 발송</span>}
                                            {n.scheduled_at && <span>예약: {new Date(n.scheduled_at).toLocaleString('ko-KR')}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {tab === 'stats' && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={styles.cardTitle}>통계</h2>
                            <button onClick={loadStats} style={styles.refreshBtn}>새로고침</button>
                        </div>
                        {statsError ? (
                            <div style={{ ...styles.resultBox, backgroundColor: '#fef2f2', color: '#ef4444' }}>{statsError}</div>
                        ) : statsLoading || !stats ? (
                            <p style={styles.empty}>{statsLoading ? '불러오는 중…' : '데이터가 없습니다.'}</p>
                        ) : (() => {
                            const S = stats;
                            const usd = (n: number) => `$${Number(n || 0).toFixed(2)}`;
                            const Box = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
                                <div style={{ flex: '1 1 150px', minWidth: 150, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
                                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{label}</div>
                                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{value}</div>
                                    {sub && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
                                </div>
                            );
                            const daily = (S.signupsDaily || []) as Array<{ d: string; n: number }>;
                            const maxN = Math.max(1, ...daily.map(x => x.n));
                            return (
                                <>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>회원</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                                        <Box label="전체 회원" value={String(S.users?.total ?? 0)} />
                                        <Box label="오늘 가입" value={String(S.users?.today ?? 0)} />
                                        <Box label="7일" value={String(S.users?.days7 ?? 0)} />
                                        <Box label="30일" value={String(S.users?.days30 ?? 0)} />
                                    </div>

                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>매출 · 구독</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                                        <Box label="누적 매출" value={usd(S.revenue?.totalUsd)} sub={`실결제 ${S.revenue?.count ?? 0}건`} />
                                        <Box label="30일 매출" value={usd(S.revenue?.days30Usd)} />
                                        <Box label="오늘 매출" value={usd(S.revenue?.today)} />
                                        <Box label="활성 구독 · 실결제" value={String(S.subscriptions?.paid ?? 0)} sub={`월 ${S.subscriptions?.monthly ?? 0} · 연 ${S.subscriptions?.yearly ?? 0}`} />
                                        <Box label="활성 구독 · 선물" value={String(S.subscriptions?.gifted ?? 0)} sub={`전체 ${S.subscriptions?.active ?? 0}명`} />
                                        <Box label="선물 지급분 (매출 아님)" value={usd(S.gifts?.valueUsd)} sub={`${S.gifts?.count ?? 0}건 · 선물·이벤트`} />
                                    </div>

                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>교회 · 오픈 이벤트</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                                        <Box label="등록 교회" value={String(S.church?.userRegistered ?? 0)} />
                                        <Box label="사역자" value={String(S.church?.pastors ?? 0)} sub={`인증 ${S.church?.pastorsVerified ?? 0}`} />
                                        <Box label="새신자 등록" value={String(S.church?.newcomers ?? 0)} sub={`7일 ${S.church?.newcomers7 ?? 0}`} />
                                        <Box label="이벤트 지급" value={String(S.launchEvent?.granted ?? 0)} sub={`사용 ${S.launchEvent?.used ?? 0}`} />
                                    </div>

                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '10px 0 8px' }}>최근 14일 가입 추이</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, padding: '8px 4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 18 }}>
                                        {daily.length === 0 ? <span style={{ fontSize: 12, color: '#94a3b8' }}>데이터 없음</span> : daily.map(x => (
                                            <div key={x.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`${x.d}: ${x.n}명`}>
                                                <div style={{ fontSize: 10, color: '#64748b' }}>{x.n}</div>
                                                <div style={{ width: '100%', height: Math.max(3, (x.n / maxN) * 80), background: '#38BDF8', borderRadius: 4 }} />
                                                <div style={{ fontSize: 9.5, color: '#94a3b8' }}>{String(x.d).slice(5)}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* ── 구독 퍼널 ─────────────────────────────
                                        요금제까지 오는 사람이 없는 건지(진입), 와서 안 사는 건지(설득)를 가른다. */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 8px' }}>
                                        <div style={{ fontSize: 13, fontWeight: 800, color: '#334155' }}>구독 퍼널</div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {[7, 30].map(d => (
                                                <button key={d} onClick={() => setFunnelDays(d)}
                                                    style={{
                                                        fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                                                        border: '1px solid ' + (funnelDays === d ? '#38BDF8' : '#e2e8f0'),
                                                        background: funnelDays === d ? '#E0F2FE' : '#fff',
                                                        color: funnelDays === d ? '#0369A1' : '#64748b',
                                                    }}>{d}일</button>
                                            ))}
                                        </div>
                                    </div>
                                    {funnel?._error ? (
                                        <div style={{ ...styles.resultBox, backgroundColor: '#fffbeb', color: '#b45309', marginBottom: 18 }}>{funnel._error}</div>
                                    ) : !funnel ? (
                                        <p style={{ ...styles.empty, marginBottom: 18 }}>아직 기록이 없습니다.</p>
                                    ) : (() => {
                                        const st = funnel.steps || {};
                                        const n = (k: string, f: 'users' | 'events') => Number(st?.[k]?.[f] ?? 0);
                                        const paywall = n('paywall_view', 'users');
                                        const tapped = n('subscribe_tap', 'users');
                                        const bought = n('purchase_success', 'users');
                                        const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : '-');
                                        const gates = (funnel.gateByFeature || []) as Array<{ feature: string; users: number; events: number }>;
                                        const maxGate = Math.max(1, ...gates.map(g => g.events));
                                        const FEATURE_KO: Record<string, string> = {
                                            qt: '매일 큐티', quiz: '성경 퀴즈', readingPlan: '통독 플랜', transcribe: '성경 필사',
                                            sermon: '말씀 노트', community: '기도·간증', letter: '기도 편지', ai: 'AI 상담',
                                            memorize: '암송', relay: '릴레이 기도', group: '소그룹·챌린지',
                                        };
                                        return (
                                            <>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                                                    <Box label="잠긴 기능 안내를 봄" value={String(n('gate_view', 'users'))} sub={`${n('gate_view', 'events')}회`} />
                                                    <Box label="요금제 화면 진입" value={String(paywall)} sub={`${n('paywall_view', 'events')}회`} />
                                                    <Box label="결제 시도" value={String(tapped)} sub={`진입 대비 ${pct(tapped, paywall)}`} />
                                                    <Box label="결제 완료" value={String(bought)} sub={`시도 대비 ${pct(bought, tapped)}`} />
                                                </div>
                                                <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 0, marginBottom: 14 }}>
                                                    숫자는 <b>사람 수</b>(중복 제외), 작은 글씨는 발생 횟수입니다.
                                                    진입은 많은데 결제 시도가 적으면 <b>설득</b> 문제, 진입 자체가 적으면 <b>유입</b> 문제입니다.
                                                </p>

                                                <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>어떤 기능에서 막혔나</div>
                                                <div style={{ ...styles.historyList, marginBottom: 18 }}>
                                                    {gates.length === 0 ? <p style={styles.empty}>기록이 없습니다.</p> : gates.map(g => (
                                                        <div key={g.feature} style={{ ...styles.historyItem, display: 'flex', alignItems: 'center', gap: 10 }}>
                                                            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', minWidth: 110 }}>
                                                                {FEATURE_KO[g.feature] || g.feature}
                                                            </span>
                                                            <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                                                                <div style={{ width: `${(g.events / maxGate) * 100}%`, height: '100%', background: '#38BDF8' }} />
                                                            </div>
                                                            <span style={{ fontSize: 12.5, color: '#475569', minWidth: 88, textAlign: 'right' as any }}>
                                                                {g.users}명 · {g.events}회
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        );
                                    })()}

                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>상품별 판매</div>
                                    <div style={styles.historyList}>
                                        {(S.byProduct || []).length === 0 ? <p style={styles.empty}>판매 내역이 없습니다.</p> :
                                            (S.byProduct as Array<{ productId: string; count: number; usd: number }>).map(p => (
                                                <div key={p.productId} style={{ ...styles.historyItem, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{p.productId}</span>
                                                    <span style={{ fontSize: 13, color: '#475569' }}>{p.count}건 · <b>{usd(p.usd)}</b></span>
                                                </div>
                                            ))}
                                    </div>

                                    <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 14 }}>
                                        기준 시각: {S.generatedAt ? new Date(S.generatedAt).toLocaleString('ko-KR') : '-'} ·
                                        매출은 실결제(스토어)만 집계하며, 선물·이벤트로 지급한 이용권은 제외했습니다. 스토어 정산액(수수료 차감 후)과는 다를 수 있습니다.
                                    </p>
                                </>
                            );
                        })()}
                    </div>
                )}

                {tab === 'store' && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={styles.cardTitle}>스토어</h2>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {[7, 14, 30].map(d => (
                                    <button key={d} onClick={() => setStoreDays(d)}
                                        style={{
                                            fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                                            border: '1px solid ' + (storeDays === d ? '#38BDF8' : '#e2e8f0'),
                                            background: storeDays === d ? '#E0F2FE' : '#fff',
                                            color: storeDays === d ? '#0369A1' : '#64748b',
                                        }}>{d}일</button>
                                ))}
                                <button onClick={loadStore} style={styles.refreshBtn}>새로고침</button>
                            </div>
                        </div>
                        {storeError ? (
                            <div style={{ ...styles.resultBox, backgroundColor: '#fef2f2', color: '#ef4444' }}>{storeError}</div>
                        ) : storeLoading || !store ? (
                            <p style={styles.empty}>{storeLoading ? '불러오는 중…' : '데이터가 없습니다.'}</p>
                        ) : (() => {
                            const A = store.apple || {}; const G = store.google || {}; const SU = store.setup || {};
                            const Box = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
                                <div style={{ flex: '1 1 150px', minWidth: 150, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px' }}>
                                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{label}</div>
                                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{value}</div>
                                    {sub && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
                                </div>
                            );
                            const Notice = ({ text }: { text: string }) => (
                                <div style={{ ...styles.resultBox, backgroundColor: '#fffbeb', color: '#b45309', marginBottom: 14, fontSize: 13 }}>{text}</div>
                            );
                            const daily = (A.daily || []) as Array<any>;
                            const maxD = Math.max(1, ...daily.map(x => x.downloads || 0));
                            const stars = (n: number) => '★'.repeat(Math.round(n)) + '☆'.repeat(Math.max(0, 5 - Math.round(n)));
                            return (
                                <>
                                    {!SU.apple && <Notice text="애플 미설정 — APPLE_ASC_ISSUER_ID · APPLE_ASC_KEY_ID · APPLE_ASC_PRIVATE_KEY 를 넣어주세요." />}
                                    {SU.apple && !SU.appleSales && <Notice text="애플 다운로드·매출은 벤더 번호가 있어야 합니다 — APPLE_ASC_VENDOR_NUMBER (App Store Connect → 지급 및 재무 보고서)." />}
                                    {!SU.google && <Notice text="구글 미설정 — GOOGLE_SERVICE_ACCOUNT_JSON 을 넣어주세요." />}
                                    {SU.google && !SU.googleInstalls && <Notice text="구글 설치 수는 리포트 버킷이 있어야 합니다 — GOOGLE_PLAY_REPORT_BUCKET (Play Console → 다운로드 → 보고서의 gs:// 이름)." />}

                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>🍎 App Store · 최근 {store.days}일</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                                        <Box label="신규 다운로드" value={String(A.totals?.downloads ?? 0)} sub={`업데이트 ${A.totals?.updates ?? 0}`} />
                                        <Box label="인앱 결제" value={`${A.totals?.iapUnits ?? 0}건`} />
                                        <Box label="개발자 수익" value={`${(A.totals?.proceeds ?? 0).toFixed(2)} ${A.totals?.currency || ''}`} sub="애플 수수료 차감 후" />
                                        <Box label="별점 (KR)" value={A.rating ? `${A.rating.average.toFixed(1)}` : '-'} sub={A.rating ? `리뷰 ${A.rating.count}개` : '평가 없음'} />
                                    </div>

                                    {daily.length > 0 && (
                                        <>
                                            <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>일별 다운로드 (애플)</div>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, padding: '8px 4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 18 }}>
                                                {daily.map((x: any) => (
                                                    <div key={x.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} title={`${x.date}: 설치 ${x.downloads} · 수익 ${x.proceeds}`}>
                                                        <div style={{ fontSize: 10, color: '#64748b' }}>{x.downloads}</div>
                                                        <div style={{ width: '100%', height: Math.max(3, (x.downloads / maxD) * 80), background: '#0f172a', borderRadius: 4 }} />
                                                        <div style={{ fontSize: 9.5, color: '#94a3b8' }}>{String(x.date).slice(5)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>🤖 Google Play</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                                        <Box label="이번 달 설치" value={G.installs ? String(G.installs.installs) : '-'} sub={G.installs ? `삭제 ${G.installs.uninstalls}` : '버킷 미설정'} />
                                        <Box label="지난 달 설치" value={G.installsPrev ? String(G.installsPrev.installs) : '-'} sub={G.installsPrev ? `삭제 ${G.installsPrev.uninstalls}` : ''} />
                                        <Box label="별점 (최근 리뷰)" value={G.rating ? `${G.rating.average.toFixed(1)}` : '-'} sub={G.rating ? `${G.rating.count}개 평균` : '리뷰 없음'} />
                                    </div>

                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#334155', margin: '4px 0 8px' }}>최근 리뷰</div>
                                    <div style={styles.historyList}>
                                        {(store.reviews || []).length === 0 ? <p style={styles.empty}>아직 리뷰가 없습니다.</p> :
                                            (store.reviews as Array<any>).map((r, i) => (
                                                <div key={i} style={{ ...styles.historyItem }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                        <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: r.store === 'apple' ? '#0f172a' : '#DCFCE7', color: r.store === 'apple' ? '#fff' : '#166534' }}>
                                                            {r.store === 'apple' ? 'App Store' : 'Play'}
                                                        </span>
                                                        <span style={{ fontSize: 13, color: '#f59e0b', letterSpacing: 1 }}>{stars(r.rating)}</span>
                                                        <span style={{ fontSize: 11.5, color: '#94a3b8', marginLeft: 'auto' }}>
                                                            {r.at ? new Date(r.at).toLocaleDateString('ko-KR') : ''}
                                                        </span>
                                                    </div>
                                                    {r.title && <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{r.title}</div>}
                                                    <div style={{ fontSize: 13, color: '#475569', whiteSpace: 'pre-wrap' }}>{r.body}</div>
                                                    {r.author && <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 3 }}>— {r.author}{r.territory ? ` · ${r.territory}` : ''}</div>}
                                                </div>
                                            ))}
                                    </div>

                                    <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 14 }}>
                                        기준 시각: {store.generatedAt ? new Date(store.generatedAt).toLocaleString('ko-KR') : '-'} ·
                                        애플 판매 리포트는 1~2일 지연됩니다. 구글 리뷰는 최근 1주일치만 제공됩니다(구글 정책).
                                        앱 내 실매출은 <b>통계</b> 탭이 더 정확하고 즉시 반영됩니다.
                                    </p>
                                </>
                            );
                        })()}
                    </div>
                )}

                {tab === 'recent' && (
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <h2 style={styles.cardTitle}>최근 가입자 {recentUsers.length > 0 && <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>({recentPage * 100 + 1}–{recentPage * 100 + recentUsers.length}번째)</span>}</h2>
                            <button onClick={() => loadRecent(recentPage)} style={styles.refreshBtn}>새로고침</button>
                        </div>
                        {recentError ? (
                            <div style={{ ...styles.resultBox, backgroundColor: '#fef2f2', color: '#ef4444' }}>{recentError}</div>
                        ) : recentLoading ? (
                            <p style={styles.empty}>불러오는 중…</p>
                        ) : recentUsers.length === 0 ? (
                            <p style={styles.empty}>가입자가 없습니다.</p>
                        ) : (
                            <>
                                <div style={styles.historyList}>
                                    {recentUsers.map((u, i) => (
                                        <div key={u.id} style={{ ...styles.historyItem, display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 700, minWidth: 34, textAlign: 'right' as any }}>
                                                {recentPage * 100 + i + 1}
                                            </span>
                                            {u.avatar_url
                                                ? <img src={u.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: 18, objectFit: 'cover', flexShrink: 0 }} />
                                                : <span style={{ width: 36, height: 36, borderRadius: 18, background: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#94a3b8' }}>👤</span>}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a' }}>
                                                    {u.full_name || '(이름 없음)'}
                                                    {u.church_name && <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginLeft: 8 }}>· {u.church_name}</span>}
                                                </div>
                                                <div style={{ fontSize: 12.5, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as any }}>
                                                    {u.email || u.id.slice(0, 8)}
                                                </div>
                                            </div>
                                            <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0, textAlign: 'right' as any }}>
                                                {new Date(u.created_at).toLocaleString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
                                    <button
                                        onClick={() => loadRecent(recentPage - 1)}
                                        disabled={recentPage === 0 || recentLoading}
                                        style={{ ...styles.secondaryBtn, flex: 'none', padding: '10px 18px', opacity: recentPage === 0 ? 0.4 : 1 }}
                                    >← 이전 100명</button>
                                    <span style={{ fontSize: 13, color: '#64748b' }}>{recentPage + 1} 페이지</span>
                                    <button
                                        onClick={() => loadRecent(recentPage + 1)}
                                        disabled={!recentHasMore || recentLoading}
                                        style={{ ...styles.secondaryBtn, flex: 'none', padding: '10px 18px', opacity: !recentHasMore ? 0.4 : 1 }}
                                    >다음 100명 →</button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {tab === 'gift' && (
                    <>
                        <div style={styles.card}>
                            <h2 style={styles.cardTitle}>이용권 발급</h2>
                            <p style={styles.cardDesc}>대상 사용자를 검색하고 이용권을 발급합니다. 발급된 이용권은 사용자의 보관함에 추가되어 본인이 사용하거나 다른 사람에게 선물할 수 있습니다.</p>

                            <label style={styles.label}>대상 사용자 검색 (이메일 또는 이름)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input placeholder="예: pastor@example.com 또는 이름 일부" value={userSearchQuery} onChange={e => setUserSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUserSearch()} style={{ ...styles.input, flex: 1 }} />
                                <button onClick={handleUserSearch} disabled={searching} style={{ ...styles.secondaryBtn, flex: 'none', padding: '12px 20px' }}>
                                    {searching ? '검색...' : '검색'}
                                </button>
                            </div>

                            {searchResults.length > 0 && (
                                <>
                                    <p style={styles.dupHint}>같은 이름이 여러 명이면 프로필 사진 · 소속 교회 · 이메일로 구분하세요.</p>
                                    <div style={styles.searchResults}>
                                        {searchResults.map(u => (
                                            <button key={u.id} onClick={() => { setSelectedUser(u); setSearchResults([]); }} style={styles.searchResultItem}>
                                                {u.avatar_url
                                                    ? <img src={u.avatar_url} alt="" style={styles.searchAvatar} />
                                                    : <div style={{ ...styles.searchAvatar, ...styles.searchAvatarFallback }}>{(u.full_name || '?').slice(0, 1)}</div>}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{u.full_name || '(이름 없음)'}</div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                                        {u.church_name && <span style={styles.churchChip}>⛪ {u.church_name}</span>}
                                                        <span style={{ fontSize: 12, color: '#64748b' }}>{u.email || u.id}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {selectedUser && (
                                <div style={styles.selectedUser}>
                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>선택된 사용자</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                            {selectedUser.avatar_url
                                                ? <img src={selectedUser.avatar_url} alt="" style={styles.searchAvatar} />
                                                : <div style={{ ...styles.searchAvatar, ...styles.searchAvatarFallback }}>{(selectedUser.full_name || '?').slice(0, 1)}</div>}
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>{selectedUser.full_name || '(이름 없음)'}</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                                    {selectedUser.church_name && <span style={styles.churchChip}>⛪ {selectedUser.church_name}</span>}
                                                    <span style={{ fontSize: 12, color: '#64748b' }}>{selectedUser.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedUser(null)} style={styles.clearBtn}>변경</button>
                                    </div>
                                </div>
                            )}

                            {/* 이용권 종류 — 여러 SKU 동시 수량 선택 */}
                            <label style={styles.label}>이용권 종류와 수량 (여러 종류 한 번에 발급 가능)</label>
                            <div style={{ marginTop: 8 }}>
                                {SKU_SECTIONS.map(section => (
                                    <div key={section.title} style={{ marginBottom: 16 }}>
                                        <div style={styles.skuSectionTitle}>{section.title}</div>
                                        <div style={styles.skuList}>
                                            {section.keys.map(key => {
                                                const sku = GIFTABLE_SKUS.find(s => s.key === key)!;
                                                const qty = quantities[key] || '';
                                                const qtyNum = parseInt(qty || '0', 10) || 0;
                                                const active = qtyNum > 0;
                                                return (
                                                    <div key={key} style={{ ...styles.skuRow, ...(active ? styles.skuRowActive : {}) }}>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={styles.skuLabel}>{sku.label}</div>
                                                            <div style={styles.skuPrice}>${sku.price.toFixed(2)}{qtyNum > 0 && ` × ${qtyNum} = $${(sku.price * qtyNum).toFixed(2)}`}</div>
                                                        </div>
                                                        <div style={styles.qtyControl}>
                                                            <button type="button" onClick={() => decQty(key)} style={styles.qtyBtn} disabled={qtyNum === 0}>−</button>
                                                            <input
                                                                value={qty}
                                                                onChange={e => setQty(key, e.target.value)}
                                                                placeholder="0"
                                                                style={styles.qtyInput}
                                                                inputMode="numeric"
                                                            />
                                                            <button type="button" onClick={() => incQty(key)} style={styles.qtyBtn}>+</button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 합계 요약 */}
                            {totalCount > 0 && (
                                <div style={styles.summaryBox}>
                                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>
                                        총 {totalCount}장 · 시장가치 ${totalValue.toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                                        {selectedItems.map(x => `${x.sku.label} × ${x.qty}`).join(' · ')}
                                    </div>
                                </div>
                            )}

                            <label style={styles.label}>메모 (선택, 사용자에게 표시됨)</label>
                            <input placeholder="예: 예수님께서 사랑하시는 목사님께 ROOT 운영팀 드림" value={note} onChange={e => setNote(e.target.value)} style={styles.input} />

                            <div style={styles.btnRow}>
                                <button
                                    onClick={handleGrant}
                                    disabled={granting || !selectedUser || totalCount === 0}
                                    style={(selectedUser && totalCount > 0) ? styles.primaryBtn : styles.disabledBtn}
                                >
                                    {granting ? '발급 중...' : (totalCount > 0 ? `${totalCount}장 발급` : '이용권 수량 입력')}
                                </button>
                            </div>

                            {grantResult && (
                                <div style={{ ...styles.resultBox, backgroundColor: grantResult.startsWith('❌') ? '#fef2f2' : '#f0fdf4', color: grantResult.startsWith('❌') ? '#ef4444' : '#22c55e' }}>
                                    {grantResult}
                                </div>
                            )}
                        </div>

                        {/* 크레딧 보내기 — 위에서 선택한 사용자에게 USD 크레딧 지급 */}
                        <div style={{ ...styles.card, marginTop: 16 }}>
                            <h2 style={styles.cardTitle}>크레딧 선물</h2>
                            <p style={styles.cardDesc}>위에서 선택한 사용자의 <b>받은 선물함</b>에 USD 크레딧 선물을 보냅니다. 사용자가 앱에서 직접 "충전하기"를 눌러야 잔액에 반영됩니다. 크레딧은 이용권 구매·선물에 사용됩니다.</p>

                            {!selectedUser ? (
                                <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0' }}>먼저 위에서 대상 사용자를 선택해주세요.</p>
                            ) : (
                                <div style={styles.selectedUser}>
                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>지급 대상</div>
                                    <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>{selectedUser.full_name || '(이름 없음)'}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>{selectedUser.email}</div>
                                </div>
                            )}

                            <label style={styles.label}>지급 금액 (USD)</label>
                            <input
                                type="number"
                                min={0}
                                step="0.5"
                                placeholder="예: 5"
                                value={creditAmount}
                                onChange={e => setCreditAmount(e.target.value)}
                                style={styles.input}
                                inputMode="decimal"
                            />

                            <div style={styles.btnRow}>
                                <button
                                    onClick={handleGrantCredit}
                                    disabled={grantingCredit || !selectedUser || !(Number(creditAmount) > 0)}
                                    style={(selectedUser && Number(creditAmount) > 0) ? styles.primaryBtn : styles.disabledBtn}
                                >
                                    {grantingCredit ? '지급 중...' : '크레딧 보내기'}
                                </button>
                            </div>

                            {creditResult && (
                                <div style={{ ...styles.resultBox, backgroundColor: creditResult.startsWith('❌') ? '#fef2f2' : '#f0fdf4', color: creditResult.startsWith('❌') ? '#ef4444' : '#22c55e' }}>
                                    {creditResult}
                                </div>
                            )}
                        </div>

                        <div style={{ ...styles.card, marginTop: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h2 style={styles.cardTitle}>최근 발급 이력</h2>
                                <button onClick={loadGrantHistory} style={styles.refreshBtn}>새로고침</button>
                            </div>
                            {grantHistory.length === 0 ? (
                                <p style={styles.empty}>발급 이력이 없습니다.</p>
                            ) : (
                                <div style={styles.historyList}>
                                    {grantHistory.map(g => {
                                        const isCredit = g.product_id === 'credit_usd';
                                        return (
                                            <div key={g.id} style={styles.historyItem}>
                                                <div style={styles.historyHeader}>
                                                    {isCredit ? (
                                                        <span style={{ ...styles.statusBadge, backgroundColor: '#FEF3C7', color: '#D97706' }}>크레딧 지급</span>
                                                    ) : (
                                                        <span style={{ ...styles.statusBadge, backgroundColor: '#dbeafe', color: '#2563eb' }}>{g.quantity}장 발급</span>
                                                    )}
                                                    <span style={styles.historyDate}>{new Date(g.created_at).toLocaleString('ko-KR')}</span>
                                                </div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>
                                                    {isCredit
                                                        ? `크레딧 $${Number(g.quantity).toFixed(2)}`
                                                        : `${g.product_id}${g.bible_translation ? ` (${g.bible_translation})` : ''}`}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>대상: {g.target_email || g.target_user_id}</div>
                                                {g.note && (<div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', marginTop: 4 }}>"{g.note}"</div>)}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {tab === 'pastors' && (
                    <>
                        <div style={styles.card}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                <h2 style={{ ...styles.cardTitle, marginBottom: 0 }}>사역자 등록 신청</h2>
                                <button style={styles.refreshBtn} onClick={loadPastors}>새로고침</button>
                            </div>
                            <p style={styles.cardDesc}>
                                당분간 등록은 <b>자동 활성</b>입니다. 여기서 언제 누가 신청했는지 확인하고,
                                서류를 클릭해 크게 본 뒤 필요하면 거절(비활성)할 수 있습니다.
                            </p>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                                {([['all', '전체'], ['verified', '활성'], ['rejected', '거절됨']] as const).map(([k, label]) => (
                                    <button key={k}
                                        style={pastorFilter === k ? { ...styles.chipActive } : { ...styles.chip }}
                                        onClick={() => setPastorFilter(k)}>{label}</button>
                                ))}
                            </div>
                            {pastorsLoading ? (
                                <p style={styles.empty}>불러오는 중…</p>
                            ) : (
                                (() => {
                                    const rows = pastorRows.filter(r =>
                                        pastorFilter === 'all' ? true :
                                        pastorFilter === 'verified' ? r.verification_status === 'verified' :
                                        r.verification_status === 'rejected');
                                    if (rows.length === 0) return <p style={styles.empty}>신청이 없습니다.</p>;
                                    return rows.map(r => {
                                        const docs = [
                                            ['임명장', r.ordination_certificate_url],
                                            ['교단 등록증', r.denomination_registration_url],
                                            ['주보', r.church_bulletin_url],
                                        ].filter(d => !!d[1]) as [string, string][];
                                        const isVerified = r.verification_status === 'verified';
                                        const isRejected = r.verification_status === 'rejected';
                                        return (
                                            <div key={r.id} style={styles.pastorItem}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{r.name || '이름 미입력'}</span>
                                                    {isVerified && <span style={{ ...styles.statusBadge, backgroundColor: '#dcfce7', color: '#16a34a' }}>활성{r.auto_verified ? ' (자동)' : ''}</span>}
                                                    {isRejected && <span style={{ ...styles.statusBadge, backgroundColor: '#fee2e2', color: '#dc2626' }}>거절됨</span>}
                                                    {!isVerified && !isRejected && <span style={{ ...styles.statusBadge, backgroundColor: '#fef3c7', color: '#d97706' }}>대기</span>}
                                                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{r.created_at ? new Date(r.created_at).toLocaleString('ko-KR') : ''}</span>
                                                </div>
                                                <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                                                    {[r.church_name, r.position, r.denomination].filter(Boolean).join(' · ') || '-'}
                                                </div>
                                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                                                    {[r.phone, r.email].filter(Boolean).join(' · ')}
                                                </div>
                                                {docs.length > 0 && (
                                                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                                        {docs.map(([label, url]) => (
                                                            /* eslint-disable-next-line @next/next/no-img-element */
                                                            <img key={label} src={url} alt={label} title={`${label} — 클릭하면 크게`}
                                                                onClick={() => setLightbox({ url, label })}
                                                                style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e8f0', cursor: 'zoom-in' }} />
                                                        ))}
                                                    </div>
                                                )}
                                                {docs.length === 0 && <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 8 }}>첨부 서류 없음</div>}
                                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                                    {!isRejected && (
                                                        <button style={styles.dangerSmallBtn} onClick={() => { if (confirm(`${r.name || '이 신청'} 을(를) 거절(비활성) 처리할까요?`)) setPastorStatusWeb(r.id, 'rejected'); }}>거절</button>
                                                    )}
                                                    {!isVerified && (
                                                        <button style={styles.approveSmallBtn} onClick={() => setPastorStatusWeb(r.id, 'verified')}>승인(활성)</button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    });
                                })()
                            )}
                        </div>

                        <div style={{ ...styles.card, marginTop: 16 }}>
                            <h2 style={styles.cardTitle}>사용자 등록 교회</h2>
                            <p style={styles.cardDesc}>사용자가 앱에서 직접 등록한 교회 목록입니다. 나중에 정비할 때 여기서 추리면 됩니다.</p>
                            {userChurches.length === 0 ? (
                                <p style={styles.empty}>등록된 교회가 없습니다.</p>
                            ) : userChurches.map(c => (
                                <div key={c.id} style={styles.pastorItem}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{c.name}</span>
                                        {(c.lat == null || c.lon == null) && <span style={{ ...styles.statusBadge, backgroundColor: '#fef3c7', color: '#d97706' }}>지도 좌표 없음</span>}
                                        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8' }}>{c.created_at ? new Date(c.created_at).toLocaleString('ko-KR') : ''}</span>
                                    </div>
                                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                                        {[c.denomination, c.region, c.address].filter(Boolean).join(' · ') || '-'}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                                        등록자: {[c.applicant_name, c.applicant_contact, c.creator_email].filter(Boolean).join(' · ') || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* 서류 라이트박스 — 클릭하면 원본 크기로 */}
                {lightbox && (
                    <div onClick={() => setLightbox(null)}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 24 }}>
                        <div style={{ color: '#fff', fontSize: 15, fontWeight: 800, marginBottom: 12 }}>{lightbox.label} <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: 12 }}>(클릭하면 닫힘)</span></div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={lightbox.url} alt={lightbox.label}
                            style={{ maxWidth: '95vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }} />
                        <a href={lightbox.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            style={{ marginTop: 14, color: '#a5b4fc', fontSize: 13, fontWeight: 700 }}>원본 새 탭에서 열기 ↗</a>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    pastorItem: { border: '1px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', marginBottom: 10 },
    chip: { padding: '7px 14px', borderRadius: 999, border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: 13, fontWeight: 700, color: '#94a3b8', cursor: 'pointer' },
    chipActive: { padding: '7px 14px', borderRadius: 999, border: '1px solid #6366f1', backgroundColor: '#eef2ff', fontSize: 13, fontWeight: 700, color: '#6366f1', cursor: 'pointer' },
    approveSmallBtn: { padding: '9px 18px', borderRadius: 10, backgroundColor: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer' },
    dangerSmallBtn: { padding: '9px 18px', borderRadius: 10, backgroundColor: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 800, border: '1.5px solid #fecaca', cursor: 'pointer' },
    container: { minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 20 },
    loginCard: { backgroundColor: '#fff', borderRadius: 20, padding: 40, maxWidth: 400, width: '100%', margin: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' as const },
    loginTitle: { fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 },
    loginDesc: { fontSize: 14, color: '#94a3b8', marginBottom: 24 },
    main: { maxWidth: 720, width: '100%', margin: '0 auto' },
    pageTitle: { fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 20 },
    tabRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const },
    tab: { flex: 1, minWidth: 120, padding: '12px 0', border: '2px solid #e2e8f0', borderRadius: 12, backgroundColor: '#fff', fontSize: 14, fontWeight: 700, color: '#94a3b8', cursor: 'pointer' },
    tabActive: { flex: 1, minWidth: 120, padding: '12px 0', border: '2px solid #6366f1', borderRadius: 12, backgroundColor: '#eef2ff', fontSize: 14, fontWeight: 700, color: '#6366f1', cursor: 'pointer' },
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    cardTitle: { fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 8, marginTop: 0 },
    cardDesc: { fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.6 },
    label: { fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', marginTop: 12 },
    input: { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 14, color: '#1e293b', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 4 },
    btnRow: { display: 'flex', gap: 10, marginTop: 20 },
    primaryBtn: { flex: 1, padding: '14px 0', borderRadius: 14, backgroundColor: '#6366f1', color: '#fff', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer' },
    secondaryBtn: { flex: 1, padding: '14px 0', borderRadius: 14, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer' },
    disabledBtn: { flex: 1, padding: '14px 0', borderRadius: 14, backgroundColor: '#cbd5e1', color: '#fff', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'not-allowed' },
    refreshBtn: { padding: '8px 16px', borderRadius: 10, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' },
    clearBtn: { padding: '6px 12px', borderRadius: 8, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' },
    resultBox: { marginTop: 16, padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 700, textAlign: 'center' as const },
    empty: { textAlign: 'center' as const, color: '#94a3b8', padding: 40 },
    historyList: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
    historyItem: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, border: '1px solid #f1f5f9' },
    historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    statusBadge: { padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800 },
    historyDate: { fontSize: 12, color: '#94a3b8' },
    historyTitle: { fontSize: 15, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' },
    historyBody: { fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 },
    historyMeta: { display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: '#94a3b8' },
    searchResults: { marginTop: 8, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', maxHeight: 280, overflowY: 'auto' as const },
    searchResultItem: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', textAlign: 'left' as const, backgroundColor: '#fff', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
    dupHint: { fontSize: 12, color: '#94a3b8', margin: '8px 2px 0', lineHeight: 1.5 },
    searchAvatar: { width: 36, height: 36, borderRadius: 18, objectFit: 'cover' as const, flex: 'none', backgroundColor: '#eef2ff' },
    searchAvatarFallback: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: '#6366f1', textTransform: 'uppercase' as const },
    churchChip: { fontSize: 11, fontWeight: 700, color: '#4338ca', backgroundColor: '#eef2ff', padding: '2px 7px', borderRadius: 7 },
    selectedUser: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' },

    // 다중 SKU 발급
    skuSectionTitle: { fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 },
    skuList: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
    skuRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', backgroundColor: '#fff' },
    skuRowActive: { borderColor: '#6366f1', backgroundColor: '#eef2ff' },
    skuLabel: { fontSize: 13.5, fontWeight: 700, color: '#1e293b' },
    skuPrice: { fontSize: 11.5, color: '#64748b', marginTop: 2 },
    qtyControl: { display: 'flex', alignItems: 'center', gap: 4 },
    qtyBtn: { width: 28, height: 28, borderRadius: 8, border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: 16, fontWeight: 800, color: '#475569', cursor: 'pointer', padding: 0 },
    qtyInput: { width: 44, height: 28, borderRadius: 8, border: '1px solid #cbd5e1', textAlign: 'center' as const, fontSize: 14, fontWeight: 700, color: '#1e293b', padding: 0, boxSizing: 'border-box' as const, outline: 'none' },
    summaryBox: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' },
};
