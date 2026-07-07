"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { detectTier, Tier } from "@/lib/tier";
import Lantern3D from "./Lantern3D";
import DustStream from "./DustStream";
import { ShootingStars, Birds } from "./Ambient";

/**
 * The FOREGROUND cinema layer: transparent, fixed on top of all sections
 * (below grain/vignette). The lantern character, big soft dust motes,
 * shooting stars and birds fly OVER the story.
 */
export default function FrontCanvas() {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    setTier(detectTier());
  }, []);

  if (tier === null || tier === "low") return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 8]} intensity={0.8} color="#bfd8ff" />
        {/* big soft transparent motes drifting around the viewer */}
        <DustStream count={420} size={0.26} opacity={0.12} baseSpeed={0.18} warpBoost={9} wander={0.5} color="#cfe6ff" />
        <ShootingStars />
        <Birds />
        <Lantern3D />
      </Canvas>
    </div>
  );
}
