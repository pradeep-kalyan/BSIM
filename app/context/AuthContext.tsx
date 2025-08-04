"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { logoutUser, getCurrentUser } from "@/app/_actions/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Checking auth status...");

      // Use server action instead of fetch request
      const userData = await getCurrentUser();

      if (userData) {
        console.log("User authenticated:", userData);
        setUser(userData);
      } else {
        // If userData is null, user is not authenticated
        console.log("User not authenticated");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
      console.log("Auth check completed");
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        setUser(null);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      window.location.href = "/login";
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  const checkAuth = async () => {
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
