"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NEAR = 9.5; // wrap plane (just past camera at z=10)
const FAR = -6;

type Props = {
  count?: number;
  size?: number;
  opacity?: number;
  baseSpeed?: number;
  warpBoost?: number;
  color?: string;
  wander?: number; // lateral drift amount — big motes float around
};

/**
 * The flight layer: dust that streams past the camera so the page always
 * feels like moving through space — and hits warp speed while you scroll.
 * Configurable so it can run as fine fast dust (back) or big soft
 * transparent motes (front).
 */
export default function DustStream({
  count = 2400,
  size = 0.035,
  opacity = 0.55,
  baseSpeed = 0.35,
  warpBoost = 26,
  color = "#9fdcff",
  wander = 0,
}: Props) {
  const points = useRef<THREE.Points>(null!);
  const lastScroll = useRef(0);
  const warp = useRef(0);
  const seeds = useRef<Float32Array | null>(null);

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = FAR + Math.random() * (NEAR - FAR);
      sd[i] = Math.random() * Math.PI * 2;
    }
    seeds.current = sd;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 40);
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size,
      sizeAttenuation: true,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const scrollY = typeof window === "undefined" ? 0 : window.scrollY;
    const v = Math.abs(scrollY - lastScroll.current) / Math.max(delta, 1e-4); // px/s
    lastScroll.current = scrollY;
    // smooth the warp factor: 0 idle → ~1 fast scroll
    const target = Math.min(1, v / 2600);
    warp.current += (target - warp.current) * Math.min(1, delta * 5);

    const speed = baseSpeed + warp.current * warpBoost;
    const arr = (geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    const sd = seeds.current!;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += speed * delta;
      if (wander > 0) {
        arr[i * 3] += Math.sin(t * 0.5 + sd[i]) * wander * delta;
        arr[i * 3 + 1] += Math.cos(t * 0.4 + sd[i] * 1.7) * wander * 0.7 * delta;
      }
      if (arr[i * 3 + 2] > NEAR) {
        arr[i * 3] = (Math.random() - 0.5) * 26;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
        arr[i * 3 + 2] = FAR;
      }
    }
    (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    material.opacity = opacity * (0.75 + warp.current * 0.6);
    material.size = size * (1 + warp.current * 2.2);
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
