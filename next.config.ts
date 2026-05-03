/** @type {import('next').NextConfig} */
const nextConfig: import("next").NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
