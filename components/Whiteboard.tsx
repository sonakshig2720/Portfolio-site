"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { whiteboard as wb } from "@/lib/whiteboard";
import SectionRail from "./SectionRail";

/*
 * Hero + About merged into a "research whiteboard": a taped polaroid in the
 * middle, four pinned notes around it, and sketchy arrows drawn between them.
 */

type Pt = { x: number; y: number };

const doodle = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const Bulb = () => (
  <svg viewBox="0 0 24 24" {...doodle}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
  </svg>
);
const Pin = () => (
  <svg viewBox="0 0 24 24" {...doodle}>
    <path d="M15 3l6 6-3 1-4 4 1 4-2 1-4-4-5 5M9 9l4-4" />
  </svg>
);
const Chart = () => (
  <svg viewBox="0 0 24 24" {...doodle}>
    <path d="M3 3v18h18M6 8c3 0 3 7 6 8s5-2 8-2" />
  </svg>
);
const Bubble = () => (
  <svg viewBox="0 0 24 24" {...doodle}>
    <path d="M4 5h16v11H9l-5 4V5ZM8 10h8M8 13h5" />
  </svg>
);

// x/y of the loss-curve doodle in its 260 × 110 viewBox
const cx = (epoch: number) => 14 + epoch * 2.34;
const cy = (loss: number) => 98 - loss * 84;

function curvePath(points: [number, number][]) {
  const p = points.map(([e, l]) => [cx(e), cy(l)]);
  return p.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = p[i - 1];
    const dx = (x - px) / 2.4;
    return `${d} C${px + dx} ${py}, ${x - dx} ${y}, ${x} ${y}`;
  }, "");
}

// Slightly curved arrow from a note to the polaroid.
function arrow(a: Pt, b: Pt, bend: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 + bend;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

// Which side of the photo each card sits on, top to bottom.
const LAYOUT: { left: CardId[]; right: CardId[] } = {
  left: ["facts", "radar"],
  right: ["obsession", "toolbox", "human"],
};
type CardId = "obsession" | "facts" | "toolbox" | "radar" | "human";

export default function Whiteboard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [epochIdx, setEpochIdx] = useState(wb.toolbox.curve.length - 1);
  const [epoch, loss] = wb.toolbox.curve[epochIdx];

  // Re-measure the arrows whenever the board resizes (desktop layout only).
  useLayoutEffect(() => {
    const board = boardRef.current;
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    if (!board || !canvas || !photo) return;
    // look the cards up on every pass so a re-render never leaves stale nodes behind
    const getCards = () => [...canvas.querySelectorAll<HTMLElement>("[data-side]")];
    const measure = () => {
      if (window.innerWidth < 900) return setPaths([]);
      const cards = getCards();
      // the arrow SVG fills the canvas, so measure relative to it
      const base = canvas.getBoundingClientRect();
      const p = photo.getBoundingClientRect();
      const rel = (x: number, y: number) => ({ x: x - base.left, y: y - base.top });
      const gap = 10;
      const next: string[] = [];
      (["left", "right"] as const).forEach((side) => {
        const group = cards.filter((c) => c.dataset.side === side);
        group.forEach((el, k) => {
          const r = el.getBoundingClientRect();
          const left = side === "left";
          // spread the arrow heads evenly down the photo's edge
          const t = (k + 1) / (group.length + 1);
          const start = rel(left ? r.right + gap : r.left - gap, r.top + r.height / 2);
          const end = rel(left ? p.left - gap : p.right + gap, p.top + p.height * t);
          next.push(arrow(start, end, t < 0.5 ? -18 : t > 0.5 ? 18 : 0));
        });
      });
      setPaths(next);
    };
    measure();
    // Cards move as fonts and the photo load, so watch every piece, not just the board.
    const ro = new ResizeObserver(measure);
    [board, canvas, photo, ...getCards()].forEach((el) => ro.observe(el));
    document.fonts?.ready.then(measure);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", measure);
    };
  }, []);

  const card = (id: CardId, side: "left" | "right") => {
    switch (id) {
      case "obsession":
        return (
          <article key={id} id="about" className="wb-note wb-note--obsession" data-side={side}>
            <h2 className="wb-note__title">
              <span className="wb-note__icon">
                <Bulb />
              </span>
              {wb.obsession.title}:
            </h2>
            <p className="wb-note__quote">
              “{wb.obsession.before}
              <span className="wb-squiggle">{wb.obsession.emphasis}</span>
              {wb.obsession.after}”
            </p>
            <code className="wb-note__code">{wb.obsession.code}</code>
          </article>
        );
      case "facts":
        return (
          <article key={id} className="wb-note wb-note--facts" data-side={side}>
            <h2 className="wb-note__title">
              <span className="wb-note__icon">
                <Pin />
              </span>
              {wb.facts.title}
            </h2>
            <ul className="wb-checklist">
              {wb.facts.items.map((item) => (
                <li key={item} className="wb-check">
                  <span className="wb-check__box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" {...doodle}>
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                  </span>
                  <span className="wb-check__label">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      case "toolbox":
        return (
          <article key={id} className="wb-note wb-note--toolbox" data-side={side}>
            <div className="wb-note__row">
              <h2 className="wb-note__title">
                <span className="wb-note__icon">
                  <Chart />
                </span>
                {wb.toolbox.title}
              </h2>
              <span className="wb-readout" aria-live="polite">
                epoch {epoch} · loss {loss.toFixed(2)}
              </span>
            </div>
            <svg className="wb-curve" viewBox="0 0 260 110" role="group" aria-label="Sketch of a loss curve falling towards zero">
              <path d="M14 8 V98 H250" className="wb-curve__axes" />
              <path d={curvePath(wb.toolbox.curve)} className="wb-curve__line" />
              {wb.toolbox.curve.map(([e, l], i) => (
                <g
                  key={e}
                  className={`wb-curve__pt ${i === epochIdx ? "is-active" : ""}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Epoch ${e}, loss ${l.toFixed(2)}`}
                  onMouseEnter={() => setEpochIdx(i)}
                  onFocus={() => setEpochIdx(i)}
                >
                  <circle cx={cx(e)} cy={cy(l)} r={11} className="wb-curve__hit" />
                  <circle cx={cx(e)} cy={cy(l)} r={4} />
                </g>
              ))}
            </svg>
            <p className="wb-note__stack">
              <span>Toolbox:</span> {wb.toolbox.stack.join(" · ")}
            </p>
            <p className="wb-note__caption">{wb.toolbox.caption}</p>
          </article>
        );
      case "radar":
        return (
          <article key={id} className="wb-note wb-note--radar" data-side={side}>
            <div className="wb-note__row">
              <h2 className="wb-note__title">
                <span className="wb-note__icon" aria-hidden="true">
                  📡
                </span>
                {wb.radar.title}
              </h2>
              <span className="wb-radar__tag">★ {wb.radar.tag}</span>
            </div>
            <blockquote className="wb-radar__quote">“{wb.radar.quote}”</blockquote>
            <p className="wb-radar__list-title">
              <span aria-hidden="true">✦</span> {wb.radar.listTitle}
            </p>
            <ul className="wb-radar__list">
              {wb.radar.items.map(([before, hl, after]) => (
                <li key={hl}>
                  {before}
                  <strong>{hl}</strong>
                  {after}
                </li>
              ))}
            </ul>
            <p className="wb-note__foot">
              <span>{wb.radar.status}</span>
            </p>
          </article>
        );
      case "human":
        return (
          <article key={id} className="wb-note wb-note--human" data-side={side}>
            <h2 className="wb-note__title">
              <span className="wb-note__icon">
                <Bubble />
              </span>
              {wb.human.title}:
            </h2>
            {wb.human.lines.map((l) => (
              <p key={l} className="wb-note__quote wb-note__quote--sm">
                {l}
              </p>
            ))}
            <p className="wb-note__foot">
              <span>{wb.human.footer}</span>
              <span className="wb-note__tag">{wb.human.tag}</span>
            </p>
          </article>
        );
    }
  };

  return (
    <section id="top" className="wb-section">
      <div className="container wb-layout">
        <div className="wb" ref={boardRef}>
          <header className="wb__head">
            <h1 className="wb__title">{wb.greeting}</h1>
            <p className="wb__tagline">{wb.tagline}</p>
          </header>

          <div className="wb__canvas" ref={canvasRef}>
            <svg className="wb__arrows" aria-hidden="true">
              <defs>
                <marker id="wbArrow" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
                  <path d="M2 2 L10 6 L2 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              {paths.map((d, i) => d && <path key={i} d={d} markerEnd="url(#wbArrow)" />)}
            </svg>

            <div className="wb__col wb__col--left">{LAYOUT.left.map((id) => card(id, "left"))}</div>

            {/* Portrait */}
            <figure className="wb-polaroid" ref={photoRef}>
              <span className="wb-polaroid__tape" aria-hidden="true" />
              <span className="wb-polaroid__pin" aria-hidden="true" />
              <div className="wb-polaroid__photo">
                <Image
                  src="/profile.jpg"
                  alt="Sonakshi Godavarthy smiling by the sea"
                  width={800}
                  height={1000}
                  priority
                  sizes="(max-width: 900px) 70vw, 320px"
                />
              </div>
              <figcaption>
                <span className="wb-polaroid__name">{wb.polaroid.caption}</span>
                <span className="wb-polaroid__role">{wb.polaroid.role}</span>
              </figcaption>
            </figure>

            <div className="wb__col wb__col--right">{LAYOUT.right.map((id) => card(id, "right"))}</div>
          </div>

        </div>
        {/* phones only: the header has no room for the section rail */}
        <div className="wb-rail-mobile">
          <SectionRail items={wb.jumps} />
        </div>
      </div>
    </section>
  );
}
