import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '우리 교회 — soluma 사용 설명서',
    description: '커뮤니티 탭의 우리 교회 — 교인 명단, 1:1 채팅, 교회 등록(새신자·기존신자 등록 카드)까지. 전부 무료.',
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

export default function ChurchTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>⛪ 우리 교회</h1>
                <p style={S.lead}>
                    커뮤니티 탭에서 <b>우리 교회 사람들</b>을 만나는 공간입니다.
                    교인 명단을 한눈에 보고, 누구와도 <b>1:1 채팅</b>으로 인사를 나눌 수 있어요.
                    아직 교회를 등록하지 않았다면 여기서 <b>교회 등록</b>까지 한 번에 끝납니다. 전부 무료예요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>우리 교회 <b>교인 명단</b>을 목사 → 사역자 → 성도 순으로, 프로필 사진과 함께 볼 수 있어요.</li>
                        <li>명단의 누구에게나 <b>💬 버튼</b>을 눌러 바로 1:1 채팅을 시작할 수 있어요.</li>
                        <li>교회가 아직 없다면 <b>교회 검색 → 등록 카드 작성</b>으로 간단히 등록 — 제출하면 프로필에 교회가 자동 연동돼요.</li>
                        <li>사역자·목사님은 교인의 <b>등록 카드 내용을 열람</b>하며 심방·양육에 활용할 수 있어요.</li>
                        <li>목사님은 성도를 <b>사역자로 임명</b>할 수 있어요 — 명단에 직분 칩으로 표시됩니다.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료 안내</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>교인 명단 열람 · 1:1 채팅</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>교회 등록 (새신자 · 기존신자 등록 카드)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>등록 카드 열람 · 사역자 임명 (사역자 · 목사)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 우리 교회의 모든 기능은 구독 없이 누구나 쓸 수 있습니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/church/community.png" alt="커뮤니티 탭 상단의 우리 교회 카드" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>커뮤니티 탭에서 우리 교회 카드 열기</p>
                        <p style={S.p}>
                            하단 <b>커뮤니티</b> 탭을 열면 맨 위에 <b>우리 교회 카드</b>가 있어요
                            (화면에서는 &lsquo;OO교회 — 우리 교회 사람들 보기&rsquo;).
                            카드를 누르면 교인 명단으로 들어갑니다.
                            카드 아래에는 내 채팅 · 기도 · 기도 편지 · 간증 · 소그룹 등
                            커뮤니티 기능 그리드가 함께 보여요
                            (기도·기도 편지·간증·소그룹·AI 신앙 상담은 프리미엄 전용, 내 채팅과 우리 교회는 무료).
                        </p>
                        <p style={S.p}>
                            <b>아직 교회를 등록하지 않았다면?</b> 카드를 눌렀을 때 <b>교회 검색</b>이 먼저 열려요.
                            내 교회를 찾아 선택하고 <b>새신자 / 기존신자</b> 중 하나를 고른 뒤
                            <b> 등록 카드</b>를 작성해 제출하면, 프로필에 교회가 자동으로 연동됩니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/church/directory.png" alt="우리 교회 교인 명단 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>교인 명단 보기 &amp; 1:1 채팅</p>
                        <p style={S.p}>
                            명단은 <b>🕊️ 담임·목사</b> 섹션부터 <b>🙂 성도</b> 섹션 순으로 정렬되고,
                            이름 옆에 <b>목사</b> 같은 직분 칩이 붙어요. 상단에는 전체 인원(총 8명)이 표시됩니다.
                            각 사람 오른쪽의 <b>💬 버튼</b>을 누르면 바로 1:1 채팅이 열려요.
                            맨 아래 <b>명부 자세히 보기</b>로 더 자세한 명부로 이동할 수 있습니다.
                        </p>
                        <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8' }}>
                            · 화면 속 성도 섹션의 이름과 사진 일부는 사생활 보호를 위해 가렸어요.
                        </p>
                        <p style={S.p}>
                            사역자·목사님이 교인을 탭하면 <b>등록 카드 내용</b>을 열람할 수 있고,
                            목사님은 성도를 <b>사역자로 임명</b>할 수도 있어요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 등록 카드를 제출하면 우리 교회의 <b>인증 사역자에게 푸시 알림</b>이 가서 빠르게 연락을 받을 수 있어요.<br />
                    💡 사역자·목회자시라면 <Link href="/tutorial/minister" style={{ color: '#7c5a10', fontWeight: 800 }}>사역자 기능 안내</Link>에서 명부 관리와 웹 대시보드 사용법을 확인하세요.<br />
                    💡 교회에 필요한 일손은 <Link href="/tutorial/jobbox" style={{ color: '#7c5a10', fontWeight: 800 }}>잡박스</Link>에서 구할 수 있어요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
