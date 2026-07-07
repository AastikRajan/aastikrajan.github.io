/**
 * Morph-target generators for the particle field.
 * Each returns positions (count*3) and a signal mask (count) in [0,1]:
 * signal=1 particles take the accent gradient — "the signal emerging from noise".
 * World space is roughly x ∈ [-9,9], y ∈ [-5,5], z ∈ [-4,4]; camera at z=10.
 */

export type Shape = { positions: Float32Array; signal: Float32Array };
export type ShapeKey =
  | "noise"
  | "starfield"
  | "waveform"
  | "islands"
  | "lattice"
  | "constellation"
  | "balloon"
  | "beacon";

// Deterministic PRNG so shapes are stable across renders (mulberry32).
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  // Box–Muller
  return Math.sqrt(-2 * Math.log(1 - r() + 1e-9)) * Math.cos(2 * Math.PI * r());
}

/** Chaotic drifting cloud — pure noise. No signal. */
export function noise(count: number): Shape {
  const r = rng(11);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    p[i * 3] = gauss(r) * 4.2;
    p[i * 3 + 1] = gauss(r) * 2.6;
    p[i * 3 + 2] = gauss(r) * 1.8;
  }
  return { positions: p, signal: s };
}

/** Starfield + a transit light-curve polyline drawn beneath (the dip = signal). */
export function starfield(count: number): Shape {
  const r = rng(22);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  const curveN = Math.floor(count * 0.28);
  const starsN = count - curveN;

  for (let i = 0; i < starsN; i++) {
    p[i * 3] = (r() - 0.5) * 18;
    p[i * 3 + 1] = 0.6 + r() * 4.2; // stars live in the upper field
    p[i * 3 + 2] = (r() - 0.5) * 6;
  }
  // Light curve: flat → dip → flat, lower third of the frame.
  for (let i = 0; i < curveN; i++) {
    const t = i / (curveN - 1); // 0..1 along the curve
    const x = -7.5 + t * 15;
    // transit dip centered at t=0.5, width 0.12
    const d = Math.exp(-(((t - 0.5) / 0.07) ** 2));
    const y = -2.6 - d * 1.4 + (r() - 0.5) * 0.12; // noisy photometry
    const j = starsN + i;
    p[j * 3] = x;
    p[j * 3 + 1] = y;
    p[j * 3 + 2] = (r() - 0.5) * 0.4;
    s[j] = 0.35 + d * 0.65; // whole curve mildly lit; the dip burns
  }
  return { positions: p, signal: s };
}

/** Vital-sign waveform + forward forecast cone (PulseGuard). */
export function waveform(count: number): Shape {
  const r = rng(33);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  const waveN = Math.floor(count * 0.4);
  const coneN = Math.floor(count * 0.25);
  const bgN = count - waveN - coneN;

  // ambient monitor "static"
  for (let i = 0; i < bgN; i++) {
    p[i * 3] = (r() - 0.5) * 18;
    p[i * 3 + 1] = (r() - 0.5) * 9;
    p[i * 3 + 2] = -1.5 - r() * 2.5;
  }
  // arterial-pressure-like waveform, left 60% of frame
  for (let i = 0; i < waveN; i++) {
    const t = i / (waveN - 1);
    const x = -8 + t * 10.5;
    const beat = Math.max(0, Math.sin(t * Math.PI * 10)) ** 3 * 1.6;
    const notch = Math.max(0, Math.sin(t * Math.PI * 10 + 0.9)) ** 12 * 0.5;
    const y = -0.4 + beat + notch + (r() - 0.5) * 0.06;
    const j = bgN + i;
    p[j * 3] = x;
    p[j * 3 + 1] = y;
    p[j * 3 + 2] = (r() - 0.5) * 0.3;
    s[j] = 0.9;
  }
  // forecast cone: spreads right from waveform end — the 10-min prediction band
  for (let i = 0; i < coneN; i++) {
    const t = i / (coneN - 1);
    const x = 2.5 + t * 6;
    const spread = 0.25 + t * 1.9;
    const j = bgN + waveN + i;
    p[j * 3] = x;
    p[j * 3 + 1] = 0.2 + gauss(r) * spread * 0.45;
    p[j * 3 + 2] = (r() - 0.5) * 0.3;
    s[j] = 0.55 * (1 - t * 0.5); // cone fades with uncertainty
  }
  return { positions: p, signal: s };
}

/** Topic islands (clusters); the bridges between them = the glowing gaps. */
export function islands(count: number): Shape {
  const r = rng(44);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  const centers: [number, number][] = [
    [-6, 2.2], [-2.4, -1.8], [1.8, 2.6], [5.6, -0.6], [7.4, 3], [-7, -2.8], [0.2, 0.6],
  ];
  const bridgeN = Math.floor(count * 0.12);
  const clusterN = count - bridgeN;

  for (let i = 0; i < clusterN; i++) {
    const c = centers[i % centers.length];
    p[i * 3] = c[0] + gauss(r) * 0.9;
    p[i * 3 + 1] = c[1] + gauss(r) * 0.6;
    p[i * 3 + 2] = (r() - 0.5) * 1.2;
  }
  // bridges: sparse particles strung between "adjacent but un-co-cited" islands
  const pairs: [number, number][] = [[0, 2], [1, 3], [6, 4]];
  for (let i = 0; i < bridgeN; i++) {
    const [a, b] = pairs[i % pairs.length];
    const t = r();
    const j = clusterN + i;
    p[j * 3] = centers[a][0] + (centers[b][0] - centers[a][0]) * t + (r() - 0.5) * 0.25;
    p[j * 3 + 1] = centers[a][1] + (centers[b][1] - centers[a][1]) * t + (r() - 0.5) * 0.25;
    p[j * 3 + 2] = (r() - 0.5) * 0.6;
    s[j] = 1; // the white space GLOWS
  }
  return { positions: p, signal: s };
}

/** Neural lattice: 3 layers of nodes + particles strung along edges (signal). */
export function lattice(count: number): Shape {
  const r = rng(55);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  const layers = [
    { x: -5.5, n: 5 },
    { x: 0, n: 7 },
    { x: 5.5, n: 4 },
  ];
  const nodes: [number, number, number][] = [];
  for (const L of layers) {
    for (let k = 0; k < L.n; k++) {
      nodes.push([L.x, ((k + 0.5) / L.n - 0.5) * 8, 0]);
    }
  }
  const nodeShare = Math.floor(count * 0.35);
  for (let i = 0; i < nodeShare; i++) {
    const nd = nodes[i % nodes.length];
    p[i * 3] = nd[0] + gauss(r) * 0.18;
    p[i * 3 + 1] = nd[1] + gauss(r) * 0.18;
    p[i * 3 + 2] = nd[2] + gauss(r) * 0.18;
    s[i] = 0.85;
  }
  // edges between consecutive layers
  const l0 = layers[0].n, l1 = layers[1].n;
  for (let i = nodeShare; i < count; i++) {
    const pick = r();
    let a: number, b: number;
    if (pick < 0.55) {
      a = Math.floor(r() * l0);
      b = l0 + Math.floor(r() * l1);
    } else {
      a = l0 + Math.floor(r() * l1);
      b = l0 + l1 + Math.floor(r() * layers[2].n);
    }
    const t = r();
    p[i * 3] = nodes[a][0] + (nodes[b][0] - nodes[a][0]) * t;
    p[i * 3 + 1] = nodes[a][1] + (nodes[b][1] - nodes[a][1]) * t + (r() - 0.5) * 0.08;
    p[i * 3 + 2] = (r() - 0.5) * 0.5;
    s[i] = 0.45;
  }
  return { positions: p, signal: s };
}

/** Constellation timeline — 4 bright waypoint clusters joined by a faint path. */
export function constellation(count: number): Shape {
  const r = rng(66);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  const stops: [number, number][] = [[-7, -1.5], [-2.3, 2.2], [2.3, -2], [7, 1.8]];
  const nodeN = Math.floor(count * 0.5);
  for (let i = 0; i < nodeN; i++) {
    const c = stops[i % stops.length];
    p[i * 3] = c[0] + gauss(r) * 0.45;
    p[i * 3 + 1] = c[1] + gauss(r) * 0.45;
    p[i * 3 + 2] = (r() - 0.5) * 0.8;
    s[i] = 0.9;
  }
  for (let i = nodeN; i < count; i++) {
    const seg = Math.min(stops.length - 2, Math.floor(r() * (stops.length - 1)));
    const t = r();
    p[i * 3] = stops[seg][0] + (stops[seg + 1][0] - stops[seg][0]) * t;
    p[i * 3 + 1] = stops[seg][1] + (stops[seg + 1][1] - stops[seg][1]) * t + (r() - 0.5) * 0.6;
    p[i * 3 + 2] = (r() - 0.5) * 1.5;
    s[i] = 0.2;
  }
  return { positions: p, signal: s };
}

/** A lantern/balloon rising — circle shell + string + scattered sky. */
export function balloon(count: number): Shape {
  const r = rng(77);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  const shellN = Math.floor(count * 0.35);
  const stringN = Math.floor(count * 0.06);
  const skyN = count - shellN - stringN;
  for (let i = 0; i < skyN; i++) {
    p[i * 3] = (r() - 0.5) * 18;
    p[i * 3 + 1] = (r() - 0.5) * 10;
    p[i * 3 + 2] = -1 - r() * 3;
  }
  for (let i = 0; i < shellN; i++) {
    // spherical shell (the balloon), slightly egg-shaped
    const th = r() * Math.PI * 2;
    const ph = Math.acos(2 * r() - 1);
    const j = skyN + i;
    p[j * 3] = 2.2 + Math.sin(ph) * Math.cos(th) * 1.7;
    p[j * 3 + 1] = 1.2 + Math.cos(ph) * 2.1;
    p[j * 3 + 2] = Math.sin(ph) * Math.sin(th) * 1.7;
    s[j] = 0.85;
  }
  for (let i = 0; i < stringN; i++) {
    const t = i / (stringN - 1);
    const j = skyN + shellN + i;
    p[j * 3] = 2.2 + Math.sin(t * 6) * 0.15;
    p[j * 3 + 1] = -0.9 - t * 2.2;
    p[j * 3 + 2] = 0;
    s[j] = 0.5;
  }
  return { positions: p, signal: s };
}

/** Everything converges into one pulsing beacon. All signal. */
export function beacon(count: number): Shape {
  const r = rng(88);
  const p = new Float32Array(count * 3);
  const s = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // dense core + sparse halo
    const core = r() < 0.75;
    const rad = core ? Math.abs(gauss(r)) * 0.7 : 1.5 + Math.abs(gauss(r)) * 2.2;
    const th = r() * Math.PI * 2;
    const ph = Math.acos(2 * r() - 1);
    p[i * 3] = Math.sin(ph) * Math.cos(th) * rad;
    p[i * 3 + 1] = Math.cos(ph) * rad;
    p[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * rad;
    s[i] = core ? 1 : 0.35;
  }
  return { positions: p, signal: s };
}

export const shapeGenerators: Record<ShapeKey, (count: number) => Shape> = {
  noise,
  starfield,
  waveform,
  islands,
  lattice,
  constellation,
  balloon,
  beacon,
};
