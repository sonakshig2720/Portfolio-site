// Copy for the hero "research whiteboard". Everything here comes from the
// About text and the CV; the loss curve is a decorative doodle, not a real run.

export const whiteboard = {
  greeting: "Hi, I'm Sonakshi Godavarthy",
  tagline: "I build AI systems that make sense of complex, real-world data.",
  polaroid: { caption: "Sonakshi Godavarthy", role: "AI/ML & Research Engineer" },

  obsession: {
    title: "Obsession",
    // the word in `emphasis` gets the hand-drawn wavy underline
    before: "Building AI that is ",
    emphasis: "reliable",
    after: ", interpretable and useful in the real world.",
    code: "answer = ground(KG, retrieve(query)) → LLM",
  },

  facts: {
    title: "Quick facts",
    items: [
      "AI & Machine Learning Engineer",
      "Research Engineer",
      "Hamburg, Germany · open to relocate",
      "Master's thesis at DLR",
      "M.Sc. Data Science, TUHH",
    ],
  },

  toolbox: {
    title: "Toolbox",
    stack: ["PyTorch", "Neo4j", "LLMs & RAG", "Kafka", "KG"],
    caption: "doodle: L → 0",
    // illustrative training curve points (epoch, loss)
    curve: [
      [0, 0.92],
      [20, 0.61],
      [40, 0.33],
      [60, 0.17],
      [80, 0.09],
      [100, 0.04],
    ] as [number, number][],
  },

  human: {
    title: "Off the clock",
    lines: ["Speaks English, Hindi and Telugu.", "Currently learning German (A2)."],
    footer: "Based in Hamburg",
    tag: "#AlwaysLearning",
  },

  jumps: [
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#hackathons", label: "Hackathons" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ],
};
