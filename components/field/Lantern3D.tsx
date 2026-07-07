"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";

const GLB_PATH = "/models/lantern.glb";

const TRAIL = 140;

/**
 * The guide character: a glowing lantern that FLIES with you through the
 * whole story — swooping figure-eights across the journey, banking into
 * turns, shedding a warm ember trail.
 */
function LanternRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const prev = useRef(new THREE.Vector3(3.4, 0.6, 2.2));
  const trailGeo = useRef<THREE.BufferGeometry>(null!);
  const trailPos = useRef(new Float32Array(TRAIL * 3));
  const trailInit = useRef(false);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const scrollY = typeof window === "undefined" ? 0 : window.scrollY;
    const doc = typeof document === "undefined" ? null : document.documentElement;
    const total = doc ? Math.max(1, doc.scrollHeight - window.innerHeight) : 1;
    const p = Math.min(1, scrollY / total); // 0..1 across the whole film

    // flight path: swooping arcs across the journey + idle bob
    const x = Math.sin(p * Math.PI * 5) * 4.6 + Math.sin(t * 0.5) * 0.2;
    const y = Math.cos(p * Math.PI * 4) * 2.4 + Math.sin(t * 0.9) * 0.22;
    const z = 1.6 + Math.sin(p * Math.PI * 3) * 1.3;
    const pos = new THREE.Vector3(x, y, z);
    group.current.position.copy(pos);

    // banking: lean into horizontal motion like a real flyer
    const vx = (pos.x - prev.current.x) / Math.max(delta, 1e-4);
    const vy = (pos.y - prev.current.y) / Math.max(delta, 1e-4);
    const bank = THREE.MathUtils.clamp(-vx * 0.04, -0.6, 0.6);
    const pitch = THREE.MathUtils.clamp(vy * 0.02, -0.35, 0.35);
    group.current.rotation.set(pitch, t * 0.35, bank);

    // ember trail: shift history back, head follows the lantern
    const arr = trailPos.current;
    if (!trailInit.current) {
      for (let i = 0; i < TRAIL; i++) pos.toArray(arr, i * 3);
      trailInit.current = true;
    }
    for (let i = TRAIL - 1; i > 0; i--) {
      arr[i * 3] = arr[(i - 1) * 3];
      arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
      arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
    }
    // slight droop + scatter so it reads as embers, not a rope
    arr[0] = pos.x + (Math.random() - 0.5) * 0.06;
    arr[1] = pos.y - 0.55 + (Math.random() - 0.5) * 0.06;
    arr[2] = pos.z;
    if (trailGeo.current) {
      (trailGeo.current.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    }

    prev.current.copy(pos);
    if (light.current) light.current.intensity = 6 + Math.sin(t * 1.7) * 1.5;
  });

  return (
    <>
      <group ref={group} scale={0.9}>
        {children}
        <pointLight ref={light} color="#ffb35c" distance={10} decay={2} />
        <pointLight position={[1.6, 0.8, 1.6]} color="#ffc98a" intensity={3} distance={6} decay={2} />
      </group>
      {/* ember trail */}
      <points frustumCulled={false}>
        <bufferGeometry ref={trailGeo}>
          <bufferAttribute attach="attributes-position" args={[trailPos.current, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffb35c"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
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
