import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '기도 편지 — soluma 사용 설명서',
    description: '마음을 담아 기도를 편지로 써서 보내는 기도 편지. 선교사님들의 소식에 함께 기도로 동역해요.',
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

export default function PrayerLetterTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>💌 기도 편지</h1>
                <p style={S.lead}>
                    <b>선교사님·사역자님들이 보내온 기도 편지를 읽고, 함께 기도로 동역하는</b> 공간입니다.
                    사역지의 소식을 편지로 만나고 [함께 기도하기]를 누르면, 멀리 있어도 한마음으로
                    그 사역을 붙들 수 있어요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>선교사님·사역자님들의 <b>기도 편지 소식</b>을 받아보고 함께 기도로 동역할 수 있어요.</li>
                        <li><b>함께 기도하기</b>를 누르며 한마음으로 기도에 참여해요.</li>
                        <li>긴급한 기도 제목은 <b>긴급 기도</b>로 표시되어 놓치지 않아요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>프리미엄 안내</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>기도 편지 읽기</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                        <tr><td style={S.td}>기도 편지 쓰기 · 보내기</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                        <tr><td style={S.td}>함께 기도하기 · 공유</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 기도 편지는 <span style={S.badgePremium}>프리미엄</span> 전용 기능이에요. 아직 구독 전이라면 화면에 들어갈 때 구독 안내가 먼저 나오고,
                    구독(월 $1.49 · 연 $15)하시면 바로 이용할 수 있어요. 구독료는 미자립교회 지원과 선교 사업에 쓰입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>커뮤니티 탭에서 기도 편지 열기</p>
                        <p style={S.p}>
                            하단 <b>커뮤니티 탭</b>에서 <b>기도 편지</b>로 들어가세요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/prayerletter/main.png" alt="기도 편지 화면 — 선교사님들의 소식" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>소식 읽고 함께 기도하기</p>
                        <p style={S.p}>
                            <b>선교사님들의 소식</b>이 카드로 쌓입니다 — &ldquo;기도로 함께 동역해주세요&rdquo;.
                            각 카드에는 보낸 분의 이름과 사역지(예: 탄자니아, 캠퍼스 사역), 날짜,
                            편지 제목과 내용 일부가 보여요. 급한 기도 제목에는 <b>긴급 기도</b> 배지가 붙습니다.
                            카드 아래 <b>♡ 함께 기도하기</b>로 기도에 동참하고,
                            <b>카톡 공유</b>로 주변에 기도 제목을 전할 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>내 기도 편지 쓰기</p>
                        <p style={S.p}>
                            화면 오른쪽 위의 <b>봉투 아이콘 ✉️</b>을 눌러보세요.
                            마음을 담아 기도를 편지로 써서 보낼 수 있습니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 <b>함께 기도하기</b> 한 번이 멀리 있는 사역자에게는 큰 힘이 됩니다.<br />
                    💡 <b>긴급 기도</b> 배지가 붙은 편지는 시간이 급한 기도 제목이에요 — 먼저 기도해주세요.<br />
                    💡 좋은 기도 제목은 <b>카톡 공유</b>로 가족·교회 소그룹에도 전해보세요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
