import { site } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";
import CinemaLayer from "@/components/ui/CinemaLayer";

export default function Signal() {
  return (
    <section
      id="signal"
      data-chapter="signal"
      className="relative flex min-h-[140vh] flex-col items-center justify-center px-6 text-center"
    >
      <CinemaLayer src="/media/signal.jpg" strength="bold" />
      <p data-reveal className="font-mono text-xs uppercase tracking-[0.35em] text-cyan">
        CHAPTER 07 — THE SIGNAL
      </p>
      <h2
        data-reveal
        className="font-display mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
      >
        The next signal
        <br />
        could be <span className="text-gradient">yours</span>
      </h2>
      <p data-reveal className="mt-8 max-w-lg text-base leading-relaxed text-dim">
        Research collaboration, an interesting problem, or a role where faint signals matter —
        my inbox is open.
      </p>
      <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <MagneticButton href={`mailto:${site.email}`} primary>
          {site.email}
        </MagneticButton>
        <MagneticButton href={site.github}>GitHub</MagneticButton>
        <MagneticButton href={site.linkedin}>LinkedIn</MagneticButton>
      </div>
      <footer className="absolute bottom-8 left-0 right-0 px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 border-t pt-6 hairline sm:flex-row">
          <p className="font-mono text-[11px] text-dim">
            © 2026 {site.name} · Signal in the Noise
          </p>
          <p className="font-mono text-[11px] text-dim">
            Next.js · React Three Fiber · GSAP — one particle field, eight signals
          </p>
        </div>
      </footer>
    </section>
  );
}
