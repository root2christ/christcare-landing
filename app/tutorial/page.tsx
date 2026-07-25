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
    { emoji: '📚', title: '성경 통독 플랜', pricing: 'free', desc: '자유·1년 1독·연대기·맥체인 4가지 플랜', href: '/tutorial/plan' },
    { emoji: '🤝', title: '함께 암송', pricing: 'premium', priceNote: '녹음 보관·상호 청취가 포함된 프리미엄 전용', desc: '전원이 완료해야 내일이 열리는 암송', href: '/tutorial/memorization' },
    { emoji: '📝', title: '말씀 노트', pricing: 'free', desc: '은혜받은 말씀과 적용을 기록해요', href: '/tutorial/note' },
    { emoji: '🙏', title: '기도', pricing: 'free', desc: '기도제목 나눔과 중보기도', href: '/tutorial/prayer' },
    { emoji: '✝️', title: '크라이스트 테스트', pricing: 'mixed', priceNote: '무료: 테스트·결과 · 프리미엄: 심층 결과지', desc: '나는 성경 속 어떤 인물일까?', href: '/tutorial/test' },
    { emoji: '⛪', title: '우리 교회', pricing: 'free', desc: '교인 명단·채팅·새신자 등록 (교회 공동체)', href: '/tutorial/church' },
    { emoji: '🤝', title: '잡박스', pricing: 'free', desc: '교회의 필요와 성도의 재능을 연결', href: '/tutorial/jobbox' },
    { emoji: '🕊️', title: '사역자 기능', pricing: 'free', desc: '새신자 관리·교인 명부·웹 대시보드', href: '/tutorial/minister' },
    { emoji: '🏆', title: '챌린지', pricing: 'free', desc: '함께 도전하는 신앙 습관 만들기', href: '/tutorial/challenges' },
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
};

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
            </div>
        </div>
    );
}
