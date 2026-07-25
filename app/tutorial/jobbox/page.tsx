import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '잡박스 — soluma 사용 설명서',
    description: '교회의 필요(구인 공고)와 성도의 재능을 연결하는 잡박스(JobBox). 재능 등록 · 구인 게시판 · 사역 후기, 전부 무료.',
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

export default function JobboxTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>💼 잡박스 (JobBox)</h1>
                <p style={S.lead}>
                    <b>교회의 필요(구인 공고)와 성도의 재능을 연결</b>하는 공간입니다.
                    건축·설비, 찬양·예배 같은 분야별로 내 재능을 등록해 두면 교회의 구인 소식을 받아볼 수 있고,
                    교회는 인증 사역자를 통해 봉사자를 모집할 수 있어요. 열람도 등록도 전부 무료입니다.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>내 재능을 등록해 두면 <b>구인 소식 알림</b>을 받아 섬길 기회를 놓치지 않아요.</li>
                        <li>지역은 <b>전세계 검색</b>을 지원해요 — 국내는 물론 해외 교회와도 연결됩니다.</li>
                        <li>페이는 <b>무료 봉사</b>부터 <b>통화(₩ $ ¥) + 회/시간/일/월 단위</b>까지 자유롭게 정할 수 있어요.</li>
                        <li>구인 공고는 <b>인증 사역자만</b> 올릴 수 있어 &lsquo;인증됨&rsquo; 배지를 보고 안심하고 지원할 수 있어요.</li>
                        <li><b>사역 후기</b>로 실제 섬김의 이야기를 나누고 읽을 수 있어요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료 안내</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>재능 등록 · 등록된 재능 둘러보기</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>구인 게시판 열람 · 지원</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>봉사자 모집 공고 등록 (인증 사역자)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 잡박스의 모든 기능은 구독 없이 누구나 쓸 수 있습니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/jobbox/main.png" alt="잡박스 메인 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>잡박스 탭 열기</p>
                        <p style={S.p}>
                            하단 <b>JobBox</b> 탭을 누르면 &lsquo;교회의 필요와 성도의 달란트를 연결합니다&rsquo;라는
                            소개와 함께 메인이 열려요. 위에서부터 —
                        </p>
                        <ul style={S.ul}>
                            <li><b>카테고리 칩</b> — 전체 · 🔧 건축/설비 · 🎵 찬양/예배 등 분야별로 골라볼 수 있어요.</li>
                            <li><b>내 재능 등록하기</b> — 섬길 수 있는 분야를 등록하고 구인 알림 받기.</li>
                            <li><b>🤝 등록된 재능 둘러보기</b> — 함께할 일꾼 찾아보기.</li>
                            <li><b>📋 구인 게시판</b> — 교회들이 올린 구인 공고 목록.</li>
                            <li><b>✨ 사역 후기</b> — 실제 매칭 후 남긴 후기.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/jobbox/browse.png" alt="잡박스의 구인 게시판과 사역 후기" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>재능 등록하고, 둘러보고, 지원하기</p>
                        <p style={S.p}>
                            <b>내 재능 등록하기</b>에서는 <b>카테고리 · 소개 · 지역(전세계 검색) · 페이</b>를 적어요.
                            페이는 <b>무료 봉사</b>로 하거나, 통화(₩ $ ¥)를 골라 <b>회/시간/일/월</b> 단위로 정할 수 있어요.
                            <b> 등록된 재능 둘러보기</b>에서 다른 성도들의 재능을 살펴보고,
                            <b> 구인 게시판</b>에서 공고를 확인해 지원하면 됩니다.
                        </p>
                        <p style={S.p}>
                            화면처럼 아직 공고가 없으면 &lsquo;현재 등록된 구인 공고가 없어요 —
                            새로운 구인 공고가 올라오면 알려드릴게요!&rsquo;라고 안내돼요.
                            아래 <b>사역 후기</b>에는 &lsquo;지붕 수리를 도와드린 후 어르신들이 눈물 흘리시며
                            감사하셨어요&rsquo; 같은 실제 섬김의 이야기가 올라옵니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/jobbox/trust.png" alt="안심하고 섬기세요 — 인증됨 배지 안내" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>안심하고 섬기세요 — 인증됨 배지</p>
                        <p style={S.p}>
                            메인 아래쪽 <b>🤝 안심하고 섬기세요</b> 안내를 확인하세요.
                            <b> 일꾼분들께</b> — ✅ <b>&lsquo;인증됨&rsquo; 배지</b>가 있는 교회는 인증된 목회자가
                            등록한 곳이니 안심하고 재능을 나눌 수 있어요.
                        </p>
                        <p style={S.p}>
                            <b>사역자분들께</b> (담임목사 · 부목사 · 전도사 · 선교사) — 3단계로 안내돼요.
                        </p>
                        <ul style={S.ul}>
                            <li>❶ 사역자 등록 및 인증을 완료하세요</li>
                            <li>❷ 봉사 모집 공고를 등록하세요</li>
                            <li>❸ &lsquo;인증됨&rsquo; 배지와 함께 봉사자를 모집하세요</li>
                        </ul>
                        <p style={S.p}>
                            아래 <b>[봉사자 모집 공고 등록하기 →]</b> 버튼으로 바로 시작할 수 있어요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 재능 소개는 구체적으로 — 어떤 장비·경력이 있는지 적으면 매칭 확률이 올라가요.<br />
                    💡 구인 공고 등록은 인증 사역자 전용이에요. 인증 방법은 <Link href="/tutorial/minister" style={{ color: '#7c5a10', fontWeight: 800 }}>사역자 기능 안내</Link>에서 확인하세요.<br />
                    💡 섬김을 마쳤다면 <b>사역 후기</b>를 남겨 주세요 — 다음 일꾼과 교회에 큰 힘이 됩니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
