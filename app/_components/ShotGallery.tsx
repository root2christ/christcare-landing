'use client';
/**
 * ShotGallery — 앱 스크린샷 가로 스크롤 갤러리 + 클릭 시 라이트박스 확대
 * (2026-08-15 사장님 요청: 8장을 격자로 쌓지 말고 옆으로 넘기며 보게)
 *
 * - 가로 스크롤(스냅) — 모바일에서 손가락으로 넘기고, 다음 장이 살짝 보여 스크롤 힌트가 된다
 * - 클릭/탭 → 전체화면 라이트박스(배경 탭·X·ESC 로 닫기)
 * - 페이지마다 톤이 달라 테두리/라벨 색을 props 로 받는다
 */
import { useEffect, useState } from 'react';

export type ShotItem = { src: string; label: string };

type Props = {
    shots: ShotItem[];
    width?: number;
    height?: number;
    radius?: number;
    border?: string;
    labelColor?: string;
};

export default function ShotGallery({
    shots, width = 150, height = 330, radius = 16,
    border = '#e0d3ba', labelColor = '#8a7f6e',
}: Props) {
    const [open, setOpen] = useState<ShotItem | null>(null);

    // ESC 로 닫기 + 열려 있는 동안 뒤 스크롤 잠금
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    }, [open]);

    return (
        <>
            <div style={{
                display: 'flex', gap: 16, overflowX: 'auto', padding: '4px 2px 14px',
                scrollSnapType: 'x proximity', WebkitOverflowScrolling: 'touch' as any,
            }}>
                {shots.map((s) => (
                    <button
                        key={s.src}
                        onClick={() => setOpen(s)}
                        style={{ flex: '0 0 auto', scrollSnapAlign: 'center', background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', textAlign: 'center' }}
                        aria-label={`${s.label} 크게 보기`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.src} alt={s.label} loading="lazy"
                            style={{ width, height, objectFit: 'cover', objectPosition: 'top', borderRadius: radius, border: `1px solid ${border}`, display: 'block', boxShadow: '0 3px 10px rgba(38,32,25,0.08)' }} />
                        <div style={{ fontSize: 12, fontWeight: 600, color: labelColor, marginTop: 8, letterSpacing: 1 }}>{s.label}</div>
                    </button>
                ))}
            </div>

            {open && (
                <div
                    onClick={() => setOpen(null)}
                    role="dialog" aria-modal="true"
                    style={{
                        position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(12,10,8,0.94)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20,
                    }}
                >
                    <button
                        onClick={() => setOpen(null)}
                        aria-label="닫기"
                        style={{ position: 'absolute', top: 18, right: 18, width: 40, height: 40, borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.16)', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}
                    >✕</button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={open.src} alt={open.label}
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '92vw', maxHeight: '82vh', borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
                    <div style={{ color: '#e7e5e4', fontSize: 14, fontWeight: 700, marginTop: 14, letterSpacing: 1 }}>{open.label}</div>
                </div>
            )}
        </>
    );
}
