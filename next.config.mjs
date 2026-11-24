import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages cannot run the default Next.js image optimization
  // server (it needs Node.js sharp). Simplest reliable option:
  images: {
    unoptimized: true,
  },
};

// Bind Cloudflare bindings (D1, KV, etc.) during `next dev` (requires wrangler)
if (process.env.NODE_ENV === "development" && process.env.CLOUDFLARE_DEV_PLATFORM === "1") {
  await setupDevPlatform();
}

export default nextConfig;
