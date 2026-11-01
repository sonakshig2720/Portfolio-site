"use client";

import { useRef, useState } from "react";
import { skillMaps, type MapNode, type Route } from "@/lib/skillMaps";

const W = 640;
const H = 440;

// Circuit trace between two nodes.
function trace(a: MapNode, b: MapNode, route: Route) {
  if (route === "h") {
    const mx = Math.round((a.x + b.x) / 2);
    return `M${a.x} ${a.y} H${mx} V${b.y} H${b.x}`;
  }
  if (route === "v") {
    const my = Math.round((a.y + b.y) / 2);
    return `M${a.x} ${a.y} V${my} H${b.x} V${b.y}`;
  }
  // 45° run until one axis is used up, then straight.
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.min(Math.abs(dx), Math.abs(dy));
  const mx = a.x + Math.sign(dx) * d;
  const my = a.y + Math.sign(dy) * d;
  return `M${a.x} ${a.y} L${mx} ${my} L${b.x} ${b.y}`;
}

// Approximate card footprint in viewBox units.
const CARD_W = 250;
const CARD_H = 125;

// Scan the diagram for the spot that covers the fewest other nodes and
// labels, preferring spots close to the active node (never on top of it).
function placeCard(active: MapNode, nodes: MapNode[]) {
  const labelOffset = { top: [0, -36], bottom: [0, 36], left: [-60, 0], right: [60, 0] } as const;
  const pad = 24;
  const inside = (px: number, py: number, x: number, y: number) =>
    px > x - pad && px < x + CARD_W + pad && py > y - pad && py < y + CARD_H + pad;

  let best = { x: 0, y: 0, cost: Infinity };
  for (let x = -10; x <= W - CARD_W + 10; x += 15) {
    for (let y = -10; y <= H - CARD_H + 30; y += 15) {
      if (inside(active.x, active.y, x, y)) continue;
      let cost = 0;
      for (const n of nodes) {
        const [lx, ly] = labelOffset[n.label];
        if (n.id !== active.id && inside(n.x, n.y, x, y)) cost += 1000;
        // the hovered node's own label matters most
        if (inside(n.x + lx, n.y + ly, x, y)) cost += n.id === active.id ? 1500 : 400;
      }
      // distance from the node to the nearest point of the card
      const dx = Math.max(x - active.x, 0, active.x - (x + CARD_W));
      const dy = Math.max(y - active.y, 0, active.y - (y + CARD_H));
      cost += Math.hypot(dx, dy);
      if (cost < best.cost) best = { x, y, cost };
    }
  }
  return best;
}

export default function Skills() {
  const [mapIndex, setMapIndex] = useState(0);
  // Nothing is highlighted until a node is hovered/focused; a click pins it.
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const map = skillMaps[mapIndex];
  const byId = Object.fromEntries(map.nodes.map((n) => [n.id, n]));
  const activeId = hovered ?? pinned;
  const node = activeId ? byId[activeId] : null;

  const chooseMap = (i: number) => {
    setMapIndex(i);
    setHovered(null);
    setPinned(null);
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in step)) return;
    e.preventDefault();
    const next = (mapIndex + step[e.key] + skillMaps.length) % skillMaps.length;
    chooseMap(next);
    tabs.current[next]?.focus();
  };

  const cardPos = node ? placeCard(node, map.nodes) : null;
  const cardStyle: React.CSSProperties | undefined = cardPos
    ? { left: `${(cardPos.x / W) * 100}%`, top: `${(cardPos.y / H) * 100}%` }
    : undefined;

  return (
    <section id="skills" className="section skills">
      <div className="glow glow--right" aria-hidden="true" />
      <div className="container skills__layout">
        <div className="skills__side reveal">
          <div className="section-head">
            <h2>My Skills</h2>
            <p className="section-sub">
              Pick an area, then hover a node to see where I&apos;ve used that skill.
            </p>
          </div>

          <div className="skill-tabs" role="tablist" aria-label="Skill areas" aria-orientation="vertical" onKeyDown={onTabKey}>
            {skillMaps.map((m, i) => (
              <button
                key={m.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`skilltab-${m.id}`}
                aria-selected={i === mapIndex}
                aria-controls="skill-map"
                tabIndex={i === mapIndex ? 0 : -1}
                className="skill-tab"
                style={{ ["--c" as string]: m.color }}
                onClick={() => chooseMap(i)}
              >
                <span className="swatch" aria-hidden="true" />
                <span className="skill-tab__name">{m.name}</span>
                <span className="skill-tab__count mono">{m.nodes.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          id="skill-map"
          role="tabpanel"
          aria-labelledby={`skilltab-${map.id}`}
          className="circuit reveal"
          style={{ ["--c" as string]: map.color }}
        >
          <div className="circuit__board" key={map.id}>
            <svg className="circuit__wires" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
              {map.stubs?.map(([id, dx, dy]) => {
                const n = byId[id];
                return (
                  <g key={`stub-${id}-${dx}`} className="stub">
                    <path d={trace(n, { ...n, x: n.x + dx, y: n.y + dy }, "d")} pathLength={1} />
                    <circle cx={n.x + dx} cy={n.y + dy} r={3} />
                  </g>
                );
              })}
              {map.edges.map(([a, b, route]) => {
                const on = activeId !== null && (a === activeId || b === activeId);
                return (
                  <path
                    key={`${a}-${b}`}
                    d={trace(byId[a], byId[b], route)}
                    pathLength={1}
                    className={on ? "trace trace--on" : "trace"}
                  />
                );
              })}
            </svg>

            {map.nodes.map((n) => {
              const linked = map.edges.some(
                ([a, b]) => activeId !== null && ((a === activeId && b === n.id) || (b === activeId && a === n.id))
              );
              return (
                <button
                  key={n.id}
                  type="button"
                  className={`cnode cnode--${n.label} ${n.id === activeId ? "is-active" : ""} ${linked ? "is-linked" : ""}`}
                  style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
                  aria-pressed={n.id === pinned}
                  onClick={() => setPinned((p) => (p === n.id ? null : n.id))}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(n.id)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="cnode__dot" aria-hidden="true" />
                  <span className="cnode__label">{n.name}</span>
                </button>
              );
            })}

            {node && (
            <div className="circuit-card" style={cardStyle} aria-live="polite" key={node.id}>
              <p>
                <span className="mono">Skill</span> <strong>{node.name}</strong>
              </p>
              {node.usedIn && (
                <p>
                  <span className="mono">Used in</span> {node.usedIn}
                </p>
              )}
              <p className="circuit-card__area">{map.name}</p>
              <span className="circuit-card__bar" aria-hidden="true" />
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
