// app/hooks/useHydration.ts
"use client";

import { useEffect, useState } from "react";

/**
 * Hook to prevent hydration mismatches by ensuring client-side only rendering
 * Returns false on server-side and initial client render, true after hydration
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook for safely accessing browser APIs that might cause hydration issues
 * Returns null/undefined values during SSR and initial render
 */
export function useSafeLocalStorage() {
  const isHydrated = useHydration();

  const getItem = (key: string): string | null => {
    if (!isHydrated || typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  };

  const setItem = (key: string, value: string): void => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }
    localStorage.setItem(key, value);
  };

  const removeItem = (key: string): void => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(key);
  };

  return { getItem, setItem, removeItem };
}

/**
 * Hook for safely accessing session storage
 */
export function useSafeSessionStorage() {
  const isHydrated = useHydration();

  const getItem = (key: string): string | null => {
    if (!isHydrated || typeof window === "undefined") {
      return null;
    }
    return sessionStorage.getItem(key);
  };

  const setItem = (key: string, value: string): void => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }
    sessionStorage.setItem(key, value);
  };

  const removeItem = (key: string): void => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }
    sessionStorage.removeItem(key);
  };

  return { getItem, setItem, removeItem };
}
