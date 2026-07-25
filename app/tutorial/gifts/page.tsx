import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '선물 · 달란트 — soluma 사용 설명서',
    description: '앱 활동으로 모으는 달란트 포인트와, 프리미엄 이용권을 소중한 분께 전하는 선물 기능. 사용법과 무료/유료 안내.',
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

export default function GiftsTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🎁 선물 · 달란트</h1>
                <p style={S.lead}>
                    <b>달란트</b>는 필사·챌린지 같은 앱 활동으로 차곡차곡 모으는 포인트이고,
                    <b> 선물</b>은 프리미엄 이용권 등을 소중한 분께 전하는 기능입니다.
                    둘 다 <b>My 탭</b>에서 들어갈 수 있어요.
                </p>

                <h2 style={S.h2}>세 가지만 알면 돼요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>달란트(T)</b> — 필사·챌린지 등 앱 활동으로 모으는 포인트예요. <b>10,000T = $1</b> 가치이고, <b>달란트 랭킹</b>에서 다른 성도들과 순위도 볼 수 있어요.</li>
                        <li><b>선물</b> — 프리미엄 이용권 등을 다른 사람에게 선물해요. <b>링크만 공유하면</b> 상대가 앱에서 바로 받을 수 있어요.</li>
                        <li><b>크레딧</b> — 미리 충전해 두고 선물 등에 쓰는 잔액이에요. <b>$50부터</b> 충전할 수 있고 보너스가 붙어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 유료</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>달란트 모으기 · 내 달란트 확인 · 달란트 랭킹</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>선물 화면 열람 · 보낸선물/받은선물 확인</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>선물 구매 (구독 이용권 등)</td><td style={S.td}><span style={S.badgePremium}>유료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 열람은 모두 무료이며, 선물을 구매해 보낼 때만 결제(크레딧 또는 스토어 결제)가 필요해요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>My 탭에서 들어가기</p>
                        <p style={S.p}>
                            <b>My 탭</b>에 내 크레딧과 내 달란트가 함께 보여요.
                            여기서 <b>선물</b>과 <b>내 달란트</b> 화면으로 들어갈 수 있습니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/gifts/main.png" alt="선물 화면 — 선물하기·보낸선물·받은선물 탭과 구독 선물 목록" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>선물 고르고 링크로 보내기</p>
                        <p style={S.p}>
                            선물 화면 상단에는 <b>선물하기 · 보낸선물 · 받은선물</b> 세 탭이 있어요.
                            &ldquo;소중한 분께 선물하세요 — 선물 링크를 공유하면 누구나 받을 수 있어요.&rdquo;
                        </p>
                        <ul style={S.ul}>
                            <li><b>구독 선물</b> — 월 구독($1.49, 모든 기능 한 달 이용) 또는 연 구독($15, 모든 기능 1년 + 크라이스트 테스트 프리미엄 분석 2회 + 한글 유료 성경 평생 소장)을 고를 수 있어요.</li>
                            <li><b>추가 선물</b> — 신앙의 계절(신앙 건강 자가진단, 무료), 크라이스트 테스트 프리미엄 분석($1, 맞춤 영적 멘토링 + 종합 보고서) 등도 보낼 수 있어요.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/gifts/talents.png" alt="내 달란트 화면 — 보유 달란트와 다음 목표 진행률" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>내 달란트 확인하기</p>
                        <p style={S.p}>
                            <b>내 달란트</b> 화면에는 보유 달란트 숫자와 함께 지금 나의 뱃지(예: 🌱 새신자)가 보여요.
                            달란트는 <b>매일의 큐티·기도·말씀 생활이 쌓이는 성장의 기록</b>이에요 —
                            숫자가 커질수록 뱃지와 함께 나의 신앙 여정이 남습니다.
                            아래 <b>다음 목표까지</b>에서는 다음 뱃지(예: ⭐ 충성된 종, 1,000달란트)까지의
                            진행률이 게이지로 표시돼요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 달란트는 필사 한 장, 챌린지 기록 하루처럼 <b>꾸준한 활동</b>이 가장 빨리 모으는 길이에요.<br />
                    💡 <b>달란트 랭킹</b>을 보면 함께 달리는 성도들이 보여서 동기부여가 됩니다.<br />
                    💡 새신자 양육, 소그룹 격려 선물로 <b>구독 이용권 선물 링크</b>를 활용해 보세요 — 받는 분은 링크만 누르면 돼요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
