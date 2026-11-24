import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Prisma 7 uses driver adapters:
 * - Cloudflare Pages / Edge → PrismaD1 with the D1 binding
 * - Local dev / Node → PrismaLibSql against the local SQLite file
 */

type Env = { DB?: unknown };

const DATABASE_URL =
  process.env.DATABASE_URL?.replace("file:./", "file:./prisma/") ??
  "file:./prisma/dev.db";

let cachedNodeClient: PrismaClient | undefined;
let cachedEdgeClient: PrismaClient | undefined;

/**
 * For Cloudflare Pages Functions. Called lazily per-request context.
 * Usage in a route handler:
 *   import { getRequestContext } from "@cloudflare/next-on-pages";
 *   const prisma = getPrismaWithD1(getRequestContext().env);
 */
export function getPrismaWithD1(env: Env): PrismaClient {
  if (!env.DB) {
    throw new Error(
      "D1 binding `DB` not found. Check wrangler.toml and your Pages deployment."
    );
  }
  if (!cachedEdgeClient) {
    const adapter = new PrismaD1(env.DB as never);
    cachedEdgeClient = new PrismaClient({ adapter });
  }
  return cachedEdgeClient;
}

function createPrisma(): PrismaClient {
  const isCloudflare = process.env.NEXT_RUNTIME === "edge" || process.env.CF_PAGES === "1";

  if (isCloudflare) {
    // On Cloudflare Pages the request context is injected by next-on-pages.
    const helper = (
      globalThis as Record<string, unknown>
    ).__nextOnPagesgetRequestContext as (() => { env: Env }) | undefined;

    if (helper) {
      return getPrismaWithD1(helper().env);
    }
    throw new Error(
      "Cloudflare request context is not available in this runtime."
    );
  }

  // Standard Node.js PrismaClient (libSQL adapter → local SQLite in dev)
  if (!cachedNodeClient) {
    const adapter = new PrismaLibSql({ url: DATABASE_URL } as never);
    cachedNodeClient = new PrismaClient({ adapter });
  }
  return cachedNodeClient;
}

// Reuse a single PrismaClient instance across hot reloads in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
