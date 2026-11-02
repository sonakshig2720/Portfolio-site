// Long-form content for each project's detail page, keyed by project id.

export type ArchNode = { title: string; desc?: string };
export type ArchStep = ArchNode | { parallel: ArchNode[]; note?: string };

export type ProjectDetail = {
  subtitle: string;
  // Full event line shown in the meta row instead of the short context.
  event?: string;
  tech: string[];
  stats?: { value: string; label: string }[];
  overview: string;
  problem: string;
  approach: string;
  differentiator?: string;
  architecture: ArchStep[];
  architectureNote?: string;
  contributionIntro?: string;
  contribution: string[];
  results: string;
  learnings: string[];
  extraLinks?: { label: string; href: string }[];
  linksNote?: string;
};

export const projectDetails: Record<string, ProjectDetail> = {
  "aircraft-kg": {
    subtitle: "Multimodal Knowledge Graph + RAG for Aircraft Maintenance",
    tech: ["Knowledge Graphs", "Ontologies", "RDF / OWL", "RAG / KG-RAG", "LLMs", "Information Extraction", "SGML"],
    overview:
      "Aircraft maintenance manuals distribute knowledge across text, tables, equations, flowcharts, diagrams and structured technical documentation. This project investigates how that information can be transformed into a machine-readable knowledge graph and used to support grounded retrieval and question answering for maintenance tasks — working from Airbus A320 maintenance documentation in SGML format.",
    problem:
      "Maintenance knowledge is scattered across heterogeneous document formats — text, tables, equations, flowcharts and technical diagrams — making it hard to search and harder to trust. In a safety-critical domain, retrieval needs to be grounded in the source documentation rather than relying on a language model's unverified recall.",
    approach:
      "The project builds an ontology-grounded information extraction pipeline that structures aircraft components, procedures and relationships from SGML source documents. Extracted entities and relations are mapped onto a purpose-built ontology and constructed into a knowledge graph. A Knowledge Graph-grounded Retrieval-Augmented Generation (KG-RAG) layer then uses this graph to answer technician-facing maintenance queries with retrieval grounded in the underlying documentation, integrating text, tables, equations, flowcharts and diagrams from the source material.",
    architecture: [
      { title: "SGML / Documents", desc: "Airbus A320 maintenance documentation" },
      { title: "Information Extraction", desc: "Text, tables, equations, flowcharts" },
      { title: "Ontology Mapping", desc: "Components, procedures, relationships" },
      { title: "Knowledge Graph", desc: "Components, procedures, relationships" },
      { title: "KG-RAG", desc: "Grounded retrieval + generation" },
      { title: "Maintenance Query", desc: "Technician-facing answers" },
    ],
    contribution: [
      "Designing the ontology for aircraft components, procedures and their relationships.",
      "Building the information-extraction and knowledge-graph construction pipeline for multimodal content like tables, equations and flowcharts.",
      "Connecting the graph to a KG-grounded retrieval layer for technician-facing queries.",
      "Investigating scalable storage and retrieval architectures to support maintenance knowledge access and process analysis at scale.",
    ],
    results:
      "This is ongoing Master's thesis research at DLR. Formal evaluation of the knowledge graph and retrieval pipeline is still in progress — results will be added here as the research matures.",
    learnings: [
      "Understanding complex A320 SGML maintenance documents.",
      "Exploring methods for multimodal information extraction.",
      "Learning ontology and Knowledge Graph design.",
    ],
    linksNote: "This is active thesis research — no public repository or demo is available yet.",
  },

  federated: {
    subtitle: "Robustness of aggregation strategies under drift and client dropout",
    tech: ["PyTorch", "CNNs", "Federated Learning", "Non-IID MNIST"],
    stats: [
      { value: "40%", label: "Client dropout evaluated" },
      { value: "4", label: "Aggregation strategies compared" },
      { value: "20", label: "Training rounds" },
    ],
    overview:
      "Investigated how Hierarchical Federated Learning systems maintain accuracy when client data distributions change over time (concept drift) and clients become unavailable — a common but under-tested condition for real-world federated deployments.",
    problem:
      "Federated systems must keep learning as client data shifts over time and clients lose connection in between rounds of training. Most aggregation strategies are evaluated under stable, fully-available conditions — leaving it unclear how they behave once the data and the client population stop being reliable.",
    approach:
      "Built a PyTorch/CNN framework on non-IID MNIST and evaluated FedAvg, FedProx, FedNova and a hybrid aggregation strategy under synchronous, gradual and abrupt concept drift, combined with up to 40% client dropout. The framework simulates realistic drift patterns and client unavailability to compare how each aggregation strategy recovers.",
    architecture: [
      { title: "MNIST Dataset", desc: "60K train + 10K test images" },
      { title: "Data Preparation", desc: "Tensor conversion · Normalization · Client partitioning" },
      { title: "Concept Drift Module", desc: "No drift · Synchronous · Gradual · Abrupt" },
      { title: "Client Layer", desc: "12–24 clients · Local CNN training · Up to 40% dropout" },
      {
        parallel: [
          { title: "3-Level Hierarchy", desc: "12 Clients → 4 Edge → 2 Intermediate → 1 Global" },
          { title: "4-Level Hierarchy", desc: "24 Clients → 8 Edge → 4 Intermediate → 2 → 1 Global" },
        ],
        note: "Aggregation at each server layer: FedAvg · FedProx · FedNova · Hybrid",
      },
      { title: "Global CNN Model", desc: "Updated every round · 20 rounds" },
      { title: "Performance Evaluation", desc: "Accuracy · Drop magnitude · Recovery round · Recovery rate" },
    ],
    contribution: [
      "Designed the experimental framework and the drift/dropout simulation.",
      "Implemented and compared all four aggregation strategies for hierarchical networks.",
      "Analysed recovery behaviour across drift scenarios.",
    ],
    results:
      "FedProx and FedNova adapted more effectively to concept drift than standard FedAvg, while the hybrid aggregation strategy achieved the strongest recovery in client-dropout scenarios.",
    learnings: [
      "Simulating and evaluating synchronous/asynchronous, gradual, and abrupt concept drift across clients.",
      "Understanding how hierarchical aggregation and client topology affect convergence and model performance.",
      "Comparing FedAvg, FedProx, and FedNova under heterogeneous and drifting environments.",
      "Designing a hybrid aggregation strategy to improve robustness against client dropout and concept drift.",
      "Analyzing recovery metrics to quantify the impact of drift and dropout on model accuracy and convergence.",
      "Implementing and evaluating federated learning algorithms in PyTorch, including non-IID data and client dropout.",
    ],
  },

  traffic: {
    subtitle: "Streaming Fleet Intelligence with Kafka & Flink",
    tech: ["Kafka", "Flink", "Streamlit", "Redis", "Java", "Python"],
    overview:
      "Built a scalable streaming data pipeline to process live vehicle sensor data in real time using Kafka and Flink, powering structured fleet-monitoring dashboards.",
    problem:
      "Fleet operators need to see vehicle speed, distance and performance as it happens. Getting that kind of point-in-time visibility usually means standing up dedicated streaming infrastructure rather than adapting existing batch pipelines.",
    approach:
      "Sensor data is ingested through Kafka and processed with Flink using custom stream-processing operators that compute vehicle speed, distance and performance metrics as events arrive. The processed stream feeds a real-time interface built in Streamlit, giving a live view of fleet status and alerts.",
    architecture: [
      { title: "Data Provider", desc: "Docker · Streaming source" },
      { title: "Kafka", desc: "Message queue / ingestion" },
      {
        parallel: [
          { title: "Apache Flink", desc: "Stream processing" },
          { title: "Redis", desc: "State / cache" },
        ],
        note: "Kubernetes Engine",
      },
      { title: "Streamlit", desc: "Live monitoring dashboard" },
    ],
    architectureNote: "Deployed via Cloud Run",
    contributionIntro: "Built as part of a 4-person team project. My contributions:",
    contribution: [
      "Configured the initial Kafka setup locally.",
      "Computed taxi speed and distance using the Haversine formula, aggregated by taxi ID.",
      "Created the Docker image for the data provider.",
      "Handled exceptions in Flink and established its connections with Kafka and Redis.",
      "Contributed to the planning and setup of the Streamlit interface.",
    ],
    results:
      "Delivered a working real-time fleet-monitoring dashboard, surfacing live vehicle speed, distance and performance metrics as sensor data streamed in.",
    learnings: [
      "Handling continuous real-time data with low latency.",
      "Managing missing, delayed, or out-of-order events.",
      "Understanding Flink's stream-processing model and its integration with Kafka and Redis.",
      "Debugging issues in an asynchronous streaming environment.",
      "Deploying and scaling streaming applications in a cloud environment.",
      "Best practices for monitoring and maintaining streaming systems in production.",
    ],
  },

  decideher: {
    subtitle: "An AI decision executive that challenges whether a request is right — not just how to build it.",
    event: "AI.WOMEN Hackathon 2026 · AI.Hamburg · Sep 12–13, 2026",
    tech: ["Python", "Streamlit", "Pydantic", "Gemini API (google-genai)", "SQLite", "React", "Vite", "TailwindCSS", "Anymize API"],
    stats: [
      { value: "5", label: "Person, all-women team" },
      { value: "5", label: "Stage decision pipeline" },
      { value: "15→6", label: "Ideas clustered into initiatives" },
    ],
    overview:
      "Built at the AI.WOMEN Hackathon 2026 (AI.Hamburg) with a 5-person, all-women team, DecideHer is an \"AI Decision Executive\" — a tool that doesn't just score incoming AI and improvement ideas and wave them through. It reads them against company context, clusters related requests, and forces thin evidence through a deterministic gate before anything gets greenlit.",
    problem:
      "Companies collect AI ideas one request at a time, and the decision almost never carries the context behind the request. Sales wants \"an AI customer agent,\" Marketing wants an \"AI customer-data assistant,\" Customer Success wants \"AI history search\" — three AI projects, or one fragmented customer-information problem?",
    approach:
      "DecideHer is one decision loop, not a scoring model: context → ideas → analysis → decision → clarification. It ingests the company's existing IT landscape, takes in idea submissions as structured intake, clusters and analyzes them against that context, surfaces the result as a findings dashboard, and — when the evidence behind an idea is too thin — asks only the smallest question needed to complete, challenge or reconcile it, rather than inventing confidence.",
    differentiator:
      "Most AI idea tools help you build the request. DecideHer challenges whether the request is right. It asks context first (what do we already own?), clusters before judging (what's the shared underlying need?), and asks before claiming confidence (what evidence would change the decision?) — so a request can collapse into a shared initiative, reuse an existing capability, or stay flagged INVESTIGATE until the evidence is good enough. The AI is deliberately allowed to say \"not enough evidence yet.\"",
    architecture: [
      { title: "1 · Context", desc: "Company IT landscape — systems · capabilities · adoption" },
      { title: "2 · Capture", desc: "Structured idea intake — current work · desired change · evidence" },
      { title: "3 · Analyze", desc: "Root cause · capability · cross-team patterns" },
      { title: "4 · Decide", desc: "Dashboard / findings — ideas + clustered initiatives" },
      { title: "5 · Clarify", desc: "Update missing evidence — complete · challenge · reconcile" },
      {
        parallel: [
          { title: "Anymize.AI — Privacy", desc: "PII stripped before model calls, restored only where needed" },
          { title: "Gemini — Understand", desc: "Free text → root cause, capability, data object" },
          { title: "Evidence Gate", desc: "Deterministic rules; forces INVESTIGATE when evidence is thin" },
          { title: "Gemini — Clarify", desc: "Only the questions needed to fill missing evidence" },
        ],
        note: "AI interprets, Anymize protects, deterministic rules keep the decision honest",
      },
    ],
    contributionIntro:
      "Built by a 5-person team (process/operations, product leadership, security/AI governance, data engineering/BI, and software/LLMs) over a 2-day hackathon. My focus was software and LLMs:",
    contribution: [
      "Built the core decision pipeline (the Streamlit app's intake, clustering and evidence-gate flow) that turns raw idea submissions into structured findings.",
      "Integrated the Gemini API for the \"Understand\" stage — converting free-text submissions into root cause, capability and data-object fields.",
      "Implemented the AI clarification logic that generates targeted follow-up questions only when the evidence gate flags a submission as incomplete or contradictory.",
    ],
    results:
      "Delivered a working core loop by hand-in — context intake, idea capture, analysis and the findings dashboard, plus the evidence-clarification loop (needs-more-info → update → re-analyze). A representative run clustered 15 submitted ideas into 6 initiatives, surfaced 3 cross-team patterns, and flagged 2 ideas as needing clarification.",
    learnings: [
      "Went through several full reframes in 48 hours before landing on the buildable core.",
      "Designing an evidence gate that fails closed — forcing an explicit INVESTIGATE state instead of letting the model bluff past thin evidence.",
      "Stripping PII before any model call, with a local fallback when the Anymize API wasn't configured.",
      "Coordinating a 5-person team spanning process, product, security and data backgrounds.",
    ],
    extraLinks: [{ label: "Hackathon event", href: "https://ai.hamburg/en/event/ai-women-hackathon-2026" }],
  },

  raw2ready: {
    subtitle: "From a rough business idea to pitch-ready assets — business model, competitors, deck and video.",
    event: "Cursor AI Hackathon · Hamburg, Germany · Jan 31 – Feb 1, 2026",
    tech: ["Cursor AI", "Python", "FastAPI", "Pydantic", "OpenAI API", "Google Gemini API", "MiniMax API", "React", "Vite", "python-pptx"],
    stats: [
      { value: "48h", label: "Hackathon build time" },
      { value: "4", label: "Person team" },
      { value: "2", label: "LLM providers behind one API" },
    ],
    overview:
      "Built at the Cursor AI Hackathon in Hamburg, Raw2Ready is an AI-based business intelligence website that turns a rough business idea into pitch-ready assets — a business model breakdown, competitor analysis, a timeline, a pitch presentation and a portfolio video — coded almost entirely inside Cursor over a 48-hour sprint.",
    problem:
      "Having a rough idea is easy; making it legible to an investor isn't. The information that does exist usually ends up scattered across a long ChatGPT conversation, and turning it into something pitch-ready still means separately producing a polished presentation and a video — a slow, manual step most early founders skip or outsource.",
    approach:
      "Raw2Ready takes a raw idea — name, location, budget, industry and a free-text description — and runs it through a pipeline that produces a business model, a competitor analysis, a timeline, a pitch presentation and a portfolio video, one stage feeding the next. The backend lets the user pick between two LLM providers per request and returns structured output that drives both the on-screen results and the generated deck.",
    architecture: [
      { title: "React + Vite Frontend", desc: "Idea input form · model selection · results view" },
      { title: "FastAPI Backend", desc: "/api/analyze · /api/models · Pydantic validation" },
      {
        parallel: [
          { title: "OpenAI", desc: "GPT-5.2" },
          { title: "Google", desc: "Gemini 2.5 Flash (REST via httpx)" },
        ],
        note: "User-selected provider generates structured business analysis",
      },
      { title: "Business Model & Market Pipeline", desc: "Competitors · market estimate · demographics · timeline" },
      {
        parallel: [
          { title: "Pitch Deck", desc: "Auto-built with python-pptx" },
          { title: "Portfolio Video", desc: "AI-generated summary (MiniMax API)" },
        ],
      },
      { title: "Pitch-Ready Output", desc: "Business model · competitors · timeline · presentation · video" },
    ],
    contributionIntro: "Built as part of a 4-person team over a 2-day hackathon. My contributions:",
    contribution: [
      "Built the FastAPI backend that receives the raw idea and routes it to the selected LLM provider.",
      "Integrated both OpenAI (GPT-5.2) and Google Gemini (2.5 Flash) behind a single analysis endpoint, including the REST fallback used when the official Gemini SDK proved unstable.",
      "Designed the prompts that turn unstructured idea input into the structured JSON consumed by the frontend and the deck builder.",
      "Implemented the AI video generation stage, calling the MiniMax video API to produce the portfolio video from the generated business analysis.",
    ],
    results:
      "Shipped a working end-to-end prototype within the 48-hour window — from raw idea input to generated competitor and market analysis, an auto-built pitch deck, and an AI-generated portfolio video. The team didn't place, but came away with a functioning full-stack AI product and a lot learned about building fast under hackathon time pressure.",
    learnings: [
      "Coordinating a 4-person team to design and integrate a full-stack app in 48 hours.",
      "Normalizing responses from two different LLM providers behind one API.",
      "Working around instability in the official Gemini SDK by falling back to direct REST calls.",
      "Getting AI video generation working reliably under tight time constraints.",
    ],
    extraLinks: [
      { label: "Hackathon event", href: "https://hackathonhub.eu/events/cursor-ai-hackathon-hamburg-hamburg-2026" },
    ],
  },
};
