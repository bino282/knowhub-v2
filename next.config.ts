import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      "minio.ntq.ai",
      "i.pravatar.cc",
      "lh3.googleusercontent.com",
      "chatdocs.ntq.ai",
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // hoặc "500mb" nếu bạn thực sự cần
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
