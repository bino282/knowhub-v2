import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["minio.ntq.ai"],
  },
};

export default nextConfig;
