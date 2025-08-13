// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./app/functions/jwt";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs"; // Prisma only works in Node runtime

// Initialize Prisma client for middleware
const prisma = new PrismaClient();

// Authentication control
const protectedRoutes = ["/homepage", "/simulate", "/simulations"];
const authRoutes = ["/login", "/register"];
const publicRoutes = ["/"];

async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname) || pathname.startsWith("/api/public/");
}

/**
 * Optimized: Check whether user has access to simulation or company
 */
async function checkAccess(userId: string, pathname: string) {
  try {
    // /simulations/[simulationID]
    const simMatch = pathname.match(/^\/simulations\/([^\/]+)/);
    if (simMatch) {
      const simulationId = simMatch[1];

      const sim = await prisma.simulation.findUnique({
        where: { id: simulationId },
        select: {
          created_by: true,
          simulation_access: {
            where: { user_id: userId },
            select: { id: true },
          },
        },
      });

      return sim?.created_by === userId || (sim?.simulation_access.length ?? 0) > 0;
    }

    // /homepage/[companyID] or /simulate/[companyID]
    const companyMatch = pathname.match(/^\/(?:homepage|simulate)\/([^\/]+)/);
    if (companyMatch) {
      const companyId = companyMatch[1];

      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
          user_id: true,
          simulation_id: true,
          company_access: {
            where: { user_id: userId },
            select: { id: true },
          },
          simulation: {
            select: {
              created_by: true,
              simulation_access: {
                where: { user_id: userId },
                select: { id: true },
              },
            },
          },
        },
      });

      if (!company) return false;

      return (
        company.user_id === userId ||
        (company.company_access.length ?? 0) > 0 ||
        company.simulation.created_by === userId ||
        (company.simulation.simulation_access.length ?? 0) > 0
      );
    }

    return true; // No specific restriction
  } catch (error) {
    console.error("Access check error:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files & auth provider routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/auth/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const user = await verifyAuth(request);
    const isAuthenticated = !!user;

    // Redirect logged-in users away from login/register
    if (isAuthRoute(pathname) && isAuthenticated) {
      return NextResponse.redirect(new URL("/simulations", request.url));
    }

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute(pathname) && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Allow public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Check simulation/company access
    if (isAuthenticated && user) {
      const hasAccess = await checkAccess(user.id as string, pathname);
      if (!hasAccess) {
        const errorUrl = new URL("/simulations", request.url);
        errorUrl.searchParams.set("error", "access_denied");
        return NextResponse.redirect(errorUrl);
      }

      // Attach user info for server-side access
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", user.id as string);
      requestHeaders.set("x-user-name", user.name as string);
      requestHeaders.set("x-user-role", user.role as string);
      requestHeaders.set("x-user-email", user.email as string);

      return NextResponse.next({ request: { headers: requestHeaders } });
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    if (isProtectedRoute(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
