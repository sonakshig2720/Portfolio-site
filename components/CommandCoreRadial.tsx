"use client";

import { useMemo, useState } from "react";
import type { ProjectItem } from "@/lib/types";
import BadgeCard from "./BadgeCard";
import ProjectModal from "./ProjectModal";

/*
 * "Command Core" radial project map: a central chip with PCB traces running
 * out to each project. Geometry lives in a 1000 × 1000 viewBox; badges are
 * HTML buttons positioned over the SVG by percentage.
 */

const CX = 500;
const CY = 500;
const CHIP = 140;
const X0 = CX - CHIP / 2; // 430
const RADIUS = 420;
const PINS = 7;
const PITCH = CHIP / (PINS + 1); // 17.5
const STUB = 30;

type Edge = "top" | "right" | "bottom" | "left";
type Pt = [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

const EDGE_DIR: Record<Edge, { e: Pt; p: Pt }> = {
  right: { e: [1, 0], p: [0, 1] },
  left: { e: [-1, 0], p: [0, 1] },
  bottom: { e: [0, 1], p: [1, 0] },
  top: { e: [0, -1], p: [1, 0] },
};

function edgeFor(angle: number): Edge {
  const a = ((angle % 360) + 360) % 360;
  if (a >= 315 || a < 45) return "right";
  if (a < 135) return "bottom";
  if (a < 225) return "left";
  return "top";
}

function pinPoint(edge: Edge, i: number): Pt {
  const along = X0 + PITCH * (i + 1);
  if (edge === "right") return [X0 + CHIP, along];
  if (edge === "left") return [X0, along];
  if (edge === "bottom") return [along, X0 + CHIP];
  return [along, X0];
}

// Orthogonal stub out of the pin, a 45° run, then straight into the target.
function route(start: Pt, edge: Edge, target: Pt, stub = STUB) {
  const { e, p } = EDGE_DIR[edge];
  const p1: Pt = [start[0] + e[0] * stub, start[1] + e[1] * stub];
  const du = (target[0] - p1[0]) * e[0] + (target[1] - p1[1]) * e[1];
  const dv = (target[0] - p1[0]) * p[0] + (target[1] - p1[1]) * p[1];
  const d = Math.max(0, Math.min(Math.abs(du), Math.abs(dv)));
  const s = Math.sign(dv);
  const p2: Pt = [p1[0] + e[0] * d + p[0] * s * d, p1[1] + e[1] * d + p[1] * s * d];
  const pts = [start, p1, p2, target].map(([x, y]) => [r1(x), r1(y)] as Pt);
  return { d: `M${pts.map((q) => q.join(" ")).join(" L")}`, via: pts[2] };
}

const polar = (angle: number, r: number): Pt => {
  const t = (angle * Math.PI) / 180;
  return [CX + Math.cos(t) * r, CY + Math.sin(t) * r];
};

type Trace = { project: ProjectItem; edge: Edge; pin: number; d: string; via: Pt; target: Pt };

function layout(projects: ProjectItem[]) {
  const used: Record<Edge, Set<number>> = { top: new Set(), right: new Set(), bottom: new Set(), left: new Set() };
  const traces: Trace[] = projects.map((project) => {
    const target = polar(project.radialAngle, project.radialDistance * RADIUS);
    const edge = edgeFor(project.radialAngle);
    // pick the pin closest to the target along the edge, avoiding collisions
    const along = edge === "left" || edge === "right" ? target[1] : target[0];
    let pin = Math.min(PINS - 1, Math.max(0, Math.round(((along - X0) / CHIP) * (PINS + 1) - 1)));
    while (used[edge].has(pin)) pin = (pin + 1) % PINS;
    used[edge].add(pin);
    const { d, via } = route(pinPoint(edge, pin), edge, target);
    return { project, edge, pin, d, via, target: [r1(target[0]), r1(target[1])] as Pt };
  });

  // Decorative traces in the gaps between project branches.
  const angles = projects.map((p) => p.radialAngle).sort((a, b) => a - b);
  const ambient = angles.flatMap((a, i) => {
    const next = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1];
    const mid = (a + next) / 2;
    return [
      { from: polar(mid - 6, 190), to: polar(mid + 4, 470) },
      { from: polar(mid + 9, 250), to: polar(mid + 15, 400) },
    ].map(({ from, to }) => {
      const edge = edgeFor(mid);
      const { d } = route(from, edge, to, 26);
      return { d, from: from.map(r1) as Pt, to: to.map(r1) as Pt };
    });
  });

  // Unused pins get a short dead-end stub.
  const stubs: { d: string; end: Pt }[] = [];
  (Object.keys(EDGE_DIR) as Edge[]).forEach((edge) => {
    for (let i = 0; i < PINS; i++) {
      if (used[edge].has(i)) continue;
      const [x, y] = pinPoint(edge, i);
      const { e } = EDGE_DIR[edge];
      const end: Pt = [r1(x + e[0] * 14), r1(y + e[1] * 14)];
      stubs.push({ d: `M${x} ${y} L${end.join(" ")}`, end });
    }
  });

  return { traces, ambient, stubs };
}

export default function CommandCoreRadial({ projects }: { projects: ProjectItem[] }) {
  const { traces, ambient, stubs } = useMemo(() => layout(projects), [projects]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState<ProjectItem | null>(null);

  const pins = (Object.keys(EDGE_DIR) as Edge[]).flatMap((edge) =>
    Array.from({ length: PINS }, (_, i) => ({ edge, i, pt: pinPoint(edge, i) }))
  );

  return (
    <div className="cc-board">
      <svg className="cc-svg" viewBox="0 0 1000 1000" aria-hidden="true">
        <defs>
          <radialGradient id="ccGlow">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ccCore" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        <circle cx={CX} cy={CY} r={220} fill="url(#ccGlow)" />

        {/* ambient circuitry */}
        <g className="cc-ambient">
          {ambient.map((a, i) => (
            <g key={i}>
              <path d={a.d} />
              <circle cx={a.from[0]} cy={a.from[1]} r={4} />
              <circle cx={a.to[0]} cy={a.to[1]} r={5} />
            </g>
          ))}
          {stubs.map((s, i) => (
            <path key={`s${i}`} d={s.d} />
          ))}
        </g>

        {/* project traces */}
        {traces.map((t) => {
          const on = hovered === t.project.id;
          return (
            <g key={t.project.id} className={`cc-trace ${on ? "is-hot" : ""} ${hovered && !on ? "is-dim" : ""}`}>
              <path d={t.d} className="cc-trace__line" />
              <circle cx={t.via[0]} cy={t.via[1]} r={5} className="cc-trace__via" />
              <circle cx={t.target[0]} cy={t.target[1]} r={11} className="cc-pad" />
              <circle cx={t.target[0]} cy={t.target[1]} r={5} className="cc-pad__core" />
            </g>
          );
        })}

        {/* the chip */}
        <g className="cc-chip">
          {pins.map(({ edge, i, pt }) => {
            const active = traces.some((t) => t.edge === edge && t.pin === i);
            return (
              <rect
                key={`${edge}${i}`}
                x={pt[0] - 6}
                y={pt[1] - 6}
                width={12}
                height={12}
                rx={3}
                className={`cc-pin ${active ? "is-used" : ""}`}
              />
            );
          })}
          <rect x={X0} y={X0} width={CHIP} height={CHIP} rx={14} className="cc-chip__body" />
          <rect x={X0 + 12} y={X0 + 12} width={CHIP - 24} height={CHIP - 24} rx={8} className="cc-chip__frame" />
          <rect x={X0 + 22} y={X0 + 22} width={CHIP - 44} height={CHIP - 44} rx={6} fill="url(#ccCore)" className="cc-chip__die" />
          <foreignObject x={X0 + 22} y={X0 + 22} width={CHIP - 44} height={CHIP - 44}>
            <div className="cc-core-text">
              <p className="cc-core-text__big">PROJECTS</p>
            </div>
          </foreignObject>
        </g>
      </svg>

      {traces.map((t) => (
        <BadgeCard
          key={t.project.id}
          project={t.project}
          x={t.target[0] / 10}
          y={t.target[1] / 10}
          above={t.target[1] < CY}
          active={hovered === t.project.id}
          onHover={(on) => setHovered(on ? t.project.id : null)}
          onOpen={() => setOpen(t.project)}
        />
      ))}

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </div>
  );
}
