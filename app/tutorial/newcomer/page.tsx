import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '새신자 등록 — soluma 사용 설명서',
    description: '종이 등록 카드를 앱으로 — 교회를 선택하고 새신자/기존신자로 등록하면 사역자에게 바로 전달됩니다.',
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
    step: { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' as const, margin: '0 0 30px' },
    stepText: { flex: '1 1 300px', minWidth: 280 },
    stepNum: { display: 'inline-flex', width: 30, height: 30, borderRadius: 15, background: '#2f9e6f', color: '#fff', fontWeight: 900, alignItems: 'center', justifyContent: 'center', marginRight: 9, fontSize: 15 },
    stepTitle: { fontSize: 17.5, fontWeight: 900, color: '#1e293b', margin: '0 0 8px', display: 'flex', alignItems: 'center' },
    shot: { width: 250, maxWidth: '100%', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 8px 22px rgba(15,23,42,.12)' },
    badgeFree: { background: '#e3f4ec', color: '#0f766e', borderRadius: 999, padding: '3px 11px', fontSize: 12.5, fontWeight: 800, whiteSpace: 'nowrap' as const },
    tip: { background: '#fdf9f0', border: '1.5px solid #f2d8a8', borderRadius: 14, padding: '14px 18px', color: '#7c5a10', fontSize: 14.5, lineHeight: 1.8 },
};

export default function NewcomerTutorial() {
    return (
        <div style={S.page}>
            <div style={S.wrap}>
                <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                <h1 style={S.h1}>🪪 새신자 등록</h1>
                <p style={S.lead}>
                    교회에서 종이로 쓰던 <b>새신자 등록 카드를 앱으로</b> 대신합니다.
                    교회를 고르고 몇 가지 질문에 답해 제출하면, 그 교회의 <b>사역자에게 바로 전달</b>되고
                    푸시 알림까지 갑니다. 처음 오신 분도, 원래 다니던 분(기존신자 등록)도 사용할 수 있어요.
                </p>

                <h2 style={S.h2}>이런 점이 좋아요</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>주보 사이 종이 카드가 필요 없어요 — <b>폰에서 1~2분</b>이면 등록 끝.</li>
                        <li>제출 즉시 <b>그 교회 사역자에게 푸시 알림</b>이 가서 심방·환영이 빨라져요.</li>
                        <li><b>새신자 / 기존신자</b>를 선택해 등록 — 교인 명부 정리에도 쓰여요.</li>
                        <li>등록하면 <b>내 프로필에 교회가 자동 연결</b>돼 커뮤니티의 "우리 교회"가 열려요.</li>
                        <li>교회가 자체 등록 양식을 만들어 두었다면 그 양식으로, 없으면 기본 문항으로 작성돼요.</li>
                        <li>전부 <span style={S.badgeFree}>무료</span> 입니다.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>사용법</h2>

                <div style={S.step}>
                    <img src="/tutorial/church/community.png" alt="커뮤니티 탭의 우리 교회 카드" style={S.shot} />
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>1</span>등록 화면 열기</p>
                        <p style={S.p}>
                            두 곳에서 들어갈 수 있어요:<br />
                            · <b>커뮤니티 탭</b> 상단 우리 교회 카드 (아직 교회가 없을 때)<br />
                            · <b>My 탭 → 새신자 등록</b> 메뉴
                        </p>
                    </div>
                </div>

                <div style={S.step}>
                    <div style={S.stepText}>
                        <p style={S.stepTitle}><span style={S.stepNum}>2</span>교회 선택</p>
                        <p style={S.p}>
                            교회 이름으로 검색해 선택합니다. 목록에 없는 교회는 검색 창에서 바로 등록할 수 있어요.
                        </p>
                        <p style={S.stepTitle}><span style={S.stepNum}>3</span>새신자 / 기존신자 선택</p>
                        <p style={S.p}>
                            처음 나가는 교회라면 <b>새신자</b>, 원래 다니던 교회를 앱에 연결하는 것이라면 <b>기존신자</b>를 선택하세요.
                        </p>
                        <p style={S.stepTitle}><span style={S.stepNum}>4</span>질문 작성 후 제출</p>
                        <p style={S.p}>
                            이름·연락처·거주 지역·방문 계기·신앙 배경·기도제목 같은 기본 문항에 답하고 제출하면 끝!
                            제출 내용은 <b>그 교회의 인증 사역자만</b> 볼 수 있습니다.
                        </p>
                    </div>
                </div>

                <h2 style={S.h2}>제출하면 어떻게 되나요?</h2>
                <div style={S.card}>
                    <ul style={S.ul}>
                        <li>교회 사역자·목사님에게 <b>푸시 알림</b>이 가고, 사역자의 <b>교회 명부</b>에 카드가 정리돼요.</li>
                        <li>내 프로필에 교회가 연결되어 <b>우리 교회 명단·교회 기도</b>를 볼 수 있게 됩니다.</li>
                        <li>작성한 내용은 명부에서 새신자/기존신자로 구분되어 관리돼요.</li>
                    </ul>
                </div>

                <h2 style={S.h2}>알아두면 좋은 팁</h2>
                <div style={S.tip}>
                    💡 교회 사역자시라면 — <Link href="/tutorial/minister" style={{ color: '#7c5a10', fontWeight: 800 }}>사역자 기능</Link>에서
                    등록 카드가 어떻게 모이는지 확인해보세요.<br />
                    💡 기도제목을 적어두면 교회에서 더 잘 섬겨드릴 수 있어요.<br />
                    💡 등록 후 커뮤니티 탭에서 우리 교회 사람들과 바로 인사할 수 있습니다.
                </div>

                <p style={{ marginTop: 40 }}>
                    <Link href="/tutorial" style={S.back}>← 사용 설명서 전체 보기</Link>
                </p>
            </div>
        </div>
    );
}
