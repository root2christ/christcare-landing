import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '이단 감별 자가 진단 — soluma 사용 설명서',
    description: '내가 다니는 교회, 건강한가요? 이단적 특징 여부를 스스로 점검해 보는 자가 진단 체크리스트. 결과는 참고용입니다.',
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

export default function HeresyTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🛡️ 이단 감별 자가 진단</h1>
                <p style={S.lead}>
                    <b>&ldquo;내가 다니는 교회, 건강한가요?&rdquo;</b> —
                    이단적 특징에 해당하는 모습이 있는지 <b>스스로 점검해 보는</b> 자가 진단 체크리스트입니다.
                    누군가를 판정하는 도구가 아니라, 조용히 나의 상황을 돌아보도록 돕는 점검표예요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>막연한 불안 대신, <b>구체적인 점검 항목</b>을 하나씩 짚어보며 생각을 정리할 수 있어요.</li>
                        <li>결과를 어딘가에 제출하는 것이 아니라 <b>나 혼자 조용히</b> 확인하는 방식이에요.</li>
                        <li>낯선 모임이나 성경공부 권유를 받았을 때 <b>한 번 멈춰 점검하는 습관</b>을 만들어줘요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>자가 진단 체크리스트 · 결과 확인</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 이단 감별 자가 진단은 무료로 사용할 수 있어요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>전체 기능에서 열기</p>
                        <p style={S.p}>
                            앱의 <b>전체 기능</b> 목록에서 <b>이단 감별 자가 진단</b>을 찾아 들어가세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>항목을 하나씩 점검하기</p>
                        <p style={S.p}>
                            이단에서 흔히 나타나는 특징들을 체크리스트로 하나씩 읽으며,
                            내가 다니는 교회·모임에 해당하는 내용이 있는지 <b>솔직하게</b> 표시하세요.
                            정답을 맞히는 시험이 아니니 천천히, 있는 그대로 점검하면 됩니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>결과는 참고용으로</p>
                        <p style={S.p}>
                            점검을 마치면 결과를 확인할 수 있어요. 다만 이 결과는 <b>참고용</b>입니다 —
                            체크 항목 몇 개로 어떤 교회를 단정할 수는 없어요.
                            마음에 걸리는 부분이 있다면 <b>소속 교단과 목회자에게 상의</b>하며
                            신중하게 확인해 보시길 권합니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>꼭 기억해 주세요</h2>
                <div style={S.tip}>
                    💡 이 진단은 <b>스스로 점검을 돕는 도구</b>일 뿐, 특정 교회나 단체에 대한 판정이 아니에요.<br />
                    💡 결과가 어떻게 나오든 <b>최종 판단은 소속 교단·목회자와의 상의</b>를 거쳐 신중하게 해주세요.<br />
                    💡 주변에 비슷한 고민을 하는 지체가 있다면, 정죄보다 <b>함께 점검하고 함께 상의하는</b> 자세로 도와주세요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
