"use client";

import { useRef, useState } from "react";
import { skillAreas } from "@/lib/skills";

export default function Skills() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const area = skillAreas[active];

  // Arrow keys move between areas, like a standard vertical tab list.
  const onTabKey = (e: React.KeyboardEvent) => {
    const step: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(e.key in step)) return;
    e.preventDefault();
    const next = (active + step[e.key] + skillAreas.length) % skillAreas.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-head reveal">
          <h2>Skills</h2>
        </div>

        <div className="skills-panel reveal">
          <div className="skills-areas">
            <p className="skills-areas__label">Areas</p>
            <div role="tablist" aria-label="Skill areas" aria-orientation="vertical" onKeyDown={onTabKey}>
              {skillAreas.map((a, i) => (
                <button
                  key={a.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`skilltab-${a.id}`}
                  aria-selected={i === active}
                  aria-controls="skills-grid"
                  tabIndex={i === active ? 0 : -1}
                  className="skills-area"
                  onClick={() => setActive(i)}
                >
                  <span className="skills-area__icon" aria-hidden="true">
                    {a.icon}
                  </span>
                  <span className="skills-area__name">{a.name}</span>
                  <span className="skills-area__count">{a.skills.length}</span>
                </button>
              ))}
            </div>
          </div>

          <div id="skills-grid" role="tabpanel" aria-labelledby={`skilltab-${area.id}`} className="skills-tools">
            <header className="skills-tools__head">
              <h3>
                <span aria-hidden="true">{area.icon}</span> {area.name}
              </h3>
              <span className="skills-tools__count">{area.skills.length} Tools</span>
            </header>
            <ul className="skills-tools__grid" key={area.id}>
              {area.skills.map((s) => (
                <li key={s.name} className="skill-chip" tabIndex={s.usedIn ? 0 : undefined}>
                  <span className="skill-chip__name">{s.name}</span>
                  {s.usedIn && (
                    <span className="skill-chip__tip" role="tooltip">
                      {s.usedIn}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
