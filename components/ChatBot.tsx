"use client";

import { useEffect, useRef, useState } from "react";
import { answer, warmUp, type Answer } from "@/lib/chatSearch";

// Floating "Ask about Sonakshi" assistant, bottom-right. Answers come from a
// semantic search over the portfolio's own content, run in the browser
// (see lib/chatSearch.ts) — no API or server involved.

type Msg = { role: "user" | "assistant"; content: string; link?: Answer["link"] };

const SUGGESTIONS = [
  "What is Sonakshi working on right now?",
  "Which projects use RAG or LLMs?",
  "What did she do at Lufthansa?",
  "Is she open to relocation?",
];

function Bot({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="botBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1d9a0" />
          <stop offset="1" stopColor="#b8913f" />
        </linearGradient>
      </defs>
      <line x1="32" y1="6" x2="32" y2="13" stroke="#e8c987" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="5" r="3" fill="#e8c987" />
      <rect x="10" y="13" width="44" height="34" rx="16" fill="url(#botBody)" />
      <rect x="16" y="21" width="32" height="15" rx="7.5" fill="#0b1526" />
      <circle cx="25" cy="28.5" r="4" fill="#f7f2e8" />
      <circle cx="39" cy="28.5" r="4" fill="#f7f2e8" />
      <circle cx="26" cy="29.5" r="2" fill="#0b1526" />
      <circle cx="40" cy="29.5" r="2" fill="#0b1526" />
      <path d="M27 40.5c2.8 2.4 7.2 2.4 10 0" stroke="#0b1526" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <ellipse cx="32" cy="57" rx="12" ry="2.5" fill="#d4af5f" opacity=".25" />
    </svg>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [hello, setHello] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // A short "Hello!" bubble after the page settles, until the chat is opened.
  useEffect(() => {
    const show = setTimeout(() => setHello(true), 1800);
    const hide = setTimeout(() => setHello(false), 9000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setHello(false);
      inputRef.current?.focus();
      warmUp(); // fetch the search index and model while the visitor reads
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const reply = await answer(q);
      setMsgs([...next, { role: "assistant", content: reply.text, link: reply.link }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="chatbot">
      {hello && !open && (
        <button type="button" className="chatbot__hello" onClick={() => setOpen(true)}>
          Hello! Ask me about Sonakshi
        </button>
      )}

      {open && (
        <section className="chatbot__panel" role="dialog" aria-label="Ask about Sonakshi">
          <header className="chatbot__head">
            <Bot className="chatbot__avatar" />
            <div>
              <p className="chatbot__title">Ask about Sonakshi</p>
              <p className="chatbot__sub">Searches her portfolio</p>
            </div>
            <button type="button" className="chatbot__close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>

          <div className="chatbot__log" ref={listRef} aria-live="polite">
            {msgs.length === 0 ? (
              <div className="chatbot__intro">
                <p>Hi! I can answer questions about Sonakshi&apos;s experience, projects, skills and education.</p>
                <ul>
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => ask(s)}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              msgs.map((m, i) => (
                <div key={i} className={`chatbot__msg chatbot__msg--${m.role}`}>
                  {m.content ? (
                    <>
                      <p>{m.content}</p>
                      {m.link && (
                        <a className="chatbot__link" href={m.link.href} onClick={() => setOpen(false)}>
                          {m.link.label} →
                        </a>
                      )}
                    </>
                  ) : (
                    <span className="chatbot__typing" aria-label="Searching">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <form
            className="chatbot__form"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={1000}
              placeholder="Ask a question…"
              aria-label="Your question"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(input);
                }
              }}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
          <p className="chatbot__note">Answers are matched from this portfolio — see the CV for full details.</p>
        </section>
      )}

      <button
        type="button"
        className={`chatbot__fab ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat about Sonakshi"}
      >
        <Bot />
      </button>
    </div>
  );
}
