"use client";

import { useEffect, useRef } from "react";
import type { ProjectItem } from "@/lib/types";
import { Arrow } from "./Decor";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// "Project inspection dossier": native <dialog> gives focus trapping and Escape.
export default function ProjectModal({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (project && !dlg.open) dlg.showModal();
    if (!project && dlg.open) dlg.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="pl-dialog cc-dialog"
      aria-labelledby="cc-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {project && (
        <div className="pl-dialog__inner">
          <header className="pl-dialog__head">
            <p className="cc-dialog__meta">
              <span className="cc-dialog__cat">{project.category}</span>
              {project.period && <span className="cc-dialog__period">{project.period}</span>}
              {project.status && (
                <span className={`cc-status cc-status--${project.status.toLowerCase()}`}>
                  <span aria-hidden="true" />
                  {project.status}
                </span>
              )}
            </p>
            <button type="button" className="pl-dialog__close" onClick={onClose} aria-label="Close project details">
              ×
            </button>
          </header>

          <h3 id="cc-dialog-title" className="pl-card__role">
            {project.title}
          </h3>
          <p className="pl-card__company">
            <strong>{project.subtitle}</strong>
          </p>

          <p className="cc-dialog__desc">{project.description}</p>

          <p className="pl-dialog__label">Metrics</p>
          <dl className="cc-metrics">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>

          <p className="pl-dialog__label">Stack</p>
          <ul className="chips chips--sm">
            {project.techStack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className="cc-dialog__actions">
            {project.githubUrl && (
              <a className="btn btn--primary btn--sm" href={project.githubUrl} {...external}>
                View Source
                <Arrow className="icon" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {project.demoUrl && (
              <a className="btn btn--ghost btn--sm" href={project.demoUrl} {...external}>
                Launch Demo
                <Arrow className="icon" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            {project.caseStudyUrl && (
              <a className="btn btn--ghost btn--sm" href={project.caseStudyUrl}>
                View project
                <Arrow className="icon" />
              </a>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
