// Skill areas shown in the Skills section. `usedIn` appears on hover; leave it
// out until there is a real example.

export type Skill = { name: string; usedIn?: string };

export type SkillArea = { id: string; icon: string; name: string; skills: Skill[] };

export const skillAreas: SkillArea[] = [
  {
    id: "genai",
    icon: "✨",
    name: "Generative AI & RAG",
    skills: [
      { name: "LLMs", usedIn: "DLR thesis, Lufthansa, Fraunhofer GenAI Incubator, DecideHer, Raw2Ready" },
      { name: "RAG", usedIn: "KG-RAG for aircraft maintenance (DLR); document-intelligence pipeline at Lufthansa" },
      { name: "Transformers", usedIn: "Lufthansa Technical Training; YouTube Transcript Summarisation (DistilBART)" },
      { name: "Embeddings", usedIn: "Retrieval layers of the RAG pipelines at DLR and Lufthansa" },
      { name: "Semantic Search", usedIn: "Technician-facing information retrieval at Lufthansa and DLR" },
      { name: "Prompting", usedIn: "Structured-JSON prompts in Raw2Ready; clarification questions in DecideHer" },
      { name: "Diffusion Models", usedIn: "Custom PyTorch diffusion models for synthetic data at Fraunhofer" },
    ],
  },
  {
    id: "ml",
    icon: "🧠",
    name: "Machine Learning & Deep Learning",
    skills: [
      { name: "PyTorch", usedIn: "Hierarchical Federated Learning, Fraunhofer GenAI Incubator, HCAI project" },
      { name: "TensorFlow" },
      { name: "Scikit-learn" },
      { name: "Computer Vision", usedIn: "COVID-19 Detection from Chest X-Rays (B.Tech thesis)" },
      { name: "NLP", usedIn: "YouTube Transcript Summarisation; document intelligence at Lufthansa" },
      { name: "Federated Learning", usedIn: "Concept Drift in Hierarchical Federated Learning" },
      { name: "Active Learning", usedIn: "Active-learning strategies for the IMDB sentiment classifier (HCAI project)" },
      { name: "OpenCV" },
      { name: "Hugging Face" },
    ],
  },
  {
    id: "knowledge",
    icon: "🕸️",
    name: "Knowledge Graphs & Multimodal AI",
    skills: [
      { name: "Knowledge Graphs", usedIn: "Aircraft Maintenance Intelligence — Master's thesis at DLR" },
      { name: "Ontologies", usedIn: "Designing the maintenance ontology for the DLR thesis" },
      { name: "RDF", usedIn: "Ontology-based knowledge representation at DLR" },
      { name: "OWL", usedIn: "Ontology-based knowledge representation at DLR" },
      { name: "Multimodal AI", usedIn: "Extracting text, tables, equations and flowcharts at DLR" },
      { name: "Vision-Language Models" },
    ],
  },
  {
    id: "data",
    icon: "⚙️",
    name: "Data Engineering & Cloud",
    skills: [
      { name: "Python", usedIn: "Nearly everything — DecideHer, Raw2Ready, TUHH data analysis, Traffic Monitoring" },
      { name: "Pandas" },
      { name: "NumPy" },
      { name: "SQL", usedIn: "ETL workflows at Informatica; SQLite in DecideHer" },
      { name: "Kafka", usedIn: "Real-Time Traffic Monitoring — ingestion layer" },
      { name: "Flink", usedIn: "Real-Time Traffic Monitoring — stream processing" },
      { name: "Docker", usedIn: "Data-provider image for Real-Time Traffic Monitoring" },
      { name: "AWS" },
      { name: "Azure" },
    ],
  },
  {
    id: "db",
    icon: "📊",
    name: "Databases & BI",
    skills: [
      { name: "PostgreSQL", usedIn: "Database connectors for data integration at Informatica" },
      { name: "MySQL", usedIn: "Database connectors for data integration at Informatica" },
      { name: "Snowflake", usedIn: "Database connectors for data integration at Informatica" },
      { name: "Informatica Cloud", usedIn: "IICS training, cloud integration and connector cases at Informatica" },
      { name: "ETL", usedIn: "Optimised ETL workflows at Informatica" },
      { name: "Power BI" },
      { name: "Tableau" },
      { name: "Matplotlib" },
    ],
  },
  {
    id: "apps",
    icon: "🛠️",
    name: "AI Application Engineering",
    skills: [
      { name: "FastAPI", usedIn: "Raw2Ready — backend routing ideas to OpenAI / Gemini" },
      { name: "Django", usedIn: "AutoML web app in the Applied ML & Human-Centered AI project" },
      { name: "React", usedIn: "Synthetic-data app at Fraunhofer; Raw2Ready and DecideHer front ends" },
      { name: "Streamlit", usedIn: "Real-Time Traffic Monitoring dashboard; DecideHer" },
      { name: "REST APIs", usedIn: "Raw2Ready endpoints and the Gemini REST fallback" },
      { name: "Vector Databases" },
      { name: "Chroma / FAISS" },
      { name: "Git", usedIn: "All projects — github.com/sonakshig2720" },
      { name: "Linux" },
      { name: "Deployment & Integration", usedIn: "Traffic Monitoring on Cloud Run; DecideHer live Streamlit app" },
    ],
  },
];
