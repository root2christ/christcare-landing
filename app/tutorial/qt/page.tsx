import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '매일 큐티 — soluma 사용 설명서',
    description: '365일 매일 새로운 큐티, 하루 두 번의 침묵의 예배. 사용법과 무료/프리미엄 안내.',
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
    step: { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' as const, margin: '0 0 30px' },
    stepText: { flex: '1 1 300px', minWidth: 280 },
    stepNum: { display: 'inline-flex', width: 30, height: 30, borderRadius: 15, background: '#2f9e6f', color: '#fff', fontWeight: 900, alignItems: 'center', justifyContent: 'center', marginRight: 9, fontSize: 15 },
    stepTitle: { fontSize: 17.5, fontWeight: 900, color: '#1e293b', margin: '0 0 8px', display: 'flex', alignItems: 'center' },
    shot: { width: 250, maxWidth: '100%', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 8px 22px rgba(15,23,42,.12)' },
    tip: { background: '#fdf9f0', border: '1.5px solid #f2d8a8', borderRadius: 14, padding: '14px 18px', color: '#7c5a10', fontSize: 14.5, lineHeight: 1.8 },
};

export default function QtTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🕯️ 매일 큐티</h1>
                <p style={S.lead}>
                    365일 <b>매일 새로운 큐티</b>가 준비됩니다.
                    하루 두 번(아침·저녁) 드리는 <b>침묵의 예배</b> —
                    말씀 읽기→묵상→적용·기도로 이어지는 단계식 진행으로,
                    바쁜 하루에도 말씀 앞에 조용히 머무는 시간을 만들어 드려요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>1년 내내 매일 다른 본문·묵상</b> — 성경 이야기의 흐름을 따라 이어집니다.</li>
                        <li>매주 하나의 <b>주간 테마</b>(예: 기도 주간)로 이어지는 커리큘럼이 있어요.</li>
                        <li><b>오늘의 찬송</b>과 <b>시작 기도</b>가 함께 제공돼 예배로 시작할 수 있어요.</li>
                        <li><b>아침·저녁 이중 리듬</b> — 아침엔 하루 적용 다짐, 저녁엔 기도·일기 정리.</li>
                        <li>지난 큐티는 <b>달력</b>에서 언제든 다시 볼 수 있어요.</li>
                        <li><b>한국어·영어·일본어</b> 모두 제공됩니다 (앱 언어를 따라요).</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>시작 화면 열람 — 오늘 제목 · 주간 테마 · 오늘의 찬송 · 시작 기도</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>큐티 진행 — [아멘·시작하기] 이후 전체 (말씀 읽기 · 묵상 가이드 · 적용 · 기도)</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 프리미엄은 월 $1.49로 앱의 모든 기능이 열립니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/qt/start.png" alt="침묵의 예배(QT) 시작 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>오늘의 큐티 확인</p>
                        <p style={S.p}>
                            <b>침묵의 예배(QT)</b>에 들어오면 오늘의 제목(예: [실라] 찬송이 흔든 옥문)과 날짜,
                            그리고 <b>주간 테마 카드</b>(🌟 기도 주간 · 3/7일)가 보입니다.
                            &ldquo;주야로 묵상하라&rdquo;(여호수아 1:8) 말씀 아래에서
                            <b>아침묵상</b>과 <b>저녁묵상</b> 중 하나를 고르세요.
                            우상단 <b>달력</b>을 누르면 지난 큐티를 다시 볼 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/qt/prayer.png" alt="오늘의 찬송과 시작 기도 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>마음 고르고 시작 기도</p>
                        <p style={S.p}>
                            화면 아래로 내리면 <b>오늘의 찬송</b>(예: 8장 거룩 거룩 거룩)과
                            <b>오늘의 마음 고르기</b>, 그리고 <b>시작 기도</b> 전문이 이어집니다.
                            기도로 마음을 정돈한 뒤 <b>[아멘·시작하기]</b>를 누르면 큐티가 시작돼요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/qt/word.png" alt="1단계 말씀 읽기 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>1단계 — 말씀 읽기</p>
                        <p style={S.p}>
                            오늘의 본문(예: 사도행전 16:25-28)을 읽습니다.
                            <b>오늘의 말씀 요약</b> 박스가 본문의 핵심을 먼저 짚어주고,
                            아래에 절별 본문이 이어져요. 하단 <b>이전/다음</b> 버튼으로 단계를 이동합니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/qt/meditation.png" alt="2단계 묵상하기 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>4</span>단계를 따라 묵상·적용·기도</p>
                        <p style={S.p}>
                            2단계 <b>묵상하기</b>에서는 오늘의 묵상 가이드가 말씀을 삶으로 이어줍니다.
                            이어지는 단계를 따라 <b>적용</b>과 <b>기도</b>까지 차례로 진행하면
                            오늘의 침묵의 예배가 완성돼요. 아침에는 하루 적용 다짐으로,
                            저녁에는 기도·일기 정리로 마무리됩니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 아침에 시작하지 못했다면 <b>저녁묵상</b>으로 하루를 정리해보세요.<br />
                    💡 우상단 <b>달력</b>에서 놓친 날짜의 큐티를 다시 볼 수 있어요.<br />
                    💡 <b>&ldquo;매일 큐티 50일&rdquo; 챌린지</b>와 함께 하면 습관이 됩니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
