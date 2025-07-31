"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const SimulationContext = createContext<{
  simId: string | null;
  comId: string | null;
  currentPeriod: number | null;
  setSimId: (id: string) => void;
  setComId: (id: string) => void;
  setCurrentPeriod: (period: number) => void;
  clearSimId: () => void;
  clearComId: () => void;
  clearAll: () => void;
}>({
  simId: null,
  comId: null,
  currentPeriod: null,
  setSimId: () => {},
  setComId: () => {},
  setCurrentPeriod: () => {},
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
  const [currentPeriod, setCurrentPeriod] = useState<number | null>(null);
  // Load from cookies on first load
  useEffect(() => {
    const sim = Cookies.get("simId");
    const com = Cookies.get("comId");
    const period = Cookies.get("currentPeriod");
    console.log("Loaded simId:", sim, "comId:", com);

    if (sim) setSimIdState(sim);
    if (com) setComIdState(com);
    if (period) setCurrentPeriod(Number(period));
  }, []);
  const setCurrentPeriodWrapper = (period: number) => {
    setCurrentPeriod(period);
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

  const clearSimId = () => {
    setSimIdState(null);
    Cookies.remove("simId");
  };

  const clearComId = () => {
    setComIdState(null);
    Cookies.remove("comId");
  };

  const clearAll = () => {
    clearSimId();
    clearComId();
    setCurrentPeriod(null);
    Cookies.remove("currentPeriod");
  };

  return (
    <SimulationContext.Provider
      value={{
        simId,
        comId,
        currentPeriod,
        setSimId,
        setComId,
        setCurrentPeriod: setCurrentPeriodWrapper,
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
