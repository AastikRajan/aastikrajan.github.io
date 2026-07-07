import type { Chapter } from "@/content/chapters";
import StatGrid from "@/components/ui/StatGrid";
import MagneticButton from "@/components/ui/MagneticButton";

/** A research case-study chapter: story → method → results → links. */
export default function ChapterSection({ chapter }: { chapter: Chapter }) {
  return (
    <section
      id={chapter.id}
      data-chapter={chapter.id}
      className="relative mx-auto flex min-h-[160vh] max-w-5xl flex-col justify-center px-6 py-40"
    >
      <p data-reveal className="font-mono text-xs uppercase tracking-[0.35em] text-cyan">
        {chapter.kicker}
      </p>
      <h2
        data-reveal
        className="font-display mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
      >
        {chapter.title}
      </h2>
      <p data-reveal className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/90">
        {chapter.story}
      </p>
      <div data-reveal className="mt-8 max-w-2xl border-l pl-6 hairline">
        <p className="font-mono text-[11px] uppercase tracking-wider text-dim">Method</p>
        <p className="mt-2 text-sm leading-relaxed text-dim">{chapter.method}</p>
      </div>
      <div className="mt-12">
        <StatGrid stats={chapter.stats} />
      </div>
      <div data-reveal className="mt-10 flex flex-wrap items-center gap-4">
        {chapter.links.map((l, i) => (
          <MagneticButton key={l.href} href={l.href} primary={i === 0}>
            {l.label} {i === 0 ? "→" : ""}
          </MagneticButton>
        ))}
        <div className="flex flex-wrap gap-2">
          {chapter.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border px-3 py-1 font-mono text-[11px] text-dim hairline"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
