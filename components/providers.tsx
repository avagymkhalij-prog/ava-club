"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

/**
 * Client-only providers wrapper.
 * `SessionProvider` uses React context, so it must live inside a
 * Client Component — it cannot be rendered directly from a
 * Server Component like app/layout.tsx.
 */
export default function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
