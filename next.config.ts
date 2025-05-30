import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["minio.ntq.ai", "i.pravatar.cc", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
