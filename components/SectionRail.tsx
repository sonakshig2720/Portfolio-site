"use client";

import { useEffect, useState } from "react";

type Item = { href: string; label: string };

// Constellation-style section navigation that sits beside the hero board:
// numbered nodes on a zig-zag line, with small junction dots between them.
export default function SectionRail({
  items,
  base = "",
  variant = "rail",
}: {
  items: Item[];
  base?: string; // "/" on subpages so links point back to the home page
  variant?: "rail" | "bar"; // vertical constellation, or a horizontal header row
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.querySelector(i.href))
      .filter((el): el is Element => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => window.scrollY < 300 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [items]);

  // node x-offsets (px) so the line zig-zags gently
  const xs = [10, 26, 8, 24, 12];

  return (
    <nav className={`rail rail--${variant}`} aria-label="Sections">
      <svg className="rail__lines" viewBox="0 0 40 100" preserveAspectRatio="none" aria-hidden="true">
        {items.slice(0, -1).map((_, i) => {
          const y1 = (i / (items.length - 1)) * 100;
          const y2 = ((i + 1) / (items.length - 1)) * 100;
          const x1 = xs[i % xs.length];
          const x2 = xs[(i + 1) % xs.length];
          const jx = (x1 + x2) / 2 + (i % 2 ? -12 : 12);
          const jy = (y1 + y2) / 2;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} />
              <line x1={x1} y1={y1} x2={jx} y2={jy} className="rail__chord" />
              <line x1={jx} y1={jy} x2={x2} y2={y2} className="rail__chord" />
              <circle cx={jx} cy={jy} r={1.4} />
            </g>
          );
        })}
      </svg>
      <ol>
        {items.map((it, i) => (
          <li
            key={it.href}
            style={{ top: `${(i / (items.length - 1)) * 100}%`, left: `${xs[i % xs.length]}px` }}
          >
            <a href={`${base}${it.href}`} className={active === it.href ? "is-active" : undefined} aria-current={active === it.href ? "true" : undefined}>
              <span className="rail__node" aria-hidden="true" />
              <span className="rail__label">{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
