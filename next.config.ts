import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export → GitHub Pages (root user site, no basePath needed)
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // GLSL shader files imported as raw strings
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
