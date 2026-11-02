"use client";

import { useEffect, useRef } from "react";

// Soft gold circles that ease after the cursor and fade out when it stops.
// Mouse/trackpad only, and skipped entirely for reduced-motion users.
const COUNT = 14;

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const target = { x: -100, y: -100 };
    const pts = Array.from({ length: COUNT }, () => ({ x: -100, y: -100 }));
    let visible = 0; // fades in while moving, out when still
    let lastMove = 0;
    let frame = 0;

    const draw = (t: number) => {
      // each circle eases toward the one ahead of it, so the chain trails smoothly
      pts.forEach((p, i) => {
        const lead = i === 0 ? target : pts[i - 1];
        const k = i === 0 ? 0.35 : 0.42;
        p.x += (lead.x - p.x) * k;
        p.y += (lead.y - p.y) * k;
      });
      const moving = t - lastMove < 120;
      visible += ((moving ? 1 : 0) - visible) * (moving ? 0.2 : 0.06);

      ctx.clearRect(0, 0, w, h);
      for (let i = COUNT - 1; i >= 0; i--) {
        const p = pts[i];
        const f = 1 - i / COUNT;
        const r = 3 + f * 9;
        const a = visible * f * 0.38;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.2);
        g.addColorStop(0, `rgba(241, 217, 160, ${a})`);
        g.addColorStop(0.45, `rgba(212, 175, 95, ${a * 0.55})`);
        g.addColorStop(1, "rgba(212, 175, 95, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // stop the loop once everything has faded, until the mouse moves again
      if (visible > 0.01 || moving) frame = requestAnimationFrame(draw);
      else {
        frame = 0;
        ctx.clearRect(0, 0, w, h);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (target.x < 0) pts.forEach((p) => ((p.x = e.clientX), (p.y = e.clientY)));
      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = performance.now();
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onLeave = () => {
      lastMove = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
}
