import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '성경 필사 — soluma 사용 설명서',
    description: '성경 66권 31,099절을 한 절씩 따라 쓰는 성경 필사. 사용법과 무료/프리미엄 안내.',
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

export default function ScriptureTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>✍️ 성경 필사</h1>
                <p style={S.lead}>
                    성경 66권 <b>31,099절을 한 절씩 따라 쓰는</b> 디지털 필사입니다.
                    눈으로 읽을 때보다 손으로 쓸 때 말씀은 더 깊이 새겨집니다 —
                    한 절을 쓰는 동안 그 말씀에 오래 머물게 되기 때문이에요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>진행률이 자동으로 기록</b>돼요 — 성경 전체의 몇 %를 썼는지, 어디까지 썼는지 언제나 확인하고 이어 쓸 수 있어요.</li>
                        <li><b>장을 완료할 때마다 달란트</b>(앱 포인트)를 받아요.</li>
                        <li>정확히 썼는지 <b>유사도</b>를 보여줘서 오타 없이 꼼꼼히 쓸 수 있어요.</li>
                        <li>타자가 어려우면 <b>목소리로 읽어서</b> 필사할 수도 있어요 (음성 인식).</li>
                        <li>신구약 전체를 완주하면 프로필에 영구히 남는 <b>골드스타 ⭐</b>를 받아요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>필사 화면 열람 · 구절 읽기 · 진행 현황 확인</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>개역한글(KRV) 성경</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>따라 쓰기 입력 (필사의 핵심)</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                        <tr><td style={S.td}>목소리로 읽기 (음성 인식 필사) · 말씀 듣기 · 말씀 복사</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                        <tr><td style={S.td}>개역개정 · 새번역 · 새한글성경 · 공동번역 개정판</td><td style={S.td}><span style={S.badgeOwn}>평생 소장권</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 프리미엄은 월 $1.49로 앱의 모든 기능이 열립니다. 연간 구독에는 한글 유료 성경 전체가 포함돼요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/scripture/home.png" alt="홈 화면의 성경 필사 버튼" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>홈에서 성경 필사 열기</p>
                        <p style={S.p}>
                            홈 화면 <b>my</b> 위젯에서 <b>성경 필사</b>(빨간 표시)를 누르세요.
                            말씀 탭의 기능 목록에서도 들어갈 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/scripture/intro.png" alt="필사 진행 현황 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>내 진행 현황 확인 후 시작</p>
                        <p style={S.p}>
                            지금까지 성경 전체의 몇 %를 필사했는지, <b>이어서 쓸 위치</b>가 어디인지 보여줍니다.
                            <b>[필사 시작]</b>을 누르면 마지막으로 쓰던 절부터 바로 이어져요 —
                            어디까지 썼는지 기억할 필요가 없습니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/scripture/writing.png" alt="필사 화면 구성" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>화면 구성 한눈에 보기</p>
                        <ul style={S.ul}>
                            <li><span style={{ ...S.dot, background: '#10b981' }} /><b>① 오늘의 구절</b> — 따라 쓸 말씀이에요. 화살표로 절을 이동할 수 있어요.</li>
                            <li><span style={{ ...S.dot, background: '#3b82f6' }} /><b>② 입력칸</b> — 여기에 구절을 그대로 따라 적으세요.</li>
                            <li><span style={{ ...S.dot, background: '#f59e0b' }} /><b>③ 목소리로 읽기</b> — 타자 대신 소리 내어 읽으면 자동으로 받아 적어줘요.</li>
                            <li><span style={{ ...S.dot, background: '#e13232' }} /><b>④ 번역본</b> — 사용할 성경 번역본을 바꿀 수 있어요.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/scripture/keyboard.png" alt="따라 쓰는 모습" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>4</span>따라 쓰면 자동으로 저장</p>
                        <p style={S.p}>
                            입력칸을 누르면 키보드가 열립니다. 구절을 정확히 다 쓰면 <b>&ldquo;아멘!&rdquo;</b>과 함께
                            자동으로 다음 절로 넘어가요. 쓰는 중에는 <b>유사도 %</b>로 얼마나 정확한지 보여주고,
                            중간에 나가도 저장돼서 언제든 이어 쓸 수 있어요.
                            한 장(章)을 마치면 <b>달란트 보상</b>이 지급됩니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/scripture/version.png" alt="성경 번역본 선택" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>5</span>번역본 바꾸기 (선택)</p>
                        <p style={S.p}>
                            기본 <b>개역한글</b>은 무료입니다. 개역개정·새번역·새한글성경·공동번역 개정판은
                            자물쇠(🔒)가 표시되며, <b>평생 소장권</b> 구매 또는 <b>연간 구독</b>으로 사용할 수 있어요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 하루에 몇 절이라도 <b>꾸준히</b>가 비결이에요 — 진행률 그래프가 자라는 재미가 큽니다.<br />
                    💡 <b>성경 필사 챌린지</b>에 참여하면 같은 목표를 가진 분들과 함께 완주할 수 있어요.<br />
                    💡 신구약 전체 완주 시 <b>골드스타 ⭐</b>가 프로필에 영구 표시됩니다 — 여러 번 완주하면 별도 늘어나요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
