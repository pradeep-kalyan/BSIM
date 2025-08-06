"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface checkboxdropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const Checkboxdropdown: React.FC<checkboxdropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select companies",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    );
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md min-w-[200px] w-full"
      >
        <span className="truncate">
          {selected.length > 0
            ? `${selected.length} compan${
                selected.length > 1 ? "ies" : "y"
              } selected`
            : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 text-white max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            const limitReached = selected.length >= 3 && !isSelected;

            return (
              <label
                key={option}
                className={`flex items-center justify-between px-4 py-2 transition-colors ${
                  limitReached
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-700"
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={limitReached}
                    onChange={() => {
                      if (!limitReached) toggleOption(option);
                    }}
                    className="mr-2 accent-purple-500"
                  />
                  {option}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Checkboxdropdown;
