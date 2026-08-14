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

export default function Stardust({ density = 700 }: { density?: number }) {
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
        // 면적 비례 개수 (좁은 영역용)
        const count = Math.max(50, Math.min(400, Math.round((W * H) / density)));
        const ps = Array.from({ length: count }, () => ({
            x: Math.random(), y: Math.random(),
            r: rand(0.8, 2.1),            // 알갱이 코어 크기
            v: rand(9, 30),               // 낙하 속도(px/s)
            sway: rand(3, 14), ph: rand(0, Math.PI * 2), tw: rand(0.5, 1.6),
            o: rand(0.4, 1),
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
                // 밝은 바탕에서도 보이도록 두 겹으로:
                // ① 짙은 실버 헤일로(대비 확보) ② 밝은 흰 코어(반짝임)
                ctx.beginPath();
                ctx.arc(x, y, p.r * 2.1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100,116,139,${(alpha * 0.45).toFixed(3)})`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
                ctx.fill();
                // 큰 알갱이는 십자 광채
                if (p.r > 1.6) {
                    ctx.strokeStyle = `rgba(255,255,255,${(alpha * 0.7).toFixed(3)})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(x - p.r * 3, y); ctx.lineTo(x + p.r * 3, y);
                    ctx.moveTo(x, y - p.r * 3); ctx.lineTo(x, y + p.r * 3);
                    ctx.stroke();
                }
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, [density]);

    return <canvas ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }} />;
}
