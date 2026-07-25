import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '설정 · 언어 — soluma 사용 설명서',
    description: '알림·계정·언어 설정. 언어는 시스템 따르기/한국어/English/日本語, 성경·큐티 콘텐츠도 언어를 따라가요.',
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

export default function SettingsTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>⚙️ 설정 · 언어</h1>
                <p style={S.lead}>
                    <b>알림 · 계정 · 언어</b>를 관리하는 곳입니다.
                    알림 시간을 조정하고, 앱 언어를 바꾸고, 계정을 관리하는 일이 모두 여기에서 이루어져요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>큐티·통독 <b>알림 시간</b>을 내 생활에 맞게 조정할 수 있어요.</li>
                        <li>앱 <b>언어</b>를 한국어 · English · 日本語 중에서 고를 수 있고, 성경·큐티 콘텐츠도 함께 바뀌어요.</li>
                        <li>계정 정보 확인, 업데이트 확인, 로그아웃·계정 삭제까지 <b>한곳에서</b> 처리해요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>무료와 프리미엄</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>알림 · 계정 · 언어 설정 전체</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 설정은 모든 항목이 무료입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/settings/main.png" alt="설정 화면" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>설정 화면 한눈에 보기</p>
                        <ul style={S.ul}>
                            <li><b>계정</b> — 내 프로필(이름·이메일)과 <b>내 진단 결과 보기</b>(테스트 히스토리 확인)가 있어요.</li>
                            <li><b>멤버십</b> — <b>프리미엄 구독 관리</b>에서 구독을 확인·관리해요.</li>
                            <li><b>환경 설정</b> — <b>알림 설정</b>(큐티·통독 알림 시간 관리)과 <b>업데이트 확인</b>(최신 버전으로 업데이트)이 있어요.</li>
                            <li>화면의 <b>관리자</b> 섹션(사역자 신청 승인)은 해당 권한이 있는 계정에만 보여요.</li>
                        </ul>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>언어 바꾸기</p>
                        <p style={S.p}>
                            환경 설정에서 언어를 <b>시스템 따르기 · 한국어 · English · 日本語</b> 중에 고를 수 있어요.
                            기본은 <b>폰의 시스템 언어를 자동으로 따라갑니다</b> —
                            한국어 폰이면 한국어, 일본어 폰이면 일본어, 그 외에는 영어로 표시돼요.
                        </p>
                        <p style={S.p}>
                            언어를 바꾸면 화면 글자만 바뀌는 게 아니라 <b>성경·큐티 콘텐츠도 그 언어를 따라갑니다</b> —
                            한국어는 <b>개역한글</b>, English는 <b>WEB</b>, 日本語는 <b>口語訳</b> 성경으로 함께 바뀌어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>업데이트 · 로그아웃 · 계정 삭제</p>
                        <p style={S.p}>
                            <b>업데이트 확인</b>은 환경 설정 안에 있어요 — 누르면 최신 버전으로 업데이트합니다.
                            <b>로그아웃</b>과 <b>계정 삭제</b>는 설정 화면을 아래로 스크롤하면 맨 아래쪽에 있어요.
                            계정 삭제는 되돌릴 수 없으니 신중히 진행해주세요.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 언어는 따로 설정하지 않아도 <b>폰 시스템 언어를 자동으로</b> 따라가요 — 대부분은 건드릴 필요가 없어요.<br />
                    💡 <b>알림 설정</b>에서 큐티·통독 알림 시간을 내 묵상 시간에 맞춰두면 습관 만들기가 쉬워져요.<br />
                    💡 앱이 이상하게 동작하면 먼저 <b>업데이트 확인</b>을 눌러 최신 버전인지 확인해보세요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
