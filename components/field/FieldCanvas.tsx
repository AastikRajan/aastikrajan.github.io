"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { detectTier, PARTICLES, Tier } from "@/lib/tier";
import ParticleField from "./ParticleField";
import DustStream from "./DustStream";
import { Moon, Gems } from "./Ambient";

/**
 * The persistent field behind the entire site.
 * high/mid → WebGL particle field. low → static CSS starfield (no JS anim).
 */
export default function FieldCanvas() {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    setTier(detectTier());
  }, []);

  if (tier === null) return <div className="fixed inset-0 -z-10 bg-space" />;

  if (tier === "low") {
    return (
      <div className="fixed inset-0 -z-10 bg-space" aria-hidden>
        <div className="static-stars" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 bg-space" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ParticleField count={PARTICLES[tier]} />
        <DustStream count={2600} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 8]} intensity={0.8} color="#bfd8ff" />
        <Moon />
        <Gems />
      </Canvas>
    </div>
  );
}
