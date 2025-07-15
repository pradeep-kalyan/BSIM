// app/context/index.tsx
"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { SimulationProvider } from "./SimulationContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SimulationProvider>{children}</SimulationProvider>
    </AuthProvider>
  );
}
