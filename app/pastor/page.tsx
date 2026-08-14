import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'soluma Launch Invitation',
    description: '신앙 성장 솔루션 soluma에 초대합니다. 앱 소개 · 교회를 위한 기능 · 사용법 · ROOT의 비전 · 다운로드',
    openGraph: {
        title: '📜 soluma Launch Invitation',
        description: '신앙 성장 솔루션 soluma에 초대합니다.',
        url: 'https://christcare.us/pastor',
        siteName: 'soluma',
        images: ['/app-icon.png'],
        type: 'website',
    },
};

// 목사님께 링크로 전달하는 정식 런칭 초대장 (2026-08-15).
// 발표회(/advisory·/qr)와 같은 디자인 언어 — 인라인 스타일, 카드 섹션, QR.

const NAVY = '#0f172a';
const GREEN = '#16a34a';
const GREEN_DEEP = '#15803d';
const GOLD = '#b45309';
const SUB = '#475569';
const FAINT = '#64748b';
const LINE = '#e7e3da';

const IOS_URL = 'https://apps.apple.com/app/id6779090825';
const AOS_URL = 'https://play.google.com/store/apps/details?id=com.root2christ.christapp';

function Section({ tag, title, accent = GREEN, children }: { tag: string; title: string; accent?: string; children: React.ReactNode }) {
    return (
        <div style={{ marginTop: 20, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 22, padding: '26px 22px', boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: accent, letterSpacing: 1.5, marginBottom: 5 }}>{tag}</div>
            <h2 style={{ fontSize: 21, fontWeight: 900, color: NAVY, margin: '0 0 14px', lineHeight: 1.35 }}>{title}</h2>
            {children}
        </div>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return <p style={{ fontSize: 15, color: SUB, lineHeight: 1.85, margin: '0 0 12px' }}>{children}</p>;
}

function Feature({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
    return (
        <div style={{ flex: '1 1 240px', minWidth: 220, background: '#fbfaf7', border: `1px solid ${LINE}`, borderRadius: 16, padding: '16px 15px' }}>
            <div style={{ fontSize: 24, lineHeight: 1, marginBottom: 8 }}>{emoji}</div>
            <div style={{ fontSize: 15.5, fontWeight: 800, color: NAVY, marginBottom: 5 }}>{title}</div>
            <div style={{ fontSize: 13.5, color: SUB, lineHeight: 1.7 }}>{desc}</div>
        </div>
    );
}

function Step({ n, title, children }: { n: string; title: string; children?: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', gap: 14, marginBottom: 15 }}>
            <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, background: GREEN, color: '#fff', fontSize: 14.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.45 }}>{title}</div>
                {children && <div style={{ fontSize: 14.5, color: SUB, lineHeight: 1.75, marginTop: 4 }}>{children}</div>}
            </div>
        </div>
    );
}

function Shot({ src, label }: { src: string; label: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={label} style={{ width: 150, height: 'auto', borderRadius: 18, border: `1px solid ${LINE}`, display: 'block', boxShadow: '0 4px 14px rgba(15,23,42,0.08)' }} />
            <div style={{ fontSize: 12.5, fontWeight: 800, color: FAINT, marginTop: 8 }}>{label}</div>
        </div>
    );
}

export default function PastorInvitePage() {
    return (
        <div style={{ minHeight: '100dvh', background: 'linear-gradient(175deg,#f6f4ee,#faf8f3 45%,#f2f6f1)', padding: '40px 18px 70px' }}>
            <div style={{ maxWidth: 740, margin: '0 auto' }}>

                {/* ── 초대장 헤더 ── */}
                <div style={{ textAlign: 'center', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 26, padding: '40px 24px 34px', boxShadow: '0 4px 20px rgba(15,23,42,0.05)' }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: GOLD, letterSpacing: 3.5 }}>SOLUMA LAUNCH INVITATION</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/app-icon.png" alt="soluma" width={91} height={91} style={{ borderRadius: 22, margin: '18px 0 14px' }} />
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: NAVY, margin: 0, lineHeight: 1.4 }}>
                        신앙 성장 솔루션<br />솔루마에 초대합니다
                    </h1>
                    <p style={{ fontSize: 14.5, color: FAINT, lineHeight: 1.8, margin: '18px 0 0' }}>
                        말씀으로 하루를 시작하고, 공동체와 함께 자라나는<br />크리스천 신앙 성장 앱 — <b style={{ color: NAVY }}>soluma(솔루마)</b>
                    </p>
                </div>

                {/* ── 비전 ── */}
                <Section tag="ROOT의 비전" title="솔루마는 목적이 아니라 시작입니다" accent={GREEN_DEEP}>
                    <P>
                        주식회사 루트(ROOT)가 솔루마를 만드는 궁극적인 목적은 플랫폼 운영이나 수익 창출이 아닙니다.
                        우리가 꿈꾸는 가장 큰 비전은 <b style={{ color: NAVY }}>기독교 비영리 재단의 설립</b>입니다.
                        솔루마를 통해 만들어지는 가치와 수익이 다시 하나님 나라를 위해 사용되기를 소망합니다.
                    </P>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '16px 18px', margin: '4px 0 12px' }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: GREEN_DEEP, marginBottom: 8 }}>재단을 통해 감당하고자 하는 사역</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
                            {['비자립 교회 지원', '국내외 선교 사역 지원', '선교사·목회자 가정 지원', '다음 세대 장학 사업', '긴급 구호와 사랑 나눔', '복음 전파 프로젝트 후원'].map((v, i) => (
                                <span key={i} style={{ fontSize: 13.5, fontWeight: 700, color: '#166534' }}>✓ {v}</span>
                            ))}
                        </div>
                    </div>
                    <P>
                        재정을 흘려보내는 것에 머무르지 않고, 직접 현장을 찾아가 섬기고 함께 기도하며 몸으로 순종하는 공동체가 되고자 합니다.
                    </P>
                    <div style={{ textAlign: 'center', background: NAVY, borderRadius: 16, padding: '20px 18px', marginTop: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: '#86efac', letterSpacing: 2, marginBottom: 8 }}>비전 선언문</div>
                        <div style={{ fontSize: 15.5, fontWeight: 800, color: '#fff', lineHeight: 1.7 }}>
                            “모든 것은 뿌리 되신 하나님으로부터,<br />그리고 하나님께로.”
                        </div>
                    </div>
                </Section>

                {/* ── 인사말 ── */}
                <Section tag="인사말" title="함께해 주신 모든 분들께 감사드립니다" accent={GOLD}>
                    <P>
                        솔루마가 이 자리까지 올 수 있도록 기도와 조언으로 함께해 주신
                        <b style={{ color: NAVY }}> 라이트하우스 무브먼트의 목사님들과 성도님들</b>께 진심으로 감사드립니다.
                        주신 말씀 하나하나를 마음에 새기며 다듬어 온 솔루마가, 이제 <b style={{ color: NAVY }}>애플 앱스토어와 구글 플레이 정식 심사를 모두 통과</b>하여
                        <b style={{ color: GREEN_DEEP }}> 정식 런칭</b>을 맞이하게 되었습니다.
                    </P>
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '13px 15px', fontSize: 13.5, color: '#92400e', lineHeight: 1.7 }}>
                        📌 지난 자문회 때 <b>설치 파일(APK)로 받으셨던 테스트 버전</b>은 이제 옛 버전입니다.
                        번거로우시겠지만 <b>삭제하신 뒤 정식 버전</b>을 새로 설치해 주세요(설치 주소는 맨 아래에 있습니다). 기존 계정으로 로그인하시면 기록은 그대로 이어집니다.
                    </div>
                </Section>

                {/* ── 앱 소개 ── */}
                <Section tag="앱 소개" title="크라이스트 테스트에서 시작해, 매일의 말씀 생활로">
                    <P>
                        솔루마의 입구는 <b style={{ color: NAVY }}>크라이스트 테스트</b>입니다. 30개 문항으로 나의 신앙 유형을 성경 인물에 비추어 돌아보는 테스트로,
                        결과지를 통해 자연스럽게 말씀 묵상과 통독으로 이어지도록 설계했습니다. 테스트는 진단이 목적이 아니라
                        <b style={{ color: NAVY }}> 말씀 생활로 들어가는 문</b>입니다.
                    </P>
                    <P>
                        그 문을 지나면 — 365일 큐티, 성경 통독 플랜, 필사, 함께 암송, 말씀 노트, 기도제목과 간증을 나누는 공동체,
                        그리고 교회를 위한 사역 도구까지. 신앙 생활의 하루 리듬 전체를 한 앱에 담았습니다.
                    </P>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 18 }}>
                        <Shot src="/tutorial/test/intro.png" label="크라이스트 테스트" />
                        <Shot src="/tutorial/qt/word.png" label="오늘의 큐티" />
                        <Shot src="/tutorial/scripture/writing.png" label="성경 필사" />
                        <Shot src="/tutorial/scripture/keyboard.png" label="음성 필사" />
                        <Shot src="/tutorial/memorization/room.png" label="함께 암송" />
                        <Shot src="/tutorial/jobbox/main.png" label="잡박스" />
                        <Shot src="/tutorial/newcomer/form.png" label="새신자 등록" />
                        <Shot src="/tutorial/minister/roster.png" label="성도 관리" />
                    </div>
                </Section>

                {/* ── 주요 기능 ── */}
                <Section tag="주요 기능" title="성도의 하루를 채우는 기능들">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        <Feature emoji="✝️" title="크라이스트 테스트" desc="30문항으로 만나는 나의 신앙 유형과 성경 인물. 결과지에서 위로의 말씀과 기도문까지 이어집니다." />
                        <Feature emoji="🌅" title="큐티 365" desc="1년 365일, 하루도 빠짐없이 준비된 묵상. 본문 · 묵상 · 적용 · 기도로 이어지는 하루 10분." />
                        <Feature emoji="📖" title="성경 통독 · 읽기 플랜" desc="통독 플랜을 따라 읽고 진도가 자동 기록됩니다. 대한성서공회 정식 라이선스 성경 수록." />
                        <Feature emoji="✍️" title="성경 필사" desc="손으로 쓰거나 목소리로 읽어 필사합니다. 음성 인식이 본문과 대조해 진도를 확인해 줍니다." />
                        <Feature emoji="🎙️" title="함께 암송" desc="소그룹이 한 방에 모여 월~금 하루 한 절씩 암송하고, 서로의 녹음을 들으며 격려합니다. 토요일은 복습, 주일은 쉼." />
                        <Feature emoji="💼" title="잡박스(JobBox)" desc="교계 구인 · 재능 나눔 게시판. 반주, 디자인, 번역 등 성도의 은사가 교회들과 만납니다." />
                    </div>
                </Section>

                {/* ── 교회를 위한 기능 ── */}
                <Section tag="교회를 위한 기능" title="목회 현장을 돕는 사역자 전용 도구" accent="#7c3aed">
                    <P>
                        사역자로 인증되시면 아래 기능이 열립니다. 성도들에게는 보이지 않는 <b style={{ color: NAVY }}>사역자 전용</b> 영역입니다.
                    </P>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                        {[
                            ['🔔 새신자 등록 알림', '성도나 방문자가 앱에서 새신자 등록을 하면, 그 교회의 인증 사역자 휴대폰으로 즉시 알림이 갑니다. 심방과 환영이 빨라집니다.'],
                            ['💌 기도 편지', '사역자만 쓸 수 있는 목양 편지입니다. 교회 성도들에게 기도 제목과 위로의 말씀을 보내실 수 있습니다.'],
                            ['📋 교인 명부 · 임명', '우리 교회에 등록한 성도 명단을 보고, 부교역자·리더를 임명해 함께 섬길 수 있습니다.'],
                            ['💻 교회 웹 대시보드', 'christcare.us/church 에서 컴퓨터 큰 화면으로 교인 명부를 관리합니다. 휴대폰 카메라로 QR을 찍으면 비밀번호 없이 앱 계정으로 바로 로그인됩니다.'],
                        ].map(([h, b], i) => (
                            <div key={i} style={{ display: 'flex', gap: 11 }}>
                                <span style={{ flexShrink: 0, marginTop: 7, width: 7, height: 7, borderRadius: 7, background: '#7c3aed' }} />
                                <div>
                                    <span style={{ fontSize: 15.5, fontWeight: 800, color: NAVY }}>{h}</span>
                                    <span style={{ fontSize: 14.5, color: SUB, lineHeight: 1.75 }}> — {b}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 16, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: '13px 15px', fontSize: 13.5, color: '#6d28d9', lineHeight: 1.7 }}>
                        🔑 <b>사역자 인증 방법</b> — 앱 설치 후 홈의 「사역자 등록」에서 재직을 확인할 수 있는 서류(임명장·재직증명 등)를 사진으로 올려 주시면,
                        확인 후 인증해 드립니다. 어려우시면 아래 문의처로 연락 주세요. 저희가 도와드리겠습니다.
                    </div>
                </Section>

                {/* ── 시작 가이드 ── */}
                <Section tag="시작 가이드" title="5분이면 시작하실 수 있습니다">
                    <Step n="1" title="앱 설치">스토어에서 “솔루마” 검색 → 설치. (설치 주소는 이 초대장 맨 아래에 있습니다.)</Step>
                    <Step n="2" title="간편 로그인">카카오 · 구글 · 애플 계정으로 3초 만에 가입됩니다. 별도 비밀번호가 없습니다.</Step>
                    <Step n="3" title="크라이스트 테스트 (3분)">나의 신앙 유형을 확인해 보세요. 주변에 권하시기 전에 직접 경험해 보시면 좋습니다.</Step>
                    <Step n="4" title="우리 교회 등록">마이 탭에서 섬기시는 교회를 검색해 등록합니다. 교회가 없으면 새로 등록하실 수 있습니다.</Step>
                    <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: '13px 15px', fontSize: 13.5, color: '#6d28d9', lineHeight: 1.7, margin: '2px 0 12px' }}>
                        <b>*</b> 목회자의 경우, 홈 「사역자 등록」에서 <b>사역자 인증 신청</b>을 하시면 교회 기능이 열립니다.
                    </div>
                    <p style={{ fontSize: 13.5, color: FAINT, lineHeight: 1.7, margin: '6px 0 0' }}>
                        📖 자세한 화면별 사용법은 <a href="https://christcare.us/tutorial" style={{ color: GREEN_DEEP, fontWeight: 800 }}>christcare.us/tutorial</a> 에서 계속 채워지고 있습니다.
                    </p>
                </Section>

                {/* ── 안심하고 권하실 수 있습니다 ── */}
                <Section tag="신뢰" title="더 많은 크리스천들이 함께할 수 있도록, 주변에 솔루마를 추천해 주세요!" accent={GOLD}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                        {[
                            ['📜 정식 라이선스 성경', '개역개정을 비롯한 성경 본문은 대한성서공회와 정식 사용 계약을 맺고 수록했습니다.'],
                            ['🚫 AI 상담 없음', '신앙 상담을 인공지능에 맡기지 않습니다. 양육 콘텐츠는 성경 본문과 사람이 준비한 큐레이션으로만 구성해, 교리적 오류의 여지를 원천적으로 차단했습니다.'],
                            ['👨‍💼 목회자 자문 반영', '기능과 문구 하나하나를 목회자 자문회의 피드백으로 다듬었습니다. 앞으로도 목사님들의 조언 위에 세워 가겠습니다.'],
                        ].map(([h, b], i) => (
                            <div key={i} style={{ display: 'flex', gap: 11 }}>
                                <span style={{ flexShrink: 0, marginTop: 7, width: 7, height: 7, borderRadius: 7, background: GOLD }} />
                                <div>
                                    <span style={{ fontSize: 15.5, fontWeight: 800, color: NAVY }}>{h}</span>
                                    <span style={{ fontSize: 14.5, color: SUB, lineHeight: 1.75 }}> — {b}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── 맺음말 ── */}
                <div style={{ marginTop: 20, textAlign: 'center', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 22, padding: '30px 22px' }}>
                    <div style={{ fontSize: 20, lineHeight: 1 }}>🌱</div>
                    <p style={{ fontSize: 15.5, fontWeight: 800, color: NAVY, lineHeight: 1.8, margin: '12px 0 6px' }}>
                        솔루마의 첫걸음에<br />많은 성원과 격려 부탁드립니다.
                    </p>

                    {/* 앱 다운로드 — 초대장 맨 마지막에 배치 (중간 DOWNLOAD·QR 섹션은 제거) */}
                    <div style={{ borderTop: `1px solid ${LINE}`, margin: '22px 0 0', paddingTop: 22 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 900, color: GOLD, letterSpacing: 2, marginBottom: 10 }}>앱 다운로드</div>
                        <p style={{ fontSize: 14, color: SUB, lineHeight: 1.8, margin: '0 0 14px' }}>
                            스토어에서 <b style={{ color: NAVY }}>“솔루마”</b> 또는 <b style={{ color: NAVY }}>“soluma”</b>를 검색하시거나,<br />아래 주소로 바로 설치하실 수 있습니다.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                            <a href={IOS_URL} target="_blank" rel="noopener noreferrer"
                                style={{ flex: '1 1 220px', maxWidth: 300, background: NAVY, color: '#fff', fontSize: 14.5, fontWeight: 800, textDecoration: 'none', borderRadius: 12, padding: '13px 0' }}>
                                 App Store (아이폰) →
                            </a>
                            <a href={AOS_URL} target="_blank" rel="noopener noreferrer"
                                style={{ flex: '1 1 220px', maxWidth: 300, background: GREEN_DEEP, color: '#fff', fontSize: 14.5, fontWeight: 800, textDecoration: 'none', borderRadius: 12, padding: '13px 0' }}>
                                ▶ Google Play (안드로이드) →
                            </a>
                        </div>
                    </div>

                    <p style={{ fontSize: 14, color: SUB, lineHeight: 1.8, margin: '24px 0 18px' }}>
                        교회 도입 안내, 사역자 인증, 사용 중 궁금하신 점 —<br />언제든 편하게 연락 주십시오.
                    </p>
                    <a href="mailto:master@root2christ.com" style={{ display: 'inline-block', background: GREEN, color: '#fff', fontSize: 14.5, fontWeight: 800, textDecoration: 'none', borderRadius: 12, padding: '13px 26px' }}>
                        ✉️ master@root2christ.com
                    </a>
                </div>

                <p style={{ textAlign: 'center', marginTop: 26, fontSize: 12.5, color: '#a8a29e', fontWeight: 800, letterSpacing: 1, lineHeight: 1.8 }}>
                    주식회사 루트 · ROOT Inc.<br />soluma — Find your light in Scripture
                </p>
            </div>
        </div>
    );
}
