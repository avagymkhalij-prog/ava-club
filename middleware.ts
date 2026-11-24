import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Plain middleware using getToken — no withAuth wrapper.
 *
 * withAuth's automatic signIn redirect chains `callbackUrl` onto the sign-in
 * URL on every pass, which produced the nested callbackUrl / infinite
 * redirect loop. This version builds each redirect target explicitly and
 * never appends a callbackUrl, breaking the loop.
 *
 * Rules:
 * - Public routes (/ , /login , /register , /classes...) are never blocked.
 * - Unauthenticated user on /dashboard or /admin → /login (clean, no params).
 * - Authenticated non-admin on /admin → /dashboard.
 * - Authenticated user on /login or /register → /dashboard (admin → /admin).
 */

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const isAdmin = token?.role === "ADMIN";

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // 1. Signed-in users should not see the login/register pages.
  if (isAuthPage && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = isAdmin ? "/admin" : "/dashboard";
    url.search = ""; // strip any callbackUrl params — breaks nesting
    return NextResponse.redirect(url);
  }

  // 2. Unauthenticated users hitting protected pages → clean /login redirect.
  if (isProtected && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = ""; // no callbackUrl → no nested params, no loop
    return NextResponse.redirect(url);
  }

  // 3. Only ADMIN can enter /admin.
  if (pathname.startsWith("/admin") && isAuthenticated && !isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
