// Small decorative SVGs shared across sections. All are aria-hidden.

export function NodeCluster({ className = "" }: { className?: string }) {
  const pts = [
    [20, 30], [55, 12], [90, 34], [40, 62], [78, 70], [112, 58], [64, 98], [100, 104], [24, 92],
  ];
  const links = [
    [0, 1], [1, 2], [0, 3], [3, 4], [2, 5], [4, 5], [3, 6], [6, 7], [4, 7], [3, 8], [8, 6], [1, 3],
  ];
  return (
    <svg className={`decor ${className}`} viewBox="0 0 130 120" aria-hidden="true">
      {links.map(([a, b], i) => (
        <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3.2 : 2.2} />
      ))}
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.5c.5 4.6 2.9 7 7.5 7.5-4.6.5-7 2.9-7.5 7.5-.5-4.6-2.9-7-7.5-7.5 4.6-.5 7-2.9 7.5-7.5Z"
        fill="currentColor"
      />
      <path d="M19 15.5c.2 1.8 1.2 2.8 3 3-1.8.2-2.8 1.2-3 3-.2-1.8-1.2-2.8-3-3 1.8-.2 2.8-1.2 3-3Z" fill="currentColor" opacity=".7" />
    </svg>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Download({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
    </svg>
  );
}

// Teal "paint splash" blob placed behind portrait-style images.
export function Splash({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <linearGradient id="splashGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c987" />
          <stop offset="55%" stopColor="#c9a24a" />
          <stop offset="100%" stopColor="#8a6a2a" />
        </linearGradient>
        <filter id="brush" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="34" />
        </filter>
      </defs>
      <path
        filter="url(#brush)"
        fill="url(#splashGrad)"
        d="M205 40c62 4 128 40 145 104 18 66-12 140-72 176-58 35-140 38-196 0C26 282 22 200 46 140 72 76 140 36 205 40Z"
      />
    </svg>
  );
}

// Small feed-forward neural network (3 → 4 → 2) used as a quiet accent.
export function NeuralNet({ className = "" }: { className?: string }) {
  const layers = [
    { x: 14, ys: [22, 50, 78] },
    { x: 80, ys: [12, 38, 62, 88] },
    { x: 146, ys: [34, 66] },
  ];
  return (
    <svg className={`nn ${className}`} viewBox="0 0 160 100" aria-hidden="true">
      {layers.slice(0, -1).map((l, i) =>
        l.ys.flatMap((y1) =>
          layers[i + 1].ys.map((y2) => (
            <line key={`${i}-${y1}-${y2}`} x1={l.x} y1={y1} x2={layers[i + 1].x} y2={y2} className="nn__edge" />
          ))
        )
      )}
      {layers.map((l, i) =>
        l.ys.map((y) => (
          <circle key={`${i}-${y}`} cx={l.x} cy={y} r={i === layers.length - 1 ? 5.5 : 4.5} className={i === layers.length - 1 ? "nn__node nn__node--out" : "nn__node"} />
        ))
      )}
    </svg>
  );
}
