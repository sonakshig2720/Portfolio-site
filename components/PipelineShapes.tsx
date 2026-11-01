import type { AbstractShape } from "@/lib/experiencePipeline";

// Wireframe "abstract shapes" for the experience pipeline nodes. Geometry is
// computed once at module load and drawn in a -100..100 viewBox.

type V3 = [number, number, number];
type Seg = [number, number, number, number, number]; // x1 y1 x2 y2 depth(0..1)

const rotate = ([x, y, z]: V3, ax: number, ay: number): V3 => {
  const y1 = y * Math.cos(ax) - z * Math.sin(ax);
  const z1 = y * Math.sin(ax) + z * Math.cos(ax);
  const x2 = x * Math.cos(ay) + z1 * Math.sin(ay);
  const z2 = -x * Math.sin(ay) + z1 * Math.cos(ay);
  return [x2, y1, z2];
};

const norm = (v: V3): V3 => {
  const l = Math.hypot(...v);
  return [v[0] / l, v[1] / l, v[2] / l];
};

function geodesic(): { segs: Seg[]; pts: V3[] } {
  const p = (1 + Math.sqrt(5)) / 2;
  const base: V3[] = [
    [-1, p, 0], [1, p, 0], [-1, -p, 0], [1, -p, 0],
    [0, -1, p], [0, 1, p], [0, -1, -p], [0, 1, -p],
    [p, 0, -1], [p, 0, 1], [-p, 0, -1], [-p, 0, 1],
  ].map((v) => norm(v as V3));
  const faces: [number, number, number][] = [];
  for (let a = 0; a < 12; a++)
    for (let b = a + 1; b < 12; b++)
      for (let c = b + 1; c < 12; c++) {
        const d = (i: number, j: number) => Math.hypot(...(base[i].map((v, k) => v - base[j][k]) as V3));
        if (d(a, b) < 1.1 && d(b, c) < 1.1 && d(a, c) < 1.1) faces.push([a, b, c]);
      }
  // one level of subdivision → geodesic sphere
  const pts: V3[] = [...base];
  const mid = new Map<string, number>();
  const m = (i: number, j: number) => {
    const key = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (!mid.has(key)) {
      pts.push(norm(pts[i].map((v, k) => (v + pts[j][k]) / 2) as V3));
      mid.set(key, pts.length - 1);
    }
    return mid.get(key)!;
  };
  const edges = new Set<string>();
  const add = (i: number, j: number) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`);
  for (const [a, b, c] of faces) {
    const ab = m(a, b), bc = m(b, c), ca = m(c, a);
    [[a, ab], [ab, b], [b, bc], [bc, c], [c, ca], [ca, a], [ab, bc], [bc, ca], [ca, ab]].forEach(([i, j]) => add(i, j));
  }
  const r = pts.map((v) => rotate(v, 0.45, 0.6));
  const segs = [...edges].map((e) => {
    const [i, j] = e.split("-").map(Number);
    const z = (r[i][2] + r[j][2]) / 2;
    return [r[i][0] * 78, r[i][1] * 78, r[j][0] * 78, r[j][1] * 78, (z + 1) / 2] as Seg;
  });
  return { segs, pts: r };
}

function tesseract(): Seg[] {
  const verts: number[][] = [];
  for (let i = 0; i < 16; i++) verts.push([0, 1, 2, 3].map((b) => ((i >> b) & 1 ? 1 : -1)));
  const proj = verts.map(([x, y, z, w]) => {
    // rotate in the x–w plane, then perspective-project 4D → 3D → 2D
    const a = 0.55;
    const x1 = x * Math.cos(a) - w * Math.sin(a);
    const w1 = x * Math.sin(a) + w * Math.cos(a);
    const k = 1.9 / (2.6 - w1);
    const v = rotate([x1 * k, y * k, z * k], 0.5, 0.65);
    const k2 = 2.2 / (3.4 - v[2]);
    return [v[0] * k2 * 62, v[1] * k2 * 62, (v[2] + 1.5) / 3];
  });
  const segs: Seg[] = [];
  for (let i = 0; i < 16; i++)
    for (let b = 0; b < 4; b++) {
      const j = i ^ (1 << b);
      if (j > i) segs.push([proj[i][0], proj[i][1], proj[j][0], proj[j][1], (proj[i][2] + proj[j][2]) / 2]);
    }
  return segs;
}

function lattice(): { segs: Seg[]; pts: [number, number, number][] } {
  const pts: [number, number, number][] = [];
  const idx = (x: number, y: number, z: number) => x * 12 + y * 3 + z;
  for (let x = 0; x < 4; x++)
    for (let y = 0; y < 4; y++)
      for (let z = 0; z < 3; z++) {
        const v = rotate([(x - 1.5) * 0.9, (z - 1) * 0.9, (y - 1.5) * 0.9], 0.55, 0.75);
        pts.push([v[0] * 46, v[1] * 46, (v[2] + 2) / 4]);
      }
  const segs: Seg[] = [];
  for (let x = 0; x < 4; x++)
    for (let y = 0; y < 4; y++)
      for (let z = 0; z < 3; z++) {
        const a = pts[idx(x, y, z)];
        const link = (b: [number, number, number]) => segs.push([a[0], a[1], b[0], b[1], (a[2] + b[2]) / 2]);
        if (x < 3) link(pts[idx(x + 1, y, z)]);
        if (y < 3) link(pts[idx(x, y + 1, z)]);
        if (z < 2 && (x + y) % 2 === 0) link(pts[idx(x, y, z + 1)]);
      }
  return { segs, pts };
}

const ICO = geodesic();
const TESS = tesseract();
const LAT = lattice();

// Rounded so server and client render identical attribute strings.
const q = (n: number) => Math.round(n * 100) / 100;
const opacity = (depth: number) => q(0.25 + depth * 0.75);

function Lines({ segs }: { segs: Seg[] }) {
  return (
    <>
      {segs.map(([x1, y1, x2, y2, d], i) => (
        <line key={i} x1={q(x1)} y1={q(y1)} x2={q(x2)} y2={q(y2)} style={{ opacity: opacity(d) }} />
      ))}
    </>
  );
}

function Vortex() {
  const rings = Array.from({ length: 7 }, (_, i) => i);
  const dots = Array.from({ length: 140 }, (_, i) => {
    const t = i / 140;
    const a = t * Math.PI * 9;
    const r = 8 + t * 74;
    return [Math.cos(a) * r * 0.78 + 4, Math.sin(a) * r, t] as const;
  });
  return (
    <>
      {rings.map((i) => (
        <ellipse
          key={i}
          cx={6 - i * 1.6}
          cy={4 - i * 1.2}
          rx={12 + i * 10}
          ry={15 + i * 12.5}
          transform={`rotate(${-18 + i * 4})`}
          style={{ opacity: q(0.85 - i * 0.09) }}
        />
      ))}
      {dots.map(([x, y, t], i) => (
        <circle key={i} cx={q(x)} cy={q(y)} r={q(0.9 + (1 - t) * 0.6)} className="shape-dot" style={{ opacity: q(0.25 + t * 0.6) }} />
      ))}
    </>
  );
}

function Layers() {
  const sheet = (y: number) => `M-62 ${y} L0 ${y - 26} L62 ${y} L0 ${y + 26} Z`;
  return (
    <>
      {[-48, -24, 0, 24, 48].map((y, i) => (
        <path key={y} d={sheet(y)} className={i === 2 ? "shape-fill" : undefined} style={{ opacity: q(0.45 + i * 0.12) }} />
      ))}
      {[-62, 62, 0].map((x) => (
        <line key={x} x1={x} y1={x === 0 ? -22 : -48} x2={x} y2={x === 0 ? 74 : 48} className="shape-dash" />
      ))}
    </>
  );
}

const captions: Record<AbstractShape, string> = {
  icosahedron: "GEOM: ICOSAHEDRON",
  vortex: "GEOM: VORTEX",
  tesseract: "GEOM: TESSERACT",
  lattice: "GEOM: LATTICE",
  layers: "GEOM: LAYERS",
};

export default function PipelineShape({ shape }: { shape: AbstractShape }) {
  return (
    <figure className="pshape" aria-hidden="true">
      <svg viewBox="-100 -100 200 200">
        <g className="pshape__spin">
          {shape === "icosahedron" && (
            <>
              <Lines segs={ICO.segs} />
              {ICO.pts.map(([x, y, z], i) => (
                <circle key={i} cx={q(x * 78)} cy={q(y * 78)} r={1.6} className="shape-dot" style={{ opacity: opacity((z + 1) / 2) }} />
              ))}
            </>
          )}
          {shape === "tesseract" && <Lines segs={TESS} />}
          {shape === "lattice" && (
            <>
              <Lines segs={LAT.segs} />
              {LAT.pts.map(([x, y, d], i) => (
                <circle key={i} cx={q(x)} cy={q(y)} r={2.2} className="shape-dot" style={{ opacity: opacity(d) }} />
              ))}
            </>
          )}
          {shape === "vortex" && <Vortex />}
          {shape === "layers" && <Layers />}
        </g>
      </svg>
      <figcaption className="mono">{captions[shape]}</figcaption>
    </figure>
  );
}
