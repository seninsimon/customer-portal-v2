import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meridian.ociuzerp.in",
        port: "",
        pathname: "/media/**"
      },
      {
        protocol: "https",
        hostname: "dev.meridian.ociuzerp.in",
        port: "",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
