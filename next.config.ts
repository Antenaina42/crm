import type { NextConfig } from "next";

// Restrict Tokio and Node thread counts to prevent OS error 11 on resource-constrained build environments
process.env.TOKIO_WORKER_THREADS = process.env.TOKIO_WORKER_THREADS || "1";
process.env.NEXT_CPU_COUNT = process.env.NEXT_CPU_COUNT || "1";
process.env.UV_THREADPOOL_SIZE = process.env.UV_THREADPOOL_SIZE || "1";

const defaultDbUrl = "mysql://u697568943_crm:Antenaina23@localhost:3306/u697568943_crm";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL || defaultDbUrl,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "m-it-levelup-secret-key-2026-super-secure-crm",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "https://crm.m-itlevelup.com",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
