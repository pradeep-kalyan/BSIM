import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["tse1.mm.bing.net", "example.com"],
  },
};

export default nextConfig;
