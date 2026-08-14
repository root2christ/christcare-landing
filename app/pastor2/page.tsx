import type { Metadata } from 'next';
import { Noto_Serif_KR, Great_Vibes } from 'next/font/google';
import Stardust from '../_components/Stardust';

export const metadata: Metadata = {
    title: 'soluma Launch Invitation',
    description: '신앙 성장 솔루션 soluma에 초대합니다. 앱 소개 · 교회를 위한 기능 · 사용법 · ROOT의 비전 · 다운로드',
    robots: { index: false }, // 시안 비교용 페이지 — 검색 노출 제외
    openGraph: {
        title: 'soluma Launch Invitation',
        description: '신앙 성장 솔루션 soluma에 초대합니다.',
        url: 'https://christcare.us/pastor2',
        siteName: 'soluma',
        images: ['/app-icon.png'],
        type: 'website',
    },
};

// ── /pastor2 — 클래식 포멀 초대장 시안 (2026-08-14 피드백: 베이지·브릭·블랙 톤 정리) ──
// 레퍼런스: 얇은 이중 프레임 + 자간 넓은 대문자 라벨 + 세리프 제목 + 스크립트 악센트.
// 내용은 /pastor 와 동일 — 디자인만 비교하기 위한 페이지다.

const serif = Noto_Serif_KR({ weight: ['400', '600', '700', '900'], preload: false });
const script = Great_Vibes({ weight: '400', subsets: ['latin'] });

const BRICK = '#8f3a2c';
const BRICK_DEEP = '#742d21';
const INK = '#262019';
const SUB = '#4f473c';
const FAINT = '#8a7f6e';
const HAIR = '#d8c9ae';
const PAPER = '#faf6ec';

const IOS_URL = 'https://apps.apple.com/app/id6779090825';
const AOS_URL = 'https://play.google.com/store/apps/details?id=com.root2christ.christapp';

/** 자간 넓은 대문자/한글 라벨 — 클래식 초대장의 안내 줄 */
function Caps({ children, color = INK, size = 12.5 }: { children: React.ReactNode; color?: string; size?: number }) {
    return (
        <div style={{ fontSize: size, fontWeight: 600, color, letterSpacing: 4, textTransform: 'uppercase' as const, lineHeight: 1.9 }}>
            {children}
        </div>
    );
}

/** 브릭 색 가는 구분 장식 — 선·다이아·선 */
function Rule({ margin = '26px auto' }: { margin?: string }) {
    return (
        <svg width="150" height="12" viewBox="0 0 150 12" aria-hidden style={{ display: 'block', margin }}>
            <line x1="14" y1="6" x2="62" y2="6" stroke={BRICK} strokeWidth="0.9" opacity="0.75" />
            <line x1="88" y1="6" x2="136" y2="6" stroke={BRICK} strokeWidth="0.9" opacity="0.75" />
            <path d="M75,1.6 L79.4,6 L75,10.4 L70.6,6 Z" fill={BRICK} opacity="0.9" />
        </svg>
    );
}

/** 섹션 머리 — 자간 라벨 + 세리프 제목 (카드 없이 흐른다) */
function Head({ label, title }: { label: string; title: string }) {
    return (
        <div style={{ textAlign: 'center', margin: '52px 0 22px' }}>
            <Caps color={FAINT}>{label}</Caps>
            {title ? <h2 style={{ fontSize: 23, fontWeight: 700, color: BRICK_DEEP, margin: '8px 0 0', lineHeight: 1.45, letterSpacing: 0.5 }}>{title}</h2> : null}
        </div>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return <p style={{ fontSize: 15, color: SUB, lineHeight: 1.95, margin: '0 0 14px' }}>{children}</p>;
}

function Feature({ title, desc }: { title: string; desc: string }) {
    return (
        <div style={{ flex: '1 1 240px', minWidth: 220, borderTop: `1px solid ${HAIR}`, padding: '14px 4px 4px' }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: INK, marginBottom: 5 }}>{title}</div>
            <div style={{ fontSize: 13.5, color: SUB, lineHeight: 1.75 }}>{desc}</div>
        </div>
    );
}

function Step({ n, title, children }: { n: string; title: string; children?: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
            <div style={{ flexShrink: 0, width: 34, textAlign: 'center' }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: BRICK, lineHeight: 1 }}>{n}</div>
                <div style={{ width: 1, height: 'calc(100% - 24px)', background: HAIR, margin: '6px auto 0' }} />
            </div>
            <div style={{ flex: 1, paddingBottom: 2 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: INK, lineHeight: 1.5 }}>{title}</div>
                {children && <div style={{ fontSize: 14, color: SUB, lineHeight: 1.8, marginTop: 3 }}>{children}</div>}
            </div>
        </div>
    );
}

function Shot({ src, label }: { src: string; label: string }) {
    return (
        <div style={{ textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={label} style={{ width: 138, height: 'auto', borderRadius: 14, border: `1px solid ${HAIR}`, display: 'block', boxShadow: '0 3px 10px rgba(38,32,25,0.08)' }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: FAINT, marginTop: 8, letterSpacing: 1 }}>{label}</div>
        </div>
    );
}

export default function PastorInviteV2Page() {
    return (
        <div className={serif.className} style={{ minHeight: '100dvh', background: '#e8dfcd', padding: '30px 12px 64px' }}>
            {/* 카드 — 크림 종이 + 브릭 이중 프레임 (외곽 실선 + 안쪽 점선) */}
            <div style={{ maxWidth: 720, margin: '0 auto', background: PAPER, border: `1.5px solid ${BRICK}`, padding: 9, boxShadow: '0 14px 40px rgba(56,38,25,0.18)' }}>
                <div style={{ position: 'relative', overflow: 'hidden', border: `1px dotted ${BRICK}`, padding: '46px 22px 42px' }}>

                    {/* 앱 아이콘 글레어(부드러운 빛 스침) + 별가루 반짝임 */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        .icon-stage { position: relative; display: inline-block; }
                        .icon-glare { position: relative; display: inline-block; overflow: hidden; }
                        .icon-glare::after { content:''; position:absolute; top:-60%; left:-90%; width:34%; height:220%;
                            background: linear-gradient(115deg, rgba(255,255,255,0) 22%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 78%);
                            transform: rotate(10deg); filter: blur(3px);
                            animation: iconShine 6s cubic-bezier(.45,.05,.35,1) infinite; }
                        @keyframes iconShine { 0% { left:-90%; } 32% { left:150%; } 100% { left:150%; } }
                    ` }} />
                    {/* ── 헤더 ── */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                            <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(90deg,transparent,${BRICK})` }} />
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: BRICK_DEEP, letterSpacing: 4 }}>SOLUMA LAUNCH INVITATION</span>
                            <span aria-hidden style={{ width: 40, height: 1, background: `linear-gradient(270deg,transparent,${BRICK})` }} />
                        </div>
                        <span className="icon-stage" style={{ margin: '26px 0 22px' }}>
                            <span aria-hidden style={{ position: 'absolute', top: -90, left: -37, right: -37, bottom: -18 }}>
                                <Stardust />
                            </span>
                            <span className="icon-glare" style={{ borderRadius: 17, boxShadow: '0 6px 16px rgba(38,32,25,0.22), 0 0 22px rgba(203,141,66,0.3)' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/app-icon.png" alt="soluma" width={74} height={74} style={{ display: 'block', borderRadius: 17 }} />
                            </span>
                        </span>
                        <h1 style={{ fontSize: 40, fontWeight: 900, color: BRICK_DEEP, margin: 0, lineHeight: 1.1, letterSpacing: 6 }}>
                            SOLUMA
                        </h1>
                        <div className={script.className} style={{ fontSize: 34, color: INK, margin: '10px 0 0', lineHeight: 1.2 }}>
                            Launch Invitation
                        </div>
                        <Rule margin="24px auto" />
                        <div style={{ fontSize: 17, fontWeight: 600, color: INK, letterSpacing: 2, lineHeight: 1.8 }}>
                            신앙 성장 솔루션, 솔루마에<br />여러분을 초대합니다
                        </div>
                        <p style={{ fontSize: 13.5, color: FAINT, lineHeight: 1.9, margin: '16px 0 0', letterSpacing: 0.5 }}>
                            말씀으로 하루를 시작하고, 공동체와 함께 자라나는<br />크리스천 신앙 성장 앱 — SOLUMA · 솔루마
                        </p>
                    </div>

                    {/* ── 비전 ── */}
                    <Head label="Root의 비전" title="" />
                    <P>
                        주식회사 루트(ROOT)가 솔루마를 만드는 궁극적인 목적은 플랫폼 운영이나 수익 창출이 아닙니다.
                        우리가 꿈꾸는 가장 큰 비전은 <b style={{ color: INK }}>기독교 비영리 재단의 설립</b>입니다.
                        솔루마를 통해 만들어지는 가치와 수익이 다시 하나님 나라를 위해 사용되기를 소망합니다.
                    </P>
                    <div style={{ border: `1px solid ${HAIR}`, padding: '16px 18px', margin: '18px 0' }}>
                        <Caps color={BRICK} size={11.5}>재단을 통해 감당하고자 하는 사역</Caps>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: 10 }}>
                            {['비자립 교회 지원', '국내외 선교 사역 지원', '선교사·목회자 가정 지원', '다음 세대 장학 사업', '긴급 구호와 사랑 나눔', '복음 전파 프로젝트 후원'].map((v, i) => (
                                <span key={i} style={{ fontSize: 13.5, fontWeight: 600, color: SUB }}>· {v}</span>
                            ))}
                        </div>
                    </div>
                    <P>
                        재정을 흘려보내는 것에 머무르지 않고, 직접 현장을 찾아가 섬기고 함께 기도하며 몸으로 순종하는 공동체가 되고자 합니다.
                    </P>

                    {/* ── 인사말 ── */}
                    <Head label="인사말" title="" />
                    <P>
                        솔루마가 이 자리까지 올 수 있도록 기도와 조언으로 함께해 주신
                        <b style={{ color: INK }}> 라이트하우스 무브먼트의 목사님들과 성도님들</b>께 진심으로 감사드립니다.
                        주신 말씀 하나하나를 마음에 새기며 다듬어 온 솔루마가, 이제 <b style={{ color: INK }}>애플 앱스토어와 구글 플레이 정식 심사를 모두 통과</b>하여
                        <b style={{ color: BRICK_DEEP }}> 정식 런칭</b>을 맞이하게 되었습니다.
                    </P>
                    <div style={{ borderLeft: `2px solid ${BRICK}`, background: '#f4ecdc', padding: '13px 16px', fontSize: 13.5, color: SUB, lineHeight: 1.8 }}>
                        지난 자문회 때 <b>설치 파일(APK)로 받으셨던 테스트 버전</b>은 이제 옛 버전입니다.
                        번거로우시겠지만 <b>삭제하신 뒤 정식 버전</b>을 새로 설치해 주세요(설치 주소는 맨 아래에 있습니다).
                        기존 계정으로 로그인하시면 기록은 그대로 이어집니다.
                    </div>

                    {/* ── 앱 소개 ── */}
                    <Head label="앱 소개" title="크라이스트 테스트에서 시작해, 매일의 말씀 생활로" />
                    <P>
                        솔루마의 입구는 <b style={{ color: INK }}>크라이스트 테스트</b>입니다. 30개 문항으로 나의 신앙 유형을 성경 인물에 비추어 돌아보는 테스트로,
                        결과지를 통해 자연스럽게 말씀 묵상과 통독으로 이어지도록 설계했습니다. 테스트는 진단이 목적이 아니라
                        <b style={{ color: INK }}> 말씀 생활로 들어가는 문</b>입니다.
                    </P>
                    <P>
                        그 문을 지나면 — 365일 큐티, 성경 통독 플랜, 필사, 함께 암송, 말씀 노트, 기도제목과 간증을 나누는 공동체,
                        그리고 교회를 위한 사역 도구까지. 신앙 생활의 하루 리듬 전체를 한 앱에 담았습니다.
                    </P>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 22 }}>
                        <Shot src="/tutorial/test/intro.png" label="크라이스트 테스트" />
                        <Shot src="/tutorial/qt/word.png" label="오늘의 큐티" />
                        <Shot src="/tutorial/scripture/writing.png" label="성경 필사" />
                        <Shot src="/tutorial/scripture/keyboard.png" label="음성 필사" />
                        <Shot src="/tutorial/memorization/room.png" label="함께 암송" />
                        <Shot src="/tutorial/jobbox/main.png" label="잡박스" />
                        <Shot src="/tutorial/newcomer/form.png" label="새신자 등록" />
                        <Shot src="/tutorial/minister/roster.png" label="성도 관리" />
                    </div>

                    {/* ── 주요 기능 ── */}
                    <Head label="주요 기능" title="성도의 하루를 채우는 기능들" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 26px' }}>
                        <Feature title="크라이스트 테스트" desc="30문항으로 만나는 나의 신앙 유형과 성경 인물. 결과지에서 위로의 말씀과 기도문까지 이어집니다." />
                        <Feature title="큐티 365" desc="1년 365일, 하루도 빠짐없이 준비된 묵상. 본문 · 묵상 · 적용 · 기도로 이어지는 하루 10분." />
                        <Feature title="성경 통독 · 읽기 플랜" desc="통독 플랜을 따라 읽고 진도가 자동 기록됩니다. 대한성서공회 정식 라이선스 성경 수록." />
                        <Feature title="성경 필사" desc="손으로 쓰거나 목소리로 읽어 필사합니다. 음성 인식이 본문과 대조해 진도를 확인해 줍니다." />
                        <Feature title="함께 암송" desc="소그룹이 한 방에 모여 월~금 하루 한 절씩 암송하고, 서로의 녹음을 들으며 격려합니다." />
                        <Feature title="잡박스(JobBox)" desc="교계 구인 · 재능 나눔 게시판. 반주, 디자인, 번역 등 성도의 은사가 교회들과 만납니다." />
                    </div>

                    {/* ── 교회를 위한 기능 ── */}
                    <Head label="교회를 위한 기능" title="목회 현장을 돕는 사역자 전용 도구" />
                    <P>
                        사역자로 인증되시면 아래 기능이 열립니다. 성도들에게는 보이지 않는 <b style={{ color: INK }}>사역자 전용</b> 영역입니다.
                    </P>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                        {[
                            ['새신자 등록 알림', '성도나 방문자가 앱에서 새신자 등록을 하면, 그 교회의 인증 사역자 휴대폰으로 즉시 알림이 갑니다. 심방과 환영이 빨라집니다.'],
                            ['기도 편지', '사역자만 쓸 수 있는 목양 편지입니다. 교회 성도들에게 기도 제목과 위로의 말씀을 보내실 수 있습니다.'],
                            ['교인 명부 · 임명', '우리 교회에 등록한 성도 명단을 보고, 부교역자·리더를 임명해 함께 섬길 수 있습니다.'],
                            ['교회 웹 대시보드', 'christcare.us/church 에서 컴퓨터 큰 화면으로 교인 명부를 관리합니다. 휴대폰 카메라로 QR을 찍으면 비밀번호 없이 앱 계정으로 바로 로그인됩니다.'],
                        ].map(([h, b], i) => (
                            <div key={i} style={{ display: 'flex', gap: 12 }}>
                                <span style={{ flexShrink: 0, marginTop: 9, width: 5, height: 5, background: BRICK }} />
                                <div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{h}</span>
                                    <span style={{ fontSize: 14, color: SUB, lineHeight: 1.8 }}> — {b}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 18, borderLeft: `2px solid ${BRICK}`, background: '#f4ecdc', padding: '13px 16px', fontSize: 13.5, color: SUB, lineHeight: 1.8 }}>
                        <b style={{ color: INK }}>사역자 인증 방법</b> — 앱 설치 후 홈의 「사역자 등록」에서 재직을 확인할 수 있는 서류(임명장·재직증명 등)를 사진으로 올려 주시면,
                        확인 후 인증해 드립니다. 어려우시면 아래 문의처로 연락 주세요. 저희가 도와드리겠습니다.
                    </div>

                    {/* ── 시작 가이드 ── */}
                    <Head label="시작 가이드" title="5분이면 시작하실 수 있습니다" />
                    <Step n="01" title="앱 설치">스토어에서 “솔루마” 검색 → 설치. (설치 주소는 이 초대장 맨 아래에 있습니다.)</Step>
                    <Step n="02" title="간편 로그인">카카오 · 구글 · 애플 계정으로 3초 만에 가입됩니다. 별도 비밀번호가 없습니다.</Step>
                    <Step n="03" title="크라이스트 테스트 (3분)">나의 신앙 유형을 확인해 보세요. 주변에 권하시기 전에 직접 경험해 보시면 좋습니다.</Step>
                    <Step n="04" title="우리 교회 등록">마이 탭에서 섬기시는 교회를 검색해 등록합니다. 교회가 없으면 새로 등록하실 수 있습니다.</Step>
                    <div style={{ fontSize: 13.5, color: SUB, lineHeight: 1.8, borderTop: `1px solid ${HAIR}`, paddingTop: 12, marginTop: 4 }}>
                        <b style={{ color: BRICK_DEEP }}>*</b> 목회자의 경우, 홈 「사역자 등록」에서 <b>사역자 인증 신청</b>을 하시면 교회 기능이 열립니다.
                        &nbsp;자세한 사용법은 <a href="https://christcare.us/tutorial" style={{ color: BRICK_DEEP, fontWeight: 700 }}>christcare.us/tutorial</a>
                    </div>

                    {/* ── 신뢰 ── */}
                    <Head label="신뢰" title="더 많은 크리스천들이 함께할 수 있도록, 주변에 솔루마를 추천해 주세요!" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                        {[
                            ['정식 라이선스 성경', '개역개정을 비롯한 성경 본문은 대한성서공회와 정식 사용 계약을 맺고 수록했습니다.'],
                            ['AI 상담 없음', '신앙 상담을 인공지능에 맡기지 않습니다. 양육 콘텐츠는 성경 본문과 사람이 준비한 큐레이션으로만 구성해, 교리적 오류의 여지를 원천적으로 차단했습니다.'],
                            ['목회자 자문 반영', '기능과 문구 하나하나를 목회자 자문회의 피드백으로 다듬었습니다. 앞으로도 목사님들의 조언 위에 세워 가겠습니다.'],
                        ].map(([h, b], i) => (
                            <div key={i} style={{ display: 'flex', gap: 12 }}>
                                <span style={{ flexShrink: 0, marginTop: 9, width: 5, height: 5, background: BRICK }} />
                                <div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{h}</span>
                                    <span style={{ fontSize: 14, color: SUB, lineHeight: 1.8 }}> — {b}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── 맺음말 + 다운로드 ── */}
                    <Rule margin="46px auto 24px" />
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16.5, fontWeight: 700, color: INK, lineHeight: 1.9 }}>
                            솔루마의 첫걸음에<br />많은 성원과 격려 부탁드립니다.
                        </div>

                        <div style={{ margin: '26px 0 0' }}>
                            <Caps color={BRICK} size={11.5}>App Download</Caps>
                            <p style={{ fontSize: 13.5, color: SUB, lineHeight: 1.9, margin: '10px 0 16px' }}>
                                스토어에서 <b style={{ color: INK }}>“솔루마”</b> 또는 <b style={{ color: INK }}>“soluma”</b>를 검색하시거나,<br />아래 주소로 바로 설치하실 수 있습니다.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                                <a href={IOS_URL} target="_blank" rel="noopener noreferrer"
                                    style={{ flex: '1 1 200px', maxWidth: 280, background: INK, color: PAPER, fontSize: 13.5, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', padding: '14px 0' }}>
                                    APP STORE →
                                </a>
                                <a href={AOS_URL} target="_blank" rel="noopener noreferrer"
                                    style={{ flex: '1 1 200px', maxWidth: 280, background: BRICK, color: PAPER, fontSize: 13.5, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', padding: '14px 0' }}>
                                    GOOGLE PLAY →
                                </a>
                            </div>
                        </div>

                        <p style={{ fontSize: 13.5, color: SUB, lineHeight: 1.9, margin: '26px 0 16px' }}>
                            교회 도입 안내, 사역자 인증, 사용 중 궁금하신 점 —<br />언제든 편하게 연락 주십시오.
                        </p>
                        <a href="mailto:master@root2christ.com" style={{ color: BRICK_DEEP, fontSize: 14, fontWeight: 700, textDecoration: 'none', borderBottom: `1px solid ${BRICK}`, paddingBottom: 2 }}>
                            master@root2christ.com
                        </a>

                        <div style={{ marginTop: 38 }}>
                            <Caps color={FAINT} size={10.5}>주식회사 루트 · ROOT Inc.</Caps>
                            <div className={script.className} style={{ fontSize: 22, color: FAINT, marginTop: 6 }}>
                                Find your light in Scripture
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
