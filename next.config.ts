import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: [
      "api.microlink.io", // Microlink Image Preview
    ],
  },
  webpack: (config) => {
    config.resolve.alias["pdfjs-dist/build/pdf.worker"] =
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs";
    return config;
  },
};

export default nextConfig;
