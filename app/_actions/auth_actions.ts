// app/_actions/auth_actions.ts
"use server";

import { redirect } from "next/navigation";
import { getAuthenticatedUser, JWTPayload } from "@/app/functions/jwt";

/**
 * Checks if the user is authenticated and redirects to login if not
 * @returns Promise resolving to the authenticated user or redirects to login
 */
export async function checkAuthStatus(): Promise<JWTPayload> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Verifies admin role authorization
 * @returns Promise resolving to the authenticated user if admin, or redirects
 */
export async function checkAdminStatus(): Promise<JWTPayload> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
}
