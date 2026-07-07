"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

const GLB_PATH = "/models/lantern.glb";

/** The hero's character: a glowing lantern that bobs, glows, and rises away as you scroll. */
function LanternRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  const light = useRef<THREE.PointLight>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scroll = typeof window === "undefined" ? 0 : window.scrollY;
    const vh = typeof window === "undefined" ? 800 : window.innerHeight;
    const p = Math.min(1, scroll / (vh * 1.2)); // scrolled past hero → 1

    // rises up and away as the story starts; gentle idle bob + sway
    group.current.position.set(
      3.4 + Math.sin(t * 0.4) * 0.15,
      0.6 + Math.sin(t * 0.8) * 0.18 + p * 9,
      2.2
    );
    group.current.rotation.y = t * 0.25;
    // breathing glow
    if (light.current) light.current.intensity = 6 + Math.sin(t * 1.7) * 1.5;
  });

  return (
    <group ref={group} scale={0.9}>
      {children}
      <pointLight ref={light} color="#ffb35c" distance={10} decay={2} />
      {/* warm rim light just outside the shell so the paper reads at night */}
      <pointLight position={[1.6, 0.8, 1.6]} color="#ffc98a" intensity={3} distance={6} decay={2} />
    </group>
  );
}

function GlbLantern() {
  const { scene } = useGLTF(GLB_PATH);
  // normalize: center the model and scale to ~1.5 world units tall
  const prepared = useRef<THREE.Group | null>(null);
  if (!prepared.current) {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 2.1 / Math.max(size.x, size.y, size.z, 1e-6);
    // paper lanterns glow from inside: reuse the diffuse map as an emissive map
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.isMeshStandardMaterial) {
          mat.emissive = new THREE.Color("#ff9540");
          mat.emissiveMap = mat.map ?? null;
          mat.emissiveIntensity = 2.8;
          mat.toneMapped = false; // let the paper burn through ACES
          mat.needsUpdate = true;
        }
      }
    });
    const g = new THREE.Group();
    scene.position.sub(center);
    g.add(scene);
    g.scale.setScalar(s);
    prepared.current = g;
  }
  return <primitive object={prepared.current} />;
}

/** Procedural fallback: paper-glow shell + inner flame. Always available. */
function ProceduralLantern() {
  return (
    <group>
      {/* paper shell */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color="#ff9d45"
          emissive="#ff7a1a"
          emissiveIntensity={4}
          transparent
          opacity={0.9}
          roughness={0.6}
        />
      </mesh>
      {/* inner flame core */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#ffe8b0" />
      </mesh>
      {/* top + bottom rims */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.1, 16]} />
        <meshStandardMaterial color="#5a2e12" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.26, 0.18, 0.1, 16]} />
        <meshStandardMaterial color="#5a2e12" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function Lantern3D() {
  const [mode, setMode] = useState<"none" | "glb" | "procedural">("none");

  useEffect(() => {
    fetch(GLB_PATH, { method: "HEAD" })
      .then((r) => setMode(r.ok ? "glb" : "procedural"))
      .catch(() => setMode("procedural"));
  }, []);

  if (mode === "none") return null;

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <LanternRig>
        {mode === "glb" ? (
          <Suspense fallback={<ProceduralLantern />}>
            <GlbLantern />
          </Suspense>
        ) : (
          <ProceduralLantern />
        )}
      </LanternRig>
    </Float>
  );
}
