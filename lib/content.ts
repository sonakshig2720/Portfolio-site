// All site copy lives here so it can be edited without touching components.

export const profile = {
  name: "Sonakshi Godavarthy",
  firstName: "Sonakshi",
  role: "AI & Machine Learning Engineer",
  location: "Hamburg, Germany",
  locationNote: "Open to relocate",
  tagline: "I build AI systems that make sense of complex, real-world data.",
  intro:
    "I work across the AI and data stack — from machine learning and data engineering to generative AI and knowledge systems — building practical, reliable systems that turn complex, real-world data into useful outcomes.",
  focus: ["Generative AI", "Knowledge Graphs", "RAG", "Multimodal AI", "ML Systems"],
  cv: "/Sonakshi_Godavarthy_CV.pdf",
  email: "godavarthysonakshi@gmail.com",
  linkedin: "https://www.linkedin.com/in/sonakshi-godavarthy-0685181b6/",
  github: "https://github.com/sonakshig2720",
};

export const about = [
  "I am interested in building intelligent systems that can understand complex information, learn meaningful representations, and solve real-world problems. My work spans artificial intelligence, machine learning, knowledge graphs, multimodal learning, natural language processing and streaming applications.",
  "I am particularly drawn to problems involving complex and heterogeneous data — from text, images, tables and diagrams to sensor and domain-specific information — and exploring how AI can connect and reason across these different sources. Most recently, I have been working on intelligent systems for aircraft maintenance documentation at the German Aerospace Center (DLR).",
  "My background combines applied research with hands-on engineering, and I enjoy taking ideas from experimentation to working systems. I am especially interested in developing AI that is reliable, interpretable, and useful in real-world applications.",
];

export const researchInterests = [
  "Generative AI",
  "Multimodal Learning",
  "Knowledge Graphs",
  "RAG",
  "Representation Learning",
  "Human Activity Recognition",
  "Federated Learning",
  "Streaming Systems",
];

export type ArtVariant = "graph" | "tree" | "stream" | "decision" | "pipeline";

export type Project = {
  id: string;
  title: string;
  short: string;
  context: string;
  kind: "Research" | "Hackathon";
  problem: string;
  summary?: string;
  contribution: string;
  tags: string[];
  stats?: { value: string; label: string }[];
  links: { label: string; href: string }[];
  art: ArtVariant;
};

export const projects: Project[] = [
  {
    id: "aircraft-kg",
    title: "Aircraft Maintenance Intelligence",
    short: "KG-RAG",
    context: "Master's Thesis Research · DLR",
    kind: "Research",
    problem:
      "Maintenance knowledge is scattered across text, tables, equations, flowcharts and diagrams — hard to search, harder to trust.",
    summary:
      "Transforming Airbus A320 maintenance documentation into a machine-readable knowledge graph, grounded in tables, equations and flowcharts. Uses KG-RAG to answer technician-facing maintenance queries.",
    contribution:
      "Designing the ontology and building the KG-RAG pipeline end-to-end, from extraction to grounded retrieval for multimodal information.",
    tags: ["Knowledge Graphs", "Ontologies · RDF/OWL", "Neo4j", "RAG / KG-RAG", "LLMs"],
    links: [
    ],
    art: "graph",
  },
  {
    id: "federated",
    title: "Concept Drift in Hierarchical Federated Learning",
    short: "Fed. Learning",
    context: "Research Project",
    kind: "Research",
    problem:
      "Federated systems must keep learning as client data shifts over time and clients drop in and out — most aggregation strategies aren't tested against that.",
    summary:
      "A PyTorch/CNN framework simulating concept drift and client dropout in hierarchical federated learning, comparing FedAvg, FedProx, FedNova and a hybrid aggregation strategy.",
    contribution:
      "Designed the experimental framework and drift/dropout simulation, and implemented and compared all four aggregation strategies for hierarchical networks.",
    tags: ["Federated Learning", "PyTorch", "Non-IID Data"],
    stats: [
      { value: "40%", label: "Client dropout evaluated" },
      { value: "4", label: "Aggregation strategies compared" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/sonakshig2720/Hierarchical_Federated_Learning" },
    ],
    art: "tree",
  },
  {
    id: "traffic",
    title: "Real-Time Traffic Monitoring",
    short: "Streaming",
    context: "Streaming Data Systems · Team Project",
    kind: "Research",
    problem:
      "Fleet operators need to see vehicle speed, distance and performance as it happens — not in a nightly batch report.",
    summary:
      "A real-time streaming pipeline using Kafka and Flink to compute live fleet metrics, visualised through a Streamlit dashboard.",
    contribution:
      "Built as part of a 4-person team — owned the Kafka setup, Flink processing logic and Streamlit interface.",
    tags: ["Kafka", "Flink", "Streamlit", "Real-Time Data Engineering"],
    links: [
      { label: "GitHub", href: "https://github.com/sonakshig2720/Real-time-Traffic-Monitoring" },
    ],
    art: "stream",
  },
  {
    id: "decideher",
    title: "DecideHer — AI Decision Executive",
    short: "DecideHer",
    context: "AI.WOMEN Hackathon · Hamburg · 2026",
    kind: "Hackathon",
    problem:
      "Companies collect AI ideas one request at a time, with no shared context — so related requests from different teams look like separate projects instead of one shared problem.",
    contribution:
      "Built the core decision pipeline and its Gemini LLM integration — turning free-text idea submissions into structured root-cause and capability data, and generating the AI clarification questions.",
    tags: ["Python", "Streamlit", "Gemini API", "Anymize API"],
    links: [
      { label: "Live app", href: "https://decideher-ai-women.streamlit.app/" },
      { label: "GitHub", href: "https://github.com/sonakshig2720/DecideHer" },
    ],
    art: "decision",
  },
  {
    id: "raw2ready",
    title: "Raw2Ready",
    short: "Raw2Ready",
    context: "Cursor AI Hackathon · Hamburg · 2026",
    kind: "Hackathon",
    problem:
      "Turning a raw business idea into something investor-ready — a business model, competitor analysis and pitch deck — usually means hours of manual, scattered work.",
    contribution:
      "Built the FastAPI backend and its LLM integration (OpenAI GPT-5.2 and Gemini 2.5 Flash), and implemented the AI video generation stage using the MiniMax video API.",
    tags: ["FastAPI", "OpenAI API", "Gemini API", "MiniMax API"],
    links: [
      { label: "GitHub", href: "https://github.com/rishitank1805/cursor-ai-hackathon-raw2ready" },
    ],
    art: "pipeline",
  },
];

export const experience = [
  {
    role: "Master's Thesis Research",
    org: "German Aerospace Center (DLR)",
    dates: "Apr 2026 – Present",
    current: true,
    text: "Research on multimodal knowledge extraction, ontology-based knowledge representation and KG-grounded retrieval for aircraft maintenance documentation.",
    tags: ["Knowledge Graphs", "RAG", "Ontologies", "LLMs"],
  },
  {
    role: "Intern — eLearning & Artificial Intelligence",
    org: "Lufthansa Technical Training GmbH",
    dates: "Nov 2025 – Mar 2026",
    text: "Prototyped a RAG-based document-intelligence pipeline for summarisation, question generation and technician-facing information retrieval.",
    tags: ["RAG", "LLMs", "Transformers", "Evaluation"],
  },
  {
    role: "Research Assistant — GenAI Incubator",
    org: "Fraunhofer Institute for Mechatronic Systems Design",
    dates: "Jan 2025 – Aug 2025",
    text: "Built an LLM-based synthetic data generation pipeline with automated validation — 15,000+ records generated at a 98% validation pass rate.",
    tags: ["LLMs", "PyTorch", "Synthetic Data", "React"],
  },
  {
    role: "Student Assistant",
    org: "Institute of Data Science Foundations, TUHH",
    dates: "Feb 2025 – Jul 2025",
    text: "Analysed particle-beam simulation data against real EuXFEL measurements using error analysis and dimensionality reduction to trace data-quality issues.",
    tags: ["Python", "Data Analysis", "t-SNE"],
  },
  {
    role: "Associate Software Engineer / Intern — Global Customer Support",
    org: "Informatica",
    dates: "Aug 2021 – Sep 2023",
    text: "Resolved complex cloud-integration issues faced by customers and optimised ETL workflows across enterprise database connectors.",
    tags: ["ETL", "Cloud Integration", "SQL"],
  },
];

export type Degree = {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  grade?: string;
  thesisTitle: string;
  partner?: string; // external institution the thesis is done with
  techStack: string[];
  links?: { label: string; url: string; external?: boolean }[];
};

export const education: Degree[] = [
  {
    id: "msc",
    degree: "M.Sc. Data Science",
    institution: "Hamburg University of Technology (TUHH)",
    period: "Oct 2023 – Dec 2026",
    location: "Hamburg, Germany",
    grade: "Current grade 1.9 (German scale, 1.0 = highest)",
    thesisTitle: "Knowledge Graph-RAG for aircraft maintenance",
    partner: "German Aerospace Center (DLR)",
    techStack: [],
  },
  {
    id: "btech",
    degree: "B.Tech. Computer Science & Engineering",
    institution: "CMR College of Engineering & Technology",
    period: "Jun 2018 – May 2022",
    location: "Hyderabad, India",
    grade: "GPA 8.87 / 10",
    thesisTitle: "COVID-19 Detection & Severity from Chest X-Rays",
    techStack: [],
  },
];

export type Award = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  note?: string;
  category: string;
  url?: string;
};

export const awards: Award[] = [
  {
    id: "merit",
    title: "Merit Scholarship for International Students",
    issuer: "Hamburg University of Technology (TUHH)",
    year: "Aug 2025",
    note: "Awarded for academic excellence",
    category: "Scholarship",
  },
];
