import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '신앙의 계절 — soluma 사용 설명서',
    description: '지금 내 믿음이 어느 계절인지 가볍게 점검하는 신앙 건강 체크. 사용법과 무료 안내.',
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

export default function FaithTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🍃 신앙의 계절</h1>
                <p style={S.lead}>
                    지금 내 믿음이 <b>어느 계절</b>을 지나고 있는지 가볍게 점검하는 신앙 건강 체크입니다.
                    결과는 <b>봄 · 여름 · 가을 · 겨울</b>의 계절 은유로 보여줘서,
                    점수나 등급이 아니라 &ldquo;지금 나의 때&rdquo;를 따뜻하게 돌아보게 해줘요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>맞고 틀리는 시험이 아니라, <b>내 신앙의 현재를 돌아보는</b> 부드러운 점검이에요.</li>
                        <li>결과가 <b>계절 은유</b>로 나와서 위축되지 않고 자연스럽게 받아들일 수 있어요.</li>
                        <li>결과 계절이 <b>My탭에 표시</b>돼요 — 예: &ldquo;성장하는 여름&rdquo;.</li>
                        <li>시간이 지나 다시 해보면 <b>계절의 변화</b>를 확인할 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>신앙의 계절 검사 · 결과 확인 · My탭 계절 표시</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 신앙의 계절은 전부 무료로 이용할 수 있어요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/faith/intro.png" alt="신앙의 계절 인트로 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>홈에서 신앙의 계절 열기</p>
                        <p style={S.p}>
                            홈 화면의 <b>신앙의 계절</b> 카드를 누르면 인트로 화면(Spiritual Season)이 열립니다.
                            <b>목회자의 따뜻한 권면이 담긴 30개 문항</b>으로 나의 영적 계절을 발견하는 검사예요.
                            <b>30문항 · 5-10분 소요</b>가 안내되고, <b>[계절 발견]</b> 버튼을 누르면 시작됩니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/faith/question.png" alt="신앙의 계절 문항 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>솔직하게 답하기</p>
                        <p style={S.p}>
                            한 화면에 한 문항씩 나옵니다 (예: &ldquo;주일 예배에 대한 나의 모습은 어떠한가요?&rdquo;).
                            문항 위에는 <b>DISCIPLINES</b> 같은 영역 표시가, 상단에는 <b>진행 상황(1/30)</b>이 보여요.
                            보기 중에서 <b>지금의 나와 가장 가까운 것</b> 하나를 고르면 다음 문항으로 넘어갑니다.
                            잘 보이고 싶은 답이 아니라 솔직한 답이 정확한 계절을 알려줘요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>내 계절 확인하기</p>
                        <p style={S.p}>
                            30문항을 마치면 지금 내 믿음의 계절이 <b>봄 · 여름 · 가을 · 겨울</b> 은유로 나옵니다.
                            결과 계절은 <b>My탭</b>에 표시돼요 (예: <b>성장하는 여름</b>) —
                            언제든 다시 검사해서 계절의 변화를 확인할 수 있습니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 계절에는 <b>좋고 나쁨이 없어요</b> — 겨울도 뿌리가 깊어지는 소중한 때입니다.<br />
                    💡 한 번으로 끝내지 말고 <b>계절이 바뀔 즈음 다시</b> 해보세요. 믿음의 흐름이 보입니다.<br />
                    💡 결과를 두고 소그룹이나 교회 공동체와 <b>나눔의 소재</b>로 삼아도 좋아요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
