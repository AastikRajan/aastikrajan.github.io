// Higgs field fragment shader — soft additive sprites.
// noise = cool monochrome; signal = cyan → violet energy gradient.
uniform float uTime;

varying float vSignal;
varying float vSeed;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  float glow = smoothstep(0.5, 0.0, r);
  glow = pow(glow, 2.2);

  // monochrome dust
  vec3 dust = vec3(0.42, 0.47, 0.55);
  // energy gradient: cyan (#22D3EE) → violet (#8B5CF6), shifting per particle
  vec3 cyan = vec3(0.133, 0.827, 0.933);
  vec3 violet = vec3(0.545, 0.361, 0.965);
  vec3 energy = mix(cyan, violet, fract(vSeed * 3.17 + uTime * 0.02));

  vec3 col = mix(dust, energy, vSignal);
  float alpha = glow * (0.28 + vSignal * 0.6);
  float tw = 0.75 + 0.25 * sin(uTime * (1.0 + vSeed * 2.0) + vSeed * 40.0);

  gl_FragColor = vec4(col * tw, alpha * tw);
}
