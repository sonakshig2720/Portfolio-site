import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import ArchFlow from "@/components/ArchFlow";
import { Arrow, Sparkle } from "@/components/Decor";
import { profile, projects } from "@/lib/content";
import { projectDetails } from "@/lib/projectDetails";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = projects.find((x) => x.id === id);
  if (!p) return {};
  return {
    title: `${p.title} — ${profile.name}`,
    description: projectDetails[id]?.subtitle ?? p.problem,
  };
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function ProjectPage({ params }: Params) {
  const { id } = await params;
  const index = projects.findIndex((x) => x.id === id);
  const p = projects[index];
  const d = projectDetails[id];
  if (!p || !d) notFound();

  const links = [...p.links, ...(d.extraLinks ?? [])];

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "approach", label: "Approach" },
    { id: "architecture", label: "Architecture" },
    { id: "contribution", label: "My contribution" },
    { id: "results", label: "Results" },
    { id: "learnings", label: "Learnings" },
  ];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav base="/" />
      <main id="main">
        {/* ── Hero ── */}
        <section id="top" className="hero phero">
          <div className="glow glow--hero" aria-hidden="true" />
          <div className="container hero__grid">
            <div className="hero__copy">
              <a href={p.kind === "Hackathon" ? "/#hackathons" : "/#projects"} className="back-link">
                <Arrow className="icon back-link__icon" />
                {p.kind === "Hackathon" ? "Back to hackathons" : "Back to projects"}
              </a>
              <p className="project__meta phero__meta">
                <span className={`pill pill--${p.kind.toLowerCase()}`}>{p.kind}</span>
                {d.event ?? p.context}
              </p>
              <h1 className="phero__title">
                <span className="brace" aria-hidden="true">{"{"}</span>
                <span className="grad-text">{p.title}</span>
                <span className="brace" aria-hidden="true">{"}"}</span>
              </h1>
              <p className="hero__tagline">{d.subtitle}</p>
              <ul className="chips chips--sm phero__tech" aria-label="Technologies">
                {d.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {links.length > 0 && (
                <div className="hero__actions">
                  {links.map((l, i) => (
                    <a key={l.href} href={l.href} {...external} className={`btn ${i === 0 ? "btn--primary" : "btn--ghost"}`}>
                      {l.label}
                      <Arrow className="icon" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              )}
              {d.stats && (
                <dl className="phero__stats">
                  {d.stats.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd className="grad-text">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>

        {/* ── Case study ── */}
        <section className="section pdetail">
          <div className="glow glow--left" aria-hidden="true" />
          <div className="container pdetail__grid">
            <nav className="toc" aria-label="On this page">
              <p className="mono label">On this page</p>
              <ol>
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>
                      <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="pdetail__body">
              <section id="overview" className="pblock reveal">
                <p className="kicker">01 — Overview</p>
                <p className="pblock__lead">{d.overview}</p>
              </section>

              <section id="problem" className="pblock reveal">
                <p className="kicker">02 — Problem</p>
                <div className="window">
                  <div className="window__bar" aria-hidden="true">
                    <span className="window__dots">
                      <i /> <i /> <i />
                    </span>
                    <span className="window__url">sonakshi.ai/projects/{p.id}</span>
                  </div>
                  <div className="window__body">
                    <div className="prompt">
                      <Sparkle className="prompt__icon" />
                      <span className="prompt__text">
                        What problem does it solve?
                        <span className="caret" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="answer">
                      <p>{d.problem}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="approach" className="pblock reveal">
                <p className="kicker">03 — Approach</p>
                <h2>How it works</h2>
                <p className="pblock__text">{d.approach}</p>
                {d.differentiator && (
                  <div className="callout">
                    <p className="mono label">What makes it different</p>
                    <p>{d.differentiator}</p>
                  </div>
                )}
              </section>

              <section id="architecture" className="pblock reveal">
                <p className="kicker">04 — System / Architecture</p>
                <h2>Architecture</h2>
                <ArchFlow steps={d.architecture} note={d.architectureNote} />
              </section>

              <section id="contribution" className="pblock reveal">
                <p className="kicker">05 — My contribution</p>
                <h2>What I built</h2>
                {d.contributionIntro && <p className="pblock__text">{d.contributionIntro}</p>}
                <ol className="contrib">
                  {d.contribution.map((c, i) => (
                    <li key={i}>
                      <span className="contrib__node mono" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p>{c}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="results" className="pblock reveal">
                <p className="kicker">06 — Results</p>
                <div className="results">
                  <h2>Results</h2>
                  <p>{d.results}</p>
                </div>
              </section>

              <section id="learnings" className="pblock reveal">
                <p className="kicker">07 — Challenges &amp; learnings</p>
                <h2>What I learned</h2>
                <ul className="learn">
                  {d.learnings.map((l, i) => (
                    <li key={i}>
                      <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                      <p>{l}</p>
                    </li>
                  ))}
                </ul>
                {d.linksNote && <p className="pblock__note">{d.linksNote}</p>}
              </section>
            </div>
          </div>
        </section>

      </main>
      <Reveal />
    </>
  );
}
