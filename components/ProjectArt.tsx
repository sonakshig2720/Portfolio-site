import type { ArtVariant } from "@/lib/content";

// Generative cover art for each project, drawn to echo what the project does.

function Graph() {
  const n = [
    [70, 80], [150, 50], [230, 95], [320, 60], [110, 170], [200, 190], [290, 160], [350, 230], [60, 240], [170, 260], [260, 255],
  ];
  const e = [
    [0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [2, 5], [5, 6], [3, 6], [6, 7], [4, 8], [5, 9], [9, 10], [6, 10], [1, 5], [8, 9],
  ];
  return (
    <g>
      {e.map(([a, b], i) => (
        <line key={i} x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} className="art-line" />
      ))}
      {n.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 14 : i % 3 === 0 ? 9 : 6} className={i === 5 ? "art-hub" : "art-node"} />
      ))}
    </g>
  );
}

function Tree() {
  const root = [200, 50];
  const mids = [[90, 140], [200, 140], [310, 140]];
  const leaves = mids.flatMap(([x]) => [x - 45, x, x + 45].map((lx) => [lx, 240]));
  return (
    <g>
      {mids.map(([x, y], i) => (
        <path key={`m${i}`} d={`M${root[0]} ${root[1]} V95 H${x} V${y}`} className="art-line" />
      ))}
      {leaves.map(([x, y], i) => {
        const m = mids[Math.floor(i / 3)];
        return <path key={`l${i}`} d={`M${m[0]} ${m[1]} V190 H${x} V${y}`} className={i % 4 === 1 ? "art-line art-line--dash" : "art-line"} />;
      })}
      <circle cx={root[0]} cy={root[1]} r={16} className="art-hub" />
      {mids.map(([x, y], i) => (
        <rect key={i} x={x - 12} y={y - 12} width={24} height={24} rx={6} className="art-node" />
      ))}
      {leaves.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} className={i % 4 === 1 ? "art-node art-node--off" : "art-node"} />
      ))}
    </g>
  );
}

function Stream() {
  const waves = Array.from({ length: 9 }, (_, i) => {
    const y = 70 + i * 20;
    const a = 18 + (i % 3) * 8;
    return `M0 ${y} C 70 ${y - a}, 130 ${y + a}, 200 ${y} S 330 ${y - a}, 400 ${y}`;
  });
  return (
    <g>
      {waves.map((d, i) => (
        <path key={i} d={d} className="art-line art-wave" style={{ opacity: 0.25 + (i % 4) * 0.18 }} />
      ))}
      {[80, 170, 260, 340].map((x, i) => (
        <circle key={i} cx={x} cy={110 + (i % 2) * 70} r={6} className="art-hub" />
      ))}
    </g>
  );
}

function Decision() {
  const inputs = [50, 100, 150, 200, 250];
  return (
    <g>
      {inputs.map((y, i) => (
        <path key={i} d={`M40 ${y} C 140 ${y}, 160 150, 230 150`} className="art-line" />
      ))}
      {inputs.map((y, i) => (
        <rect key={`r${i}`} x={22} y={y - 8} width={36} height={16} rx={8} className="art-node" />
      ))}
      <rect x={210} y={130} width={40} height={40} rx={6} transform="rotate(45 230 150)" className="art-hub" />
      <path d="M262 150 H360" className="art-line" />
      <circle cx={360} cy={150} r={12} className="art-node" />
    </g>
  );
}

function Pipeline() {
  const steps = [60, 150, 240, 330];
  return (
    <g>
      <path d="M60 150 H330" className="art-line" />
      {steps.map((x, i) => (
        <g key={i}>
          <rect x={x - 30} y={120 - (i % 2) * 30} width={60} height={60 + (i % 2) * 60} rx={10} className={i === 3 ? "art-hub" : "art-node"} />
          <line x1={x - 16} x2={x + 16} y1={140} y2={140} className="art-line" />
          <line x1={x - 16} x2={x + 6} y1={152} y2={152} className="art-line" />
        </g>
      ))}
    </g>
  );
}

const motifs: Record<ArtVariant, () => React.ReactElement> = {
  graph: Graph,
  tree: Tree,
  stream: Stream,
  decision: Decision,
  pipeline: Pipeline,
};

export default function ProjectArt({ variant, className = "" }: { variant: ArtVariant; className?: string }) {
  const Motif = motifs[variant];
  return (
    <div className={`art art--${variant} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <Motif />
      </svg>
    </div>
  );
}
