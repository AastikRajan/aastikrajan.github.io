"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fieldController, morphSequence } from "@/components/field/controller";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires the scroll narrative:
 * - each `[data-chapter]` section scrubs the field morph seq[i-1] → seq[i]
 * - each `[data-reveal]` element gets a masked rise-in
 * Sections must appear in the same order as morphSequence (hero = index 0).
 */
export default function ScrollStory({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = gsap.utils.toArray<HTMLElement>("[data-chapter]");

    const triggers: ScrollTrigger[] = [];

    if (!reduced) {
      sections.forEach((sec, i) => {
        if (i === 0) return; // hero sits in pure noise
        const from = morphSequence[Math.min(i - 1, morphSequence.length - 1)];
        const to = morphSequence[Math.min(i, morphSequence.length - 1)];
        triggers.push(
          ScrollTrigger.create({
            trigger: sec,
            start: "top 90%",
            end: "top 15%",
            scrub: true,
            onUpdate: (self) => fieldController.set(from, to, self.progress),
          })
        );
      });
    } else {
      // reduced motion: hold the calm noise field, no scrubbing
      fieldController.set("noise", "noise", 0);
    }

    // text reveals
    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { y: reduced ? 0 : 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });

    // cinematic backdrops drift slower than the page — depth
    gsap.utils.toArray<HTMLElement>("[data-cinema]").forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: reduced ? 0 : -6 },
        {
          yPercent: reduced ? 0 : 6,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    // stat counters pop with stagger
    gsap.utils.toArray<HTMLElement>("[data-stats]").forEach((grid) => {
      gsap.fromTo(
        grid.children,
        { y: reduced ? 0 : 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: grid, start: "top 85%" },
        }
      );
    });

    return () => {
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
