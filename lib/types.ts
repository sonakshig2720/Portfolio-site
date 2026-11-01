// Data contract for the "Command Core" radial project map.

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  period?: string; // e.g. "Oct 2024 – Jul 2025"
  image?: string; // card visual, served from /public
  imageFit?: "contain" | "cover"; // line art is shown whole; photos fill the frame
  event?: string; // hackathon name, for category "Hackathon"
  description: string;
  techStack: string[];
  metrics: ProjectMetric[]; // metrics[0] is the primary benchmark shown on the badge and core
  status?: string; // e.g. "Ongoing", "Shipped"
  githubUrl?: string;
  demoUrl?: string;
  caseStudyUrl?: string; // internal detail page, when one exists
  // Radial layout positioning (relative to 1000x1000 coordinate space)
  radialAngle: number; // Position in degrees (0 to 360), 0° = right, clockwise
  radialDistance: number; // Distance factor from center (0.65 to 0.90)
}
