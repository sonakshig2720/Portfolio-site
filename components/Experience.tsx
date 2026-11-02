"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { experienceNodes, type ExperienceNode } from "@/lib/experiencePipeline";

// Zig-zag placement of the nodes down the pipeline.
const ALIGN = ["right", "center", "left", "right", "shift-left"] as const;

type Segment = { d: string; from: number };

function SideTag({ text, side }: { text: string; side: "left" | "right" }) {
  const [title, sub] = text.split("\n");
  return (
    <div className={`pl-tag pl-tag--${side}`} aria-hidden="true">
      <span className="pl-tag__text">
        <span className="pl-tag__title">{title}</span>
        {sub && <span className="pl-tag__sub">{sub}</span>}
      </span>
      <span className="pl-tag__wire" />
    </div>
  );
}

// "Apr 2026 — Present" → "Apr 2026"; "Feb — Jul 2025" → "Feb 2025"
function startOf(period: string) {
  const [start] = period.split("—").map((p) => p.trim());
  const year = period.match(/\d{4}/)?.[0] ?? "";
  return /\d{4}/.test(start) ? start : `${start} ${year}`;
}

export default function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bus, setBus] = useState<{ w: number; h: number; segs: Segment[] }>({ w: 0, h: 0, segs: [] });
  const [hot, setHot] = useState<number | null>(null);
  const [open, setOpen] = useState<ExperienceNode | null>(null);
  // left-hand year rail: dot positions, how far the gold fill has run, current role
  const [rail, setRail] = useState<{ dots: number[]; fill: number; active: number }>({ dots: [], fill: 0, active: 0 });

  // Route an orthogonal busway between consecutive cards only (no lead-in or tail),
  // re-measured on resize.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const base = track.getBoundingClientRect();
      const boxes = cardRefs.current.map((el) => {
        const r = el!.getBoundingClientRect();
        return { cx: Math.round(r.left - base.left + r.width / 2), top: r.top - base.top, bottom: r.bottom - base.top };
      });
      const segs: Segment[] = [];
      for (let i = 0; i < boxes.length - 1; i++) {
        const a = boxes[i];
        const b = boxes[i + 1];
        const mid = Math.round((a.bottom + b.top) / 2);
        segs.push({ d: `M${a.cx} ${a.bottom} V${mid} H${b.cx} V${b.top}`, from: i });
      }
      setBus({ w: base.width, h: base.height, segs });
      updateRail();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Year rail: the fill follows the middle of the screen through the track.
  const updateRail = () => {
    const track = trackRef.current;
    if (!track) return;
    const base = track.getBoundingClientRect();
    const dots = cardRefs.current.map((el) => (el ? Math.round(el.getBoundingClientRect().top - base.top + 34) : 0));
    const mid = window.innerHeight / 2 - base.top;
    const fill = Math.max(0, Math.min(base.height, mid));
    let active = 0;
    dots.forEach((y, i) => {
      if (y <= mid) active = i;
    });
    setRail({ dots, fill: Math.round(fill), active });
  };

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          updateRail();
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const jumpTo = (i: number) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRefs.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <section id="experience" className="section pipeline-section">
      <div className="glow glow--right" aria-hidden="true" />
      <div className="container pipeline">
        <div className="section-head reveal pl-head">
          <h2>Experience</h2>
          <p className="section-sub">Where I&apos;ve worked, most recent first. Open the details on any card for the full story.</p>
        </div>

        {/* ── Pipeline ── */}
        <div className="pl-track" ref={trackRef}>
          <nav className="pl-years" aria-label="Experience timeline">
            <span className="pl-years__line" aria-hidden="true" />
            <span className="pl-years__fill" style={{ height: rail.fill }} aria-hidden="true" />
            {rail.dots.length > 0 && (
              <ol>
                {experienceNodes.map((n, i) => (
                  <li key={n.id} style={{ top: rail.dots[i] }}>
                    <button
                      type="button"
                      className={`pl-years__dot ${i === rail.active ? "is-active" : ""} ${i < rail.active ? "is-past" : ""}`}
                      onClick={() => jumpTo(i)}
                      aria-label={`${startOf(n.period)}: ${n.role} at ${n.company}`}
                      aria-current={i === rail.active ? "step" : undefined}
                    >
                      <span className="pl-years__label">{startOf(n.period)}</span>
                      <span className="pl-years__node" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </nav>
          <svg className="pl-bus" width={bus.w} height={bus.h} aria-hidden="true">
            {bus.segs.map((s, i) => {
              const lit = hot !== null && (s.from === hot || s.from === hot - 1);
              return (
                <g key={i} className={lit ? "pl-bus__seg is-lit" : "pl-bus__seg"}>
                  <path d={s.d} className="pl-bus__rail" />
                  <path d={s.d} className="pl-bus__current" />
                </g>
              );
            })}
          </svg>

          <ol className="pl-nodes">
            {experienceNodes.map((n, i) => {
              const align = ALIGN[i % ALIGN.length];
              return (
                <li
                  key={n.id}
                  className={`pl-node pl-node--${align} ${hot === i ? "is-hot" : ""}`}
                  onMouseEnter={() => setHot(i)}
                  onMouseLeave={() => setHot(null)}
                >
                  {n.sideTagLeft && <SideTag text={n.sideTagLeft} side="left" />}
                  {n.sideTagRight && <SideTag text={n.sideTagRight} side="right" />}

                  <article
                    className="pl-card"
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                  >
                    <span className="pl-card__corner pl-card__corner--tl" aria-hidden="true" />
                    <span className="pl-card__corner pl-card__corner--tr" aria-hidden="true" />
                    <span className="pl-card__corner pl-card__corner--bl" aria-hidden="true" />
                    <span className="pl-card__corner pl-card__corner--br" aria-hidden="true" />

                    <header className="pl-card__head">
                      <span className="pl-card__org">
                        {n.company}
                        <span className="pl-card__loc">{n.location}</span>
                      </span>
                      <span className="pl-card__period">{n.period}</span>
                    </header>

                    <h3 className="pl-card__role">{n.role}</h3>
                    <p className="pl-card__company">
                      <span className="pl-card__impact">{n.impactMetric}</span>
                    </p>

                    <div className="pl-card__body">
                      <ul className="pl-card__verbs">
                        {n.verbs.map((v) => (
                          <li key={v}>
                            <span aria-hidden="true">›</span> {v}.
                          </li>
                        ))}
                      </ul>
                    </div>

                    <footer className="pl-card__foot">
                      <p className="pl-card__stack">
                        <span>Stack</span> {n.techStack.slice(0, 3).join(" · ")}
                      </p>
                      <button type="button" className="pl-card__spec" onClick={() => setOpen(n)} aria-haspopup="dialog">
                        Details <span aria-hidden="true">→</span>
                        <span className="sr-only"> — {n.role} at {n.company}</span>
                      </button>
                    </footer>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* ── Case study ── */}
      <dialog
        ref={dialogRef}
        className="pl-dialog"
        aria-labelledby="pl-dialog-title"
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
      >
        {open && (
          <div className="pl-dialog__inner">
            <header className="pl-dialog__head">
              <p className="pl-card__head">
                <span className="pl-card__org">
                  {open.company}
                  <span className="pl-card__loc">{open.location}</span>
                </span>
                <span className="pl-card__period">{open.period}</span>
              </p>
              <button type="button" className="pl-dialog__close" onClick={() => setOpen(null)} aria-label="Close case study">
                ×
              </button>
            </header>
            <h3 id="pl-dialog-title" className="pl-card__role">
              {open.role}
            </h3>

            <div className="pl-dialog__grid">
              <section>
                <p className="pl-dialog__label">{open.caseStudy.labels?.problem ?? "Problem"}</p>
                <p>{open.caseStudy.problem}</p>
              </section>
              <section>
                <p className="pl-dialog__label">{open.caseStudy.labels?.architecture ?? "Architecture"}</p>
                <p>{open.caseStudy.architecture}</p>
              </section>
              <section>
                <p className="pl-dialog__label">{open.caseStudy.labels?.solution ?? "Solution"}</p>
                <p>{open.caseStudy.solution}</p>
              </section>
              <section>
                <p className="pl-dialog__label">{open.caseStudy.labels?.metrics ?? "Metrics"}</p>
                <ul className="pl-dialog__metrics">
                  {open.caseStudy.metrics.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </section>
            </div>

            {open.caseStudy.recommendation && (
              <blockquote className="pl-dialog__quote">
                <p>“{open.caseStudy.recommendation.quote}”</p>
                <footer>
                  {open.caseStudy.recommendation.author}, {open.caseStudy.recommendation.title}
                </footer>
              </blockquote>
            )}

            <p className="pl-dialog__label">{open.caseStudy.labels?.stack ?? "Stack"}</p>
            <ul className="chips chips--sm">
              {open.techStack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </dialog>
    </section>
  );
}
