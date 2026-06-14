import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'soluma 자문회 QR 안내',
    description: '발표 따라보기 · 자문 설문 QR — 주식회사 루트',
};

// 발표 시작 전/중에 프로젝터로 띄우거나 출력해서 배포하는 QR 안내 페이지.
// 정적 페이지(서버 컴포넌트) — /public 에 미리 생성한 QR PNG 사용.

const NAVY = '#0f172a';
const BLUE = '#4f6ef2';

function QRCard({
    qr, label, sub, url, accent,
}: { qr: string; label: string; sub: string; url: string; accent: string }) {
    return (
        <div style={{
            background: '#fff', borderRadius: 24, padding: '28px 24px 24px',
            boxShadow: '0 12px 40px rgba(15,23,42,0.12)', border: '1px solid #eef0f6',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, minWidth: 280,
        }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: accent, letterSpacing: 1, marginBottom: 14 }}>{label}</div>
            <div style={{ background: '#fff', padding: 10, borderRadius: 16, border: '1px solid #eef0f6' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt={label} width={300} height={300} style={{ display: 'block', width: 300, height: 300, imageRendering: 'pixelated' }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, color: NAVY, margin: '20px 0 4px', lineHeight: 1.4 }}>{sub}</p>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0, wordBreak: 'break-all' }}>{url}</p>
        </div>
    );
}

export default function QRPage() {
    return (
        <div style={{ minHeight: '100dvh', background: 'linear-gradient(165deg,#f5f7ff,#eef2ff)', padding: '40px 22px 60px' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 34 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/app-icon.png" alt="soluma" width={72} height={72} style={{ borderRadius: 17, marginBottom: 14 }} />
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: NAVY, margin: 0, lineHeight: 1.3 }}>soluma 프리런칭 · 목회자 자문회</h1>
                    <p style={{ fontSize: 16, color: '#475569', marginTop: 12, lineHeight: 1.6 }}>
                        휴대폰 카메라로 아래 QR을 스캔해 주세요.
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, justifyContent: 'center' }}>
                    <QRCard
                        qr="/qr-advisory.png"
                        label="① 발표 함께 보기"
                        sub="발표를 내 휴대폰에서 함께 보기"
                        url="christcare.us/advisory"
                        accent={BLUE}
                    />
                    <QRCard
                        qr="/qr-survey.png"
                        label="② 자문 설문 작성"
                        sub="앱 설치 + 84문항 자문 설문"
                        url="christcare.us/survey"
                        accent="#16a34a"
                    />
                </div>

                <div style={{
                    marginTop: 30, background: NAVY, borderRadius: 20, padding: '20px 24px', color: '#fff',
                    display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#93c5fd', letterSpacing: 1 }}>발표자 전용 (박상범 · 정지원 · 조미형)</div>
                    <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.6 }}>
                        슬라이드 제어: <span style={{ color: '#fff', fontWeight: 900 }}>christcare.us/advisory/present?key=soluma-present-2026</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                        이 링크를 발표자 휴대폰/노트북에서 열면 다음·이전으로 모든 목사님 화면이 함께 넘어갑니다. 목사님 화면(①)에는 넘김 버튼이 없습니다.
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: 30, fontSize: 13, color: '#94a3b8', fontWeight: 800, letterSpacing: 1 }}>
                    ROOT &amp; SOLUMA · 모든 것은 뿌리되신 하나님으로부터
                </p>
            </div>
        </div>
    );
}
