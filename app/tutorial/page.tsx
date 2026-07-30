import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'soluma 사용 설명서',
    description: 'soluma 앱의 모든 기능을 처음 보는 분도 쉽게 — 기능별 사용법과 무료/프리미엄 안내.',
};

/** 기능 카드 목록 — 준비되는 대로 href 를 연결한다 */
const FEATURES: { emoji: string; title: string; desc: string; href?: string; tag?: string; pricing?: 'free' | 'mixed' | 'premium'; priceNote?: string }[] = [
    { emoji: '✍️', title: '성경 필사', pricing: 'mixed', priceNote: '무료: 열람·진행률 · 프리미엄: 따라쓰기·음성', desc: '한 절씩 따라 쓰며 말씀을 마음에 새겨요', href: '/tutorial/scripture' },
    { emoji: '📖', title: '성경 읽기', pricing: 'free', priceNote: '개역한글 전부 무료 · 일부 번역본만 소장권', desc: '개역한글 무료, 구절 하이라이트·카드 공유', href: '/tutorial/bible' },
    { emoji: '🌅', title: '매일 큐티', pricing: 'mixed', priceNote: '무료: 오늘의 큐티 확인 · 프리미엄: 묵상 진행', desc: '365일 새 묵상과 기도, 한 해의 동행', href: '/tutorial/qt' },
    { emoji: '📚', title: '성경 통독 플랜', pricing: 'mixed', priceNote: '무료: 자유 통독 · 프리미엄: 1년 1독·연대기·맥체인', desc: '자유·1년 1독·연대기·맥체인 4가지 플랜', href: '/tutorial/plan' },
    { emoji: '❓', title: '성경 퀴즈 365', pricing: 'mixed', priceNote: '무료: 둘러보기 · 프리미엄: 퀴즈 도전', desc: '매일 새로운 퀴즈로 말씀 지식 점검', href: '/tutorial/quiz' },
    { emoji: '🤝', title: '함께 암송', pricing: 'premium', priceNote: '녹음 보관·상호 청취가 포함된 프리미엄 전용', desc: '요일마다 한 절씩, 다 같이 외우는 암송', href: '/tutorial/memorization' },
    { emoji: '📝', title: '말씀 노트', pricing: 'free', desc: '은혜받은 말씀과 적용을 기록해요', href: '/tutorial/note' },
    { emoji: '🙏', title: '기도', pricing: 'premium', desc: '기도제목 나눔과 중보기도', href: '/tutorial/prayer' },
    { emoji: '💌', title: '기도 편지', pricing: 'premium', desc: '선교사님들의 소식에 기도로 동역해요', href: '/tutorial/prayerletter' },
    { emoji: '✝️', title: '크라이스트 테스트', pricing: 'mixed', priceNote: '무료: 테스트·결과 · 프리미엄: 심층 결과지', desc: '나는 성경 속 어떤 인물일까?', href: '/tutorial/test' },
    { emoji: '🌱', title: '신앙의 계절', pricing: 'free', desc: '지금 내 믿음은 어느 계절일까? 신앙 건강 체크', href: '/tutorial/faith' },
    { emoji: '🖼️', title: '인물 탐구', pricing: 'free', desc: '통독으로 모으는 성경 인물 도감', href: '/tutorial/gallery' },
    { emoji: '⛪', title: '우리 교회', pricing: 'free', desc: '교인 명단·채팅 (교회 공동체)', href: '/tutorial/church' },
    { emoji: '🪪', title: '새신자 등록', pricing: 'free', desc: '종이 등록 카드를 앱으로 — 사역자에게 바로 전달', href: '/tutorial/newcomer' },
    { emoji: '📅', title: '교회 출석', pricing: 'free', desc: '내 교회 예배 출석을 기록·확인해요', href: '/tutorial/attendance' },
    { emoji: '👥', title: '소그룹', pricing: 'premium', desc: '초대코드로 모이는 우리끼리 나눔방', href: '/tutorial/smallgroup' },
    { emoji: '🙌', title: '간증', pricing: 'premium', desc: '하나님이 하신 일을 나누고 서로 격려해요', href: '/tutorial/testimony' },
    { emoji: '🤝', title: '잡박스', pricing: 'free', desc: '교회의 필요와 성도의 재능을 연결', href: '/tutorial/jobbox' },
    { emoji: '🕊️', title: '사역자 기능', pricing: 'free', desc: '새신자 관리·교인 명부·웹 대시보드', href: '/tutorial/minister' },
    { emoji: '🏆', title: '챌린지', pricing: 'premium', desc: '찬양 365 등 15가지 도전, 달란트 적립', href: '/tutorial/challenges' },
    { emoji: '🎁', title: '선물 · 달란트', pricing: 'mixed', priceNote: '열람·적립 무료 · 선물 구매만 유료', desc: '활동으로 모으는 달란트, 마음을 전하는 선물', href: '/tutorial/gifts' },
    { emoji: '💎', title: '프리미엄 구독', pricing: 'premium', priceNote: '월 $1.49 · 연 $15 — 구독료는 미자립교회·선교에', desc: '프리미엄으로 열리는 모든 기능 안내', href: '/tutorial/premium' },
    { emoji: '🔍', title: '이단 감별 자가 진단', pricing: 'free', desc: '내가 다니는 교회, 건강한지 점검해요', href: '/tutorial/heresy' },
    { emoji: '⚙️', title: '설정 · 언어', pricing: 'free', desc: '알림·계정·언어 (한국어/English/日本語)', href: '/tutorial/settings' },
];

const S: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: '#f7f5f0', padding: '40px 20px 80px' },
    wrap: { maxWidth: 860, margin: '0 auto' },
    logo: { fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: -1, margin: 0 },
    h1: { fontSize: 34, fontWeight: 900, color: '#1e293b', margin: '18px 0 8px' },
    sub: { color: '#64748b', fontSize: 16, lineHeight: 1.7, margin: '0 0 18px' },
    legend: { display: 'flex', gap: 10, flexWrap: 'wrap', margin: '0 0 28px' },
    badgeFree: { background: '#e3f4ec', color: '#0f766e', borderRadius: 999, padding: '5px 14px', fontSize: 13, fontWeight: 800 },
    badgePremium: { background: '#fdf0d8', color: '#a8730a', borderRadius: 999, padding: '5px 14px', fontSize: 13, fontWeight: 800 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 },
    card: { background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, padding: '18px 18px 16px', boxShadow: '0 2px 8px rgba(15,23,42,.04)', textDecoration: 'none', display: 'block' },
    cardSoon: { opacity: 0.55 },
    cardEmoji: { fontSize: 28, marginBottom: 8 },
    cardTitle: { fontSize: 17, fontWeight: 800, color: '#1e293b', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 },
    cardDesc: { fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 },
    soon: { fontSize: 11, fontWeight: 800, color: '#94a3b8', background: '#f1f5f9', borderRadius: 999, padding: '2px 8px' },
    go: { fontSize: 11, fontWeight: 800, color: '#0f766e', background: '#e3f4ec', borderRadius: 999, padding: '2px 8px' },
    priceRow: { marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' },
    priceFree: { fontSize: 11.5, fontWeight: 800, color: '#0f766e', background: '#e3f4ec', borderRadius: 999, padding: '2px 10px' },
    priceMixed: { fontSize: 11.5, fontWeight: 800, color: '#a8730a', background: '#fdf0d8', borderRadius: 999, padding: '2px 10px' },
    priceNote: { fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 },
    pricePremium: { fontSize: 11.5, fontWeight: 800, color: '#7c3aed', background: '#f3e8ff', borderRadius: 999, padding: '2px 10px' },
    tableH2: { fontSize: 22, fontWeight: 900, color: '#1e293b', margin: '48px 0 6px' },
    tableSub: { color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: '0 0 16px' },
    tableWrap: { overflowX: 'auto' as const, background: '#fff', border: '1px solid #eef2f7', borderRadius: 16, boxShadow: '0 2px 8px rgba(15,23,42,.04)' },
    table: { width: '100%', borderCollapse: 'collapse' as const, minWidth: 480 },
    th: { textAlign: 'left' as const, fontSize: 13.5, fontWeight: 900, color: '#475569', padding: '12px 16px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' },
    thC: { textAlign: 'center' as const, fontSize: 13.5, fontWeight: 900, padding: '12px 10px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', width: 90 },
    td: { fontSize: 14.5, color: '#1e293b', fontWeight: 700, padding: '10px 16px', borderBottom: '1px solid #f1f5f9' },
    tdNote: { display: 'block', fontSize: 12, color: '#94a3b8', fontWeight: 500, lineHeight: 1.5, marginTop: 2 },
    tdC: { textAlign: 'center' as const, padding: '10px 10px', borderBottom: '1px solid #f1f5f9', fontSize: 17 },
};

/** 하단 요약 표 — free/premium 에 ✓, note 는 기능명 아래 작은 글씨 */
const PRICING_TABLE: { name: string; href?: string; free?: boolean; premium?: boolean; note?: string }[] = [
    { name: '성경 읽기', href: '/tutorial/bible', free: true, note: '개역한글 전부 무료 · 일부 번역본은 소장권 구매' },
    { name: '성경 필사', href: '/tutorial/scripture', free: true, premium: true, note: '무료: 열람·진행률 / 프리미엄: 따라쓰기·음성' },
    { name: '매일 큐티', href: '/tutorial/qt', free: true, premium: true, note: '무료: 오늘의 큐티 확인 / 프리미엄: 묵상 진행' },
    { name: '성경 통독 플랜', href: '/tutorial/plan', free: true, premium: true, note: '무료: 자유 통독 / 프리미엄: 1년 1독·연대기·맥체인' },
    { name: '성경 퀴즈 365', href: '/tutorial/quiz', free: true, premium: true, note: '무료: 둘러보기 / 프리미엄: 퀴즈 도전·달란트' },
    { name: '말씀 노트', href: '/tutorial/note', free: true },
    { name: '크라이스트 테스트', href: '/tutorial/test', free: true, premium: true, note: '무료: 테스트·결과 / 프리미엄: 심층 결과지' },
    { name: '신앙의 계절', href: '/tutorial/faith', free: true },
    { name: '인물 탐구', href: '/tutorial/gallery', free: true },
    { name: '함께 암송', href: '/tutorial/memorization', premium: true },
    { name: '기도', href: '/tutorial/prayer', premium: true },
    { name: '기도 편지', href: '/tutorial/prayerletter', premium: true },
    { name: '간증', href: '/tutorial/testimony', premium: true },
    { name: '소그룹', href: '/tutorial/smallgroup', premium: true },
    { name: '시간 릴레이 (끊김 없는 기도 사슬)', premium: true },
    { name: '인물 탐구 그룹 (스터디 그룹)', premium: true },
    { name: 'AI 신앙 상담', premium: true },
    { name: '챌린지 (찬양 365 포함)', href: '/tutorial/challenges', premium: true },
    { name: '우리 교회 (명단·채팅)', href: '/tutorial/church', free: true },
    { name: '새신자 등록', href: '/tutorial/newcomer', free: true },
    { name: '교회 출석', href: '/tutorial/attendance', free: true },
    { name: '사역자 기능', href: '/tutorial/minister', free: true },
    { name: '잡박스', href: '/tutorial/jobbox', free: true },
    { name: '선물 · 달란트', href: '/tutorial/gifts', free: true, note: '달란트 적립·열람 무료 · 선물 구매는 개별 결제' },
    { name: '이단 감별 자가 진단', href: '/tutorial/heresy', free: true },
    { name: '설정 · 언어', href: '/tutorial/settings', free: true },
];

export default function TutorialHub() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <p style={S.logo}>soluma.</p>
                <h1 style={S.h1}>사용 설명서</h1>
                <p style={S.sub}>
                    처음 만나는 분도, 목사님·사역자님도 — soluma의 기능을 하나씩 화면과 함께 안내합니다.
                    각 페이지에서 <b>무엇이 무료이고 무엇이 프리미엄인지</b>도 함께 확인하세요.
                </p>
                <div style={S.legend}>
                    <span style={S.badgeFree}>무료 — 전부 무료</span>
                    <span style={S.badgePremium}>무료+프리미엄 — 핵심은 무료, 일부만 프리미엄</span>
                    <span style={{ background: '#f3e8ff', color: '#7c3aed', borderRadius: 999, padding: '5px 14px', fontSize: 13, fontWeight: 800 }}>프리미엄 — 구독 전용 (월 $1.49)</span>
                </div>
                <div style={S.grid}>
                    {FEATURES.map((f) => (
                        f.href ? (
                            <Link key={f.title} href={f.href} style={S.card}>
                                <div style={S.cardEmoji}>{f.emoji}</div>
                                <p style={S.cardTitle}>{f.title} <span style={S.go}>보기 →</span></p>
                                <p style={S.cardDesc}>{f.desc}</p>
                                <div style={S.priceRow}>
                                    <span style={f.pricing === 'premium' ? S.pricePremium : f.pricing === 'mixed' ? S.priceMixed : S.priceFree}>{f.pricing === 'premium' ? '프리미엄' : f.pricing === 'mixed' ? '무료+프리미엄' : '무료'}</span>
                                    {f.priceNote && <span style={S.priceNote}>{f.priceNote}</span>}
                                </div>
                            </Link>
                        ) : (
                            <div key={f.title} style={{ ...S.card, ...S.cardSoon }}>
                                <div style={S.cardEmoji}>{f.emoji}</div>
                                <p style={S.cardTitle}>{f.title} <span style={S.soon}>준비 중</span></p>
                                <p style={S.cardDesc}>{f.desc}</p>
                            </div>
                        )
                    ))}
                </div>

                <h2 style={S.tableH2}>무료 · 프리미엄 한눈에 보기</h2>
                <p style={S.tableSub}>
                    모든 기능의 무료/프리미엄 여부를 한 표로 정리했습니다. 양쪽에 모두 체크된 기능은
                    핵심은 무료, 일부만 프리미엄입니다 (아래 작은 글씨 참고).
                </p>
                <div style={S.tableWrap}>
                    <table style={S.table}>
                        <thead>
                            <tr>
                                <th style={S.th}>기능</th>
                                <th style={{ ...S.thC, color: '#0f766e' }}>무료</th>
                                <th style={{ ...S.thC, color: '#7c3aed' }}>프리미엄</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PRICING_TABLE.map((r) => (
                                <tr key={r.name}>
                                    <td style={S.td}>
                                        {r.href ? <Link href={r.href} style={{ color: '#1e293b', textDecoration: 'none' }}>{r.name}</Link> : r.name}
                                        {r.note && <span style={S.tdNote}>{r.note}</span>}
                                    </td>
                                    <td style={S.tdC}>{r.free ? '✅' : ''}</td>
                                    <td style={S.tdC}>{r.premium ? '✅' : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ ...S.tableSub, marginTop: 12 }}>
                    프리미엄 구독: 월 $1.49 · 연 $15 — 구독료는 미자립교회 지원과 선교 사업에 쓰입니다.{' '}
                    <Link href="/tutorial/premium" style={{ color: '#7c3aed', fontWeight: 800 }}>자세히 보기 →</Link>
                </p>
            </div>
        </div>
    );
}
