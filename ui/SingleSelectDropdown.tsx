"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SingleSelectDropdownProps {
  options: string[];
  selected: string | null;
  onChange: (selected: string | null) => void;
  placeholder?: string;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select option",
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

  const selectOption = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md min-w-[200px]"
      >
        <span className="truncate">{selected || placeholder}</span>
        <div className="flex items-center gap-1">
          {selected && (
            <span
              onClick={clearSelection}
              className="text-white/70 hover:text-white text-sm cursor-pointer"
            >
              ×
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-50 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50 text-white max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => selectOption(option)}
              className={`w-full text-left px-4 py-2 hover:bg-slate-700 cursor-pointer transition-colors ${
                selected === option ? "bg-slate-700 text-white-400" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
