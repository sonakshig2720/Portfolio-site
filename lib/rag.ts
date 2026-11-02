// Knowledge base for the "Ask about Sonakshi" chatbot: short question → answer
// facts generated from the same data files the site renders, so the bot can
// only say what the portfolio says. scripts/build-chat-index.ts embeds both
// sides of every fact into public/chat-index.json for offline semantic search.

import { awards, education, profile } from "./content";
import { experienceNodes } from "./experiencePipeline";
import { radialProjects } from "./radialProjects";
import { skillAreas } from "./skills";
import { whiteboard } from "./whiteboard";

export type Fact = { q: string; a: string; href?: string; label?: string };

const firstSentence = (t: string) => t.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? t;
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

function buildFacts(): Fact[] {
  const facts: Fact[] = [];
  const add = (q: string | string[], a: string, href?: string, label?: string) => {
    for (const one of Array.isArray(q) ? q : [q]) facts.push({ q: one, a, href, label });
  };

  // ── who she is ──
  const intro = `${profile.name} is an ${profile.role} and research engineer based in ${profile.location}. ${profile.tagline} ${profile.intro}`;
  add(["Who is Sonakshi?", "Tell me about her", "What does she do?", "What is her role?"], intro, "/#top", "About Sonakshi");
  add(
    [
      "Where is she based?",
      "Is she open to relocation?",
      "Is she willing to relocate?",
      "Would she move to another country for a job?",
      "Can she work abroad?",
      "Is she open to moving for work?",
    ],
    `She is based in ${profile.location} and is open to relocating worldwide.`,
    "/#contact",
    "Contact"
  );
  add(
    ["How can I contact her?", "What is her email?", "How do I reach Sonakshi?", "Is she on LinkedIn or GitHub?"],
    `Email: ${profile.email}. LinkedIn: ${profile.linkedin}. GitHub: ${profile.github}.`,
    "/#contact",
    "Contact"
  );
  add(["Where can I get her CV?", "Can I download her resume?"], "Her CV can be downloaded with the Download CV button at the top right of the site.", profile.cv, "Download CV");
  add(["Which languages does she speak?", "Does she speak German?"], `${whiteboard.human.lines.join(" ")}`, "/#top", "About Sonakshi");
  add(
    ["What is she passionate about?", "What motivates her?", "What are her research interests?"],
    `${whiteboard.obsession.before}${whiteboard.obsession.emphasis}${whiteboard.obsession.after} ${whiteboard.radar.quote} What keeps her up at night: ${whiteboard.radar.items.map((i) => i.join("")).join(" ")}`,
    "/#about",
    "About Sonakshi"
  );

  // ── experience ──
  const [current] = experienceNodes;
  add(
    ["What is she working on right now?", "What is her current job?", "Where does she work now?"],
    `She is currently doing ${current.role.toLowerCase()} at ${current.company} (${current.period}). ${current.caseStudy.solution}`,
    "/#experience",
    "Experience"
  );
  add(
    ["Where has she worked?", "What is her work experience?", "Which companies has she worked for?"],
    experienceNodes.map((n) => `${n.role} at ${n.company} (${n.period})`).join("; ") + ".",
    "/#experience",
    "Experience"
  );
  for (const n of experienceNodes) {
    const org = n.company.match(/\(([^)]+)\)\s*$/)?.[1] ?? n.company.split(" ")[0];
    const names = [...new Set([org, n.company.split(",")[0]])];
    add(
      names.flatMap((c) => [`What did she do at ${c}?`, `Tell me about her role at ${c}`]),
      `${n.role} at ${n.company}, ${n.location} (${n.period}). ${n.caseStudy.solution}`,
      "/#experience",
      `${n.role} — ${org}`
    );
    add(
      names.map((c) => `What was her impact at ${c}?`),
      `At ${org}: ${n.caseStudy.metrics.join("; ")}.`,
      "/#experience",
      `${n.role} — ${org}`
    );
    add(names.map((c) => `What tools did she use at ${c}?`), `At ${org} she used ${list(n.techStack)}.`, "/#experience", `${n.role} — ${org}`);
  }

  // ── projects & hackathons ──
  const projects = radialProjects.filter((p) => p.category !== "Hackathon");
  const hacks = radialProjects.filter((p) => p.category === "Hackathon");
  add(
    ["What projects has she built?", "Show me her projects", "What has she worked on?"],
    projects.map((p) => `${p.title} — ${p.subtitle}`).join("; ") + ".",
    "/#projects",
    "Projects"
  );
  add(
    ["Has she done any hackathons?", "Which hackathons has she won or joined?"],
    hacks.map((p) => `${p.title} at ${p.event} (${p.period}) — ${p.subtitle}`).join("; ") + ".",
    "/#hackathons",
    "Hackathons"
  );
  for (const p of radialProjects) {
    const href = p.caseStudyUrl ?? (p.category === "Hackathon" ? "/#hackathons" : "/#projects");
    add([`What is ${p.title}?`, `Tell me about ${p.title}`, `${p.title} project`], `${p.title} (${p.period}): ${p.description}`, href, p.title);
    add(
      [`What were the results of ${p.title}?`, `What did ${p.title} achieve?`],
      `${p.title}: ${p.metrics.map((m) => `${m.label} — ${m.value}`).join("; ")}.`,
      href,
      p.title
    );
    add(
      [`What tech stack did ${p.title} use?`, `Which tools were used in ${p.title}?`],
      `${p.title} uses ${list(p.techStack)}.${p.githubUrl ? ` Code: ${p.githubUrl}.` : ""}${p.demoUrl ? ` Live demo: ${p.demoUrl}.` : ""}`,
      href,
      p.title
    );
  }

  const byId = (id: string) => radialProjects.find((p) => p.id === id)!;
  const traffic = byId("traffic");
  add(
    ["Has she worked with streaming or real-time data?", "Does she have experience with real-time systems?", "Has she used Kafka and Flink?"],
    `Yes — ${traffic.title} (${traffic.period}): ${traffic.description}`,
    traffic.caseStudyUrl,
    traffic.title
  );
  const lufthansa = experienceNodes.find((n) => n.id === "lufthansa")!;
  add(
    ["Which projects use RAG or LLMs?", "Has she built RAG systems?", "Does she have experience with LLMs and generative AI?"],
    [
      `${byId("aircraft-kg").title} — ${byId("aircraft-kg").subtitle} (master's thesis at DLR)`,
      `the RAG pipeline at Lufthansa (${firstSentence(lufthansa.caseStudy.solution)})`,
      `${byId("decideher").title} — ${byId("decideher").subtitle}`,
      `${byId("raw2ready").title} — ${byId("raw2ready").subtitle}`,
    ].join("; ") + ".",
    "/#projects",
    "Projects"
  );
  add(
    ["Does she have research experience?", "Has she worked in research?"],
    experienceNodes
      .filter((n) => /research|assistant|thesis/i.test(n.role))
      .map((n) => `${n.role} at ${n.company} (${n.period})`)
      .concat(`${byId("federated").title} — ${byId("federated").subtitle}`)
      .join("; ") + ".",
    "/#experience",
    "Experience"
  );

  // ── skills ──
  add(
    ["What are her skills?", "What technologies does she know?", "What is her tech stack?"],
    skillAreas.map((a) => `${a.name}: ${a.skills.slice(0, 5).map((s) => s.name).join(", ")}`).join(". ") + ".",
    "/#skills",
    "Skills"
  );
  for (const a of skillAreas) {
    add([`What are her ${a.name} skills?`, `Does she have experience in ${a.name}?`], `${a.name}: ${list(a.skills.map((s) => s.name))}.`, "/#skills", "Skills");
    for (const s of a.skills) {
      add(
        [`Does she know ${s.name}?`, `Has she used ${s.name}?`],
        s.usedIn ? `Yes — ${s.name}: ${s.usedIn}.` : `Yes, ${s.name} is one of her skills (${a.name}).`,
        "/#skills",
        "Skills"
      );
    }
  }

  // ── education & awards ──
  for (const d of education) {
    const short = d.degree.split(" ")[0].replace(/\.$/, "");
    add(
      [`Tell me about her ${d.degree}`, `What did she study for her ${short}?`, `What was her grade in the ${short}?`, `What was her ${short} thesis?`],
      `${d.degree} at ${d.institution}, ${d.location} (${d.period}). ${d.grade ?? ""}. Thesis: ${d.thesisTitle}${d.partner ? ` with ${d.partner}` : ""}.`,
      "/#education",
      "Education"
    );
  }
  add(
    ["What is her education?", "What did she study?", "Which university did she attend?", "What are her grades?"],
    education.map((d) => `${d.degree}, ${d.institution} (${d.period}) — ${d.grade}`).join("; ") + ".",
    "/#education",
    "Education"
  );
  add(
    ["What is her master's thesis about?", "What is her thesis?"],
    `Her master's thesis is "${education[0].thesisTitle}" with ${education[0].partner}. ${current.caseStudy.architecture}`,
    "/projects/aircraft-kg",
    "Aircraft Maintenance Intelligence"
  );
  for (const w of awards) {
    add(
      ["Has she won any awards?", "Which award did she receive?", "Does she have a scholarship?"],
      `${w.title} from ${w.issuer} (${w.year})${w.note ? ` — ${w.note.toLowerCase()}` : ""}.`,
      "/#education",
      "Education & Honors"
    );
  }

  // ── out of scope: personal or unrelated questions land here instead of on a wrong fact ──
  add(
    [
      "How old is she?",
      "Is she married?",
      "Does she have a boyfriend?",
      "What is her favourite food?",
      "What are her hobbies?",
      "What is her religion?",
      "What is her salary expectation?",
      "Where does she live exactly?",
      "What's her phone number?",
      "What is the weather today?",
      "Tell me a joke",
      "Write me a poem",
      "Who will win the election?",
      "What is the capital of France?",
      "Can you help me with my homework?",
    ],
    `I can only answer questions about Sonakshi's professional profile — her experience, projects, skills and education. For anything else, you can email her at ${profile.email}.`,
    "/#contact",
    "Contact"
  );

  return facts;
}

export const facts = buildFacts();
export { normalizeQuestion } from "./normalizeQuestion";

