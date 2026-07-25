import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '인물 탐구 (인물 도감) — soluma 사용 설명서',
    description: '성경 인물들을 도감처럼 모으고 알아가는 인물 탐구. 사용법과 무료 안내.',
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

export default function GalleryTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>📖 인물 탐구 (인물 도감)</h1>
                <p style={S.lead}>
                    성경 인물들을 <b>도감처럼 모으고 알아가는</b> 기능입니다.
                    인물 탐구(통독)로 한 인물의 성경 이야기를 따라 읽으면
                    그 인물이 내 도감에 수집돼요 — 읽을수록 도감이 채워집니다.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>인물의 <b>성경 이야기를 직접 따라 읽으며</b> 수집해요 — 읽기가 곧 모으기예요.</li>
                        <li><b>크라이스트 테스트</b> 결과의 내 유형 인물과 연결돼, 나와 닮은 인물부터 탐구할 수 있어요.</li>
                        <li>각 인물 카드에 <b>유형 코드</b>가 함께 표시돼 인물의 성향을 한눈에 볼 수 있어요.</li>
                        <li>수집 현황이 표시돼 <b>도감을 채워가는 재미</b>가 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>인물 도감 열람 · 인물 탐구(통독) · 인물 수집</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 인물 탐구는 전부 무료로 이용할 수 있어요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/gallery/main.png" alt="성경 인물 도감 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>인물 도감 열기</p>
                        <p style={S.p}>
                            <b>말씀 탭</b>의 기능 목록에서 <b>인물 도감</b>을 누르세요. 홈에서도 들어갈 수 있어요.
                            상단에 <b>수집 현황</b>(예: 수집 1/64)과 &ldquo;통독을 완주하면 모여요&rdquo; 안내가 보이고,
                            아래로 에스더 · 바울 · 모세 · 다윗 같은 <b>인물 카드</b>가 그리드로 펼쳐집니다.
                            각 카드에는 인물 일러스트와 이름, <b>유형 코드</b>가 함께 표시돼요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>인물 탐구(통독)로 수집하기</p>
                        <p style={S.p}>
                            아직 모으지 못한 인물은 카드가 <b>흐리게</b> 표시돼요.
                            인물을 골라 <b>인물 탐구(통독)</b>를 시작하면 그 인물의 <b>성경 이야기를 따라 읽게</b> 되고,
                            완주하면 인물이 도감에 수집됩니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>내 유형 인물부터 시작하기</p>
                        <p style={S.p}>
                            <b>크라이스트 테스트</b>를 해봤다면 결과로 나온 <b>내 유형 인물</b>과 연결돼요.
                            나와 닮은 인물의 이야기부터 읽어보면 몰입이 훨씬 쉽습니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 어디서 시작할지 막막하면 <b>크라이스트 테스트의 내 유형 인물</b>부터 읽어보세요.<br />
                    💡 인물 카드의 <b>유형 코드</b>를 비교해 보면 나와 비슷한 성향의 인물을 찾는 재미가 있어요.<br />
                    💡 한 인물씩 완주할 때마다 도감이 채워져요 — <b>수집 현황</b>이 자라는 걸 지켜보세요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
