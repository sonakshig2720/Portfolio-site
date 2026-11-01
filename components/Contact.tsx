import { profile } from "@/lib/content";
import { Arrow } from "./Decor";

const waves = Array.from({ length: 22 }, (_, i) => {
  const t = i / 21;
  const amp = 18 + 46 * Math.sin(t * Math.PI);
  const phase = i * 9;
  return `M0 120 C 260 120, 420 120, 560 120 C 680 ${120 - amp}, ${740 + phase} ${120 + amp}, 860 120 S ${1040 - phase} ${120 - amp * 0.8}, 1200 120`;
});

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "contact__icon",
};

const icons = {
  Email: (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  LinkedIn: (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </svg>
  ),
  GitHub: (
    <svg {...iconProps}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  ),
};

export default function Contact() {
  const links = [
    { label: "Email" as const, value: profile.email, href: `mailto:${profile.email}` },
    { label: "LinkedIn" as const, value: "/in/sonakshi-godavarthy", href: profile.linkedin },
    { label: "GitHub" as const, value: "/sonakshig2720", href: profile.github },
  ];
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact__inner reveal">
          <h2 className="contact__title">
            Let&apos;s build something <span className="grad-text">great together.</span>
          </h2>
          <p className="section-sub">
            Interested in research, AI systems or collaboration? I&apos;m based in {profile.location} and{" "}
            {profile.locationNote.toLowerCase()}.
          </p>
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            Get in touch
            <Arrow className="icon" />
          </a>
          <ul className="contact__links">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className="mono label contact__label">
                    {icons[l.label]}
                    {l.label}
                  </span>
                  <span className="contact__value">{l.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <svg className="waves" viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#d4af5f" stopOpacity="0.15" />
            <stop offset="55%" stopColor="#d4af5f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d4af5f" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {waves.map((d, i) => (
          <path key={i} d={d} stroke="url(#waveGrad)" style={{ animationDelay: `${-i * 0.35}s` }} />
        ))}
      </svg>

      <footer className="footer container">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}
