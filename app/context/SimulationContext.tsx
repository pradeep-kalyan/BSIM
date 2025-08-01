"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

    console.log("Loaded simId:", sim, "comId:", com);

    if (sim) setSimIdState(sim);
    if (com) setComIdState(com);
    if (period) setPeriodState(parseInt(period));
  }, []);
  const setCurrentPeriodWrapper = (period: number) => {
      setPeriod(period);
    Cookies.set("currentPeriod", period.toString(), {
      expires: 0.25,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  };

  const setSimId = (id: string) => {
    setSimIdState(id);
    // Set cookie to expire in 6 hours (0.25 days)
    Cookies.set("simId", id, {
      expires: 0.25,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  };

  const setComId = (id: string) => {
    setComIdState(id);
    // Set cookie to expire in 6 hours (0.25 days)
    Cookies.set("comId", id, {
      expires: 0.25,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  };

  const setPeriod = (id: number) => {
    setPeriodState(id);
    // Set cookie to expire in 6 hours (0.25 days)
    Cookies.set("period", id.toString(), {
      expires: 0.25,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
  };

  const clearSimId = () => {
    setSimIdState(null);
    Cookies.remove("simId");
  };

  const clearComId = () => {
    setComIdState(null);
    Cookies.remove("comId");
  };

  const clearPeriod = () => {
    setPeriodState(null);
    Cookies.remove("period");
  };

  const clearAll = () => {
    clearSimId();
    clearComId();
    clearPeriod();
  };

  return (
    <SimulationContext.Provider
      value={{
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

      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);

export default SimulationContext;
