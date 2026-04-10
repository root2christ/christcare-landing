'use client';

import { useState, useEffect } from 'react';

const ADMIN_PW = 'Seiehjw1!@';

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

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [tab, setTab] = useState<'send' | 'history'>('send');

    const loadHistory = async () => {
        try {
            const res = await fetch('/api/push');
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch { }
    };

    useEffect(() => {
        if (authed) loadHistory();
    }, [authed, tab]);

    const handleLogin = () => {
        if (password === ADMIN_PW) {
            setAuthed(true);
        } else {
            alert('비밀번호가 올바르지 않습니다.');
        }
    };

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
                    password: ADMIN_PW,
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
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                        style={styles.input}
                    />
                    <button onClick={handleLogin} style={styles.primaryBtn}>로그인</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.main}>
                <h1 style={styles.pageTitle}>예닮 관리자</h1>

                {/* 탭 */}
                <div style={styles.tabRow}>
                    <button
                        style={tab === 'send' ? styles.tabActive : styles.tab}
                        onClick={() => setTab('send')}
                    >
                        푸시 알림 보내기
                    </button>
                    <button
                        style={tab === 'history' ? styles.tabActive : styles.tab}
                        onClick={() => setTab('history')}
                    >
                        발송 이력
                    </button>
                </div>

                {tab === 'send' && (
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>푸시 알림 보내기</h2>

                        <label style={styles.label}>제목</label>
                        <input
                            placeholder="알림 제목"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={styles.input}
                        />

                        <label style={styles.label}>내용</label>
                        <textarea
                            placeholder="알림 내용을 입력하세요"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={4}
                            style={{ ...styles.input, resize: 'vertical' as any }}
                        />

                        <label style={styles.label}>예약 발송 (선택)</label>
                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={e => setScheduledAt(e.target.value)}
                            style={styles.input}
                        />

                        <div style={styles.btnRow}>
                            <button
                                onClick={() => handleSend(false)}
                                disabled={sending}
                                style={styles.primaryBtn}
                            >
                                {sending ? '발송 중...' : '즉시 발송'}
                            </button>
                            <button
                                onClick={() => handleSend(true)}
                                disabled={sending}
                                style={styles.secondaryBtn}
                            >
                                {sending ? '처리 중...' : '예약 발송'}
                            </button>
                        </div>

                        {result && (
                            <div style={{
                                ...styles.resultBox,
                                backgroundColor: result.includes('오류') ? '#fef2f2' : '#f0fdf4',
                                color: result.includes('오류') ? '#ef4444' : '#22c55e',
                            }}>
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
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: n.status === 'sent' ? '#dcfce7' : n.status === 'scheduled' ? '#fef3c7' : '#f1f5f9',
                                                color: n.status === 'sent' ? '#16a34a' : n.status === 'scheduled' ? '#d97706' : '#64748b',
                                            }}>
                                                {n.status === 'sent' ? '발송완료' : n.status === 'scheduled' ? '예약중' : n.status}
                                            </span>
                                            <span style={styles.historyDate}>
                                                {new Date(n.created_at).toLocaleString('ko-KR')}
                                            </span>
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
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 20,
    },
    loginCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 40,
        maxWidth: 400,
        width: '100%',
        margin: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center' as const,
    },
    loginTitle: { fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 8 },
    loginDesc: { fontSize: 14, color: '#94a3b8', marginBottom: 24 },
    main: { maxWidth: 640, width: '100%', margin: '0 auto' },
    pageTitle: { fontSize: 24, fontWeight: 900, color: '#1e293b', marginBottom: 20 },
    tabRow: { display: 'flex', gap: 8, marginBottom: 20 },
    tab: {
        flex: 1,
        padding: '12px 0',
        border: '2px solid #e2e8f0',
        borderRadius: 12,
        backgroundColor: '#fff',
        fontSize: 14,
        fontWeight: 700,
        color: '#94a3b8',
        cursor: 'pointer',
    },
    tabActive: {
        flex: 1,
        padding: '12px 0',
        border: '2px solid #6366f1',
        borderRadius: 12,
        backgroundColor: '#eef2ff',
        fontSize: 14,
        fontWeight: 700,
        color: '#6366f1',
        cursor: 'pointer',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    },
    cardTitle: { fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 20, marginTop: 0 },
    label: { fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', marginTop: 12 },
    input: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        fontSize: 14,
        color: '#1e293b',
        outline: 'none',
        boxSizing: 'border-box' as const,
        marginBottom: 4,
    },
    btnRow: { display: 'flex', gap: 10, marginTop: 20 },
    primaryBtn: {
        flex: 1,
        padding: '14px 0',
        borderRadius: 14,
        backgroundColor: '#6366f1',
        color: '#fff',
        fontSize: 15,
        fontWeight: 800,
        border: 'none',
        cursor: 'pointer',
    },
    secondaryBtn: {
        flex: 1,
        padding: '14px 0',
        borderRadius: 14,
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        fontSize: 15,
        fontWeight: 800,
        border: 'none',
        cursor: 'pointer',
    },
    refreshBtn: {
        padding: '8px 16px',
        borderRadius: 10,
        backgroundColor: '#f1f5f9',
        color: '#64748b',
        fontSize: 13,
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
    },
    resultBox: {
        marginTop: 16,
        padding: 14,
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        textAlign: 'center' as const,
    },
    empty: { textAlign: 'center' as const, color: '#94a3b8', padding: 40 },
    historyList: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
    historyItem: {
        backgroundColor: '#f8fafc',
        borderRadius: 14,
        padding: 16,
        border: '1px solid #f1f5f9',
    },
    historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    statusBadge: {
        padding: '4px 10px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 800,
    },
    historyDate: { fontSize: 12, color: '#94a3b8' },
    historyTitle: { fontSize: 15, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' },
    historyBody: { fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 },
    historyMeta: { display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: '#94a3b8' },
};
