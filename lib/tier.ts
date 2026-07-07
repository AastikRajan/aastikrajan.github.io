export type Tier = "high" | "mid" | "low";

/** Device capability tier — decides particle count or static fallback. Client-only. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "low";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth < 900);
  if (isMobile) return "low";

  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;

  // Probe WebGL — no GL, no field.
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) return "low";

  if (cores >= 8 && mem >= 8) return "high";
  return "mid";
}

export const PARTICLES: Record<Exclude<Tier, "low">, number> = {
  high: 14000,
  mid: 7000,
};
