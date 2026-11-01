// Career history mapped onto the "Career Pipeline" experience section.
// Every figure here comes from the CV; nodes run newest → oldest (top to bottom).

export type AbstractShape = "icosahedron" | "vortex" | "tesseract" | "lattice" | "layers";

export interface ExperienceNode {
  id: string;
  index: string; // Sequential tabular number ('01', '02', '03')
  stageName: string; // Pipeline phase
  role: string;
  company: string;
  period: string;
  location: string;
  verbs: [string, string, string];
  abstractShape: AbstractShape;
  sideTagLeft?: string; // "TITLE\nsub-line" — monospace label flanking the left edge
  sideTagRight?: string; // "TITLE\nsub-line" — monospace label flanking the right edge
  techStack: string[];
  impactMetric: string;
  caseStudy: {
    problem: string;
    architecture: string;
    solution: string;
    metrics: string[];
    recommendation?: {
      quote: string;
      author: string;
      title: string;
    };
  };
}

export const experienceNodes: ExperienceNode[] = [
  {
    id: "dlr",
    index: "01",
    stageName: "Grounding",
    role: "Master’s Thesis Research",
    company: "German Aerospace Center (DLR)",
    period: "Apr 2026 — Present",
    location: "Hamburg, Germany",
    verbs: ["Extract", "Structure", "Ground"],
    abstractShape: "icosahedron",
    sideTagLeft: "A320 maintenance docs\ntables · equations · flowcharts",
    sideTagRight: "KG-grounded retrieval\nNeo4j · RDF/OWL",
    techStack: ["Knowledge Graphs", "Neo4j", "RDF / OWL", "KG-RAG", "LLMs"],
    impactMetric: "Ongoing thesis",
    caseStudy: {
      problem:
        "Aircraft maintenance knowledge is scattered across text, tables, equations, flowcharts and technical diagrams — hard to search, and in a safety-critical domain, answers must be grounded in the source documentation.",
      architecture:
        "A multimodal knowledge-extraction pipeline over Airbus A320 maintenance documentation (SGML) that maps components, procedures and relationships onto an ontology and a Neo4j knowledge graph, with a KG-grounded retrieval layer on top.",
      solution:
        "Developing the extraction pipeline and ontology, building knowledge-grounded retrieval and reasoning for accurate access to components, procedures and maintenance relationships, and investigating scalable storage and retrieval architectures.",
      metrics: ["Formal evaluation in progress — results will be added as the research matures"],
    },
  },
  {
    id: "lufthansa",
    index: "02",
    stageName: "Retrieval",
    role: "Intern — eLearning & AI",
    company: "Lufthansa Technical Training GmbH",
    period: "Nov 2025 — Mar 2026",
    location: "Hamburg, Germany",
    verbs: ["Summarise", "Retrieve", "Evaluate"],
    abstractShape: "tesseract",
    sideTagLeft: "Document intelligence\nRAG prototypes",
    sideTagRight: "Evaluation\nROUGE · Precision@K",
    techStack: ["RAG", "DistilBART-CNN", "all-MiniLM-L6-v2", "GPT-4"],
    impactMetric: "RAG pipeline · ROUGE + P@K",
    caseStudy: {
      problem:
        "Training documents needed to be summarised, turned into questions and searchable, so technicians and learners could find the right information quickly.",
      architecture:
        "A RAG-based document-processing pipeline: DistilBART-CNN for summarisation, all-MiniLM-L6-v2 for semantic retrieval, and GPT-4 for question generation and learner support.",
      solution:
        "Researched and built functional prototypes supporting content summarisation, question generation, information retrieval and learner assistance, and defined how to evaluate them.",
      metrics: [
        "ROUGE to measure summary accuracy",
        "Precision@K to measure retrieval relevance",
      ],
    },
  },
  {
    id: "tuhh",
    index: "03",
    stageName: "Analysis",
    role: "Student Assistant",
    company: "Institute of Data Science Foundations, Hamburg University of Technology (TUHH)",
    period: "Feb — Jul 2025",
    location: "Hamburg, Germany",
    verbs: ["Compare", "Visualise", "Diagnose"],
    abstractShape: "lattice",
    sideTagLeft: "EuXFEL beam data\n189 × 189 runs",
    sideTagRight: "Error analysis\nt-SNE · heatmaps",
    techStack: ["Python", "t-SNE", "Heatmaps", "Error analysis"],
    impactMetric: "88.9% within threshold",
    caseStudy: {
      problem:
        "Particle-beam simulations from physics-based simulation software did not always match the actual experimental measurements from the EuXFEL laboratory.",
      architecture:
        "A Python workflow comparing 189 real measurements with 189 API-generated simulation results, using error analysis, heatmaps and t-SNE to surface where and why they diverge.",
      solution:
        "Measured how often simulated and measured beam-quality values agreed, then investigated the 21 high-error cases and found most of them clustered on a single measurement date — pointing to experiment-specific or data-quality issues rather than the simulation itself.",
      metrics: [
        "189 measurements compared against 189 simulations",
        "88.9% of cases met the defined error threshold",
        "86% of the 21 high-error cases traced to the same measurement date",
      ],
    },
  },
  {
    id: "fraunhofer",
    index: "04",
    stageName: "Synthesis",
    role: "Research Assistant — GenAI Incubator",
    company: "Fraunhofer Institute for Mechatronic Systems Design (IEM)",
    period: "Jan — Aug 2025",
    location: "Paderborn, Germany",
    verbs: ["Compare", "Generate", "Validate"],
    abstractShape: "vortex",
    sideTagLeft: "Synthetic tabular data\n15,000+ records",
    sideTagRight: "Automated validation\n98% pass rate",
    techStack: ["GPT-4 Turbo", "SDV", "PyTorch", "Diffusion models", "React"],
    impactMetric: "98% of records valid",
    caseStudy: {
      problem:
        "Realistic synthetic tabular data was needed, and it wasn't clear which generation approach produced data that was both useful and structurally valid.",
      architecture:
        "An automated pipeline that analyses dataset columns, generates structured synthetic data with a chosen method — GPT-4 Turbo, Synthetic Data Vault (SDV), custom PyTorch diffusion models, denoising MLPs or rule-based techniques — and writes component descriptions, with a React front end designed in Figma.",
      solution:
        "Developed and compared the five generation approaches, integrated them into one pipeline, and validated output quality with schema checks, statistical distribution comparisons and outlier detection. Users can upload a dataset, pick a model and generate more data interactively.",
      metrics: [
        "15,000+ synthetic records generated across experiments",
        "98% of generated records passed the validation checks",
        "5 generation approaches compared",
      ],
    },
  },
  {
    id: "informatica",
    index: "05",
    stageName: "Genesis",
    role: "Associate Software Engineer",
    company: "Informatica",
    period: "Aug 2021 — Sep 2023",
    location: "Bangalore, India",
    verbs: ["Integrate", "Resolve", "Optimise"],
    abstractShape: "layers",
    sideTagLeft: "ETL workflows\nIICS · Snowflake · Oracle",
    sideTagRight: "Global customer support\n95% satisfaction",
    techStack: ["Informatica Cloud", "ETL", "SQL", "Snowflake", "PostgreSQL"],
    impactMetric: "95% customer satisfaction",
    caseStudy: {
      problem:
        "Enterprise customers were blocked by complex Informatica Cloud integration and connector issues across flat-file, Oracle, MySQL, PostgreSQL and Snowflake sources.",
      architecture:
        "ETL workflows in Informatica Intelligent Cloud Services (IICS), moving and transforming data through a range of enterprise database connectors.",
      solution:
        "Started as an intern (Aug 2021 – Jun 2022) working with senior engineers to prioritise and resolve customer issues, then as Associate Software Engineer (Jul 2022 – Sep 2023) resolved integration and connector cases, optimised ETL workflows for efficiency and reliability, and wrote reusable knowledge articles so recurring cases didn't need fresh investigation.",
      metrics: [
        "95% customer satisfaction rate",
        "Technical workarounds for ~90% of assigned support cases",
        "Issue response times improved by 20% as an intern",
      ],
    },
  },
];
