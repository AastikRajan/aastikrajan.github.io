import { path } from "@/content/chapters";
import CinemaLayer from "@/components/ui/CinemaLayer";
import SceneShot from "@/components/ui/SceneShot";

export default function Path() {
  return (
    <section id="path" data-chapter="path" className="relative">
      <SceneShot
        src="/media/path.jpg"
        kicker="CHAPTER 05 — THE PATH"
        title="From a satellite dish to a research lab"
        index="SCENE 05"
      />
      <div className="relative mx-auto flex min-h-[100vh] max-w-5xl flex-col justify-center px-6 py-32">
      <CinemaLayer src="/media/path.jpg" />
      <div className="space-y-0">
        {path.map((stop, i) => (
          <div
            key={stop.place}
            data-reveal
            className="group grid grid-cols-[80px_1fr] gap-6 border-t py-8 hairline sm:grid-cols-[120px_1fr]"
          >
            <div className="font-mono text-sm text-cyan">{stop.year}</div>
            <div>
              <h3 className="font-display text-xl font-semibold sm:text-2xl">{stop.place}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dim">{stop.what}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
