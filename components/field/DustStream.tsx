"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 1800;
const NEAR = 9.5; // wrap plane (just past camera at z=10)
const FAR = -6;

/**
 * The flight layer: dust that streams past the camera so the page always
 * feels like moving through space — and hits warp speed while you scroll.
 */
export default function DustStream() {
  const points = useRef<THREE.Points>(null!);
  const lastScroll = useRef(0);
  const warp = useRef(0);

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = FAR + Math.random() * (NEAR - FAR);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 40);
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color("#9fdcff"),
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, []);

  useFrame((_, delta) => {
    const scrollY = typeof window === "undefined" ? 0 : window.scrollY;
    const v = Math.abs(scrollY - lastScroll.current) / Math.max(delta, 1e-4); // px/s
    lastScroll.current = scrollY;
    // smooth the warp factor: 0 idle → ~1 fast scroll
    const target = Math.min(1, v / 2600);
    warp.current += (target - warp.current) * Math.min(1, delta * 5);

    const speed = 0.35 + warp.current * 26; // gentle cruise → warp
    const arr = (geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 2] += speed * delta;
      if (arr[i * 3 + 2] > NEAR) {
        arr[i * 3] = (Math.random() - 0.5) * 24;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
        arr[i * 3 + 2] = FAR;
      }
    }
    (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    // streaks read faster: stretch alpha with warp
    material.opacity = 0.4 + warp.current * 0.5;
    material.size = 0.035 + warp.current * 0.09;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
