import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '소그룹 — soluma 사용 설명서',
    description: '아는 사람들과 소그룹을 만들어 기도제목·나눔·채팅을 함께하는 소그룹. 사용법과 프리미엄 안내.',
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

export default function SmallGroupTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>👥 소그룹</h1>
                <p style={S.lead}>
                    아는 사람들과 <b>소그룹을 만들어 기도제목 · 나눔 · 채팅</b>을 함께하는 공간입니다.
                    교회 셀 모임, 구역, 가족, 친구 — 어떤 모임이든
                    앱 안에서 서로의 신앙을 나누고 함께 기도할 수 있어요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>기도제목</b>을 나누고 서로를 위해 기도할 수 있어요.</li>
                        <li>말씀과 삶의 <b>나눔</b>, 그리고 <b>채팅</b>으로 평일에도 이어지는 교제가 가능해요.</li>
                        <li><b>초대 방식</b>이라 아는 사람들끼리만 모이는 안전한 공간이에요.</li>
                        <li>여러 그룹에 참여할 수 있어요 — 셀 모임 따로, 가족 따로.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>프리미엄 안내</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>소그룹 만들기 · 초대 참여 · 기도제목 · 나눔 · 채팅</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 소그룹은 <span style={S.badgePremium}>프리미엄</span> 전용 기능이에요. 아직 구독 전이라면 화면에 들어갈 때 구독 안내가 먼저 나오고,
                    구독(월 $1.49 · 연 $15)하시면 바로 이용할 수 있어요. 구독료는 미자립교회 지원과 선교 사업에 쓰입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/smallgroup/main.png" alt="소그룹 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>커뮤니티 탭에서 소그룹 열기</p>
                        <p style={S.p}>
                            하단의 <b>커뮤니티</b> 탭에서 소그룹으로 들어가세요.
                            화면 상단에 <b>[+ 소그룹 만들기]</b>와 <b>[초대코드 입력]</b> 두 버튼이 있고,
                            아래에 <b>내가 속한 그룹 카드</b>가 표시됩니다 —
                            그룹 이름과 태그(예: 찬양팀 · 선교팀), 인원 수, 리더가 한눈에 보여요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>그룹 만들기 또는 초대로 참여하기</p>
                        <ul style={S.ul}>
                            <li><b>새로 만들기</b> — [+ 소그룹 만들기]를 누르고 그룹 이름을 정한 뒤, 함께할 사람들을 초대하세요.</li>
                            <li><b>초대받아 참여</b> — 리더에게 받은 초대코드를 [초대코드 입력]에 넣으면 바로 합류돼요.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>기도제목 · 나눔 · 채팅 함께하기</p>
                        <p style={S.p}>
                            그룹 카드를 누르면 그룹 안으로 들어갑니다.
                            <b>기도제목</b>을 올려 서로를 위해 기도하고, <b>나눔</b>으로 말씀과 일상을 나누고,
                            <b>채팅</b>으로 평일에도 소통을 이어가세요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 모임 시작 전에 <b>기도제목을 미리 올려두면</b> 모였을 때 나눔이 훨씬 깊어져요.<br />
                    💡 그룹에 <b>태그</b>를 달아두면 (예: 찬양팀 · 선교팀) 어떤 모임인지 한눈에 알 수 있어요.<br />
                    💡 초대코드는 <b>아는 사람에게만</b> 전달하세요 — 소그룹은 초대로만 참여할 수 있어요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
