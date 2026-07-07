"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** A little moon — softly lit crescent drifting in the upper sky. */
export function Moon() {
  const group = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.position.set(-6.6 + Math.sin(t * 0.05) * 0.3, 3.4 + Math.sin(t * 0.11) * 0.2, -3);
    group.current.rotation.y = t * 0.02;
  });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color="#cdd6e4" roughness={0.95} metalness={0} />
      </mesh>
      {/* halo */}
      <sprite scale={[3.4, 3.4, 1]}>
        <spriteMaterial
          color="#aebfdd"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* the light that carves the crescent */}
      <directionalLight position={[3, 1.5, 2]} intensity={2.2} color="#eef3ff" />
    </group>
  );
}

/** Small floating gems that twinkle — scattered treasure in the field. */
export function Gems({ count = 12 }: { count?: number }) {
  const group = useRef<THREE.Group>(null!);
  const gems = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        pos: new THREE.Vector3((Math.random() - 0.5) * 17, (Math.random() - 0.5) * 8.5, -2.5 + Math.random() * 3.5),
        scale: 0.07 + Math.random() * 0.09,
        speed: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        color: i % 2 === 0 ? "#22d3ee" : "#8b5cf6",
      })),
    [count]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const g = gems[i];
      child.rotation.x = t * g.speed;
      child.rotation.y = t * g.speed * 1.4;
      const tw = 0.75 + 0.45 * Math.sin(t * g.speed * 2.4 + g.phase); // twinkle
      child.scale.setScalar(g.scale * tw);
      child.position.y = g.pos.y + Math.sin(t * 0.5 + g.phase) * 0.35;
      child.position.x = g.pos.x + Math.cos(t * 0.3 + g.phase) * 0.25;
    });
  });

  return (
    <group ref={group}>
      {gems.map((g, i) => (
        <mesh key={i} position={g.pos}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={g.color}
            emissive={g.color}
            emissiveIntensity={1.6}
            toneMapped={false}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

const STAR_N = 5;

/** Occasional shooting stars streaking across the sky. */
export function ShootingStars() {
  const lines = useRef<(THREE.Line | null)[]>([]);
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_N }, () => ({
        head: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        life: -Math.random() * 6, // negative = waiting to spawn
        speed: 0,
      })),
    []
  );

  const reset = (s: (typeof stars)[0]) => {
    s.head.set((Math.random() - 0.5) * 20, 3 + Math.random() * 4, -3 + Math.random() * 2);
    const ang = -0.4 - Math.random() * 0.5;
    s.dir.set(Math.cos(ang) * (Math.random() > 0.5 ? 1 : -1), Math.sin(ang), 0).normalize();
    s.speed = 9 + Math.random() * 7;
    s.life = 0;
  };

  useFrame((_, delta) => {
    stars.forEach((s, i) => {
      s.life += delta;
      if (s.life < 0) return; // still waiting
      if (s.life === 0 || (s.life <= delta && s.speed === 0)) reset(s);
      const line = lines.current[i];
      if (!line) return;
      if (s.life > 1.1) {
        // done — hide and schedule the next one
        (line.material as THREE.LineBasicMaterial).opacity = 0;
        s.life = -(2 + Math.random() * 7);
        s.speed = 0;
        return;
      }
      if (s.speed === 0) reset(s);
      s.head.addScaledVector(s.dir, s.speed * delta);
      const tail = s.head.clone().addScaledVector(s.dir, -1.6);
      const posAttr = line.geometry.getAttribute("position") as THREE.BufferAttribute;
      posAttr.setXYZ(0, s.head.x, s.head.y, s.head.z);
      posAttr.setXYZ(1, tail.x, tail.y, tail.z);
      posAttr.needsUpdate = true;
      const fade = Math.sin(Math.min(1, s.life / 1.1) * Math.PI); // in-out
      (line.material as THREE.LineBasicMaterial).opacity = fade * 0.8;
    });
  });

  return (
    <>
      {stars.map((_, i) => (
        // eslint-disable-next-line react/no-unknown-property
        <line key={i} ref={(el) => { lines.current[i] = el as unknown as THREE.Line; }}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array(6), 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#dff3ff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </>
  );
}

const BIRD_N = 4;

/** A few small birds gliding across, wings beating slowly. */
export function Birds() {
  const group = useRef<THREE.Group>(null!);
  const birds = useMemo(
    () =>
      Array.from({ length: BIRD_N }, () => ({
        y: 1.5 + Math.random() * 3,
        z: -1 - Math.random() * 2,
        x: (Math.random() - 0.5) * 18,
        speed: 0.5 + Math.random() * 0.5,
        flap: 2.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        dirn: Math.random() > 0.5 ? 1 : -1,
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current.children.forEach((b, i) => {
      const bd = birds[i];
      let x = bd.x + t * bd.speed * bd.dirn;
      // wrap around the sky
      x = ((x + 11) % 22 + 22) % 22 - 11;
      b.position.set(x, bd.y + Math.sin(t * 0.7 + bd.phase) * 0.3, bd.z);
      b.scale.x = bd.dirn;
      const wings = b.children as THREE.Object3D[];
      const beat = Math.sin(t * bd.flap + bd.phase) * 0.55;
      if (wings[0]) wings[0].rotation.z = beat;
      if (wings[1]) wings[1].rotation.z = -beat;
    });
  });

  return (
    <group ref={group}>
      {birds.map((_, i) => (
        <group key={i}>
          <mesh position={[-0.09, 0, 0]} rotation={[0, 0, 0.2]}>
            <planeGeometry args={[0.18, 0.045]} />
            <meshBasicMaterial color="#8fa8c8" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.09, 0, 0]} rotation={[0, 0, -0.2]}>
            <planeGeometry args={[0.18, 0.045]} />
            <meshBasicMaterial color="#8fa8c8" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
