'use client';

import { useState, useEffect, useCallback } from 'react';

// 비밀번호는 서버에서만 검증 (Vercel 환경변수 pwSession)
// 클라이언트는 입력값을 sessionStorage에 저장하고 모든 API 호출 시 함께 전송 (서버에서 매번 검증)
const SESSION_KEY = 'admin_pw_session';

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

const GIFTABLE_PRODUCTS = [
    { id: 'test_faith_checkup',  label: '신앙심 테스트',          price: '$1' },
    { id: 'test_christ_basic',   label: '크라이스트 테스트',      price: '$1.5' },
    { id: 'analysis_deep',       label: '심층 분석',              price: '$3' },
    { id: 'sub_monthly',         label: '월 구독',                price: '$2' },
    { id: 'sub_yearly',          label: '연 구독 (심층분석 4회)', price: '$20' },
    { id: 'bible_lifetime',      label: '성경 평생 소장권',        price: '$6', needsBible: true },
];

const BIBLE_TRANSLATIONS = [
    { id: 'korean_krv', label: '개역개정' },
    { id: 'korean_new', label: '새번역' },
    { id: 'english_niv', label: 'NIV (영문)' },
    { id: 'english_esv', label: 'ESV (영문)' },
];

type TabKey = 'send' | 'history' | 'gift';

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [pwSession, setPwSession] = useState<string>(''); // 인증된 비밀번호 (API 호출용)
    const [adminEmail, setAdminEmail] = useState('master@root2christ.com');
    const [tab, setTab] = useState<TabKey>('send');

    // 페이지 로드 시 sessionStorage에서 비밀번호 복원
    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(SESSION_KEY);
            if (saved) {
                setPwSession(saved);
                setAuthed(true);
            }
        } catch { }
    }, []);

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
    const [productId, setProductId] = useState('test_christ_basic');
    const [bibleTranslation, setBibleTranslation] = useState('korean_krv');
    const [quantity, setQuantity] = useState('1');
    const [note, setNote] = useState('');
    const [granting, setGranting] = useState(false);
    const [grantResult, setGrantResult] = useState('');
    const [grantHistory, setGrantHistory] = useState<GiftGrant[]>([]);

    const loadHistory = useCallback(async () => {
        try {
            const res = await fetch('/api/push');
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch { }
    }, []);

    const loadGrantHistory = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/gift-inventory?password=${encodeURIComponent(pwSession)}`);
            const data = await res.json();
            setGrantHistory(data.grants || []);
        } catch { }
    }, []);

    useEffect(() => {
        if (!authed) return;
        if (tab === 'history') loadHistory();
        if (tab === 'gift') loadGrantHistory();
    }, [authed, tab, loadHistory, loadGrantHistory]);

    const handleLogin = async () => {
        if (!password) return;
        setLoggingIn(true);
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (res.ok) {
                setPwSession(password);
                setAuthed(true);
                try { sessionStorage.setItem(SESSION_KEY, password); } catch { }
                setPassword('');
            } else {
                alert('비밀번호가 올바르지 않습니다.');
            }
        } catch (e: any) {
            alert(`오류: ${e?.message || '서버 오류'}`);
        } finally {
            setLoggingIn(false);
        }
    };

    const handleLogout = () => {
        setAuthed(false);
        setPwSession('');
        try { sessionStorage.removeItem(SESSION_KEY); } catch { }
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
            const res = await fetch('/api/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: pwSession,
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
        if (q.length < 2) {
            alert('검색어를 2자 이상 입력해주세요.');
            return;
        }
        setSearching(true);
        setSearchResults([]);
        try {
            const res = await fetch('/api/admin/user-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwSession, query: q }),
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
        if (!selectedUser) {
            alert('대상 사용자를 먼저 선택해주세요.');
            return;
        }
        const qty = parseInt(quantity, 10);
        if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
            alert('수량은 1-99 사이로 입력해주세요.');
            return;
        }

        const selectedProduct = GIFTABLE_PRODUCTS.find(p => p.id === productId);
        const productLabel = selectedProduct?.needsBible
            ? `성경 평생 소장권 (${BIBLE_TRANSLATIONS.find(b => b.id === bibleTranslation)?.label})`
            : selectedProduct?.label;

        if (!confirm(
            `[발급 확인]\n\n` +
            `대상: ${selectedUser.full_name || '(이름 없음)'} (${selectedUser.email || selectedUser.id.slice(0, 8)})\n` +
            `상품: ${productLabel}\n` +
            `수량: ${qty}장\n` +
            `메모: ${note.trim() || '(없음)'}\n\n` +
            `발급하시겠습니까?`
        )) return;

        setGranting(true);
        setGrantResult('');
        try {
            const res = await fetch('/api/admin/gift-inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: pwSession,
                    adminEmail,
                    targetUserId: selectedUser.id,
                    targetEmail: selectedUser.email,
                    productId: selectedProduct?.needsBible ? 'bible_lifetime_' : productId,
                    bibleTranslation: selectedProduct?.needsBible ? bibleTranslation : undefined,
                    quantity: qty,
                    note: note.trim() || undefined,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setGrantResult(`✅ ${data.granted}장 발급 완료 → ${selectedUser.email || selectedUser.full_name}`);
                setNote('');
                setQuantity('1');
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

    // ── 렌더 ──

    if (!authed) {
        return (
            <div style={styles.container}>
                <div style={styles.loginCard}>
                    <h1 style={styles.loginTitle}>예닮 관리자</h1>
                    <p style={styles.loginDesc}>관리자 비밀번호를 입력하세요</p>
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !loggingIn && handleLogin()}
                        style={styles.input}
                        disabled={loggingIn}
                    />
                    <button onClick={handleLogin} disabled={loggingIn} style={styles.primaryBtn}>
                        {loggingIn ? '확인 중...' : '로그인'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.main}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h1 style={{ ...styles.pageTitle, marginBottom: 0 }}>예닮 관리자</h1>
                    <button onClick={handleLogout} style={styles.refreshBtn}>로그아웃</button>
                </div>

                <div style={styles.tabRow}>
                    <button style={tab === 'send' ? styles.tabActive : styles.tab} onClick={() => setTab('send')}>
                        푸시 알림 보내기
                    </button>
                    <button style={tab === 'history' ? styles.tabActive : styles.tab} onClick={() => setTab('history')}>
                        발송 이력
                    </button>
                    <button style={tab === 'gift' ? styles.tabActive : styles.tab} onClick={() => setTab('gift')}>
                        이용권 보내기
                    </button>
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

                            {/* 관리자 이메일 (감사 로그용) */}
                            <label style={styles.label}>관리자 식별 (감사 기록용)</label>
                            <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} style={styles.input} />

                            {/* 사용자 검색 */}
                            <label style={styles.label}>대상 사용자 검색 (이메일 또는 이름)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    placeholder="예: pastor@example.com 또는 이름 일부"
                                    value={userSearchQuery}
                                    onChange={e => setUserSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleUserSearch()}
                                    style={{ ...styles.input, flex: 1 }}
                                />
                                <button onClick={handleUserSearch} disabled={searching} style={{ ...styles.secondaryBtn, flex: 'none', padding: '12px 20px' }}>
                                    {searching ? '검색...' : '검색'}
                                </button>
                            </div>

                            {/* 검색 결과 */}
                            {searchResults.length > 0 && (
                                <div style={styles.searchResults}>
                                    {searchResults.map(u => (
                                        <button
                                            key={u.id}
                                            onClick={() => { setSelectedUser(u); setSearchResults([]); }}
                                            style={styles.searchResultItem}
                                        >
                                            <div style={{ fontWeight: 700, color: '#1e293b' }}>
                                                {u.full_name || '(이름 없음)'}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#64748b' }}>
                                                {u.email || u.id}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* 선택된 사용자 */}
                            {selectedUser && (
                                <div style={styles.selectedUser}>
                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>선택된 사용자</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: 15, color: '#1e293b' }}>
                                                {selectedUser.full_name || '(이름 없음)'}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#64748b' }}>{selectedUser.email}</div>
                                        </div>
                                        <button onClick={() => setSelectedUser(null)} style={styles.clearBtn}>변경</button>
                                    </div>
                                </div>
                            )}

                            {/* 상품 선택 */}
                            <label style={styles.label}>이용권 종류</label>
                            <select value={productId} onChange={e => setProductId(e.target.value)} style={styles.input}>
                                {GIFTABLE_PRODUCTS.map(p => (
                                    <option key={p.id} value={p.id}>{p.label} ({p.price})</option>
                                ))}
                            </select>

                            {/* 성경 평생 소장권일 경우 번역본 선택 */}
                            {GIFTABLE_PRODUCTS.find(p => p.id === productId)?.needsBible && (
                                <>
                                    <label style={styles.label}>번역본</label>
                                    <select value={bibleTranslation} onChange={e => setBibleTranslation(e.target.value)} style={styles.input}>
                                        {BIBLE_TRANSLATIONS.map(b => (
                                            <option key={b.id} value={b.id}>{b.label}</option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {/* 수량 */}
                            <label style={styles.label}>수량 (1-99장)</label>
                            <input type="number" min={1} max={99} value={quantity} onChange={e => setQuantity(e.target.value)} style={styles.input} />

                            {/* 메모 */}
                            <label style={styles.label}>메모 (선택, 사용자에게 표시됨)</label>
                            <input placeholder="예: 예수님께서 사랑하시는 목사님께 ROOT 운영팀 드림" value={note} onChange={e => setNote(e.target.value)} style={styles.input} />

                            <div style={styles.btnRow}>
                                <button onClick={handleGrant} disabled={granting || !selectedUser} style={selectedUser ? styles.primaryBtn : styles.disabledBtn}>
                                    {granting ? '발급 중...' : '이용권 발급'}
                                </button>
                            </div>

                            {grantResult && (
                                <div style={{ ...styles.resultBox, backgroundColor: grantResult.startsWith('❌') ? '#fef2f2' : '#f0fdf4', color: grantResult.startsWith('❌') ? '#ef4444' : '#22c55e' }}>
                                    {grantResult}
                                </div>
                            )}
                        </div>

                        {/* 최근 발급 이력 */}
                        <div style={{ ...styles.card, marginTop: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h2 style={styles.cardTitle}>최근 발급 이력</h2>
                                <button onClick={loadGrantHistory} style={styles.refreshBtn}>새로고침</button>
                            </div>
                            {grantHistory.length === 0 ? (
                                <p style={styles.empty}>발급 이력이 없습니다.</p>
                            ) : (
                                <div style={styles.historyList}>
                                    {grantHistory.map(g => (
                                        <div key={g.id} style={styles.historyItem}>
                                            <div style={styles.historyHeader}>
                                                <span style={{ ...styles.statusBadge, backgroundColor: '#dbeafe', color: '#2563eb' }}>
                                                    {g.quantity}장 발급
                                                </span>
                                                <span style={styles.historyDate}>{new Date(g.created_at).toLocaleString('ko-KR')}</span>
                                            </div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 4 }}>
                                                {g.product_id}{g.bible_translation ? ` (${g.bible_translation})` : ''}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                                대상: {g.target_email || g.target_user_id}
                                            </div>
                                            {g.note && (
                                                <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', marginTop: 4 }}>
                                                    "{g.note}"
                                                </div>
                                            )}
                                        </div>
                                    ))}
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
    searchResults: { marginTop: 8, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' as const },
    searchResultItem: { display: 'block', width: '100%', padding: '12px 16px', textAlign: 'left' as const, backgroundColor: '#fff', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' },
    selectedUser: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' },
};
