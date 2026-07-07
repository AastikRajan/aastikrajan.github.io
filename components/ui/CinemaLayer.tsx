/**
 * Cinematic backdrop (Higgsfield-generated film still) behind a chapter.
 * Screen-blended so pure blacks vanish into the page; masked so edges melt
 * into the void; parallax handled by ScrollStory via [data-cinema].
 */
export default function CinemaLayer({
  src,
  strength = "normal",
}: {
  src: string;
  strength?: "normal" | "bold" | "full";
}) {
  if (strength === "full") {
    // full-bleed film frame: no blend, no mask — just a scrim for legibility
    return (
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          decoding="async"
          data-cinema
          className="h-[112%] w-full object-cover opacity-90"
          style={{ willChange: "transform" }}
        />
        <div className="scene-scrim" />
      </div>
    );
  }
  return (
    <div aria-hidden className="cinema-layer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        data-cinema
        className={strength === "bold" ? "opacity-70" : "opacity-45"}
      />
    </div>
  );
}
