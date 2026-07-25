import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '함께 암송 — soluma 사용 설명서',
    description: '방 멤버 전원이 오늘 암송을 마쳐야 내일이 열리는 함께 암송. 시작 방법과 하루 사용법 안내.',
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

export default function MemorizationTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🤝 함께 암송</h1>
                <p style={S.lead}>
                    <b>&ldquo;서로가 서로의 이유가 되는 암송&rdquo;</b> —
                    방 멤버 <b>전원이 오늘 암송을 마쳐야 내일 진도가 열리는</b> 말씀 암송입니다.
                    혼자서는 며칠 만에 흐지부지되던 암송이, 나를 기다리는 사람이 있으면 계속됩니다.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>전원 완료 게이트</b>가 심장이에요 — 방 멤버 <b>전원이 오늘 암송을 마쳐야 내일이 열립니다</b>. 내가 하면 모두가 앞으로 가요.</li>
                        <li>매일 <b>새 구절은 딱 1개</b>(월~금), 토요일은 복습, 일요일은 쉼 — 부담 없는 일주일 리듬이에요.</li>
                        <li><b>지난 2주 본문을 매일 함께 복습</b>(누적)해서, 외운 말씀이 잊히지 않아요.</li>
                        <li>완료 인증은 <b>녹음 제출</b> — 멤버끼리 서로의 녹음을 들으며 격려할 수 있어요.</li>
                        <li>이틀 넘게 못 하는 멤버가 있어도, 완료한 사람이 있으면 <b>자동으로 넘어가는 배려 장치</b>가 있어요. 아직 안 한 멤버는 <b>콕 찌르기</b>(하루 1번)로 살짝 깨워줄 수도 있고요.</li>
                        <li>테마를 완주하면 <b>같은 방에서 새 테마</b>로 계속할 수 있고, 함께 암송의 모든 기능은 <b>전부 무료</b>예요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>두 가지 시작 방식</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>구분</th><th style={S.th}>솔루마 신청</th><th style={S.th}>소그룹</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>누구와</td><td style={S.td}>모르는 사람과 새로운 만남</td><td style={S.td}>가족 · 친구 · 구역 식구와</td></tr>
                        <tr><td style={S.td}>시작</td><td style={S.td}><b>3명 모이면 자동 시작</b></td><td style={S.td}><b>2명부터</b> 방장이 시작</td></tr>
                        <tr><td style={S.td}>입장</td><td style={S.td}>최대 8명 · 진행 중에도 중간 입장 가능</td><td style={S.td}>초대코드로 입장</td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 어느 방식이든 함께 암송은 <span style={S.badgeFree}>전부 무료</span> 입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/memorization/home.png" alt="함께 암송 홈 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>방 만들기 또는 신청하기</p>
                        <p style={S.p}>
                            함께 암송 홈에는 내 방 목록과 함께 세 가지 입구가 있어요.
                            <b>[솔루마 신청으로 시작]</b>(3명 모이면 바로) · <b>[소그룹 만들기]</b>(초대코드로) ·
                            받은 <b>초대코드로 입장</b> 중에서 골라 시작하세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/memorization/themes.png" alt="암송 테마 4종 선택 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>테마 고르기</p>
                        <ul style={S.ul}>
                            <li><span style={{ ...S.dot, background: '#10b981' }} /><b>쉼과 회복</b> — 4주</li>
                            <li><span style={{ ...S.dot, background: '#3b82f6' }} /><b>산상수훈</b> — 13주</li>
                            <li><span style={{ ...S.dot, background: '#f59e0b' }} /><b>로마서 복음의 길</b> — 26주</li>
                            <li><span style={{ ...S.dot, background: '#e13232' }} /><b>성경 파노라마</b> — 52주</li>
                        </ul>
                        <p style={{ ...S.p, marginTop: 8 }}>
                            방 이름은 🎲 버튼으로 <b>자동 추천</b>을 받을 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/memorization/invite.png" alt="초대코드 공유 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>초대코드 공유하기</p>
                        <p style={S.p}>
                            방을 만들면 <b>초대코드</b>가 크게 표시돼요. <b>[코드 공유]</b>로
                            가족·친구에게 보내면, 받은 사람은 홈에서 코드를 입력해 바로 들어옵니다.
                            그동안 방은 <b>모집 중</b> 상태로 기다려요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/memorization/members.png" alt="멤버가 모여 시작을 기다리는 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>4</span>모이면 시작</p>
                        <p style={S.p}>
                            멤버가 모이면 출발합니다. <b>솔루마 신청</b> 방은 3명이 모이면 <b>자동으로 시작</b>되고,
                            <b>소그룹</b> 방은 2명부터 방장이 <b>[시작하기]</b>를 눌러 출발해요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/memorization/room.png" alt="진행 중인 암송 방 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>5</span>매일 방에서 오늘 구절 확인</p>
                        <p style={S.p}>
                            방에 들어오면 이번 주 주제와 <b>오늘의 새 구절</b>, 그리고 <b>오늘 완료 현황</b>(완료한 멤버는
                            초록 체크)이 보여요. 이번 주 본문 트랙(1~6 · 복습 · 쉼)으로 한 주의 흐름도 한눈에 보입니다.
                            <b>[오늘 암송 시작하기]</b>를 눌러 오늘 몫을 시작하세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/memorization/prayer.png" alt="암송 가이드 첫 단계인 암송 기도문 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>6</span>가이드 따라 암송하고 녹음 제출</p>
                        <p style={S.p}>
                            <b>암송 기도문</b>으로 마음을 모은 뒤, 가이드가 순서대로 이끌어요 —
                            <b>누적 복습 ×3</b> → <b>이번 본문 낭독 ×5</b> → 오늘 구절 <b>구구절절</b>(짧게 끊어 반복)
                            → <b>녹음 제출</b>. 녹음이 제출되면 오늘 완료! <b>전원이 완료하면 내일이 열려요.</b>
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 가족·구역 식구와 <b>소그룹</b>으로 시작해보세요 — 서로 아는 사이일수록 게이트의 힘이 커요.<br />
                    💡 완료한 친구의 <b>녹음을 들어보세요</b> — 같은 말씀을 서로의 목소리로 들으며 격려하게 됩니다.<br />
                    💡 부담될 땐 <b>쉼과 회복 4주</b>부터 — 짧은 완주 경험이 다음 테마로 이어져요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
