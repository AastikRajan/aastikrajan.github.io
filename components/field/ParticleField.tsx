"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { shapeGenerators, ShapeKey, Shape } from "@/lib/shapes";
import { fieldController } from "./controller";
import vertexShader from "./field.vert";
import fragmentShader from "./field.frag";

/** One draw call. All morphing happens on the GPU; JS only swaps target buffers. */
export default function ParticleField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null!);
  const applied = useRef<{ from: ShapeKey; to: ShapeKey }>({ from: "noise", to: "noise" });
  const shapeCache = useRef(new Map<ShapeKey, Shape>());
  const gl = useThree((s) => s.gl);

  const getShape = (key: ShapeKey): Shape => {
    let s = shapeCache.current.get(key);
    if (!s) {
      s = shapeGenerators[key](count);
      shapeCache.current.set(key, s);
    }
    return s;
  };

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const init = getShape("noise");
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = Math.random();

    // `position` must exist for bounding computations; mirror aFrom.
    geo.setAttribute("position", new THREE.BufferAttribute(init.positions.slice(), 3));
    geo.setAttribute("aFrom", new THREE.BufferAttribute(init.positions.slice(), 3));
    geo.setAttribute("aTo", new THREE.BufferAttribute(init.positions.slice(), 3));
    geo.setAttribute("aSignalFrom", new THREE.BufferAttribute(init.signal.slice(), 1));
    geo.setAttribute("aSignalTo", new THREE.BufferAttribute(init.signal.slice(), 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 30);

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uDrift: { value: 1 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
        uPulse: { value: 0 },
      },
    });
    return { geometry: geo, material: mat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const mouse = useRef(new THREE.Vector2(0, 0));
  const mouseTarget = useRef(new THREE.Vector2(0, 0));

  useMemo(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("pointermove", (e) => {
      mouseTarget.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    });
  }, []);

  useFrame((_, delta) => {
    const st = fieldController.get();
    const u = material.uniforms;

    // swap morph buffers only when the segment changes
    if (applied.current.from !== st.from || applied.current.to !== st.to) {
      const from = getShape(st.from);
      const to = getShape(st.to);
      (geometry.getAttribute("aFrom") as THREE.BufferAttribute).copyArray(from.positions).needsUpdate = true;
      (geometry.getAttribute("aTo") as THREE.BufferAttribute).copyArray(to.positions).needsUpdate = true;
      (geometry.getAttribute("aSignalFrom") as THREE.BufferAttribute).copyArray(from.signal).needsUpdate = true;
      (geometry.getAttribute("aSignalTo") as THREE.BufferAttribute).copyArray(to.signal).needsUpdate = true;
      applied.current = { from: st.from, to: st.to };
    }

    u.uTime.value += delta;
    // ease the scrubbed value slightly so fast scrolls stay silky
    u.uMorph.value += (st.t - u.uMorph.value) * Math.min(1, delta * 8);
    u.uDrift.value = fieldController.drift();
    u.uPulse.value = fieldController.pulse();

    mouse.current.lerp(mouseTarget.current, Math.min(1, delta * 4));
    u.uMouse.value.copy(mouse.current);
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
