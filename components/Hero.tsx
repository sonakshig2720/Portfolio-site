import Image from "next/image";
import { profile } from "@/lib/content";
import { Splash } from "./Decor";
import InteractiveConstellation from "./InteractiveConstellation";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="glow glow--hero" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" />
            {profile.role} · {profile.location}
          </p>
          <h1 className="hero__title">
            <span className="hero__hi">Hi, I am</span>
            <span className="hero__name">
              <span className="grad-text">{profile.name}</span>
            </span>
          </h1>
          <p className="hero__tagline">{profile.tagline}</p>
          <p className="hero__intro">{profile.intro}</p>
          <ul className="hero__focus" aria-label="Focus areas">
            {profile.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="hero__visual">
          <Splash className="hero__splash" />
          <div className="hero__photo">
            <Image
              src="/profile.jpg"
              alt="Sonakshi Godavarthy smiling by the sea"
              width={800}
              height={1000}
              priority
              sizes="(max-width: 900px) 70vw, 420px"
            />
          </div>
          <InteractiveConstellation />
        </div>
      </div>
    </section>
  );
}
