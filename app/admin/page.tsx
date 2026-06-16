'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { Session } from '@supabase/supabase-js';

// 관리자 이메일 화이트리스트 (정확 일치 필요)
// 환경변수 NEXT_PUBLIC_ADMIN_EMAILS (쉼표 구분) 없으면 기본값
const ADMIN_EMAILS_CLIENT = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'master@root2christ.com')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

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
    { key: 'test_faith_checkup', productId: 'test_faith_checkup', label: '신앙심 테스트', price: 1 },
    { key: 'test_christ_basic',  productId: 'test_christ_basic',  label: '크라이스트 테스트', price: 1.49 },
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
    { title: '단품 테스트', keys: ['test_faith_checkup', 'test_christ_basic', 'analysis_deep'] },
    { title: '구독', keys: ['sub_monthly', 'sub_yearly'] },
    { title: '성경 평생소장', keys: ['bible_korean_all'] },
];

type TabKey = 'send' | 'history' | 'gift';

export default function AdminPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);

    const [loginEmail, setLoginEmail] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState(''); // check-permission 실패 시에만 사용

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

    // 세션 확인 + 권한 검증 (admin 아니면 자동 로그아웃)
    useEffect(() => {
        const verifyAndSet = async (s: Session | null) => {
            if (!s) {
                setSession(null);
                setCheckingSession(false);
                return;
            }
            // 서버에서 admin 권한 확인
            try {
                const res = await fetch('/api/admin/check-permission', {
                    headers: { 'Authorization': `Bearer ${s.access_token}` },
                });
                if (res.ok) {
                    setSession(s);
                } else {
                    // 비admin이 어쩌다 토큰 얻어도 즉시 로그아웃
                    await supabase.auth.signOut();
                    setSession(null);
                    setLoginError('관리자 권한이 없는 계정입니다.');
                }
            } catch {
                setSession(s); // 네트워크 에러면 일단 두고 API 호출 시 재검증
            } finally {
                setCheckingSession(false);
            }
        };

        supabase.auth.getSession().then(({ data }) => verifyAndSet(data.session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => verifyAndSet(s));
        return () => subscription.unsubscribe();
    }, []);

    // 공통 fetch (토큰 자동 첨부)
    const authedFetch = useCallback(async (url: string, init?: RequestInit) => {
        const token = session?.access_token;
        if (!token) throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
        return fetch(url, {
            ...init,
            headers: {
                ...(init?.headers || {}),
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    }, [session]);

    const loadHistory = useCallback(async () => {
        try {
            const res = await fetch('/api/push'); // GET은 토큰 없어도 동작 (이력 조회)
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch { }
    }, []);

    const loadGrantHistory = useCallback(async () => {
        if (!session) return;
        try {
            const res = await authedFetch('/api/admin/gift-inventory');
            const data = await res.json();
            setGrantHistory(data.grants || []);
        } catch { }
    }, [authedFetch, session]);

    useEffect(() => {
        if (!session) return;
        if (tab === 'history') loadHistory();
        if (tab === 'gift') loadGrantHistory();
    }, [session, tab, loadHistory, loadGrantHistory]);

    // ── 로그인 ──
    // 보안: 입력이 admin이든 아니든 응답·시간·UI 완전 동일 (해커가 admin 여부 추측 불가)
    const handleLogin = async () => {
        const email = loginEmail.trim().toLowerCase();

        setLoggingIn(true);
        setLoginError('');

        const startTime = Date.now();
        const isAdmin = ADMIN_EMAILS_CLIENT.includes(email);

        if (isAdmin) {
            // 실제 서버 호출 → Magic Link 발송
            try {
                await fetch('/api/admin/send-magic-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
            } catch {
                // 에러 메시지 표시 X (정보 노출 방지)
            }
        }

        // 시간 동기화 — admin이든 아니든 동일하게 600~900ms 후 응답
        // (실제 서버 호출이 더 오래 걸리면 그대로, 짧으면 패딩)
        const elapsed = Date.now() - startTime;
        const minDuration = 700 + Math.random() * 200; // 700~900ms
        if (elapsed < minDuration) {
            await new Promise(r => setTimeout(r, minDuration - elapsed));
        }

        // 항상 동일한 UI 변화 (메시지 X, 단순히 입력란 비움)
        setLoginEmail('');
        setLoggingIn(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
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

    if (!session) {
        return (
            <div style={styles.container}>
                <div style={styles.loginCard}>
                    <h1 style={styles.loginTitle}>soluma 관리자</h1>
                    <input
                        type="text"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !loggingIn && handleLogin()}
                        style={{ ...styles.input, marginTop: 20 }}
                        disabled={loggingIn}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                    />
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
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{session.user.email}</p>
                    </div>
                    <button onClick={handleLogout} style={styles.refreshBtn}>로그아웃</button>
                </div>

                <div style={styles.tabRow}>
                    <button style={tab === 'send' ? styles.tabActive : styles.tab} onClick={() => setTab('send')}>푸시 알림 보내기</button>
                    <button style={tab === 'history' ? styles.tabActive : styles.tab} onClick={() => setTab('history')}>발송 이력</button>
                    <button style={tab === 'gift' ? styles.tabActive : styles.tab} onClick={() => setTab('gift')}>이용권 보내기</button>
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
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
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
