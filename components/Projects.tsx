"use client";

import { useRouter } from "next/navigation";
import { radialProjects } from "@/lib/radialProjects";
import type { ProjectItem } from "@/lib/types";
import StackDeck, { type DeckItem } from "./StackDeck";

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
    previewImage: p.image,
    imageFit: p.imageFit,
    ctaLabel: p.caseStudyUrl ? "View project" : undefined,
    project: p,
  };
}) satisfies (DeckItem & { project: ProjectItem })[];

export default function Projects() {
  const router = useRouter();

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-head reveal">
          <h2>Projects</h2>
        </div>
        <StackDeck
          items={items}
          onProjectSelect={(item) => item.project.caseStudyUrl && router.push(item.project.caseStudyUrl)}
        />
      </div>
    </section>
  );
}
