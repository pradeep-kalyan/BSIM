"use client";
import React from "react";
import { TooltipProps, PieTooltipProps } from "@/app/types/homepage";

export const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (
    !active ||
    !payload ||
    !payload.length ||
    payload.every((entry) => entry.value === 0 || entry.value == null)
  ) {
    return null;
  }
  return (
    <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
      {label && (
        <p className="font-medium mb-1 text-gray-200">{String(label)}</p>
      )}
      {payload.map((entry, index: number) => (
        <p key={index} className="text-gray-100">
          <span
            className="font-medium"
            style={{ color: entry.color || "#fff" }}
          >
            {entry.name || "Unknown"}:
          </span>{" "}
          {typeof entry.value === "number"
            ? entry.value.toLocaleString()
            : String(entry.value || "0")}
        </p>
      ))}
    </div>
  );
};

export const FinancialTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
        {label && (
          <p className="font-medium mb-1 text-gray-200">{String(label)}</p>
        )}
        {payload.map((entry, index: number) => (
          <p key={index} className="text-gray-100">
            <span
              className="font-medium"
              style={{ color: entry.color || "#fff" }}
            >
              {entry.name || "Unknown"}:
            </span>{" "}
            ₹{(((entry.value as number) || 0) / 10000000).toFixed(2)} Cr
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const PieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length && payload[0].value != null) {
    return (
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
        <p className="font-medium text-gray-200">
          {String(payload[0].name || "Unknown")}
        </p>
        <p className="text-gray-100">
          Value: ₹{(((payload[0].value as number) || 0) / 10000000).toFixed(2)}{" "}
          Cr
        </p>
        <p className="text-gray-100">
          Percentage: {payload[0].payload?.percentage || 0}%
        </p>
      </div>
    );
  }
  return null;
};

interface SalesTooltipPayload {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

export const SalesTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: SalesTooltipPayload[];
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-gray-600">
      {label && (
        <p className="font-medium mb-1 text-gray-200">Period {label}</p>
      )}
      {payload.map((entry, index) => (
        <p key={index} className="text-gray-100">
          <span className="font-medium" style={{ color: entry.color }}>
            {entry.name}:
          </span>{" "}
          {entry.dataKey === "totalSales"
            ? `${entry.value} units`
            : `₹${((entry.value as number) / 1000).toFixed(0)}K`}
        </p>
      ))}
    </div>
  );
};
