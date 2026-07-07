# Signal in the Noise — Design Spec
**Date:** 2026-07-07 · **Owner:** Aastik Rajan · **Status:** Approved (user: "start build")

## Concept
One-sentence story: **"Every project hunts a faint signal buried in overwhelming noise."**
The site is a single cinematic scroll experience. One persistent WebGL particle field
("the Higgs field") lives behind the whole page. Each chapter, scroll morphs the field
so that chapter's *signal* emerges from noise. Signal = color (cyan→violet); noise = monochrome.

Positioning: NOT a portfolio — a flagship main page / research-lab experience.
Each project is presented as a case-study flow: problem → method → result → live link.

## Chapters (scroll order)
| # | Chapter | Field morph | Content |
|---|---------|------------|---------|
| 0 | PRELOADER | particles calibrate → form name | boot choreography |
| 1 | HERO | pure noise, mouse-reactive, connection lines | name, tagline "I find signals in noise", scroll cue |
| 2 | SKY — COSMOS | starfield → one star dims → light-curve draws | 144k TESS light curves, 15 orthogonal detectors, honest nulls + candidates |
| 3 | BODY — PULSEGUARD | waveform + 10-min forecast cone | AUROC 0.849 / AUPRC 0.454 (locked 303,909-window test), ~7× field PPV, 308× alarm reduction, ~4.5-min lead, Seoul→UC Irvine cross-hospital, live monitor link |
| 4 | MAPS — COSMOSCOPE | topic islands; gaps glow | 23,954 arXiv papers, BERTopic, white-space engine, live dashboard link |
| 5 | MIND — AGENTS | neural lattice (Planner→Executor→Judge) | cashflow-runway-advisor, Small Action Model (Qwen2.5-3B QLoRA) |
| 6 | PATH | timeline constellation | ISRO (Springer Nature chapter) → Laurentian → Shubhlaxmi (150% growth) → JHU MS 2026 |
| 7 | PLAY | field goes playful | daily-puzzles, lantern-balloon-game |
| 8 | SIGNAL | field converges into pulsing beacon | contact CTA: email, GitHub |

Private work (cosmos-SBI, SAM, money-maker) = "dossier" cards, "available on request". Honest.

## Design language
- Base near-black `#05060A`, deep-space gradient. Dark only (light mode = v2).
- Accent: cyan `#22D3EE` → violet `#8B5CF6` gradient, ONLY where signal emerges.
- Type: Space Grotesk (display) · Inter (body) · JetBrains Mono (data). Self-hosted via next/font.
- Texture: film grain overlay, glass panels (backdrop-blur), 1px hairlines. Restraint.

## Tech
- Next.js 15 App Router, **static export** (`output:'export'`, `images.unoptimized`), TypeScript.
- React Three Fiber v9 + three: ONE `<Canvas>` fixed behind DOM, single-draw-call Points,
  custom GLSL shader; morph = from/to buffer attributes + `uMorph` uniform, scrub-driven.
- GSAP ScrollTrigger (pinned chapter scenes, scrub) + Lenis (synced via gsap ticker).
- Tailwind v4. Typed content in `content/*.ts` (single source of truth).
- Repo: `AastikRajan/aastikrajan.github.io` → root URL. Deploy: GitHub Actions → Pages.

## Performance budget (hard rules)
- Particles: desktop ≤ 14k, mid ≤ 7k, mobile/low → static CSS starfield fallback.
- DPR clamp [1,2]; no MSAA on mobile; bloom desktop-only.
- `prefers-reduced-motion` → no scrub morphs, static hero, no autoplay video.
- Higgsfield video loops: WebM ≤ 5MB each, lazy per-chapter, poster fallback, none on mobile.
- Lighthouse: perf ≥ 85 desktop target.

## Higgsfield cinematic layer (2-day plan — generate ASAP)
8 loops (5–8s, seamless, dark, cyan/violet grade) under the field at low opacity `mix-blend: screen`:
nebula dolly (hero), star dims (cosmos), waveform macro (pulseguard), island aerial (maps),
lattice orbit (mind), Earth-from-orbit (path), lantern rising (play), beacon pulse (signal).
Plus 5 project key-art stills + OG images (1200×630). Site must work WITHOUT these (gradient fallbacks).

## Phases
1. **MVP live:** scaffold, field engine + 3 morphs min (starfield, waveform, beacon), all chapters,
   real content, deploy. 2. **Polish:** all morphs, video layer, case-study sub-pages, OG images, custom domain.

## Constraints
- Honesty bar: only verified numbers (from research-agent fact sheets in session).
- Never touch `medical` repo. Private repos stay private. No LinkedIn automation.
- Secret-scan before push (repo is public).
