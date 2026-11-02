import type { Metadata, Viewport } from "next";
import { Inter, Caveat, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CursorTrail from "@/components/CursorTrail";
import ChatBot from "@/components/ChatBot";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
// Section and card titles.
const heading = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
// Handwritten + code fonts are used only on the hero whiteboard.
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code", display: "swap" });

export const metadata: Metadata = {
  title: "Sonakshi Godavarthy — AI & Machine Learning Engineer",
  description:
    "AI & Machine Learning Engineer in Hamburg building generative AI, knowledge graph and RAG systems that make sense of complex, real-world data.",
};

export const viewport: Viewport = {
  themeColor: "#0b1526",
};

// A reload always starts at the top: drop any #section from the URL and stop
// the browser restoring the old scroll position. Links like /#projects still work.
const resetOnReload = `(function(){try{
var n=performance.getEntriesByType("navigation")[0];
if(!n||n.type!=="reload")return;
history.scrollRestoration="manual";
if(location.hash)history.replaceState(null,"",location.pathname+location.search);
var top=function(){window.scrollTo({top:0,left:0,behavior:"instant"})};
top();window.addEventListener("load",top);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${heading.variable} ${hand.variable} ${code.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: resetOnReload }} />
        {children}
        <CursorTrail />
        <ChatBot />
      </body>
    </html>
  );
}
