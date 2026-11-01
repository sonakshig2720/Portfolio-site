import Link from "next/link";
import { radialProjects } from "@/lib/radialProjects";
import { Arrow } from "./Decor";

const hackathons = radialProjects.filter((p) => p.category === "Hackathon");
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
    </svg>
  );
}

export default function Hackathons() {
  return (
    <section id="hackathons" className="section hackathons">
      <div className="container">
        <div className="section-head reveal">
          <h2>Hackathons</h2>
        </div>

        <div className="hack-grid">
          {hackathons.map((h) => (
            <article key={h.id} className="hack reveal">
              <header className="hack__head">
                <span className="hack__icon">
                  <FlagIcon />
                </span>
                <p className="hack__event">
                  <strong>{h.event}</strong>
                  <span>{h.period}</span>
                </p>
              </header>

              <div>
                <h3 className="hack__title">{h.title}</h3>
                <p className="hack__subtitle">{h.subtitle}</p>
              </div>

              <p className="hack__desc">{h.description}</p>

              <dl className="hack__metrics">
                {h.metrics.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="chips chips--sm" aria-label="Stack">
                {h.techStack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              <footer className="hack__actions">
                {h.caseStudyUrl && (
                  <Link href={h.caseStudyUrl} className="btn btn--primary btn--sm">
                    View project
                    <Arrow className="icon" />
                  </Link>
                )}
                {h.githubUrl && (
                  <a href={h.githubUrl} className="link-arrow" {...external}>
                    Source
                    <Arrow className="icon" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                {h.demoUrl && (
                  <a href={h.demoUrl} className="link-arrow" {...external}>
                    Live demo
                    <Arrow className="icon" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
