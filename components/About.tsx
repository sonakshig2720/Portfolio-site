"use client";

import { useEffect, useState } from "react";
import { about, researchInterests } from "@/lib/content";
import { NeuralNet, Sparkle } from "./Decor";

const QUESTION = "Who is Sonakshi?";

export default function About() {
  const [typed, setTyped] = useState(QUESTION);

  // Type the prompt out once, the first time the card scrolls into view.
  useEffect(() => {
    const el = document.getElementById("about-window");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setTyped("");
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let i = 0;
        timer = window.setInterval(() => {
          i += 1;
          setTyped(QUESTION.slice(0, i));
          if (i >= QUESTION.length) window.clearInterval(timer);
        }, 55);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section id="about" className="section about">
      <div className="glow glow--left" aria-hidden="true" />
      <div className="container about__grid">
        <div className="section-head reveal">
          <h2>About me</h2>
          <NeuralNet className="decor--about" />
        </div>

        <div id="about-window" className="window reveal">
          <div className="window__bar" aria-hidden="true">
            <span className="window__dots">
              <i /> <i /> <i />
            </span>
            <span className="window__url">sonakshi.ai/about</span>
          </div>
          <div className="window__body">
            <div className="prompt" aria-label={`Prompt: ${QUESTION}`}>
              <Sparkle className="prompt__icon" />
              <span className="prompt__text" aria-hidden="true">
                {typed}
                <span className="caret" />
              </span>
            </div>
            <div className="answer">
              {about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="answer__interests">
                <p className="mono label">Research interests</p>
                <ul className="chips">
                  {researchInterests.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
