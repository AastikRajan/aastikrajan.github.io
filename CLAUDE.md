# aastikrajan.github.io — "Signal in the Noise"

Cinematic scroll-story portfolio. Next.js 15 (App Router, `output: 'export'`) + React Three Fiber + GSAP ScrollTrigger + Lenis. Deployed by GitHub Actions → GitHub Pages → https://aastikrajan.github.io

## Commands

- `npm run dev` — local dev
- `npm run build` — static export to `out/`. MUST pass before every commit.
- Deploy: push to `main` → `.github/workflows/deploy.yml`. Verify live URL returns 200 after.

## Architecture invariants (breaking these breaks the site)

- Section order in `app/page.tsx` MUST match `morphSequence` in `components/field/controller.ts` — particle morphs are index-mapped to sections.
- Z-order is sacred: FieldCanvas `-z-10` < story panels `z-10` < FrontCanvas `z-40` < vignette `z-45` < grain `z-50` < preloader `z-60`.
- Two canvases, fixed roles: `FieldCanvas` = background (particle field, fine dust, moon, gems). `FrontCanvas` = foreground over ALL sections (lantern character, big transparent motes, shooting stars, birds) — must stay `pointer-events-none`.
- Device tiers (`lib/tier.ts`): high 14k / mid 7k particles, low = static CSS stars and NO FrontCanvas. Every new visual must respect tier gating and `prefers-reduced-motion`.
- Every stat in `content/chapters.ts` is a real, verified number. Never invent, round up, or embellish a metric.
- Assets stay small: `public/media` JPEGs compressed (~50–100KB each), `public/models/lantern.glb` draco+webp (2.32MB). Optimize anything new before committing.

## Working rules

- Follow the workspace principles (think first, simplicity first, surgical diffs, goal-driven: build passes + live URL verified = done).
- Log every work session in `docs/LOG.md`, newest entry on top. A new session reads that file first.
- Secret-scan before every push: `git grep -nE "sk-ant-|AIzaSy|ghp_|github_pat_" -- . ':!CLAUDE.md'` must be empty (this file quotes the patterns, so it excludes itself).
