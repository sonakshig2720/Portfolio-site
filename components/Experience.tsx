"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { experienceNodes, type ExperienceNode } from "@/lib/experiencePipeline";
import PipelineShape from "./PipelineShapes";

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

export default function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bus, setBus] = useState<{ w: number; h: number; segs: Segment[] }>({ w: 0, h: 0, segs: [] });
  const [hot, setHot] = useState<number | null>(null);
  const [open, setOpen] = useState<ExperienceNode | null>(null);

  // Route an orthogonal busway between consecutive cards, re-measured on resize.
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
      segs.push({ d: `M${boxes[0].cx} 0 V${boxes[0].top}`, from: -1 });
      for (let i = 0; i < boxes.length - 1; i++) {
        const a = boxes[i];
        const b = boxes[i + 1];
        const mid = Math.round((a.bottom + b.top) / 2);
        segs.push({ d: `M${a.cx} ${a.bottom} V${mid} H${b.cx} V${b.top}`, from: i });
      }
      const last = boxes[boxes.length - 1];
      segs.push({ d: `M${last.cx} ${last.bottom} V${base.height}`, from: boxes.length - 1 });
      setBus({ w: base.width, h: base.height, segs });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

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
                      <PipelineShape shape={n.abstractShape} />
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
                <p className="pl-dialog__label">Problem</p>
                <p>{open.caseStudy.problem}</p>
              </section>
              <section>
                <p className="pl-dialog__label">Architecture</p>
                <p>{open.caseStudy.architecture}</p>
              </section>
              <section>
                <p className="pl-dialog__label">Solution</p>
                <p>{open.caseStudy.solution}</p>
              </section>
              <section>
                <p className="pl-dialog__label">Metrics</p>
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

            <p className="pl-dialog__label">Stack</p>
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
