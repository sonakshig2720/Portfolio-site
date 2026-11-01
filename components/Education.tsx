import { awards, education } from "@/lib/content";
import { Arrow } from "./Decor";

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 9 12 4 2 9l10 5 10-5Z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 9v6" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
    </svg>
  );
}

export default function Education() {
  return (
    <section id="education" className="section education">
      <div className="container">
        <div className="section-head reveal">
          <h2>Education &amp; Honors</h2>
        </div>

        <div className="edu-grid">
          {education.map((d) => (
            <article key={d.id} className="degree reveal">
              <div className="degree__body">
                <header className="degree__head">
                  <div>
                    <p className="degree__meta">
                      {d.isCurrent && (
                        <span className="degree__current">
                          <span aria-hidden="true" />
                          Current
                        </span>
                      )}
                      <span className="degree__period">{d.period}</span>
                    </p>
                    <p className="degree__location">{d.location}</p>
                  </div>
                  <span className="degree__icon">
                    <CapIcon />
                  </span>
                </header>

                <div>
                  <h3 className="degree__title">{d.degree}</h3>
                  <p className="degree__school">{d.institution}</p>
                  {d.grade && <p className="degree__grade">{d.grade}</p>}
                </div>

                <div className="degree__thesis">
                  {d.partner ? (
                    <p className="degree__partner">Thesis with {d.partner}</p>
                  ) : (
                    <p className="degree__partner">Thesis</p>
                  )}
                  <p className="degree__thesis-title">{d.thesisTitle}</p>
                </div>

                {d.techStack.length > 0 && (
                  <ul className="chips chips--sm" aria-label="Technologies">
                    {d.techStack.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>

              {d.links && d.links.length > 0 && (
                <footer className="degree__links">
                  {d.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      className="link-arrow"
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {l.label}
                      <Arrow className="icon" />
                    </a>
                  ))}
                </footer>
              )}
            </article>
          ))}
        </div>

        {awards.length > 0 && (
          <ul className="honors reveal" aria-label="Honors and awards">
            {awards.map((a) => (
              <li key={a.id} className="honor">
                <span className="honor__icon">
                  <AwardIcon />
                </span>
                <span className="honor__text">
                  <strong>{a.title}</strong>
                  <span>
                    {a.issuer} · {a.year}
                  </span>
                  {a.note && <span>{a.note}</span>}
                </span>
                <span className="honor__cat">{a.category}</span>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="link-arrow">
                    View
                    <Arrow className="icon" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
