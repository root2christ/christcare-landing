import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '챌린지 — soluma 사용 설명서',
    description: '40일 새벽기도, 100일 감사일기 등 함께 도전하며 신앙 습관을 만드는 챌린지. 사용법과 무료 안내.',
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

export default function ChallengesTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🔥 챌린지</h1>
                <p style={S.lead}>
                    <b>40일 새벽기도, 100일 감사일기</b> 같은 목표에 도전해
                    매일 기록하며 <b>진행률을 쌓아가는</b> 신앙 습관 기능입니다.
                    혼자서는 작심삼일이던 결심도, 공개 챌린지나 소그룹 챌린지로 함께하면 완주까지 갑니다.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>기록할 때마다 <b>진행률 게이지</b>가 차올라요 — 며칠째인지, 몇 %인지 한눈에 보여요.</li>
                        <li><b>공개 챌린지</b>로 여러 성도와 함께, 또는 <b>소그룹 챌린지</b>로 우리 모임끼리 도전할 수 있어요.</li>
                        <li><b>필사·큐티·암송</b> 등 앱의 다른 기능과 연동된 챌린지가 있어요 — 예를 들어 &lsquo;주 3회 말씀 암송&rsquo;은 [하러 가기]로 암송 기능과 바로 이어져요.</li>
                        <li>&lsquo;40일 새벽기도&rsquo;처럼 <b>기록 가능 시간</b>(예: 5시~7시)이 정해진 챌린지는 그 시간의 실천을 진짜로 지켜줘요.</li>
                        <li>챌린지 기록 시 <b>달란트(+5T)</b> 보상을 받아요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>챌린지 참여 · 기록 · 진행률 확인</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 챌린지는 무료로 사용할 수 있어요.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/challenges/main.png" alt="챌린지 메인 화면 — 나의 챌린지 목록과 진행률" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>챌린지 화면 한눈에 보기</p>
                        <ul style={S.ul}>
                            <li><span style={{ ...S.dot, background: '#10b981' }} /><b>① 릴레이</b> — 상단의 <b>시간 릴레이</b>(끊김 없는 기도 사슬)와 <b>중보 릴레이</b>(돌아가며 음성 중보)로 함께 기도를 이어가요.</li>
                            <li><span style={{ ...S.dot, background: '#3b82f6' }} /><b>② 나의 챌린지</b> — 참여 중인 챌린지 목록이에요. <b>40일 새벽기도 챌린지</b>, <b>100일 감사일기</b>, <b>주 3회 말씀 암송</b>, <b>21일 금식기도</b>처럼 각 카드에 진행률(0/40 days 등)이 보여요.</li>
                            <li><span style={{ ...S.dot, background: '#f59e0b' }} /><b>③ 공개 · +5T 배지</b> — 공개 챌린지 여부와 기록 시 받는 달란트 보상이 표시돼요.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>오늘 실천하고 기록하기</p>
                        <p style={S.p}>
                            실천한 날에는 챌린지 카드의 <b>[기록하기]</b>를 눌러 진행률을 쌓으세요.
                            &lsquo;40일 새벽기도&rsquo;처럼 <b>기록 가능 시간(5시~7시)</b>이 정해진 챌린지는
                            그 시간 안에만 기록할 수 있어요.
                            &lsquo;주 3회 말씀 암송&rsquo; 같은 연동 챌린지는 <b>[하러 가기 →]</b>를 누르면
                            해당 기능으로 바로 이동해 실천과 기록을 함께 해결해요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>완주까지 이어가기</p>
                        <p style={S.p}>
                            진행률 게이지가 100%가 되면 완주예요.
                            오른쪽 위 <b>기록</b>에서 그동안의 기록을 돌아볼 수 있고,
                            끝난 챌린지는 새 챌린지로 갈아타며 신앙 습관을 이어가면 됩니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 처음엔 <b>21일짜리 짧은 챌린지</b>부터 완주해보세요 — 완주 경험이 다음 도전의 힘이 됩니다.<br />
                    💡 <b>소그룹 챌린지</b>로 함께 도전하면 서로의 진행률이 자극이 돼서 완주율이 훨씬 높아져요.<br />
                    💡 필사·큐티·암송 <b>연동 챌린지</b>를 활용하면 어차피 하던 경건 생활이 그대로 챌린지 진행률이 돼요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
