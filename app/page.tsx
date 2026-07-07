import FieldCanvas from "@/components/field/FieldCanvas";
import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollStory from "@/components/motion/ScrollStory";
import Preloader from "@/components/chapters/Preloader";
import Hero from "@/components/chapters/Hero";
import ChapterSection from "@/components/chapters/ChapterSection";
import Path from "@/components/chapters/Path";
import Play from "@/components/chapters/Play";
import Signal from "@/components/chapters/Signal";
import { chapters } from "@/content/chapters";

/**
 * Signal in the Noise — one scroll, one particle field, eight signals.
 * Section order MUST match morphSequence in components/field/controller.ts.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <ScrollStory>
        <Preloader />
        <FieldCanvas />
        <main>
          <Hero />
          {chapters.map((c, i) => (
            <ChapterSection key={c.id} chapter={c} sceneIndex={`SCENE 0${i + 1}`} />
          ))}
          <Path />
          <Play />
          <Signal />
        </main>
      </ScrollStory>
    </SmoothScroll>
  );
}
