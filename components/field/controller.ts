import { ShapeKey } from "@/lib/shapes";

/**
 * FieldController — the single bridge between the DOM scroll world (GSAP
 * ScrollTrigger) and the WebGL particle field. ScrollTriggers write to it;
 * the field reads it every frame. Plain mutable module state — no React
 * re-renders on scroll.
 */
export type FieldState = {
  from: ShapeKey;
  to: ShapeKey;
  t: number; // morph progress 0..1
};

const state: FieldState = { from: "noise", to: "noise", t: 0 };

const DRIFT: Partial<Record<ShapeKey, number>> = {
  noise: 1,
  beacon: 0.12,
};
const defaultDrift = 0.25;

export const fieldController = {
  set(from: ShapeKey, to: ShapeKey, t: number) {
    state.from = from;
    state.to = to;
    state.t = Math.min(1, Math.max(0, t));
  },
  get(): FieldState {
    return state;
  },
  drift(): number {
    const a = DRIFT[state.from] ?? defaultDrift;
    const b = DRIFT[state.to] ?? defaultDrift;
    return a + (b - a) * state.t;
  },
  pulse(): number {
    return state.to === "beacon" ? state.t : 0;
  },
};

/** The scroll story: what the field morphs through, in chapter order. */
export const morphSequence: ShapeKey[] = [
  "noise", // hero
  "starfield", // cosmos
  "waveform", // pulseguard
  "islands", // cosmoscope
  "lattice", // agents
  "constellation", // path
  "balloon", // play
  "beacon", // signal / contact
];
