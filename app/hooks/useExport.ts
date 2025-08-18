import { useCallback, useState } from "react";
import {
  exportElementAsImage,
  exportDashboard,
} from "@/app/lib/utils/exportUtils";

/**
 * Custom hook for exporting elements as images
 * @returns Object with export functions and loading state
 */
export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportElement = useCallback(
    async (
      element: HTMLElement,
      options?: {
        filename?: string;
        format?: "png" | "jpeg";
        quality?: number;
        backgroundColor?: string;
        width?: number;
        height?: number;
      }
    ) => {
      setIsExporting(true);
      try {
        await exportElementAsImage({
          element,
          ...options,
        });
      } catch {
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const exportDashboardElement = useCallback(
    async (element: HTMLElement, filename?: string) => {
      setIsExporting(true);
      try {
        await exportDashboard(element, filename);
      } catch {
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportElement,
    exportDashboard: exportDashboardElement,
    isExporting,
  };
};
