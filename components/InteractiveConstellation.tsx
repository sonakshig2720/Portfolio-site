"use client";

import { useEffect, useState } from "react";

/*
 * Low-poly constellation that wraps the bottom/right curve of the hero
 * portrait and doubles as section navigation. Coordinates are in the
 * portrait container's own space (440 × 475); the SVG is oversized so the
 * mesh and labels can spill past the container.
 */

type Primary = {
  id: string;
  num: string;
  label: string;
  x: number;
  y: number;
  // Desktop label sits below or to the right; mobile moves right-hand labels inward.
  side: "below" | "right";
  row?: number;
};

// Portrait centre (in the 440 × 475 container space) and how much to enlarge
// the network around it.
const CX = 216;
const CY = 242;
const SCALE = 1.06;

const primaries: Primary[] = [
  { id: "about", num: "01", label: "About", x: 93, y: 447, side: "below" },
  { id: "skills", num: "02", label: "Skills", x: 216, y: 492, side: "below", row: 1 },
  { id: "projects", num: "03", label: "Projects", x: 339, y: 447, side: "below" },
  { id: "experience", num: "04", label: "Experience", x: 418, y: 328, side: "right" },
  { id: "contact", num: "05", label: "Contact", x: 418, y: 156, side: "right" },
];

const junctions: Record<string, [number, number]> = {
  ja: [158, 488],
  jb: [282, 494],
  jc: [392, 398],
  jd: [458, 240],
  je: [392, 78],
  jf: [478, 404],
  jg: [28, 478],
};

const edges: [string, string][] = [
  // the arc
  ["about", "ja"], ["ja", "skills"], ["skills", "jb"], ["jb", "projects"], ["projects", "jc"],
  ["jc", "experience"], ["experience", "jd"], ["jd", "contact"], ["contact", "je"],
  // chords between primaries
  ["about", "skills"], ["skills", "projects"], ["projects", "experience"], ["experience", "contact"],
  // outer mesh
  ["jg", "about"], ["jg", "ja"], ["ja", "jb"], ["jb", "jc"], ["projects", "jf"], ["jc", "jf"],
  ["jf", "experience"], ["jf", "jd"], ["jd", "je"],
];

const pos: Record<string, [number, number]> = {
  ...junctions,
  ...Object.fromEntries(primaries.map((p) => [p.id, [p.x, p.y] as [number, number]])),
};

const neighbours = (id: string) =>
  edges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));

export default function InteractiveConstellation() {
  const [hot, setHot] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  // Keep the active node in sync with whichever section is on screen.
  useEffect(() => {
    const sections = primaries
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => window.scrollY < 200 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, []);

  const near = hot ? new Set(neighbours(hot)) : new Set<string>();

  return (
    <svg
      className="constellation"
      viewBox="-44 -48 616 641"
      role="navigation"
      aria-label="Section navigation"
    >
      <defs>
        <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Enlarge the whole network around the portrait's centre. */}
      <g transform={`translate(${CX} ${CY}) scale(${SCALE}) translate(${-CX} ${-CY})`}>
      <g className="cst-edges" aria-hidden="true">
        {edges.map(([a, b]) => {
          const lit = hot !== null && (a === hot || b === hot);
          return (
            <line
              key={`${a}-${b}`}
              x1={pos[a][0]}
              y1={pos[a][1]}
              x2={pos[b][0]}
              y2={pos[b][1]}
              className={lit ? "cst-edge cst-edge--lit" : "cst-edge"}
            />
          );
        })}
      </g>

      {/* Electric pulses travel outward from the hovered node. Keyed on the
          node so the animation restarts on every new hover. */}
      {hot && (
        <g className="cst-pulses" key={hot} aria-hidden="true">
          {neighbours(hot).map((n) => (
            <line
              key={n}
              x1={pos[hot][0]}
              y1={pos[hot][1]}
              x2={pos[n][0]}
              y2={pos[n][1]}
              pathLength={100}
              className="cst-pulse"
            />
          ))}
        </g>
      )}

      <g aria-hidden="true">
        {Object.entries(junctions).map(([id, [x, y]]) => (
          <circle key={id} cx={x} cy={y} r={2.9} className={`cst-junction ${near.has(id) ? "is-near" : ""}`} />
        ))}
      </g>

      {primaries.map((p) => {
        const on = hot === p.id || active === p.id;
        const right = p.side === "right";
        const labelY = p.y + (p.row ? 34 : 30);
        return (
          <a
            key={p.id}
            href={`#${p.id}`}
            className={`cst-node ${on ? "is-on" : ""} ${hot === p.id ? "is-hot" : ""} ${near.has(p.id) ? "is-near" : ""} ${active === p.id ? "is-active" : ""}`}
            aria-label={`${p.num} ${p.label}`}
            aria-current={active === p.id ? "true" : undefined}
            onMouseEnter={() => setHot(p.id)}
            onMouseLeave={() => setHot(null)}
            onFocus={() => setHot(p.id)}
            onBlur={() => setHot(null)}
            onClick={() => setActive(p.id)}
          >
            {/* generous invisible hit area around node + label */}
            <circle cx={p.x} cy={p.y} r={28} className="cst-hit" />
            {right ? (
              <rect x={p.x} y={p.y - 18} width={140} height={36} className="cst-hit" />
            ) : (
              <rect x={p.x - 66} y={p.y} width={132} height={labelY - p.y + 16} className="cst-hit" />
            )}

            <circle cx={p.x} cy={p.y} r={21} className="cst-orbit" />
            <circle cx={p.x} cy={p.y} r={14} className="cst-halo" />
            <circle cx={p.x} cy={p.y} r={9} className="cst-ring" />
            <circle cx={p.x} cy={p.y} r={4.5} className="cst-core" filter="url(#nodeGlow)" />

            {/* desktop label */}
            <text
              className="cst-label cst-label--d"
              x={right ? p.x + 22 : p.x}
              y={right ? p.y + 4 : labelY}
              textAnchor={right ? "start" : "middle"}
            >
              <tspan className="cst-num">[{p.num}]</tspan> {p.label}
            </text>
            {/* narrow-screen label: right-hand labels tuck inside the curve */}
            <text
              className="cst-label cst-label--m"
              x={right ? p.x - 34 : p.x}
              y={right ? p.y + 6 : labelY + 8}
              textAnchor={right ? "end" : "middle"}
            >
              <tspan className="cst-num">[{p.num}]</tspan> {p.label}
            </text>
          </a>
        );
      })}
      </g>
    </svg>
  );
}
