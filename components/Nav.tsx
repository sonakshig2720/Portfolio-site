"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";
import { Download } from "./Decor";
import SectionRail from "./SectionRail";
import { whiteboard } from "@/lib/whiteboard";

// Top bar: logo on the left; section rail and CV download on the right.
// `base` is "/" on subpages so the logo points back to the home page.
export default function Nav({ base = "" }: { base?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <a href={`${base}#top`} className="nav__logo" aria-label="Sonakshi.ai — back to top">
          Sonakshi<span>.ai</span>
        </a>
        <div className="nav__right">
          <SectionRail items={whiteboard.jumps} base={base} variant="bar" />
          <a className="btn btn--primary nav__cv" href={profile.cv} download>
            <Download className="icon" />
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
