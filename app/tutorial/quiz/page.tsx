import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '성경 퀴즈 365 — soluma 사용 설명서',
    description: '매일 새로운 성경 퀴즈로 말씀 지식을 점검하는 성경 퀴즈 365. 사용법과 무료 안내.',
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

export default function QuizTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>❓ 성경 퀴즈 365</h1>
                <p style={S.lead}>
                    <b>매일 새로운 성경 퀴즈</b>로 말씀 지식을 점검하는 1년 코스입니다.
                    하루 몇 분이면 충분해서 부담 없이 이어갈 수 있고,
                    풀수록 성경이 조금씩 더 또렷하게 보여요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>매일 새로운 문제</b> — 365일 코스로 하루하루 진행률이 쌓여요.</li>
                        <li><b>연속 일수 · 정답률 · 완료 횟수</b>가 기록돼 성장하는 재미가 있어요.</li>
                        <li>매일 퀴즈를 완료하면 <b>달란트</b>(앱 포인트) 보상을 받아요.</li>
                        <li>연속으로 이어가면 <b>보너스 달란트</b>가 더 커져요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>퀴즈 화면 둘러보기 · 오늘의 인물 확인</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>오늘의 퀴즈 도전 · 진행 기록 · 달란트 보상</td><td style={S.td}><span style={S.badgePremium}>프리미엄</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 퀴즈 도전은 <b>프리미엄 전용</b>이에요. 아직 구독 전이라면 [오늘의 퀴즈 풀기]를 누를 때
                    구독 안내가 먼저 나오고, 구독(월 $1.49 · 연 $15)하시면 바로 이용할 수 있어요.
                    구독료는 미자립교회 지원과 선교 사업에 쓰입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/quiz/word-tab.png" alt="말씀탭의 성경 퀴즈 365 버튼" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>말씀탭에서 열기</p>
                        <p style={S.p}>
                            하단의 <b>말씀</b> 탭을 열면 상단에 <b>성경 · 매일 큐티 · 성경 퀴즈 365</b> 세 버튼이 있어요.
                            여기서 <b>성경 퀴즈 365</b>를 누르면 시작됩니다.
                            아래로는 &lsquo;더 많은 기능&rsquo; 목록과 <b>오늘의 말씀</b> 카드도 함께 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <img src="/tutorial/quiz/main.png" alt="성경 퀴즈 365 메인 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>오늘의 퀴즈 풀기</p>
                        <ul style={S.ul}>
                            <li><b>상단 현황 카드</b> — 진행 중인 <b>DAY</b>, 연속 일수, 정답률, 완료 횟수와 <b>365일 진행바</b>가 보여요.</li>
                            <li><b>오늘의 인물</b> — 매일 성경 인물 한 명이 소개돼요 (예: 바울).</li>
                            <li><b>[오늘의 퀴즈 풀기]</b> 버튼을 누르면 오늘의 문제가 시작됩니다.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>보상 받기</p>
                        <p style={S.p}>
                            화면 아래 <b>퀴즈 보상</b> 카드에 안내된 대로,
                            <b>매일 5문제 완료 시 +10 달란트</b>를 받고,
                            <b>7일 연속 +50</b> · <b>30일 연속 +200</b> 보너스 달란트가 더해져요.
                            <b>365일을 완주</b>하면 크라이스타 별 1개가 주어집니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 하루 5문제, 잠들기 전이나 출근길 <b>습관 시간</b>을 정해두면 연속 기록이 쉽게 이어져요.<br />
                    💡 <b>연속 일수</b>가 보상의 핵심이에요 — 끊기지 않게 매일 잠깐이라도 들러보세요.<br />
                    💡 틀린 문제는 그냥 넘기지 말고 <b>성경에서 해당 구절</b>을 찾아 읽어보면 오래 남아요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
