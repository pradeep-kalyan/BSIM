"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const SimulationContext = createContext<{
  simId: string | null;
  comId: string | null;
  period: number | null;
  isHydrated: boolean;
  setSimId: (id: string) => void;
  setComId: (id: string) => void;
  setPeriod: (id: number) => void;
  clearSimId: () => void;
  clearComId: () => void;
  clearAll: () => void;
}>({
  simId: null,
  comId: null,
  period: null,
  isHydrated: false,
  setSimId: () => {},
  setComId: () => {},
  setPeriod: () => {},
  clearSimId: () => {},
  clearComId: () => {},
  clearAll: () => {},
});

export const SimulationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [simId, setSimIdState] = useState<string | null>(null);
  const [comId, setComIdState] = useState<string | null>(null);
  const [period, setPeriodState] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from cookies on first load - only on client side
  useEffect(() => {
    setIsHydrated(true);
    const sim = Cookies.get("simId");
    const com = Cookies.get("comId");
    const period = Cookies.get("period");


    if (sim) setSimIdState(sim);
    if (com) setComIdState(com);
    if (period) setPeriodState(parseInt(period));
  }, []);

  const setPeriodInternal = React.useCallback((id: number) => {
    setPeriodState((prevId) => {
      if (prevId === id) return prevId; // Prevent unnecessary state updates

      // Set cookie to expire in 6 hours (0.25 days)
      Cookies.set("period", id.toString(), {
        expires: 0.25,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      return id;
    });
  }, []);

  const setCurrentPeriodWrapper = React.useCallback(
    (period: number) => {
      setPeriodInternal(period);
      Cookies.set("currentPeriod", period.toString(), {
        expires: 0.25,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    },
    [setPeriodInternal]
  );

  const setSimId = React.useCallback((id: string) => {
    setSimIdState((prevId) => {
      if (prevId === id) return prevId; // Prevent unnecessary state updates

      // Set cookie to expire in 6 hours (0.25 days)
      Cookies.set("simId", id, {
        expires: 0.25,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      return id;
    });
  }, []);

  const setComId = React.useCallback((id: string) => {
    setComIdState((prevId) => {
      if (prevId === id) return prevId; // Prevent unnecessary state updates

      // Set cookie to expire in 6 hours (0.25 days)
      Cookies.set("comId", id, {
        expires: 0.25,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      return id;
    });
  }, []);

  const clearSimId = React.useCallback(() => {
    setSimIdState(null);
    Cookies.remove("simId");
  }, []);

  const clearComId = React.useCallback(() => {
    setComIdState(null);
    Cookies.remove("comId");
  }, []);

  const clearPeriod = React.useCallback(() => {
    setPeriodState(null);
    Cookies.remove("period");
  }, []);

  const clearAll = React.useCallback(() => {
    clearSimId();
    clearComId();
    clearPeriod();
  }, [clearSimId, clearComId, clearPeriod]);

  const contextValue = React.useMemo(
    () => ({
      simId,
      comId,
      period,
      isHydrated,
      setSimId,
      setComId,
      setPeriod: setCurrentPeriodWrapper,
      clearSimId,
      clearComId,
      clearAll,
    }),
    [
      simId,
      comId,
      period,
      isHydrated,
      setSimId,
      setComId,
      setCurrentPeriodWrapper,
      clearSimId,
      clearComId,
      clearAll,
    ]
  );

  return (
    <SimulationContext.Provider value={contextValue}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);

export default SimulationContext;
