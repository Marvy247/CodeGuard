import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { isServer }) => {
    config.externals.push(
      "pino-pretty",
      "pino",
      "thread-stream", 
      "lokijs",
      "encoding",
      "worker_threads"
    );
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      worker_threads: false,
    };
    return config;
  },
  // Output standalone for easier deployment
  output: "standalone",
};

export default nextConfig;
