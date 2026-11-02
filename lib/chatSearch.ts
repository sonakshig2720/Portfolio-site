// Offline answers for the chatbot: semantic search over question → answer
// facts about Sonakshi (lib/rag.ts). Their embeddings are precomputed
// (npm run chat:index → public/chat-index.json); only the visitor's question
// is embedded, in the browser, with the same all-MiniLM-L6-v2 model.
// No API, no server.

import { normalizeQuestion } from "./normalizeQuestion";

type Index = {
  model: string;
  dim: number;
  answers: { a: string; href: string | null; label: string | null }[];
  questions: [number, string][]; // [answer index, question]
  vectors: string; // base64 int8 unit vectors × 127: all questions, then all answers
};

export type Answer = { text: string; link?: { href: string; label: string } };

// Pinned to the version used to build the index, loaded only when the chat opens.
const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1";
const MIN_SCORE = 0.45; // below this, the portfolio probably doesn't cover the question
const ANSWER_WEIGHT = 0.9; // matching an answer's text counts a little less than matching a question

let indexP: Promise<{ index: Index; vecs: Int8Array }> | null = null;
let embedP: Promise<(q: string) => Promise<Float32Array>> | null = null;

function loadIndex() {
  indexP ??= fetch("/chat-index.json")
    .then((r) => r.json() as Promise<Index>)
    .then((index) => {
      const bin = atob(index.vectors);
      const vecs = new Int8Array(bin.length);
      for (let i = 0; i < bin.length; i++) vecs[i] = (bin.charCodeAt(i) << 24) >> 24;
      return { index, vecs };
    });
  return indexP;
}

function loadModel() {
  embedP ??= import(/* webpackIgnore: true */ TRANSFORMERS_URL).then(async (t) => {
    const { index } = await loadIndex();
    const extractor = await t.pipeline("feature-extraction", index.model, { dtype: "q8" });
    return async (q: string) => {
      const out = await extractor(q, { pooling: "mean", normalize: true });
      return out.data as Float32Array;
    };
  });
  embedP.catch(() => {
    embedP = null; // let a later question try again
  });
  return embedP;
}

/** Start downloading the index and model in the background (call when the chat opens). */
export function warmUp() {
  loadIndex().catch(() => {});
  loadModel().catch(() => {});
}

const withSlash = (href: string) => (href.startsWith("#") ? `/${href}` : href);

// Keyword fallback for when the model can't load (offline, blocked CDN, old browser).
const words = (s: string) => s.toLowerCase().match(/[a-z0-9+#]{3,}/g) ?? [];
function keywordScore(text: string, qs: Set<string>) {
  const ws = words(text);
  const hits = ws.filter((w) => qs.has(w)).length;
  return hits ? hits / Math.sqrt(ws.length + 4) : 0;
}

export async function answer(question: string): Promise<Answer> {
  const q = question.trim();
  if (/^(hi|hello|hey|hallo|good (morning|evening|afternoon))\b[!. ]*$/i.test(q)) {
    return { text: "Hi! Ask me anything about Sonakshi — her experience, projects, skills, education or how to reach her." };
  }

  const { index, vecs } = await loadIndex();
  const nq = index.questions.length;
  // best score per answer, from its questions or its own text
  const scores = new Array<number>(index.answers.length).fill(-1);
  const bump = (a: number, s: number) => {
    if (s > scores[a]) scores[a] = s;
  };
  let threshold = MIN_SCORE;
  try {
    const qv = await (await loadModel())(normalizeQuestion(q));
    const sim = (row: number) => {
      let dot = 0;
      for (let d = 0; d < index.dim; d++) dot += qv[d] * vecs[row * index.dim + d];
      return dot / 127;
    };
    index.questions.forEach(([a], i) => bump(a, sim(i)));
    index.answers.forEach((_, a) => bump(a, sim(nq + a) * ANSWER_WEIGHT));
  } catch {
    const qs = new Set(words(q));
    index.questions.forEach(([a, text]) => bump(a, keywordScore(text, qs)));
    index.answers.forEach((x, a) => bump(a, keywordScore(x.a, qs) * ANSWER_WEIGHT));
    threshold = 0.25;
  }

  let best = 0;
  scores.forEach((s, i) => {
    if (s > scores[best]) best = i;
  });
  if (scores[best] < threshold) {
    return {
      text: "I don't have that detail in Sonakshi's portfolio. You can email her at godavarthysonakshi@gmail.com, or ask about her experience, projects or skills.",
    };
  }

  const { a, href, label } = index.answers[best];
  return { text: a, link: href && label ? { href: withSlash(href), label } : undefined };
}
