import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Minimal OpenNext Cloudflare configuration.
 *
 * - No R2/KV incremental cache: the app uses a D1 database via Prisma and
 *   doesn't rely on Next.js ISR cache persistence, so the default (in-memory)
 *   cache is sufficient and keeps the deployment free-plan friendly.
 * - Default tag cache and queue: required by the Next.js revalidation APIs.
 */
export default defineCloudflareConfig({
  incrementalCache: "dummy",
  tagCache: "dummy",
  queue: "dummy",
});
