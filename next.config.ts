import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      "minio.ntq.ai",
      "i.pravatar.cc",
      "lh3.googleusercontent.com",
      "chatntq.ntq.ai",
    ],
  },
  experimental: {
    serverActions: {
      // Set your desired size limit (e.g., 2MB, 4MB, etc.)
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
