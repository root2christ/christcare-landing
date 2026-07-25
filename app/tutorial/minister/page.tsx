import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '사역자 기능 — soluma 사용 설명서',
    description: '담임목사·부목사·전도사를 위한 사역자 인증과 도구 — 등록 카드 관리, 교회 명부, 웹 대시보드까지. 전부 무료.',
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

export default function MinisterTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🕊️ 사역자 기능</h1>
                <p style={S.lead}>
                    <b>사역자·목회자를 위한 안내 페이지</b>입니다.
                    담임목사·부목사·전도사 등 사역자로 인증받으면 새신자 등록 카드 관리, 교회 명부,
                    봉사자 모집, 웹 대시보드까지 — 목양에 필요한 도구가 모두 열립니다. 전부 무료예요.
                </p>

                <h2 style={S.h2}>사역자 인증 받기</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li><b>① 사역자 등록</b> — <b>My탭</b> 또는 <b>잡박스</b>에서 사역자 등록을 시작하세요.</li>
                        <li><b>② 교회 선택 + 증빙 서류</b> — 섬기는 교회를 검색해 선택하고 증빙 서류를 제출해요.</li>
                        <li><b>③ 관리자 승인</b> — 승인이 완료되면 인증 사역자가 되고 아래 기능이 모두 열려요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>인증되면 할 수 있는 일</h2>
                <table style={S.table}>
                    <thead>
                        <tr><th style={S.th}>기능</th><th style={S.th}>구분</th></tr>
                    </thead>
                    <tbody>
                        <tr><td style={S.td}>새신자·기존교인 <b>등록 카드 관리</b> — 등록 양식 만들기 · 제출 시 푸시 알림 수신</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}><b>교회 명부</b> — 등록 카드 + 앱 교인을 한곳에서 열람</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>우리 교회 명단에서 <b>등록 카드 열람</b> · <b>사역자 임명</b>(목사)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}>잡박스 <b>봉사자 모집 공고</b> 등록 (&lsquo;인증됨&rsquo; 배지)</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                        <tr><td style={S.td}><b>웹 대시보드</b> christcare.us/church — 컴퓨터에서 명부 열람</td><td style={S.td}><span style={S.badgeFree}>무료</span></td></tr>
                    </tbody>
                </table>
                <p style={{ ...S.p, fontSize: 13.5, color: '#94a3b8', marginTop: 8 }}>
                    · 사역자 기능은 전부 무료입니다.
                </p>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/minister/roster.png" alt="교회 명부 화면 — 등록 카드와 앱 교인 탭" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>교회 명부 열기</p>
                        <p style={S.p}>
                            인증 사역자에게 열리는 <b>교회 명부</b>입니다. 상단에 탭이 두 개 있어요 —
                        </p>
                        <ul style={S.ul}>
                            <li><b>등록 카드</b> — 새신자·기존교인이 제출한 등록 카드 목록. <b>전체 · 새신자 · 기존 교인</b> 칩으로 걸러볼 수 있어요. 화면처럼 아직 제출이 없으면 &lsquo;아직 등록자가 없어요&rsquo;라고 표시됩니다.</li>
                            <li><b>앱 교인</b> — 우리 교회로 등록한 앱 사용자 명단 (화면에서는 8명).</li>
                        </ul>
                        <p style={S.p}>
                            성도가 등록 카드를 제출하면 인증 사역자에게 <b>푸시 알림</b>이 도착해
                            새 가족을 놓치지 않고 맞이할 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>명단에서 등록 카드 열람 · 사역자 임명</p>
                        <p style={S.p}>
                            커뮤니티 탭의 <Link href="/tutorial/church" style={{ color: '#0f766e', fontWeight: 800 }}>우리 교회</Link> 명단에서
                            교인을 탭하면 <b>등록 카드 내용</b>을 열람할 수 있어요.
                            목사님은 성도를 <b>사역자로 임명</b>할 수 있고, 임명된 사역자는 명단에 직분 칩으로 표시됩니다.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>잡박스에서 봉사자 모집하기</p>
                        <p style={S.p}>
                            <Link href="/tutorial/jobbox" style={{ color: '#0f766e', fontWeight: 800 }}>잡박스</Link>에서
                            <b> 봉사자 모집 공고</b>를 올릴 수 있어요. 공고에는 <b>&lsquo;인증됨&rsquo; 배지</b>가 붙어
                            성도들이 안심하고 지원합니다. 구인 공고 등록은 인증 사역자만 할 수 있어요.
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>4</span>컴퓨터에서 웹 대시보드 사용하기</p>
                        <p style={S.p}>
                            컴퓨터 브라우저에서 <b>christcare.us/church</b>를 열면 교회 명부를 큰 화면으로 볼 수 있어요.
                            로그인은 간단합니다 — 화면에 뜬 QR 코드를 <b>폰 기본 카메라로 스캔</b>하면
                            앱이 열리면서 로그인 승인을 물어보고, 승인하면 바로 접속돼요.
                            비밀번호를 입력할 필요가 없습니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 등록 카드 푸시 알림을 받으려면 인증 후 <b>앱을 한 번 열어</b> 알림 수신을 준비해 두세요.<br />
                    💡 등록 양식은 우리 교회에 맞게 만들 수 있어요 — 새신자용과 기존교인용을 나눠 운영해 보세요.<br />
                    💡 성도 안내가 필요하면 <Link href="/tutorial/church" style={{ color: '#7c5a10', fontWeight: 800 }}>우리 교회 사용법</Link>을 공유해 주세요.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
