import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'soluma 목회자 자문회 · 발표 운영 안내',
    description: '발표자용 진행 설명서 + QR 모음 — 주식회사 루트',
};

// 발표자(박상범·정지원·조미형)에게 전달하는 발표 운영 설명서 + QR 허브.
// 정적 서버 컴포넌트 — /public 에 미리 생성한 QR PNG 사용.

const NAVY = '#0f172a';
const BLUE = '#4f6ef2';
const GREEN = '#16a34a';

const PRESENT_URL = 'christcare.us/advisory/present?key=soluma-present-2026';

function Section({ tag, title, accent = BLUE, children }: { tag: string; title: string; accent?: string; children: React.ReactNode }) {
    return (
        <div style={{ marginTop: 18, background: '#fff', border: '1px solid #eef0f6', borderRadius: 20, padding: '22px 20px', boxShadow: '0 2px 10px rgba(15,23,42,0.04)' }}>
            <div style={{ fontSize: 12.5, fontWeight: 900, color: accent, letterSpacing: 1, marginBottom: 4 }}>{tag}</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: NAVY, margin: '0 0 14px', lineHeight: 1.35 }}>{title}</h2>
            {children}
        </div>
    );
}

function Step({ n, title, children, accent = BLUE }: { n: string; title: string; children?: React.ReactNode; accent?: string }) {
    return (
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
            <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 999, background: accent, color: '#fff', fontSize: 14.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: NAVY, lineHeight: 1.45 }}>{title}</div>
                {children && <div style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7, marginTop: 5 }}>{children}</div>}
            </div>
        </div>
    );
}

function QRBlock({ qr, label, sub, url, href, accent }: { qr: string; label: string; sub: string; url: string; href: string; accent: string }) {
    return (
        <div style={{ flex: 1, minWidth: 240, background: '#fbfbfd', border: '1px solid #eef0f6', borderRadius: 18, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: accent, letterSpacing: 0.5, marginBottom: 12 }}>{label}</div>
            <div style={{ background: '#fff', padding: 8, borderRadius: 14, border: '1px solid #eef0f6' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt={label} width={220} height={220} style={{ display: 'block', width: 220, height: 220, imageRendering: 'pixelated' }} />
            </div>
            <p style={{ fontSize: 15.5, fontWeight: 800, color: NAVY, margin: '14px 0 3px', lineHeight: 1.4 }}>{sub}</p>
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: accent, margin: 0, wordBreak: 'break-all', textDecoration: 'underline' }}>{url} ↗</a>
        </div>
    );
}

export default function QRPage() {
    return (
        <div style={{ minHeight: '100dvh', background: 'linear-gradient(170deg,#f5f7ff,#eef2ff 40%,#f8fafc)', padding: '34px 18px 64px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>

                {/* 헤더 */}
                <div style={{ textAlign: 'center', marginBottom: 6 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/app-icon.png" alt="soluma" width={64} height={64} style={{ borderRadius: 15, marginBottom: 12 }} />
                    <div style={{ fontSize: 12.5, fontWeight: 900, color: BLUE, letterSpacing: 1 }}>ROOT &amp; SOLUMA · 발표자용</div>
                    <h1 style={{ fontSize: 27, fontWeight: 900, color: NAVY, margin: '6px 0 0', lineHeight: 1.3 }}>목회자 자문회 발표 운영 안내</h1>
                    <p style={{ fontSize: 14.5, color: '#64748b', marginTop: 10, lineHeight: 1.6 }}>
                        박상범 · 정지원 · 조미형 발표자님께.<br />이 페이지 하나면 발표 진행과 QR 안내가 모두 준비됩니다.
                    </p>
                </div>

                {/* 요약 */}
                <div style={{ marginTop: 20, background: NAVY, borderRadius: 20, padding: '20px 20px', color: '#fff' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 900, color: '#93c5fd', letterSpacing: 1, marginBottom: 10 }}>30초 요약</div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {[
                            '발표자 3명 각자 폰에서 「발표자 모드」를 엽니다 (아래 ③ QR).',
                            '누가 넘기든 모든 목사님 폰 + 다른 발표자 화면이 함께 넘어갑니다.',
                            '발표가 끝나면 목사님께 「설문 QR」을 보여드립니다 (아래 ④).',
                            '목사님 응답은 자동 저장 — 폰을 꺼도 다시 열면 이어서 작성됩니다.',
                        ].map((t, i) => (
                            <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14.5, lineHeight: 1.6 }}>
                                <span style={{ color: '#93c5fd', fontWeight: 900 }}>✓</span><span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ① 행사 당일 흐름 */}
                <Section tag="① 행사 당일 흐름" title="이 순서대로 진행하면 됩니다">
                    <Step n="1" title="시작 전 — 화면 준비">
                        프로젝터(또는 큰 화면)에 발표 화면을 띄웁니다. 발표자 한 분의 노트북에서 <b>christcare.us/advisory</b> 를 열어 두면 발표 슬라이드가 그대로 보입니다.
                    </Step>
                    <Step n="2" title="목사님께 「발표 함께 보기」 QR 안내 (선택)">
                        원하시는 목사님은 ④의 첫 번째 QR을 폰으로 찍으면 발표를 본인 폰에서도 함께 보실 수 있습니다. (목사님 폰에는 넘김 버튼이 없어 발표자만 진행합니다.)
                    </Step>
                    <Step n="3" title="발표 진행">
                        발표자가 「발표자 모드」에서 <b>다음 ▶</b> 버튼으로 슬라이드를 넘깁니다. 2명·3명이 번갈아 진행해도 됩니다 (아래 ② 참고).
                    </Step>
                    <Step n="4" title="발표 끝 — 「자문 설문」 QR 안내" accent={GREEN}>
                        마지막 슬라이드에 설문 QR이 자동으로 뜹니다. 목사님께 ④의 두 번째 QR을 찍어 <b>앱 설치 → 둘러보기 → 설문 작성</b>을 부탁드립니다.
                    </Step>
                    <Step n="5" title="작성은 자동 저장" accent={GREEN}>
                        목사님이 중간에 폰을 끄거나 나가셔도, 다시 설문 페이지를 열면 작성하던 내용이 그대로 복원됩니다. 따로 제출 버튼은 없습니다.
                    </Step>
                </Section>

                {/* ② 발표자 사용법 */}
                <Section tag="② 발표자 사용법" title="여러 명이 번갈아 진행해도 자동으로 맞춰집니다">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            ['넘기기', '「다음 ▶ / ‹ 이전」 버튼, 또는 키보드 ← → 키. 노트북·휴대폰 모두 가능합니다.'],
                            ['특정 슬라이드로 점프', '상단 드롭다운에서 원하는 슬라이드를 고르면 바로 이동합니다.'],
                            ['발표자 인수인계', '누구든 넘기는 순간 그 사람이 「진행자」가 되고, 다른 발표자 화면도 자동으로 같은 위치로 따라옵니다. 미리 의논 없이 자연스럽게 번갈아 진행해도 화면이 꼬이지 않습니다.'],
                            ['늦게 접속해도 OK', '발표 도중 「발표자 모드」나 목사님 폰이 새로 접속해도 2초 안에 현재 슬라이드로 맞춰집니다.'],
                        ].map(([h, b], i) => (
                            <div key={i} style={{ display: 'flex', gap: 11 }}>
                                <span style={{ flexShrink: 0, marginTop: 3, width: 7, height: 7, borderRadius: 7, background: BLUE }} />
                                <div>
                                    <span style={{ fontSize: 15.5, fontWeight: 800, color: NAVY }}>{h}</span>
                                    <span style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7 }}> — {b}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 14, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '12px 14px', fontSize: 13.5, color: '#9a3412', lineHeight: 1.65 }}>
                        💡 팁: 같은 슬라이드를 한 사람이 오래 설명하는 동안 다른 발표자는 폰 화면을 꺼 두셔도 됩니다. 다시 켜면 현재 위치로 맞춰집니다.
                    </div>
                </Section>

                {/* ③ 발표자 제어 QR */}
                <Section tag="③ 발표자 전용" title="「발표자 모드」 열기 (박상범 · 정지원 · 조미형)" accent="#7c3aed">
                    <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7, margin: '0 0 16px' }}>
                        발표자 세 분은 각자 폰/노트북에서 아래 QR을 찍거나 링크를 열어 주세요. 비밀번호는 링크에 포함되어 있어 바로 입장됩니다.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
                        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 16, padding: 12 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/qr-present.png" alt="발표자 모드 QR" width={200} height={200} style={{ display: 'block', width: 200, height: 200, imageRendering: 'pixelated' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#7c3aed', letterSpacing: 0.5, marginBottom: 6 }}>발표자 모드 주소 (눌러서 바로 입장)</div>
                            <a href={`https://${PRESENT_URL}`} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 14.5, fontWeight: 800, color: '#6d28d9', textDecoration: 'none', wordBreak: 'break-all', lineHeight: 1.5, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '12px 14px' }}>
                                <span>{PRESENT_URL}</span>
                                <span style={{ flexShrink: 0, fontWeight: 900 }}>입장 →</span>
                            </a>
                            <p style={{ fontSize: 13, color: '#64748b', marginTop: 10, lineHeight: 1.6 }}>
                                ※ 이 주소(비밀번호 포함)는 발표자 세 분만 사용해 주세요. 목사님께는 ④의 QR을 안내합니다.
                            </p>
                        </div>
                    </div>
                </Section>

                {/* ④ 목사님께 보여줄 QR */}
                <Section tag="④ 목사님 안내용 QR" title="목사님께 화면/안내로 보여드리는 QR" accent={GREEN}>
                    <p style={{ fontSize: 14.5, color: '#475569', lineHeight: 1.7, margin: '0 0 16px' }}>
                        발표 시작 시 ①번을, 발표가 끝나면 ②번을 안내해 주세요. (설문 QR은 발표 마지막 장에도 자동으로 떠 있어, 그 화면을 그대로 보여드려도 됩니다.)
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                        <QRBlock qr="/qr-advisory.png" label="① 발표 함께 보기" sub="발표를 내 폰에서 함께 보기" url="christcare.us/advisory" href="https://christcare.us/advisory" accent={BLUE} />
                        <QRBlock qr="/qr-survey.png" label="② 자문 설문 작성" sub="앱 설치 + 84문항 설문" url="christcare.us/survey" href="https://christcare.us/survey" accent={GREEN} />
                    </div>
                </Section>

                {/* ⑤ 발표 내용 검토 & 수정 */}
                <Section tag="⑤ 발표 내용 검토 & 수정" title="발표 전에 슬라이드를 함께 검토해 주세요" accent="#d97706">
                    <Step n="검토" title="전체 슬라이드를 한 번에 읽기" accent="#d97706">
                        아래 주소를 열면 발표 슬라이드 전체 내용이 번호와 함께 쭉 나옵니다. 위에서 아래로 읽으며 어색한 표현·오타·신학적으로 고칠 부분을 확인해 주세요.
                        <a href="https://christcare.us/advisory/all" target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10, fontSize: 14.5, fontWeight: 800, color: '#92400e', textDecoration: 'none', wordBreak: 'break-all', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px' }}>
                            <span>christcare.us/advisory/all</span>
                            <span style={{ flexShrink: 0, fontWeight: 900 }}>열기 →</span>
                        </a>
                        <div style={{ marginTop: 8, fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>
                            ※ 발표자 모드(③)에서 상단 드롭다운으로 특정 슬라이드만 골라 볼 수도 있습니다.
                        </div>
                    </Step>
                    <Step n="수정" title="고칠 부분은 번호로 알려주세요" accent="#d97706">
                        고칠 곳을 발견하시면 단톡방에 이렇게 남겨 주세요 →{' '}
                        <b style={{ color: NAVY }}>「12번 슬라이드: ‘현재 문구’ → ‘이렇게’」</b>.
                        정지원이 반영하면 <b style={{ color: NAVY }}>1~2분 안에 모든 화면(목사님 폰 포함)에 자동 반영</b>됩니다. 발표 당일 현장에서도 즉시 수정할 수 있습니다.
                    </Step>
                    <div style={{ marginTop: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 14px', fontSize: 13.5, color: '#166534', lineHeight: 1.65 }}>
                        ✅ 슬라이드 내용은 실시간으로 바꿀 수 있으니, 부담 없이 검토 의견을 많이 남겨 주세요.
                    </div>
                </Section>

                <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12.5, color: '#94a3b8', fontWeight: 800, letterSpacing: 1, lineHeight: 1.7 }}>
                    ROOT &amp; SOLUMA · 주식회사 루트<br />모든 것은 뿌리되신 하나님으로부터, 그리고 하나님께로
                </p>
            </div>
        </div>
    );
}
