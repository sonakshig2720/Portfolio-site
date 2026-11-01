import type { ProjectItem } from "@/lib/types";

type Props = {
  project: ProjectItem;
  x: number; // % of board width (pad centre)
  y: number; // % of board height (pad centre)
  above: boolean; // sit above the pad (upper half) or below it
  active: boolean;
  onHover: (on: boolean) => void;
  onOpen: () => void;
};

// Floating badge next to a project's connection pad. Hover/focus lights the
// trace; activating it opens the project's page, or the details dialog when
// the project has no page of its own.
export default function BadgeCard({ project, x, y, above, active, onHover, onOpen }: Props) {
  const metric = project.metrics[0];
  const shared = {
    className: `cc-badge ${above ? "cc-badge--above" : "cc-badge--below"} ${active ? "is-active" : ""}`,
    style: { left: `${x}%`, top: `${y}%` },
    onMouseEnter: () => onHover(true),
    onMouseLeave: () => onHover(false),
    onFocus: () => onHover(true),
    onBlur: () => onHover(false),
  };
  const content = (
    <>
      <span className="cc-badge__top">
        <span className="cc-badge__title">{project.title}</span>
        <span className="cc-badge__cat">{project.category}</span>
      </span>
      <span className="cc-badge__meta">
        {project.techStack.slice(0, 2).join(" · ")}
        {metric && (
          <>
            {" · "}
            <span className="cc-badge__metric">{metric.value}</span>
          </>
        )}
      </span>
    </>
  );

  if (project.caseStudyUrl) {
    return (
      <a {...shared} href={project.caseStudyUrl} aria-label={`Open project: ${project.title}`}>
        {content}
      </a>
    );
  }
  return (
    <button {...shared} type="button" aria-label={`Inspect project: ${project.title}`} aria-haspopup="dialog" onClick={onOpen}>
      {content}
    </button>
  );
}
