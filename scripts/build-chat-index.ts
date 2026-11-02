// Builds public/chat-index.json for the offline chatbot. Every fact in
// lib/rag.ts has a question and an answer; both are embedded with
// all-MiniLM-L6-v2 so a visitor's question can match either.
// Run after changing site content:  npm run chat:index

import { writeFileSync } from "node:fs";
import { pipeline } from "@huggingface/transformers";
import { facts, normalizeQuestion } from "../lib/rag";

const MODEL = "Xenova/all-MiniLM-L6-v2";

async function main() {
  const embed = await pipeline("feature-extraction", MODEL, { dtype: "q8" });

  // One entry per distinct answer; several questions can point at it.
  const answers: { a: string; href: string | null; label: string | null }[] = [];
  const byText = new Map<string, number>();
  const questions: [number, string][] = [];
  for (const f of facts) {
    let i = byText.get(f.a);
    if (i === undefined) {
      i = answers.push({ a: f.a, href: f.href ?? null, label: f.label ?? null }) - 1;
      byText.set(f.a, i);
    }
    questions.push([i, f.q]);
  }

  // Vectors: every question first, then every answer.
  const texts = [...questions.map(([, q]) => normalizeQuestion(q)), ...answers.map((x) => x.a)];
  const out = await embed(texts, { pooling: "mean", normalize: true });
  const dim = out.dims[1];
  const data = out.data as Float32Array;

  // int8-quantise the unit vectors (×127) to keep the file small.
  const q8 = new Int8Array(data.length);
  for (let i = 0; i < data.length; i++) q8[i] = Math.max(-127, Math.min(127, Math.round(data[i] * 127)));

  writeFileSync(
    "public/chat-index.json",
    JSON.stringify({ model: MODEL, dim, answers, questions, vectors: Buffer.from(q8.buffer).toString("base64") })
  );
  console.log(`Embedded ${questions.length} questions and ${answers.length} answers (dim ${dim}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
