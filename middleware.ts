import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./app/functions/jwt";
// renamed for clarity

const protectedRoutes = ["/homepage", "/simulate", "/simulations"];
const authRoutes = ["/login", "/register"];
const publicRoutes = ["/"];

async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    return await verifyToken(token); // payload has user info
  } catch {
    return null;
  }
}

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname) || pathname.startsWith("/api/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static & auth API requests through
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const user = await verifyAuth(request);
  const isAuthenticated = !!user;

  // Redirect logged-in users away from login/register
  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/simulations", request.url));
  }

  // Block protected routes for unauthenticated users
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Public routes → allow
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", String(user.id));
    requestHeaders.set("x-user-name", String(user.name));
    requestHeaders.set("x-user-role", String(user.role));
    requestHeaders.set("x-user-email", String(user.email));

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
