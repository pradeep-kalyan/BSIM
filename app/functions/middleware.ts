// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware function for handling authentication and route protection
 * @param request - The incoming request
 * @returns Next.js response or redirects based on auth status
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedPaths = [
    "/homepage",
    "/performance",
    "/market",
    "/dashboard",
    "/profile",
  ];

  // Define auth routes (login/register) that should redirect to dashboard if already logged in
  const authRoutes = ["/login", "/register"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedPaths.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    // Store the original URL to redirect back after login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login/register while already logged in, redirect to dashboard
  if (isAuthRoute && token) {
    // Try to get the callback URL if it exists
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

    if (callbackUrl) {
      return NextResponse.redirect(
        new URL(decodeURI(callbackUrl), request.url)
      );
    }

    return NextResponse.redirect(new URL("/homepage", request.url));
  }

  // Redirect root to homepage or login based on auth status
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/homepage", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Continue with the request for all other cases
  return NextResponse.next();
}

// Configure the middleware to run on specific paths but exclude static files, api routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
