import { create } from "zustand";

interface CompareStore {
  selectedCompanies: string[];
  simulationId: string;
  setCompareData: (companies: string[], simulationId: string) => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  selectedCompanies: [],
  simulationId: "",
  setCompareData: (companies, simulationId) =>
    set({ selectedCompanies: companies, simulationId }),
}));
