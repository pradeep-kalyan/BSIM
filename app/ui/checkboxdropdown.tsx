"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, BarChart3, Ban } from "lucide-react";

interface checkboxdropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  onCompare: () => void;
}

// Small component to handle truncation detection safely
const TruncatedText: React.FC<{ text: string; maxWidth?: string }> = ({
  text,
  maxWidth = "150px",
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (spanRef.current) {
      setIsTruncated(spanRef.current.scrollWidth > spanRef.current.clientWidth);
    }
  }, [text]);

  return (
    <span
      ref={spanRef}
      className="truncate flex-1"
      style={{ maxWidth }}
      title={isTruncated ? text : undefined}
    >
      {text}
    </span>
  );
};

const Checkboxdropdown: React.FC<checkboxdropdownProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select companies",
  onCompare,
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
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-6 py-3 mt-2.5 rounded-md font-medium transition-all flex items-center gap-2 bg-blue-600"
      >
        <span className="truncate">
          {selected.length > 0
            ? `${selected.length} Compan${
                selected.length > 1 ? "ies" : "y"
              } Selected`
            : `${placeholder}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-1 w-full bg-slate-700 border border-slate-600 rounded-md shadow-lg z-50 text-sm text-white max-h-60 flex flex-col">
          {/* Company List */}
          <div className="overflow-y-auto flex-1">
            {options.map((option) => {
              const isSelected = selected.includes(option);
              const limitReached = selected.length >= 3 && !isSelected;

              return (
                <label
                  key={option}
                  className={`flex items-center px-3 py-2 ${
                    limitReached
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-slate-600 cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={limitReached}
                    onChange={() => {
                      if (!limitReached) toggleOption(option);
                    }}
                    className="mr-2 accent-blue-500"
                  />
                  <TruncatedText text={option} maxWidth="150px" />
                </label>
              );
            })}
          </div>

          {/* Sticky Footer */}
          <div className="p-2 border-t border-slate-600 bg-slate-800 sticky bottom-0">
            <button
              onClick={() => {
                setOpen(false);
                onCompare();
              }}
              disabled={selected.length < 2}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                selected.length >= 2
                  ? "bg-blue-600 hover:brightness-110"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Compare Companies
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkboxdropdown;
