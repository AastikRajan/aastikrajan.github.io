import { site } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
  return (
    <section
      data-chapter="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p data-reveal className="font-mono text-xs uppercase tracking-[0.35em] text-dim">
        {site.role}
      </p>
      <h1
        data-reveal
        className="font-display mt-6 max-w-5xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl"
      >
        I find <span className="text-gradient">signals</span>
        <br />
        in noise.
      </h1>
      <p data-reveal className="mt-8 max-w-xl text-base leading-relaxed text-dim sm:text-lg">
        {site.sub}
      </p>
      <div data-reveal className="mt-10 flex items-center gap-4">
        <MagneticButton href="#pulseguard" primary>
          Enter the lab ↓
        </MagneticButton>
        <MagneticButton href={site.github}>GitHub</MagneticButton>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="scroll-line" />
      </div>
    </section>
  );
}
