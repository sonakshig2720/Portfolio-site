"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { radialProjects } from "@/lib/radialProjects";
import type { ProjectItem } from "@/lib/types";
import StackDeck, { type DeckItem } from "./StackDeck";

// first sentence of the write-up doubles as the card's impact summary
const firstSentence = (text: string) => text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text;

// hackathon builds have their own section
const items = radialProjects.filter((p) => p.category !== "Hackathon").map((p, i) => {
  const year = p.period?.match(/\d{4}/g)?.pop();
  return {
    id: p.id,
    number: String(i + 1).padStart(2, "0"),
    title: p.title,
    tag: year ? `${p.category} (${year})` : p.category,
    headline: p.subtitle,
    chips: [p.category, p.period ?? ""].filter(Boolean),
    kicker: p.techStack.slice(0, 3).join(" · "),
    summary: firstSentence(p.description),
    previewImage: p.image,
    imageFit: p.imageFit,
    ctaLabel: p.caseStudyUrl ? "View project" : undefined,
    project: p,
  };
}) satisfies (DeckItem & { project: ProjectItem })[];

const Chevron = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function Projects() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const goTo = useRef<((index: number) => void) | null>(null);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-head reveal">
          <h2>Projects</h2>
          <div className="deck-steps">
            <button
              type="button"
              aria-label="Previous project"
              disabled={active === 0}
              onClick={() => goTo.current?.(active - 1)}
            >
              <Chevron d="m18 15-6-6-6 6" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              disabled={active === items.length - 1}
              onClick={() => goTo.current?.(active + 1)}
            >
              <Chevron d="m6 9 6 6 6-6" />
            </button>
          </div>
        </div>
        <StackDeck
          items={items}
          navRef={goTo}
          onActiveChange={setActive}
          onProjectSelect={(item) => item.project.caseStudyUrl && router.push(item.project.caseStudyUrl)}
        />
      </div>
    </section>
  );
}
