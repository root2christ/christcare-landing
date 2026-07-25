import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '교회 출석 — soluma 사용 설명서',
    description: '내 교회 예배 출석을 기록하고 확인하는 교회 출석. My탭 나의 활동에서 사용해요.',
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

export default function AttendanceTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>⛪ 교회 출석</h1>
                <p style={S.lead}>
                    <b>내 교회 예배 출석을 기록하고 확인하는</b> 기능입니다.
                    한 주 한 주의 예배 출석이 기록으로 쌓여, 나의 신앙 발걸음을 돌아볼 수 있어요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>내 교회 <b>예배 출석을 기록</b>하고 언제든 다시 확인할 수 있어요.</li>
                        <li>출석 기록이 쌓이면 <b>예배 생활의 흐름</b>이 한눈에 보여요.</li>
                        <li>앱에 <b>내 교회를 등록</b>하면 바로 사용할 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>출석 기록 · 확인</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 교회 출석은 무료입니다. 단, <b>교회를 등록해야</b> 사용할 수 있어요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>먼저 내 교회 등록하기</p>
                        <p style={S.p}>
                            교회 출석은 <b>교회를 등록한 뒤</b> 사용할 수 있습니다.
                            아직 등록하지 않았다면 My탭에서 내 교회를 먼저 등록해주세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>My탭 → 나의 활동에서 열기</p>
                        <p style={S.p}>
                            하단 <b>My탭</b>의 <b>나의 활동</b>에서 <b>교회 출석</b>으로 들어가세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/attendance/main.png" alt="교회 출석 화면 — 아직 기록이 없는 상태" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>출석을 기록하고 확인하기</p>
                        <p style={S.p}>
                            화면 상단에 <b>교회 출석</b> 제목이 보입니다.
                            처음 들어가면 위 화면처럼 <b>아직 아무 기록이 없는 빈 화면</b>이에요 —
                            예배에 출석하고 기록을 남기기 시작하면 이곳에 출석 내역이 쌓입니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 처음 화면이 비어 있는 건 정상이에요 — <b>첫 출석 기록</b>부터 채워집니다.<br />
                    💡 교회가 등록되어 있어야 출석을 기록할 수 있어요. <b>My탭에서 교회 등록</b>을 먼저 해주세요.<br />
                    💡 매주 기록하는 습관을 들이면 <b>나의 예배 생활</b>을 돌아보는 좋은 자료가 됩니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
