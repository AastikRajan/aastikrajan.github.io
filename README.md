# Signal in the Noise

**Live: https://aastikrajan.github.io**

The main page of [Aastik Rajan](https://github.com/AastikRajan) — one continuous cinematic
scroll where a single WebGL particle field morphs into each project's *signal*: a planet's
transit dip, an arterial waveform, a map of research gaps, a neural lattice, a beacon.

## How it works
- **One particle field, one draw call** — custom GLSL shaders; morphing runs on the GPU
  (`aFrom`/`aTo` buffers + a scrubbed `uMorph` uniform with per-particle stagger).
- **Scroll story** — GSAP ScrollTrigger scrubs the morphs; Lenis smooths the ride.
- **Honest by design** — every number on the page comes from a locked, held-out evaluation.
- **Performance-guarded** — device-tier detection (14k/7k particles), DPR clamp,
  static-starfield fallback on mobile/low-power, `prefers-reduced-motion` respected.

## Stack
Next.js 15 (static export) · TypeScript · React Three Fiber · Three.js · GSAP + Lenis · Tailwind v4

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to out/
```

## Structure
```
app/               layout, page, globals (design tokens)
components/field/  the particle engine: shaders, morph controller, canvas
components/motion/ Lenis + ScrollTrigger wiring
components/chapters/ preloader, hero, case-study chapters, contact
content/           all copy & verified numbers (single source of truth)
lib/               device tiers, morph-target shape generators
```

MIT © Aastik Rajan
