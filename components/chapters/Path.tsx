import { path } from "@/content/chapters";
import CinemaLayer from "@/components/ui/CinemaLayer";

export default function Path() {
  return (
    <section
      id="path"
      data-chapter="path"
      className="relative mx-auto flex min-h-[140vh] max-w-5xl flex-col justify-center px-6 py-40"
    >
      <CinemaLayer src="/media/path.jpg" />
      <p data-reveal className="font-mono text-xs uppercase tracking-[0.35em] text-cyan">
        CHAPTER 05 — THE PATH
      </p>
      <h2
        data-reveal
        className="font-display mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
      >
        From a satellite dish
        <br />
        to a research lab
      </h2>
      <div className="mt-16 space-y-0">
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
    </section>
  );
}
