// One circuit diagram per skill category. Coordinates are in a 640 × 440
// viewBox. `label` says which side of the node the skill name sits on.
// `usedIn` is shown on hover; leave it undefined until there's a real example.

export type Side = "top" | "bottom" | "left" | "right";
export type Route = "h" | "v" | "d"; // elbow horizontal-first, vertical-first, or 45° then straight

export type MapNode = {
  id: string;
  name: string;
  x: number;
  y: number;
  label: Side;
  usedIn?: string;
};

export type SkillMap = {
  id: string;
  name: string;
  color: string;
  nodes: MapNode[];
  edges: [string, string, Route][];
  // decorative dead-end traces: [fromNodeId, dx, dy]
  stubs?: [string, number, number][];
};

export const skillMaps: SkillMap[] = [
  {
    id: "genai",
    name: "Generative AI & RAG",
    color: "var(--g-genai)",
    nodes: [
      { id: "llm", name: "LLMs", x: 110, y: 90, label: "top", usedIn: "DLR thesis, Lufthansa, Fraunhofer GenAI Incubator, DecideHer, Raw2Ready" },
      { id: "rag", name: "RAG", x: 260, y: 60, label: "top", usedIn: "KG-RAG for aircraft maintenance (DLR); document-intelligence pipeline at Lufthansa" },
      { id: "trf", name: "Transformers", x: 400, y: 100, label: "right", usedIn: "Lufthansa Technical Training; YouTube Transcript Summarisation (DistilBART)" },
      { id: "emb", name: "Embeddings", x: 170, y: 230, label: "left", usedIn: "Retrieval layers of the RAG pipelines at DLR and Lufthansa" },
      { id: "sem", name: "Semantic Search", x: 330, y: 230, label: "right", usedIn: "Technician-facing information retrieval at Lufthansa and DLR" },
      { id: "prm", name: "Prompting", x: 530, y: 260, label: "bottom", usedIn: "Structured-JSON prompts in Raw2Ready; clarification questions in DecideHer" },
      { id: "dif", name: "Diffusion Models", x: 420, y: 370, label: "left", usedIn: "Custom PyTorch diffusion models for synthetic data at Fraunhofer" },
    ],
    edges: [
      ["llm", "rag", "d"],
      ["rag", "trf", "d"],
      ["llm", "emb", "v"],
      ["emb", "sem", "d"],
      ["rag", "sem", "v"],
      ["trf", "prm", "d"],
      ["sem", "dif", "d"],
      ["prm", "dif", "h"],
    ],
    stubs: [["trf", 70, -60], ["llm", -70, 60], ["dif", 90, 40]],
  },
  {
    id: "knowledge",
    name: "Knowledge & Multimodal",
    color: "var(--g-knowledge)",
    nodes: [
      { id: "kg", name: "Knowledge Graphs", x: 320, y: 200, label: "bottom", usedIn: "Aircraft Maintenance Intelligence — Master's thesis at DLR" },
      { id: "ont", name: "Ontologies", x: 180, y: 80, label: "top", usedIn: "Designing the maintenance ontology for the DLR thesis" },
      { id: "neo", name: "Neo4j", x: 460, y: 80, label: "top", usedIn: "Knowledge graph store for the DLR thesis" },
      { id: "rdf", name: "RDF", x: 80, y: 200, label: "bottom", usedIn: "Ontology-based knowledge representation at DLR" },
      { id: "owl", name: "OWL", x: 180, y: 320, label: "bottom", usedIn: "Ontology-based knowledge representation at DLR" },
      { id: "mm", name: "Multimodal AI", x: 480, y: 300, label: "right", usedIn: "Extracting text, tables, equations and flowcharts at DLR" },
      { id: "vlm", name: "Vision-Language Models", x: 360, y: 380, label: "bottom" },
    ],
    edges: [
      ["ont", "neo", "h"],
      ["kg", "ont", "d"],
      ["kg", "neo", "d"],
      ["kg", "rdf", "h"],
      ["ont", "rdf", "d"],
      ["rdf", "owl", "d"],
      ["kg", "mm", "h"],
      ["mm", "vlm", "d"],
    ],
    stubs: [["neo", 90, 0], ["owl", -80, 50], ["mm", 60, -70]],
  },
  {
    id: "ml",
    name: "Machine Learning & Deep Learning",
    color: "var(--g-ml)",
    nodes: [
      { id: "pt", name: "PyTorch", x: 320, y: 46, label: "right", usedIn: "Hierarchical Federated Learning, Fraunhofer GenAI Incubator, HCAI project" },
      { id: "tf", name: "TensorFlow", x: 160, y: 140, label: "left" },
      { id: "skl", name: "Scikit-learn", x: 480, y: 140, label: "right" },
      { id: "cv", name: "Computer Vision", x: 90, y: 250, label: "bottom", usedIn: "COVID-19 Detection from Chest X-Rays (B.Tech thesis)" },
      { id: "nlp", name: "NLP", x: 240, y: 250, label: "bottom", usedIn: "YouTube Transcript Summarisation; document intelligence at Lufthansa" },
      { id: "fl", name: "Federated Learning", x: 400, y: 250, label: "bottom", usedIn: "Concept Drift in Hierarchical Federated Learning" },
      { id: "al", name: "Active Learning", x: 560, y: 250, label: "bottom", usedIn: "Active-learning strategies for the IMDB sentiment classifier (HCAI project)" },
      { id: "ocv", name: "OpenCV", x: 90, y: 370, label: "bottom" },
      { id: "hf", name: "Hugging Face", x: 240, y: 370, label: "bottom" },
    ],
    edges: [
      ["pt", "tf", "v"],
      ["pt", "skl", "v"],
      ["tf", "cv", "v"],
      ["tf", "nlp", "v"],
      ["skl", "fl", "v"],
      ["skl", "al", "v"],
      ["nlp", "fl", "h"],
      ["cv", "ocv", "v"],
      ["nlp", "hf", "v"],
    ],
    stubs: [["pt", 0, -40], ["al", 50, -70], ["hf", 90, 40]],
  },
  {
    id: "data",
    name: "Data Engineering & Cloud",
    color: "var(--g-data)",
    nodes: [
      { id: "py", name: "Python", x: 70, y: 210, label: "bottom", usedIn: "Nearly everything — DecideHer, Raw2Ready, TUHH data analysis, Traffic Monitoring" },
      { id: "pd", name: "Pandas", x: 190, y: 110, label: "top" },
      { id: "np", name: "NumPy", x: 320, y: 60, label: "top" },
      { id: "sql", name: "SQL", x: 190, y: 310, label: "bottom", usedIn: "ETL workflows at Informatica; SQLite in DecideHer" },
      { id: "kfk", name: "Kafka", x: 320, y: 210, label: "bottom", usedIn: "Real-Time Traffic Monitoring — ingestion layer" },
      { id: "flk", name: "Flink", x: 450, y: 110, label: "top", usedIn: "Real-Time Traffic Monitoring — stream processing" },
      { id: "dck", name: "Docker", x: 450, y: 310, label: "bottom", usedIn: "Data-provider image for Real-Time Traffic Monitoring" },
      { id: "aws", name: "AWS", x: 580, y: 150, label: "top" },
      { id: "az", name: "Azure", x: 580, y: 270, label: "bottom" },
    ],
    edges: [
      ["py", "pd", "d"],
      ["pd", "np", "d"],
      ["py", "sql", "d"],
      ["pd", "kfk", "d"],
      ["sql", "kfk", "d"],
      ["kfk", "flk", "d"],
      ["kfk", "dck", "d"],
      ["flk", "aws", "h"],
      ["dck", "az", "h"],
      ["aws", "az", "v"],
    ],
    stubs: [["py", -50, -70], ["sql", -60, 70], ["np", 80, 0]],
  },
  {
    id: "db",
    name: "Databases & BI",
    color: "var(--g-data)",
    nodes: [
      { id: "pg", name: "PostgreSQL", x: 90, y: 80, label: "top", usedIn: "Database connectors for data integration at Informatica" },
      { id: "my", name: "MySQL", x: 90, y: 220, label: "bottom", usedIn: "Database connectors for data integration at Informatica" },
      { id: "sf", name: "Snowflake", x: 90, y: 360, label: "bottom", usedIn: "Database connectors for data integration at Informatica" },
      { id: "ic", name: "Informatica Cloud", x: 280, y: 80, label: "top", usedIn: "IICS training, cloud integration and connector cases at Informatica" },
      { id: "etl", name: "ETL", x: 280, y: 220, label: "bottom", usedIn: "Optimised ETL workflows at Informatica" },
      { id: "pbi", name: "Power BI", x: 500, y: 80, label: "top" },
      { id: "tab", name: "Tableau", x: 500, y: 220, label: "right" },
      { id: "mpl", name: "Matplotlib", x: 500, y: 360, label: "bottom" },
    ],
    edges: [
      ["pg", "etl", "d"],
      ["my", "etl", "h"],
      ["sf", "etl", "d"],
      ["ic", "etl", "v"],
      ["etl", "pbi", "d"],
      ["etl", "tab", "h"],
      ["etl", "mpl", "d"],
    ],
    stubs: [["pg", -50, 40], ["mpl", 90, -30], ["ic", 70, -40]],
  },
  {
    id: "apps",
    name: "AI Application Engineering",
    color: "var(--g-apps)",
    nodes: [
      { id: "fapi", name: "FastAPI", x: 110, y: 64, label: "top", usedIn: "Raw2Ready — backend routing ideas to OpenAI / Gemini" },
      { id: "dj", name: "Django", x: 260, y: 64, label: "top", usedIn: "AutoML web app in the Applied ML & Human-Centered AI project" },
      { id: "react", name: "React", x: 410, y: 64, label: "top", usedIn: "Synthetic-data app at Fraunhofer; Raw2Ready and DecideHer front ends" },
      { id: "stl", name: "Streamlit", x: 560, y: 64, label: "top", usedIn: "Real-Time Traffic Monitoring dashboard; DecideHer" },
      { id: "rest", name: "REST APIs", x: 190, y: 210, label: "left", usedIn: "Raw2Ready endpoints and the Gemini REST fallback" },
      { id: "vdb", name: "Vector Databases", x: 450, y: 210, label: "right" },
      { id: "chr", name: "Chroma / FAISS", x: 110, y: 350, label: "bottom" },
      { id: "git", name: "Git", x: 270, y: 350, label: "bottom", usedIn: "All projects — github.com/sonakshig2720" },
      { id: "lnx", name: "Linux", x: 400, y: 350, label: "bottom" },
      { id: "dep", name: "Deployment & Integration", x: 540, y: 350, label: "bottom", usedIn: "Traffic Monitoring on Cloud Run; DecideHer live Streamlit app" },
    ],
    edges: [
      ["fapi", "dj", "h"],
      ["dj", "react", "h"],
      ["react", "stl", "h"],
      ["fapi", "rest", "d"],
      ["react", "vdb", "v"],
      ["rest", "vdb", "h"],
      ["rest", "chr", "d"],
      ["rest", "git", "d"],
      ["vdb", "lnx", "d"],
      ["vdb", "dep", "d"],
    ],
    stubs: [["stl", 60, 50], ["chr", -60, 50]],
  },
];
