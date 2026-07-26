import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '성경 통독 플랜 — soluma 사용 설명서',
    description: '자유 통독·연대기·맥체인·1년 1독 — 365일 동안 성경 전체를 읽는 4가지 통독 플랜 사용법. 전부 무료.',
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

export default function PlanTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🗓️ 성경 통독 플랜</h1>
                <p style={S.lead}>
                    <b>365일 동안 성경 전체를 읽는 4가지 방법</b>입니다.
                    부담 없이 자유롭게 읽거나, 역사 흐름·맥체인·1년 1독 플랜을 따라
                    나에게 맞는 속도와 순서로 성경 일독을 완주해 보세요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>내 스타일에 맞는 <b>4가지 통독 방식</b> 중에서 고를 수 있어요 — 전부 365일 기준.</li>
                        <li><b>진행률과 이어 읽을 위치가 자동으로 기억</b>돼요 — 어디까지 읽었는지 외울 필요가 없어요.</li>
                        <li><b>대시보드</b>에서 오늘 읽을 분량과 지금까지의 진행 상황을 한눈에 확인해요.</li>
                        <li><b>자유 통독은 무료</b>예요 — 순서에 매이지 않고 원하는 대로 읽어나갈 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>4가지 통독 방식</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>플랜</th><th style={S.th}>읽는 방법</th><th style={S.th}>이런 분께</th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={S.td}><b>자유 통독</b></td>
                            <td style={S.td}>읽고 싶은 만큼 자유롭게 읽고, 읽은 장을 체크해요.</td>
                            <td style={S.td}>내 속도대로 부담 없이 읽고 싶은 분</td>
                        </tr>
                        <tr>
                            <td style={S.td}><b>1년 1독</b></td>
                            <td style={S.td}>창세기부터 요한계시록까지 순서대로 읽어요.</td>
                            <td style={S.td}>입문자 — 처음 통독하는 분</td>
                        </tr>
                        <tr>
                            <td style={S.td}><b>연대기 성경 읽기</b></td>
                            <td style={S.td}>역사가 흘러간 순서대로 매일 1~5장씩 읽어요.</td>
                            <td style={S.td}>성경을 하나의 이야기 흐름으로 이해하고 싶은 분</td>
                        </tr>
                        <tr>
                            <td style={S.td}><b>맥체인 성경 읽기표</b></td>
                            <td style={S.td}>매일 구약 2·신약 2 본문을 골고루 읽어요.</td>
                            <td style={S.td}>경험자 — 통독을 해본 분</td>
                        </tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 플랜은 <b>한 번에 하나만</b> 진행돼요 — 새 플랜을 시작하면 기존 플랜은 종료됩니다.
                </p>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>자유 통독 (순서 없이 읽고 싶은 곳부터) · 진행률 기록</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>1년 1독 · 연대기 · 맥체인 플랜 시작하기</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 날짜별 분량이 정해진 세 가지 플랜(1년 1독·연대기·맥체인)은 <b>프리미엄 전용</b>이에요.
                    구독(월 $1.49 · 연 $15)하시면 바로 시작할 수 있고, 구독료는 미자립교회 지원과 선교 사업에 쓰입니다.<br />
                    · 성경 본문은 개역한글이 무료입니다. 유료 번역본 안내는{' '}
                    <Link href="/tutorial/bible" style={{ color: '#0f766e', fontWeight: 800 }}>성경 읽기 설명서</Link>를 참고하세요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/plan/main.png" alt="통독 플랜 선택 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>플랜 선택 화면 열기</p>
                        <p style={S.p}>
                            성경 통독에 들어가면 <b>나에게 맞는 통독 플랜</b>을 고를 수 있어요.
                            이미 진행 중인 플랜이 있으면 상단 배너에 <b>몇 일차인지와 진행률</b>이 표시되고,
                            <b>[대시보드 보기]</b>를 누르면 오늘 읽을 분량과 진행 상황을 확인할 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/plan/plans.png" alt="연대기·맥체인·1년 1독 플랜 카드" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>나에게 맞는 플랜 고르기</p>
                        <p style={S.p}>
                            플랜 카드마다 읽는 방식과 <b>입문자·경험자 뱃지</b>가 표시돼요.
                            <b>[이게 뭔가요?]</b>를 누르면 그 플랜에 대한 자세한 설명을 볼 수 있어요.
                            처음이라면 <b>1년 1독</b>이나 <b>자유 통독</b>부터 시작해 보세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/plan/switch.png" alt="플랜 변경 확인 팝업" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>플랜 바꾸기는 신중히</p>
                        <p style={S.p}>
                            플랜은 한 번에 하나만 진행돼요. 다른 플랜을 시작하려고 하면
                            <b>&ldquo;현재 플랜이 종료됩니다&rdquo;</b> 확인 팝업이 떠요 —
                            기존 플랜의 진행이 종료되니 <b>신중히</b> 결정하세요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 통독이 처음이라면 <b>1년 1독</b> 또는 <b>자유 통독</b>으로 시작하는 걸 추천해요.<br />
                    💡 <b>통독 그룹·챌린지</b>와 함께하면 훨씬 꾸준히 이어갈 수 있어요.<br />
                    💡 진행률과 이어 읽을 위치는 자동으로 기억되니, 하루 놓쳐도 부담 없이 이어가세요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
