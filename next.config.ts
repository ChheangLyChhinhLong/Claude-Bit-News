import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.gstatic.com" },
      { protocol: "https", hostname: "www.notebookcheck.net" },
    ],
  },
};

export default nextConfig;
