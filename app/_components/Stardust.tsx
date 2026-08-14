'use client';
/**
 * Stardust — 수백 개의 은빛 알갱이가 눈처럼 내리는 오버레이 (2026-08-15 사장님 요청)
 *
 * DOM 수백 개를 CSS 로 움직이면 무거워서 <canvas> + rAF 로 그린다.
 * 부모(포지셔닝 컨텍스트)를 가득 덮고 클릭을 막지 않는다(pointer-events: none).
 * 알갱이는 크기·속도·흔들림·반짝임 주기가 제각각이라 자연스러운 눈/별가루로 보인다.
 * prefers-reduced-motion 이면 그리지 않는다.
 */
import { useEffect, useRef } from 'react';

export default function Stardust({ density = 9000 }: { density?: number }) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const parent = canvas?.parentElement;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !parent || !ctx) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let W = 0, H = 0, raf = 0;
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const resize = () => {
            W = parent.clientWidth; H = parent.clientHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(parent);

        const rand = (a: number, b: number) => a + Math.random() * (b - a);
        // 은빛 2톤 — 짙은 실버(바탕이 밝아도 보이게) + 밝은 글린트
        const TONES = ['158,170,186', '203,213,225', '226,232,240'];
        // 카드가 길든 짧든 화면 어디서나 같은 밀도로 내리게 — 면적 비례 개수
        const count = Math.max(180, Math.min(900, Math.round((W * H) / density)));
        const ps = Array.from({ length: count }, () => ({
            x: Math.random(), y: Math.random(),
            r: rand(0.5, 1.8),            // 아주 작은 알갱이
            v: rand(7, 26),               // 낙하 속도(px/s)
            sway: rand(4, 18), ph: rand(0, Math.PI * 2), tw: rand(0.4, 1.4),
            o: rand(0.25, 0.85),
            tone: TONES[Math.floor(Math.random() * TONES.length)],
        }));

        let last = performance.now();
        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000); last = now;
            const t = now / 1000;
            ctx.clearRect(0, 0, W, H);
            for (const p of ps) {
                p.y += (p.v * dt) / Math.max(1, H);
                if (p.y > 1.02) { p.y = -0.02; p.x = Math.random(); }
                const x = p.x * W + Math.sin(t * p.tw + p.ph) * p.sway * 0.4;
                const y = p.y * H;
                const alpha = Math.max(0, p.o * (0.55 + 0.45 * Math.sin(t * p.tw * 2 + p.ph)));
                ctx.beginPath();
                ctx.arc(x, y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.tone},${alpha.toFixed(3)})`;
                ctx.fill();
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, [density]);

    return <canvas ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }} />;
}
