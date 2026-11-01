import type { ArchStep } from "@/lib/projectDetails";

// Renders a project's system architecture as a circuit-style vertical flow,
// with parallel branches laid out side by side.
export default function ArchFlow({ steps, note }: { steps: ArchStep[]; note?: string }) {
  return (
    <div className="arch">
      <ol className="arch__flow">
        {steps.map((step, i) => (
          <li key={i} className="arch__step" style={{ ["--i" as string]: i }}>
            {"parallel" in step ? (
              <div className="arch__group">
                {step.note && <p className="arch__group-note mono">{step.note}</p>}
                <div className="arch__parallel" style={{ ["--n" as string]: step.parallel.length }}>
                  {step.parallel.map((n) => (
                    <div key={n.title} className="arch__node">
                      <strong>{n.title}</strong>
                      {n.desc && <span>{n.desc}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="arch__node">
                <span className="arch__index mono" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{step.title}</strong>
                {step.desc && <span>{step.desc}</span>}
              </div>
            )}
          </li>
        ))}
      </ol>
      {note && <p className="arch__note mono">{note}</p>}
    </div>
  );
}
