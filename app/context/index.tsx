// app/context/index.tsx
"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { SimulationProvider } from "./SimulationContext";
import { FormProvider } from "./FormContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SimulationProvider>
        <FormProvider>{children}</FormProvider>
      </SimulationProvider>
    </AuthProvider>
  );
}
