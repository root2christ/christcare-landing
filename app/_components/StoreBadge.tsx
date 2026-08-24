/**
 * StoreBadge — 공식 앱스토어/구글플레이 다운로드 배지 스타일 버튼
 * (2026-08-24 사장님 요청: 초대장 다운로드 버튼을 애플스럽게·안드로이드스럽게)
 *
 * 스토어 배지는 톤 무관하게 검은 배지 + 브랜드 로고가 관례라 그대로 재현.
 * 로고는 외부 이미지 대신 인라인 SVG (애플 사과, 구글플레이 컬러 삼각형).
 */

type Props = { kind: 'ios' | 'android'; href: string };

export default function StoreBadge({ kind, href }: Props) {
    const isIos = kind === 'ios';
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isIos ? 'App Store 에서 다운로드' : 'Google Play 에서 다운로드'}
            style={{
                flex: '1 1 190px',
                maxWidth: 240,
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                background: '#000',
                border: '1px solid rgba(255,255,255,0.28)',
                borderRadius: 13,
                padding: '10px 16px',
                textDecoration: 'none',
                boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
            }}
        >
            {isIos ? <AppleLogo /> : <PlayLogo />}
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, textAlign: 'left' }}>
                <span style={{ color: '#fff', fontSize: 10.5, fontWeight: 500, letterSpacing: 0.2, opacity: 0.92 }}>
                    {isIos ? 'Download on the' : 'GET IT ON'}
                </span>
                <span style={{ color: '#fff', fontSize: 19, fontWeight: 600, letterSpacing: 0.2, marginTop: 1 }}>
                    {isIos ? 'App Store' : 'Google Play'}
                </span>
            </span>
        </a>
    );
}

function AppleLogo() {
    return (
        <svg width="24" height="28" viewBox="0 0 24 28" fill="#fff" aria-hidden style={{ flexShrink: 0 }}>
            <path d="M19.6 21.3c-.35.82-.77 1.57-1.26 2.27-.67.95-1.22 1.6-1.63 1.97-.65.6-1.34.9-2.08.92-.53 0-1.17-.15-1.91-.46-.75-.3-1.43-.45-2.06-.45-.66 0-1.36.15-2.11.45-.75.3-1.35.46-1.81.48-.71.03-1.42-.28-2.11-.94-.45-.4-1.02-1.08-1.72-2.04-.75-1.02-1.36-2.21-1.84-3.56C.46 18.98.2 17.6.2 16.27c0-1.53.33-2.85.99-3.95a5.8 5.8 0 0 1 2.08-2.1 5.6 5.6 0 0 1 2.81-.79c.56 0 1.3.17 2.23.51.93.34 1.52.51 1.78.51.19 0 .85-.2 1.96-.6 1.05-.37 1.94-.52 2.67-.46 1.98.16 3.46.94 4.45 2.35-1.77 1.07-2.64 2.57-2.62 4.49.02 1.5.56 2.74 1.62 3.72.48.46 1.02.81 1.62 1.06-.13.38-.27.74-.42 1.09zM15.6 1.2c0 1.14-.42 2.2-1.25 3.19-1 1.17-2.21 1.85-3.52 1.74a3.5 3.5 0 0 1-.03-.43c0-1.09.48-2.26 1.33-3.22.42-.49.96-.89 1.61-1.22.65-.32 1.27-.5 1.85-.53.01.23.01.46.01.7z" />
        </svg>
    );
}

function PlayLogo() {
    return (
        <svg width="23" height="26" viewBox="0 0 512 512" aria-hidden style={{ flexShrink: 0 }}>
            <path d="M48 30 300 256 48 482c-6 4-14 1-14-8V38c0-9 8-12 14-8z" fill="#00d0ff" />
            <path d="M34 30c2-2 6-3 10 0l254 226-52 52L34 42c-4-4-4-9 0-12z" fill="#00e676" />
            <path d="M34 482c-4-3-4-8 0-12l212-212 52 52L44 482c-4 3-8 2-10 0z" fill="#ff3d47" />
            <path d="M300 256l106-58c9-5 9-15 0-20l-96-53-58 79 48 52z" fill="#ffc400" />
        </svg>
    );
}
