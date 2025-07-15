// app/hooks/useRequireAuth.ts
"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to require authentication for client components
 * Redirects to login page if user is not authenticated
 */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useRedirectIfAuthenticated() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/simulations");
    }
  }, [user, loading, router]);

  return { user, loading };
}
