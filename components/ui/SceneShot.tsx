/**
 * A full-screen cinematic establishing shot.
 * Sticky 100vh film frame: full-bleed backdrop with a scroll-scrubbed
 * camera move (Ken Burns), letterbox bars, vignette, and a centered
 * movie title card. ScrollStory drives [data-shot-img] and [data-title-card].
 */
export default function SceneShot({
  src,
  kicker,
  title,
  index,
}: {
  src: string;
  kicker: string;
  title: string;
  index?: string;
}) {
  return (
    <div className="scene-shot" data-shot>
      <div className="scene-sticky">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" data-shot-img decoding="async" loading="lazy" />
        <div className="scene-scrim" />
        <div className="scene-letterbox scene-letterbox-top" />
        <div className="scene-letterbox scene-letterbox-bottom" />
        <div data-title-card className="scene-title-card">
          {index && (
            <div className="font-mono text-sm tracking-[0.5em] text-cyan/80">{index}</div>
          )}
          <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.45em] text-ink/70">
            {kicker}
          </div>
          <h2 className="font-display mx-auto mt-6 max-w-5xl text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-7xl lg:text-8xl">
            {title}
          </h2>
          <div className="mx-auto mt-8 h-px w-24 bg-gradient-to-r from-cyan to-violet" />
        </div>
      </div>
    </div>
  );
}
