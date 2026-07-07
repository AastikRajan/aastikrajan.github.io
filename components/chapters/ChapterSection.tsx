import type { Chapter } from "@/content/chapters";
import StatGrid from "@/components/ui/StatGrid";
import MagneticButton from "@/components/ui/MagneticButton";
import CinemaLayer from "@/components/ui/CinemaLayer";
import SceneShot from "@/components/ui/SceneShot";

/**
 * A film chapter: full-screen establishing shot (title card, camera move)
 * → story panel rises over it with method, results, links.
 */
export default function ChapterSection({
  chapter,
  sceneIndex,
}: {
  chapter: Chapter;
  sceneIndex: string;
}) {
  return (
    <section id={chapter.id} data-chapter={chapter.id} className="relative">
      <SceneShot
        src={`/media/${chapter.id}.jpg`}
        kicker={chapter.kicker}
        title={chapter.title}
        index={sceneIndex}
      />

      <div className="relative flex min-h-[110vh] flex-col justify-center py-32">
        <CinemaLayer src={`/media/${chapter.id}.jpg`} />
        <div className="mx-auto w-full max-w-5xl px-6">
          <p data-reveal className="max-w-2xl text-xl leading-relaxed text-ink/95 sm:text-2xl">
            {chapter.story}
          </p>
          <div data-reveal className="mt-10 max-w-2xl border-l pl-6 hairline">
            <p className="font-mono text-[11px] uppercase tracking-wider text-cyan">Method</p>
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
        </div>
      </div>
    </section>
  );
}
