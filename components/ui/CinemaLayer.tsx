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
  strength?: "normal" | "bold";
}) {
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
