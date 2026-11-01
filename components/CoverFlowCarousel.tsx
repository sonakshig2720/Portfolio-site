"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CarouselItem {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  metrics?: { label: string; value: string }[];
  [key: string]: any; // Allows any custom user data fields
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface CoverFlowCarouselProps<T extends CarouselItem = CarouselItem> {
  items: T[];
  accentColor?: string; // Optional custom colour for glow & traces
  headerBadgeText?: string; // Defaults to "[ PROJECTS // v2.0 ]"; pass "" to hide
  title?: string;
  subtitle?: string;
  renderCard?: (item: T, isCenter: boolean) => React.ReactNode;
  onItemSelect?: (item: T) => void;
  autoSnap?: boolean;
}

type Transform = { rotateY: number; translateX: number; translateZ: number; scale: number; opacity: number; zIndex: number };

// Infinite cover-flow placement for one card (see spec equations).
function coverFlow(index: number, progress: number, n: number, spread: number) {
  let offset = index - (((progress % n) + n) % n);
  while (offset > n / 2) offset -= n;
  while (offset < -n / 2) offset += n;
  const isCenter = Math.abs(offset) < 0.5;
  const abs = Math.abs(offset);
  const t: Transform = { rotateY: 0, translateX: 0, translateZ: 0, scale: 1, opacity: 1, zIndex: 0 };
  // Same proportions as the spec's equations, divided through by the centre
  // card's 1.15 pop so the resting centre card renders at exactly 1:1 (no
  // upscaled, blurry text). The card itself is sized 15% larger in CSS.
  if (isCenter) {
    t.rotateY = -offset * 30;
    t.translateX = offset * 220;
    t.translateZ = -abs * 80;
    t.scale = 1 - abs * 0.13;
  } else if (offset > 0) {
    t.rotateY = -52;
    t.translateX = 170 + (offset - 0.5) * 125;
    t.translateZ = -180 - offset * 30;
    t.scale = Math.max(0.63, 0.77 - offset * 0.045);
    t.opacity = Math.max(0.35, 0.9 - offset * 0.15);
  } else {
    t.rotateY = 52;
    t.translateX = -170 + (offset + 0.5) * 125;
    t.translateZ = -180 - abs * 30;
    t.scale = Math.max(0.63, 0.77 - abs * 0.045);
    t.opacity = Math.max(0.35, 0.9 - abs * 0.15);
  }
  t.translateX *= spread;
  t.zIndex = Math.round(100 - abs * 15);
  return { t, offset, isCenter };
}

function DefaultCard({ item, isCenter, index, onExpand }: { item: CarouselItem; isCenter: boolean; index: number; onExpand: () => void }) {
  const metrics = item.metrics?.slice(0, 2) ?? [];
  return (
    <>
      <header className="cf-card__head">
        <span className="cf-card__cat">
          {item.category ?? "Project"}
          {item.period && <span className="cf-card__period"> · {item.period}</span>}
        </span>
        <span className="cf-card__chip">{item.code ?? `PRJ-${String(index + 1).padStart(2, "0")}`}</span>
      </header>
      <h3 className="cf-card__title">{item.title}</h3>
      {item.subtitle && <p className="cf-card__sub">{item.subtitle}</p>}
      {metrics.length > 0 && (
        <dl className="cf-card__metrics">
          {metrics.map((m) => (
            <div key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {item.tags && item.tags.length > 0 && (
        <p className="cf-card__tags">
          {item.tags.slice(0, 5).map((t, i) => (
            <span key={t}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              {t}
            </span>
          ))}
        </p>
      )}
      <footer className="cf-card__foot">
        <span className="cf-card__status">
          <span className="cf-card__status-dot" aria-hidden="true" />
          {item.status ?? "Active"}
        </span>
        <button type="button" className="cf-card__expand" onClick={onExpand} tabIndex={isCenter ? 0 : -1}>
          Open
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
          <span className="sr-only"> {item.title}</span>
        </button>
      </footer>
    </>
  );
}

export default function CoverFlowCarousel<T extends CarouselItem = CarouselItem>({
  items,
  accentColor,
  headerBadgeText = "[ PROJECTS // v2.0 ]",
  title,
  subtitle,
  renderCard,
  onItemSelect,
  autoSnap = true,
}: CoverFlowCarouselProps<T>) {
  const n = items.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const drag = useRef<{ x: number; start: number; moved: boolean; id: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [spread, setSpread] = useState(1);

  // Scale horizontal spacing with the card width on small screens.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSpread(Math.min(1, e.contentRect.width / 900 + 0.18)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const animate = useCallback(() => {
    if (rafRef.current !== null) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = () => {
      const diff = targetRef.current - progressRef.current;
      if (reduce || Math.abs(diff) < 0.001) {
        progressRef.current = targetRef.current;
        setProgress(progressRef.current);
        rafRef.current = null;
        return;
      }
      progressRef.current += diff * 0.14;
      setProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  const goTo = useCallback(
    (target: number) => {
      targetRef.current = target;
      animate();
    },
    [animate]
  );
  const stepBy = (d: number) => goTo(Math.round(targetRef.current) + d);

  // Wheel: horizontal trackpad swipes always; vertical wheel only with Shift so
  // the page itself keeps scrolling normally.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let snapTimer: number | undefined;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!delta) return;
      e.preventDefault();
      targetRef.current += delta / 260;
      animate();
      window.clearTimeout(snapTimer);
      if (autoSnap)
        snapTimer = window.setTimeout(() => {
          targetRef.current = Math.round(targetRef.current);
          animate();
        }, 140);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(snapTimer);
    };
  }, [animate, autoSnap]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, start: targetRef.current, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    if (d.moved) {
      targetRef.current = d.start - dx / (260 * spread);
      progressRef.current = targetRef.current;
      setProgress(targetRef.current);
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (d.moved && autoSnap) goTo(Math.round(targetRef.current));
    // keep `moved` around for the click that follows this pointerup
    setTimeout(() => (drag.current = null), 0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stepBy(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepBy(-1);
    }
  };

  const centerIndex = ((Math.round(progress) % n) + n) % n;
  const center = items[centerIndex];

  return (
    <div className="cf" style={accentColor ? ({ ["--cf-accent" as string]: accentColor } as React.CSSProperties) : undefined}>
      {(title || headerBadgeText) && (
        <div className="cf-header">
          {title && <h2 className="cf-header__title">{title}</h2>}
          {headerBadgeText && (
            <span className="cf-badge">
              <span className="cf-badge__dot" aria-hidden="true" />
              {headerBadgeText}
            </span>
          )}
          {subtitle && <p className="cf-header__sub">{subtitle}</p>}
        </div>
      )}

      <div
        ref={stageRef}
        className="cf-stage"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects — use the left and right arrow keys to browse"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="cf-track">
          {items.map((item, i) => {
            const { t, offset, isCenter } = coverFlow(i, progress, n, spread);
            return (
              <article
                key={item.id}
                className={`cf-card ${isCenter ? "is-center" : ""}`}
                aria-hidden={!isCenter}
                style={{
                  transform: isCenter && Math.abs(offset) < 0.001
                    ? "translate(-50%, -50%)"
                    : `translate(-50%, -50%) translateX(${t.translateX}px) translateZ(${t.translateZ}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                  opacity: t.opacity,
                  zIndex: t.zIndex,
                }}
                onClick={() => {
                  if (drag.current?.moved || isCenter) return;
                  goTo(targetRef.current + offset);
                }}
              >
                <span className="cf-card__rivet cf-card__rivet--tl" aria-hidden="true" />
                <span className="cf-card__rivet cf-card__rivet--tr" aria-hidden="true" />
                <span className="cf-card__rivet cf-card__rivet--bl" aria-hidden="true" />
                <span className="cf-card__rivet cf-card__rivet--br" aria-hidden="true" />
                {renderCard ? (
                  renderCard(item, isCenter)
                ) : (
                  <DefaultCard item={item} isCenter={isCenter} index={i} onExpand={() => onItemSelect?.(item)} />
                )}
              </article>
            );
          })}
        </div>
        <div className="cf-reflection" aria-hidden="true" />
      </div>

      <div className="cf-controls">
        <button type="button" className="cf-step" onClick={() => stepBy(-1)} aria-label="Previous project">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <p className="cf-count mono" aria-live="polite">
          <span className="sr-only">Showing </span>
          {String(centerIndex + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          <span className="sr-only">: {center?.title}</span>
        </p>
        <button type="button" className="cf-step" onClick={() => stepBy(1)} aria-label="Next project">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
