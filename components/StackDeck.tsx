"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "./Decor";

export type DeckItem = {
  id: string;
  number: string; // "01"
  title: string;
  tag: string; // category / timeline shown in the title bar
  headline: string; // large line over the visual
  chips: string[]; // small chips at the top of the visual
  kicker: string; // mono line above the headline
  previewImage?: string;
  imageFit?: "contain" | "cover";
  ctaLabel?: string; // no label, no button
};

/*
 * Sticky title stacking deck: every card pins one title-bar height lower than
 * the one before it, so as you scroll the incoming card slides over the previous
 * one and leaves only its title bar showing — a growing index at the top.
 */
export default function StackDeck<T extends DeckItem>({
  items,
  onProjectSelect,
}: {
  items: T[];
  onProjectSelect?: (item: T) => void; // CTA, shown only when ctaLabel is set
}) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Active = the deepest card that has reached its own sticky threshold.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let active = 0;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const stickTop = parseFloat(getComputedStyle(el).top) || 0;
        if (el.getBoundingClientRect().top <= stickTop + 2) active = i;
      });
      setActiveProjectIndex(active);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  // Scroll so card `index` sits exactly at its sticky threshold. Sticky boxes
  // report their pinned position, so rebuild the natural one from the list top.
  const scrollToProject = useCallback((index: number) => {
    const cards = cardRefs.current;
    const target = cards[index];
    const list = target?.parentElement;
    if (!target || !list) return;
    const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
    let natural = list.getBoundingClientRect().top + window.scrollY;
    for (let i = 0; i < index; i++) natural += (cards[i]?.offsetHeight ?? 0) + gap;
    const stickTop = parseFloat(getComputedStyle(target).top) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: natural - stickTop + 1, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <ol className="deck">
      {items.map((p, i) => {
        const isActive = i === activeProjectIndex;
        const covered = i < activeProjectIndex;
        return (
          <li
            key={p.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={`deck-card ${isActive ? "is-active" : ""} ${covered ? "is-covered" : ""}`}
            style={{ "--i": i, zIndex: 10 + i } as React.CSSProperties}
          >
            <article aria-labelledby={`deck-title-${p.id}`}>
              <header className="deck-bar">
                <span className="deck-bar__num">{p.number}</span>
                <h3 id={`deck-title-${p.id}`} className="deck-bar__title">
                  {p.title}
                </h3>
                <span className="deck-bar__tag">{p.tag}</span>
                {covered ? (
                  <button
                    type="button"
                    className="deck-bar__expand"
                    onClick={() => scrollToProject(i)}
                    aria-label={`Expand project ${p.number}: ${p.title}`}
                  >
                    Expand
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                ) : p.ctaLabel ? (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm deck-bar__cta"
                    onClick={() => onProjectSelect?.(p)}
                    aria-label={`${p.ctaLabel}: ${p.title}`}
                  >
                    <span className="deck-bar__cta-text">{p.ctaLabel}</span>
                    <Arrow className="icon" />
                  </button>
                ) : null}
                {/* the whole strip is clickable once covered; the button above is the labelled target */}
                {covered && <span className="deck-bar__hit" aria-hidden="true" onClick={() => scrollToProject(i)} />}
              </header>

              <div className="deck-card__media">
                {p.previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.previewImage}
                    alt=""
                    className={`deck-card__img ${p.imageFit === "cover" ? "deck-card__img--cover" : ""}`}
                  />
                ) : (
                  <FrameArt seed={i} />
                )}
                <div className="deck-card__top">
                  <p className="deck-card__chips">
                    {p.chips.map((c) => (
                      <span key={c}>{c}</span>
                    ))}
                  </p>
                </div>
                <div className="deck-card__overlay">
                  <p className="deck-card__kicker">{p.kicker}</p>
                  <p className="deck-card__headline">{p.headline}</p>
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

// Projects have no screenshots yet, so each visual is a small constellation
// drawn from a seeded generator (deterministic, so server and client agree).
function FrameArt({ seed }: { seed: number }) {
  let s = (seed + 1) * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const pts = Array.from({ length: 9 }, (_, i) => [
    Math.round(520 + (i % 3) * 140 + rnd() * 90 - 45),
    Math.round(90 + Math.floor(i / 3) * 110 + rnd() * 70 - 35),
  ]);
  const links = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8],
  ].filter((_, i) => rnd() > 0.25 || i % 4 === 0);
  const hub = Math.floor(rnd() * 9);

  return (
    <svg className="deck-art" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`deckGrid${seed}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" className="deck-art__grid" />
        </pattern>
      </defs>
      <rect width="1000" height="560" fill={`url(#deckGrid${seed})`} />
      {links.map(([a, b], i) => (
        <line key={i} className="deck-art__edge" x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} className={i === hub ? "deck-art__hub" : "deck-art__node"} cx={x} cy={y} r={i === hub ? 9 : 5} />
      ))}
    </svg>
  );
}
