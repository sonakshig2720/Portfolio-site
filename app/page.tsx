import Nav from "@/components/Nav";
import Whiteboard from "@/components/Whiteboard";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Hackathons from "@/components/Hackathons";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Whiteboard />
        <Experience />
        <Projects />
        <Hackathons />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Reveal />
    </>
  );
}
