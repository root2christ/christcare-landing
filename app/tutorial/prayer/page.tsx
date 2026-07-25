import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '기도 — soluma 사용 설명서',
    description: '기도제목을 나누고 서로 중보하는 기도 피드. 사용법과 무료 안내.',
};

const S: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f7f5f0', padding: '40px 20px 80px' },
    wrap: { maxWidth: 760, margin: '0 auto' },
    back: { color: '#0f766e', fontWeight: 800, textDecoration: 'none', fontSize: 14 },
    h1: { fontSize: 32, fontWeight: 900, color: '#1e293b', margin: '14px 0 6px' },
    lead: { color: '#475569', fontSize: 16.5, lineHeight: 1.75, margin: '0 0 22px' },
    h2: { fontSize: 21, fontWeight: 900, color: '#0f766e', margin: '38px 0 12px', paddingLeft: 12, borderLeft: '5px solid #2f9e6f' },
    p: { color: '#334155', fontSize: 15.5, lineHeight: 1.8, margin: '0 0 10px' },
    card: { background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, padding: '18px 20px', margin: '0 0 12px', boxShadow: '0 2px 8px rgba(15,23,42,.04)' },
    ul: { margin: '6px 0 0', paddingLeft: 20, color: '#334155', fontSize: 15, lineHeight: 1.9 },
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 14.5, background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #eef2f7' },
    th: { textAlign: 'left' as const, padding: '11px 14px', background: '#faf9f6', color: '#94a3b8', fontWeight: 800, fontSize: 12.5, borderBottom: '1px solid #eef2f7' },
    td: { padding: '11px 14px', borderBottom: '1px solid #f1f5f9', color: '#334155', verticalAlign: 'top' as const },
    badgeFree: { background: '#e3f4ec', color: '#0f766e', borderRadius: 999, padding: '3px 11px', fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap' as const },
    badgePremium: { background: '#fdf0d8', color: '#a8730a', borderRadius: 999, padding: '3px 11px', fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap' as const },
    badgeOwn: { background: '#eef2ff', color: '#4f46e5', borderRadius: 999, padding: '3px 11px', fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap' as const },
    step: { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' as const, margin: '0 0 30px' },
    stepText: { flex: '1 1 300px', minWidth: 280 },
    stepNum: { display: 'inline-flex', width: 30, height: 30, borderRadius: 15, background: '#2f9e6f', color: '#fff', fontWeight: 900, alignItems: 'center', justifyContent: 'center', marginRight: 9, fontSize: 15 },
    stepTitle: { fontSize: 17.5, fontWeight: 900, color: '#1e293b', margin: '0 0 8px', display: 'flex', alignItems: 'center' },
    shot: { width: 250, maxWidth: '100%', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 8px 22px rgba(15,23,42,.12)' },
    dot: { display: 'inline-block', width: 12, height: 12, borderRadius: 6, marginRight: 7 },
    tip: { background: '#fdf9f0', border: '1.5px solid #f2d8a8', borderRadius: 14, padding: '14px 18px', color: '#7c5a10', fontSize: 14.5, lineHeight: 1.8 },
};

export default function PrayerTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🙏 기도</h1>
                <p style={S.lead}>
                    <b>기도제목을 나누고 서로 중보하는 피드</b>입니다.
                    혼자 품고 있던 기도제목을 올리면, 누군가 그 글에 <b>[기도합니다]</b>를 눌러줍니다 —
                    나의 기도가 혼자만의 기도가 아니게 되는 곳이에요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>전체 / 우리 교회</b> 필터로 모든 성도의 기도제목을 보거나, 우리 교회 안에서만 나눌 수 있어요.</li>
                        <li>말하기 조심스러운 기도제목은 <b>익명</b>으로 올릴 수 있어요.</li>
                        <li><b>[기도합니다]</b> 버튼 하나로 &ldquo;내가 함께 기도하고 있다&rdquo;는 걸 전할 수 있어요 — 몇 명이 기도했는지 숫자로 보여요.</li>
                        <li><b>댓글</b>로 위로와 격려의 말을 남길 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>기도 피드 열람 · 기도제목 작성 · [기도합니다] · 댓글</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 기도 기능은 무료로 사용할 수 있어요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/prayer/feed.png" alt="기도 피드 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>기도 피드 둘러보기</p>
                        <ul style={S.ul}>
                            <li><span style={{ ...S.dot, background: '#10b981' }} /><b>① 전체 / 우리 교회</b> — 상단 필터로 보고 싶은 범위를 고르세요.</li>
                            <li><span style={{ ...S.dot, background: '#3b82f6' }} /><b>② 기도제목 카드</b> — 작성자(익명이면 ?로 표시)와 올린 시점, 제목과 내용이 보여요.</li>
                            <li><span style={{ ...S.dot, background: '#f59e0b' }} /><b>③ [기도합니다] · [댓글]</b> — 카드 아래 버튼으로 중보를 표시하고 댓글을 남겨요.</li>
                            <li><span style={{ ...S.dot, background: '#e13232' }} /><b>④ [글쓰기]</b> — 오른쪽 위 초록 버튼으로 내 기도제목을 올려요.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>내 기도제목 올리기</p>
                        <p style={S.p}>
                            <b>[글쓰기]</b>를 눌러 기도제목을 적어 올리세요.
                            공개 범위(전체 / 우리 교회)를 정할 수 있고, 이름을 밝히기 조심스러우면
                            <b> 익명</b>으로 올릴 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>서로의 기도에 함께하기</p>
                        <p style={S.p}>
                            다른 분의 기도제목을 읽고 마음이 움직였다면 <b>[기도합니다]</b>를 눌러주세요.
                            버튼 옆 숫자로 몇 명이 함께 기도하는지 보입니다.
                            <b> 댓글</b>로 격려의 말을 남기는 것도 큰 힘이 돼요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 [기도합니다] 숫자는 올린 사람에게 <b>큰 위로</b>가 됩니다 — 읽었다면 가볍게라도 눌러주세요.<br />
                    💡 민감한 기도제목은 <b>익명 + 우리 교회</b> 범위로 올리면 부담이 훨씬 적어요.<br />
                    💡 응답받은 기도는 <b>댓글로 감사 소식</b>을 나눠보세요 — 공동체 전체의 믿음이 자랍니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
