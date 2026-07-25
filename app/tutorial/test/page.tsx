import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '크라이스트 테스트 — soluma 사용 설명서',
    description: '나는 성경 속 어떤 인물일까? 30문항으로 신앙 성향을 발견하는 크라이스트 테스트. 사용법과 무료/프리미엄 안내.',
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

export default function TestTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>✨ 크라이스트 테스트</h1>
                <p style={S.lead}>
                    <b>나는 성경 속 어떤 인물일까?</b> —
                    30문항(5~10분)으로 나의 신앙적 성향과 은사를 발견하고,
                    나와 닮은 <b>성경 인물</b>을 만나는 테스트입니다.
                    정답은 없어요. 가장 솔직하게 답하면 됩니다.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>성격 유형이 아니라 <b>신앙의 성향과 은사</b>를 보는 테스트예요 — 옳고 그름이 아닌 &lsquo;나다움&rsquo;의 발견이에요.</li>
                        <li><b>CHRIST 6가지 핵심 영역</b>으로 신앙을 입체적으로 봐요 — Character(판단 기준)·Heart(핵심 가치)·Spirit(관계의 초점)·Relationship(성장 방식)·Identity(삶의 태도)·Talent(사역의 장).</li>
                        <li>6영역이 다시 <b>12가지 세부 영역</b>으로 나뉘어 더 섬세하게 진단해요.</li>
                        <li>결과로 나와 닮은 <b>성경 인물 매칭 결과지</b>를 받아요.</li>
                        <li><b>지난 결과 다시 보기</b>로 이전 결과를 언제든 꺼내 볼 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>기본 테스트(30문항) · 성경 인물 결과지 · 지난 결과 다시 보기</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>웹 체험판 (christcare.us/t)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>심층 결과지</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 프리미엄은 월 $1.49로 앱의 모든 기능이 열립니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/test/intro.png" alt="크라이스트 테스트 소개 화면 — 6가지 핵심 영역" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>테스트가 보는 6가지 영역</p>
                        <p style={S.p}>
                            시작 화면에서 테스트의 뼈대인 <b>6가지 핵심 영역(CHRIST)</b>을 소개해요.
                        </p>
                        <ul style={S.ul}>
                            <li><b>C</b>haracter (판단 기준) · <b>H</b>eart (핵심 가치)</li>
                            <li><b>S</b>pirit (관계의 초점) · <b>R</b>elationship (성장 방식)</li>
                            <li><b>I</b>dentity (삶의 태도) · <b>T</b>alent (사역의 장)</li>
                        </ul>
                        <p style={{ ...S.p, marginTop: 8 }}>
                            화면 아래로 내리면 6영역을 더 잘게 나눈 <b>12가지 세부 영역</b> 휠이 이어져요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/test/logic.png" alt="테스트의 논리 화면 — 내면의 영성과 외면의 실천, 결과 코드 형식" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>테스트의 논리 확인 후 시작</p>
                        <p style={S.p}>
                            결과 코드는 <b>내면의 영성(C-H-S-R)</b> — 하나님과의 관계에서 나타나는 마음의 기질 — 과
                            <b> 외면의 실천(I-T)</b> — 삶의 현장에서 믿음이 열매 맺는 방식 — 을 합쳐
                            <b> CHSR-IT 형식</b>(예: PTVI-DW)으로 나와요.
                            <b>30문항, 5~10분 소요</b>이고 정답은 없으니 솔직하게 답해 주세요.
                            <b>[진단 다시 해보기]</b>로 시작하고, 이전에 했다면 <b>[나의 지난 결과 보기]</b>로
                            지난 결과를 다시 볼 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>결과지에서 나와 닮은 성경 인물 만나기</p>
                        <p style={S.p}>
                            30문항을 마치면 나의 결과 코드와 함께 <b>나와 닮은 성경 인물 결과지</b>를 받아요.
                            더 깊이 알고 싶다면 <b>심층 결과지</b>(프리미엄)로 나의 성향을 자세히 볼 수 있어요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 앱 설치 전에도 <b>christcare.us/t</b> 에서 웹으로 바로 체험할 수 있어요 — 지인에게 링크로 공유해보세요.<br />
                    💡 &lsquo;바람직한 답&rsquo;이 아니라 <b>평소의 나</b>로 답할수록 결과가 정확해져요.<br />
                    💡 결과지를 <b>가족·소그룹과 나눠보세요</b> — 서로의 신앙 성향을 이해하는 좋은 대화거리가 됩니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
