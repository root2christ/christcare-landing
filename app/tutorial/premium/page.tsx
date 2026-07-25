import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '프리미엄 구독 — soluma 사용 설명서',
    description: '월 $1.49부터 앱의 모든 프리미엄 기능을 여는 구독. 플랜 비교, 구독 상태 확인, 해지 방법 안내.',
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

export default function PremiumTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>👑 프리미엄 구독</h1>
                <p style={S.lead}>
                    <b>월 $1.49부터</b> 앱의 모든 프리미엄 기능이 열리는 구독입니다.
                    필사 쓰기, 큐티 진행, 함께 암송, 크라이스트 테스트 심층 결과지 등
                    잠겨 있던 기능을 전부 사용할 수 있어요.
                    그리고 <b>구독료는 미자립교회 지원과 선교 사업에 쓰입니다.</b>
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>모든 프리미엄 기능</b>이 한 번에 열려요 — 필사 쓰기 · 큐티 진행 · 함께 암송 · 심층 결과지 등.</li>
                        <li><b>연 구독</b>에는 한글 유료 성경(평생 소장)이 포함돼요.</li>
                        <li>커피 반 잔 값의 구독이 <b>미자립교회 지원과 선교 사업</b>으로 이어져요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>플랜 한눈에 보기</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>플랜</th><th style={S.th}>가격</th><th style={S.th}>포함 내용</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={S.td}><b>월 구독</b></td>
                            <td style={S.td}>$1.49<span style={{ color: '#94a3b8' }}> /월</span></td>
                            <td style={S.td}>모든 기능 무제한 (매월 자동 갱신)</td>
                        </tr>
                        <tr>
                            <td style={S.td}><b>연 구독</b> <span style={S.badgePremium}>BEST</span></td>
                            <td style={S.td}>$15<span style={{ color: '#94a3b8' }}> /년</span></td>
                            <td style={S.td}>모든 기능 무제한 + 크라이스트 테스트 프리미엄 분석 2회 + 한글 유료 성경 평생 소장 (매년 자동 갱신)</td>
                        </tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 앱의 요금제 화면에는 할인 기간·정가 등 시점에 따른 표시가 있을 수 있어요. 실제 결제 금액은 앱 내 표시가 기준입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/premium/status.png" alt="My 탭 — 내 크레딧, 내 달란트, 프리미엄 구독 상태 카드" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>My 탭에서 내 구독 상태 확인</p>
                        <p style={S.p}>
                            <b>My 탭</b>의 카드에 <b>내 크레딧</b>, <b>내 달란트</b>, 그리고
                            <b> 프리미엄 구독 (연간)</b> 상태와 만료일(예: 2027년 6월 12일까지)이 한눈에 보여요.
                            구독 줄을 누르면 요금제 화면으로 이동합니다.
                            아래 <b>나의 활동</b>에서는 크라이스트 테스트 · 내 달란트 · 달란트 랭킹 · 내 기록 ·
                            교회 출석 · 설정으로 들어갈 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/premium/plans.png" alt="요금제 화면 — 월 구독 $1.49, 연 구독 $15와 자동 갱신 안내" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>요금제 화면에서 플랜 선택</p>
                        <p style={S.p}>
                            상단에는 현재 구독 상태(&ldquo;현재 모든 기능 사용 가능&rdquo;)와 내 크레딧이 보여요.
                            그 아래에서 플랜을 고릅니다.
                        </p>
                        <ul style={S.ul}>
                            <li><b>월 구독</b> — $1.49 (정가 $2, 26% 할인 · 2026.12.31까지), 매월 자동 갱신.</li>
                            <li><b>연 구독 (BEST)</b> — $15 (정가 $20, 25% 할인 · 2026.12.31까지), 매년 자동 갱신 · 크라이스트 테스트 프리미엄 분석 2회 + 한글 유료 성경 평생 소장.</li>
                        </ul>
                        <p style={{ ...S.p, marginTop: 8 }}>
                            화면 아래에는 단품 결제 항목(신앙의 계절 — 무료 등)과
                            <b> 자동 갱신 구독 안내</b>가 함께 표시돼요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>해지 · 관리는 스토어에서</p>
                        <p style={S.p}>
                            구독은 <b>스토어의 구독 관리</b>(Google Play 구독 관리 / App Store 구독 설정)에서
                            직접 해지·변경합니다. 결제 기간 만료 <b>24시간 전까지</b> 해지하지 않으면
                            같은 가격으로 자동 갱신되고, 구독 기간 중 해지해도 <b>잔여 기간은 그대로</b> 사용할 수 있어요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 필사·큐티·암송을 꾸준히 쓰신다면 <b>연 구독</b>이 유리해요 — 한글 유료 성경 평생 소장까지 포함됩니다.<br />
                    💡 프리미엄 이용권은 <b>선물</b>로도 보낼 수 있어요 — 새신자나 소그룹 지체에게 링크 하나로 전해집니다.<br />
                    💡 구독료는 <b>미자립교회 지원과 선교 사업</b>에 쓰여요 — 구독 자체가 작은 선교 후원이 됩니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
