"use client";

import { useState } from "react";
import { Play, ArrowLeft, Download, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSimulation } from "@/app/context/SimulationContext";
import { logoutUser } from "@/app/_actions/auth";

export function ButtonStack({
  isExporting,
  capture,
  handleViewCompany,
  isSimulating,
  handleSimulate,
}: {
  isExporting: boolean;
  capture: () => void;
  handleViewCompany: () => void;
  isSimulating: boolean;
  handleSimulate: () => void;
}) {
  const router = useRouter();
  const { clearAll } = useSimulation();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutUser();
      clearAll();
      toast.info("Logout successful");
      setTimeout(() => {
        router.push("/login");
      }, 300);
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const buttons = [
    {
      icon: <Download size={20} />,
      label: isExporting ? "Exporting..." : "Export Dashboard",
      onClick: capture,
      disabled: isExporting,
      extraClass: "export-dashboard-btn",
    },
    {
      icon: <ArrowLeft size={20} />,
      label: "Back to Companies",
      onClick: handleViewCompany,
      disabled: false,
    },
    {
      icon: <Play size={20} />,
      label: isSimulating ? "Simulating..." : "Simulate",
      onClick: handleSimulate,
      disabled: isSimulating,
      extraClass: "simulate-dashboard-btn",
    },
    {
      icon: <LogOut size={20} />,
      label: isLoggingOut ? "Logging out..." : "Logout",
      onClick: handleLogout,
      disabled: isLoggingOut,
    },
  ];

  const buttonWidth = 64;
  const expandedWidth = 200;
  const overlap = 16;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate container width accounting for the expanded button and pushing others
  const containerWidth =
    hoveredIndex === null
      ? buttonWidth + (buttons.length - 1) * (buttonWidth - overlap)
      : hoveredIndex * (buttonWidth - overlap) +
        expandedWidth +
        (buttons.length - hoveredIndex - 1) * (buttonWidth - overlap);

  return (
    <div
      className="relative flex items-center select-none ml-22"
      style={{
        height: 56,
        width: containerWidth,
        transition: "width 0.3s ease-in-out",
        cursor: "default",
        overflow: "visible", // allow overflow so no clipping
      }}
      aria-label="Button stack navigation"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {buttons.map(({ icon, label, onClick, disabled ,extraClass}, i) => {
        const isExpanded = hoveredIndex === i;

        // Positioning logic to fix icon clipping and overlapping
        let left = i * (buttonWidth - overlap);

        if (hoveredIndex !== null) {
          if (i === hoveredIndex + 1) {
            // Next button after hovered: no overlap, placed just after expanded button
            left = hoveredIndex * (buttonWidth - overlap) + expandedWidth;
          } else if (i > hoveredIndex + 1) {
            // Buttons after next: pushed further right accordingly
            left = i * (buttonWidth - overlap) + (expandedWidth - buttonWidth);
          }

          // Remove overlap for hovered button and its neighbors to prevent icon collision
          if (
            i === hoveredIndex ||
            i === hoveredIndex - 1 ||
            i === hoveredIndex + 1
          ) {
            left = i * buttonWidth;
            if (i > hoveredIndex) {
              left =
                hoveredIndex * buttonWidth +
                expandedWidth +
                (i - hoveredIndex - 1) * buttonWidth;
            }
          }
        }

        // zIndex: hovered highest, neighbors below, others lower
        let zIndex = 100 + buttons.length - i;
        if (isExpanded) zIndex = 1000;
        else if (
          hoveredIndex !== null &&
          (i === hoveredIndex - 1 || i === hoveredIndex + 1)
        ) {
          zIndex = 900;
        }

        return (
          <button
            key={i}
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
               ${extraClass}
              absolute top-0
              h-14
              bg-blue-600
              text-white
              rounded-xl
              font-semibold
              shadow-md
              flex items-center gap-3
              px-4
              transition-all duration-300 ease-in-out
              overflow-hidden
              whitespace-nowrap
              cursor-pointer
              disabled:opacity-50
              hover:bg-blue-500
              hover:shadow-lg
              transform hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
              disabled:cursor-not-allowed
              select-none
              text-md
            `}
            style={{
              left,
              width: isExpanded ? expandedWidth : buttonWidth,
              zIndex,
              transformOrigin: "left center",
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            aria-disabled={disabled}
            aria-label={label}
          >
            <span className="w-6 h-6 flex justify-center items-center pointer-events-none">
              {icon}
            </span>
            <span
              className={`${
                isExpanded ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300 ease-in-out pointer-events-none`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
