# Project Log — newest first

Every work session appends one entry: date, what shipped, decisions, open items, next steps.
**A new chat/session must read this file before doing any work.**

---

## 2026-07-08 — Living Sky + workflow system

**Shipped (live, verified 200):**
- `FrontCanvas` (z-40, transparent, pointer-events-none) — the lantern guide character now flies OVER all sections, plus big soft transparent wandering motes (420, size 0.26, opacity 0.12), shooting stars (5), gliding birds (4).
- `Ambient.tsx` — Moon (crescent + halo, upper-left drift), 12 twinkling cyan/violet gems.
- `DustStream` parameterized: fine fast dust (2600) in back canvas, big slow motes in front; both warp with scroll velocity.
- Repo hygiene: removed stray `readme.json` / `readme_new.b64` / `sha.txt`; added `CLAUDE.md` + this log.

**Awaiting user verdict:** front-layer balance — knobs are mote size/opacity, bird count, gem twinkle, star frequency.

**Cosmetic nits (only if asked):** daily-puzzles og.jpg is 2.32:1 (re-crop to 1.91:1); lantern game og:image lacks width/height meta; rel=canonical missing on portfolio + daily-puzzles.

**User-owned follow-ups:** rotate Anthropic API key; publish blog drafts (in cosmoscope + cashflow repos) to dev.to; use cv-handoff-prompt for CV chat.

---

## 2026-07-07 — Site built end-to-end (condensed history)

- Concept "Signal in the Noise" from mining real project transcripts; spec at `docs/specs/2026-07-07-signal-in-the-noise-design.md`. All stats verified (AUROC 0.849, 308×, ~4.5min, 144k, 23,954…).
- Core: 8 morph-target particle shapes (`lib/shapes.ts`) + GLSL morph shader scrubbed by ScrollTrigger; Lenis smooth scroll on gsap.ticker; SceneShot sticky establishing shots with Ken Burns + title cards; CinemaLayer blend modes.
- Higgsfield pipeline: CLI OAuth → 8× soul_cinematic 21:9 backdrops (PIL-compressed to 656KB total) + tripo_3d lantern GLB (57MB → 2.32MB via gltf-transform draco/webp). ~7–8 of 50 credits used.
- Lantern character: GLB with emissiveMap=map + toneMapped=false (self-lit), damped steadicam flight, 140-point ember trail.
- Fixes: reveals stuck hidden → ScrollTrigger.refresh on load + delays; disconnected sections → story-panel -42vh overlap + gradient scrim; lantern darting → lerp-damped glide; lantern hidden behind sections → moved to FrontCanvas.
- Ecosystem: vortex-drop built + shipped (24 tests); lantern-balloon-game + daily-puzzles overhauled by agents (verified); profile README links all four projects.
