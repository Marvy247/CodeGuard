import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.test.{js,ts,tsx}": {
        loaders: ["ignore-loader"],
      },
    },
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  // Ignore test files and problematic imports during build
  experimental: {
    turbo: {
      resolveAlias: {
        "thread-stream": false,
      },
    },
  },
};

export default nextConfig;
