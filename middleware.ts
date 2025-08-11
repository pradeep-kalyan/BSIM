import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./app/functions/jwt";

// Routes that require authentication
const protectedRoutes = [
  "/homepage",
  "/management",
  "/market",
  "/performance",
  "/products",
  "/profile",
  "/simulations",
];

// Routes that should redirect to homepage if user is authenticated
const authRoutes = ["/login", "/register"];

// Public routes that don't require authentication
const publicRoutes = ["/"];

/**
 * Get JWT secret for token verification
 */

/**
 * Verify JWT token from cookies
 */
async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);

    return payload;
  } catch {
    return null;
  }
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.includes(pathname) || pathname.startsWith("/api/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const user = await verifyAuth(request);
  const isAuthenticated = !!user;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/simulations", request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Add user info to headers for server components
  if (isAuthenticated && user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id as string);
    requestHeaders.set("x-user-name", user.name as string);
    requestHeaders.set("x-user-role", user.role as string);
    requestHeaders.set("x-user-email", user.email as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
