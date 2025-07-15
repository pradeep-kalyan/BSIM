// context/SimulationContext.tsx
import { createContext, use, useContext, useState } from "react";

const SimulationContext = createContext<{
  simId: string | null;
  comId: string | null;
  setSimId: (id: string) => void;
  setComId: (id: string) => void;
  clearSimId: () => void;
  clearComId: () => void;
  clearAll: () => void;
}>({
  simId: null,
  comId: null,
  setSimId: () => {},
  setComId: () => {},
  clearSimId: () => {},
  clearComId: () => {},
  clearAll: () => {},
});

export const SimulationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [simId, setSimId] = useState<string | null>(null);
  const [comId, setComId] = useState<string | null>(null);

  const clearSimId = () => setSimId(null);
  const clearComId = () => setComId(null);
  const clearAll = () => {
    setSimId(null);
    setComId(null);
  };

  return (
    <SimulationContext.Provider
      value={{
        simId,
        comId,
        setSimId,
        setComId,
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
