import { dossier } from "@/content/chapters";
import CinemaLayer from "@/components/ui/CinemaLayer";
import SceneShot from "@/components/ui/SceneShot";

export default function Play() {
  return (
    <section id="play" data-chapter="play" className="relative">
      <SceneShot
        src="/media/play.jpg"
        kicker="CHAPTER 06 — CLASSIFIED"
        title="Work that isn't public yet"
        index="SCENE 06"
      />
      <div className="story-panel mx-auto flex min-h-[85vh] w-full max-w-5xl flex-col justify-center px-6 py-28">
      <CinemaLayer src="/media/play.jpg" />
      <p data-reveal className="font-mono text-xs uppercase tracking-[0.35em] text-violet">
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
