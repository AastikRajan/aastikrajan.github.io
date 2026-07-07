import { play, dossier } from "@/content/chapters";
import CinemaLayer from "@/components/ui/CinemaLayer";
import SceneShot from "@/components/ui/SceneShot";

export default function Play() {
  return (
    <section id="play" data-chapter="play" className="relative">
      <SceneShot
        src="/media/play.jpg"
        kicker="CHAPTER 06 — PLAY & CLASSIFIED"
        title="Serious engineers also build toys"
        index="SCENE 06"
      />
      <div className="relative mx-auto flex min-h-[100vh] max-w-5xl flex-col justify-center px-6 py-32">
      <CinemaLayer src="/media/play.jpg" />
      <div className="grid gap-4 sm:grid-cols-2">
        {play.map((g) => (
          <a
            key={g.title}
            data-reveal
            href={g.href}
            target="_blank"
            rel="noreferrer"
            className="glass group rounded-2xl p-6 transition-colors hover:bg-[rgba(232,234,240,0.06)]"
          >
            <h3 className="font-display text-xl font-semibold">
              {g.title} <span className="text-dim transition-transform group-hover:translate-x-1">→</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dim">{g.what}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-dim">{g.tech}</p>
          </a>
        ))}
      </div>

      <p data-reveal className="mt-16 font-mono text-xs uppercase tracking-[0.35em] text-violet">
        // classified — available on request
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {dossier.map((d) => (
          <div key={d.title} data-reveal className="glass rounded-2xl border-dashed p-6">
            <h3 className="font-display text-lg font-semibold text-ink/90">{d.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-dim">{d.what}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-dim">{d.tech}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
