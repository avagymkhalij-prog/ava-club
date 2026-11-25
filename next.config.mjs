/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Workers cannot run the default Next.js image optimization
  // server (it needs Node.js sharp). Simplest reliable option:
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
