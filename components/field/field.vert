// Higgs field vertex shader — morphs between two shapes with organic stagger,
// curl-ish drift in the un-formed state, and mouse repulsion.
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSignalFrom;
attribute float aSignalTo;
attribute float aSeed;

uniform float uTime;
uniform float uMorph;      // 0 → aFrom, 1 → aTo (scroll-scrubbed)
uniform float uDrift;      // how much free drift (1 in noise state, ~0.15 when formed)
uniform vec2 uMouse;       // NDC mouse
uniform float uPixelRatio;
uniform float uPulse;      // beacon breathing, 0 normally

varying float vSignal;
varying float vSeed;

// cheap 3d noise-ish drift from trig stacks (no texture fetch)
vec3 drift(vec3 p, float t, float seed) {
  float s = seed * 43.7;
  return vec3(
    sin(t * 0.31 + s + p.y * 0.45) + sin(t * 0.17 + s * 2.0 + p.z * 0.3),
    cos(t * 0.23 + s + p.x * 0.35) + sin(t * 0.13 + s * 3.0 + p.z * 0.5),
    sin(t * 0.19 + s + p.x * 0.25) * 0.6
  ) * 0.35;
}

void main() {
  // per-particle staggered morph — organic reformation, not a lockstep tween
  float edge0 = aSeed * 0.35;
  float edge1 = 0.65 + aSeed * 0.35;
  float m = smoothstep(edge0, edge1, uMorph);

  vec3 pos = mix(aFrom, aTo, m);
  float sig = mix(aSignalFrom, aSignalTo, m);

  // free drift, damped where the particle is "signal" (formed shapes hold still-er)
  float driftAmp = uDrift * (1.0 - sig * 0.75);
  pos += drift(pos, uTime, aSeed) * driftAmp;

  // beacon breathing
  pos *= 1.0 + uPulse * 0.06 * sin(uTime * 2.2 + aSeed * 6.28);

  // mouse repulsion in view plane
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vec2 ndc = mv.xy / -mv.z; // approx
  vec2 toMouse = ndc - uMouse * 0.6;
  float d = length(toMouse);
  float push = smoothstep(0.35, 0.0, d) * 0.55;
  mv.xy += normalize(toMouse + 1e-4) * push;

  gl_Position = projectionMatrix * mv;

  float size = (0.6 + aSeed * 1.1) * (1.0 + sig * 1.3);
  gl_PointSize = size * uPixelRatio * (14.0 / -mv.z);

  vSignal = sig;
  vSeed = aSeed;
}
