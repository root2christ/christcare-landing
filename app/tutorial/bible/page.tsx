import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '성경 읽기 — soluma 사용 설명서',
    description: '개역한글 성경 전체를 무료로 읽는 성경 읽기. 하이라이트·노트·카드 공유 사용법과 무료/프리미엄 안내.',
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

export default function BibleTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>📖 성경 읽기</h1>
                <p style={S.lead}>
                    <b>개역한글 성경 전체를 무료로</b> 읽을 수 있습니다.
                    스마트폰에 최적화된 읽기 화면에서 하이라이트하고, 노트를 남기고,
                    마음에 남는 구절은 카드로 만들어 나눌 수 있어요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>이어 읽기</b> — 마지막으로 읽던 위치를 기억해서 언제든 바로 이어서 읽을 수 있어요.</li>
                        <li>절 하나하나에 <b>형광펜 5색 하이라이트</b>를 할 수 있어요 — 연속으로 여러 절도 한 번에.</li>
                        <li>마음에 남는 구절은 <b>카드로 만들어 공유</b>할 수 있어요 (SNS·카톡).</li>
                        <li>구절에 <b>노트</b>를 기록해 나만의 묵상을 남길 수 있어요.</li>
                        <li>단어·구절 <b>검색</b>으로 찾고 싶은 말씀을 바로 찾아요.</li>
                        <li><b>글자 크기 조절</b>과 <b>대역 보기</b>(두 번역본 나란히)를 지원해요.</li>
                        <li>본문을 <b>꾹 누르면</b> 원하는 부분만 선택해서 복사할 수 있어요.</li>
                    </ul>
                </div>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 4 }}>
                    · 상단 아이콘으로 <b>검색(돋보기)</b> · <b>노트 목록</b> · <b>북마크</b>에 바로 갈 수 있어요.
                </p>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>개역한글 전체 읽기 · 하이라이트 · 노트 · 카드 공유 · 검색</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>개역개정 · 새번역 · 새한글성경 · 공동번역 개정판</td><td style={S.td}><span style={S.badgeOwn}>평생 소장권</span></td></tr>
                        <tr><td style={S.td}>영어(WEB) · 일본어(口語訳) 성경 (앱 언어 변경 시)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 평생 소장권 성경은 <b>연간 구독</b>에도 포함돼요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/bible/books.png" alt="성경 책 선택 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>책 고르기</p>
                        <p style={S.p}>
                            상단 드롭다운에서 <b>번역본</b>(기본 개역한글)을 고르고,
                            <b>구약/신약 탭</b>에서 읽고 싶은 책을 선택하세요.
                            맨 위의 <b>이어 읽기</b> 카드를 누르면 마지막으로 읽던 장으로 바로 이동해요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/bible/chapters.png" alt="장 선택 그리드 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>장 고르기</p>
                        <p style={S.p}>
                            책을 고르면 장 목록이 그리드로 펼쳐집니다.
                            읽고 싶은 장 번호를 누르면 바로 본문으로 들어가요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/bible/text.png" alt="성경 본문 읽기 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>읽기 화면</p>
                        <p style={S.p}>
                            절 번호와 함께 본문이 읽기 좋게 펼쳐집니다.
                            상단에서 <b>글자 크기(−/+)</b>를 조절하고, <b>대역 토글</b>을 켜면
                            두 번역본을 나란히(두 단) 비교하며 읽을 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/bible/sheet.png" alt="절을 탭하면 뜨는 하이라이트·공유 시트" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>4</span>절을 탭하면 열리는 도구</p>
                        <ul style={S.ul}>
                            <li><span style={{ ...S.dot, background: '#ec4899' }} /><b>형광펜 5색</b> — 분홍·노랑·초록·파랑·보라 중 골라 하이라이트해요.</li>
                            <li><span style={{ ...S.dot, background: '#3b82f6' }} /><b>카드 공유</b> — 구절을 예쁜 카드로 만들어 SNS·카톡으로 나눠요.</li>
                            <li><span style={{ ...S.dot, background: '#10b981' }} /><b>노트</b> — 그 구절에 나만의 묵상을 기록해요.</li>
                            <li><span style={{ ...S.dot, background: '#f59e0b' }} /><b>복사·공유·검색</b> — 구절 복사, 텍스트 공유, 단어 검색도 여기서 바로.</li>
                        </ul>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 하이라이트한 구절과 노트는 <b>상단 아이콘</b>에서 한곳에 모아볼 수 있어요.<br />
                    💡 <b>카드 공유</b>로 오늘 받은 은혜를 가족·교회 식구들과 나눠보세요.<br />
                    💡 <b>성경 통독 플랜</b>과 함께 쓰면 오늘 읽을 곳을 정해줘서 꾸준히 읽기 좋아요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
