"use client";
import React from "react";
import { ChartCardProps } from "@/app/types";

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className = "",
  actions,
}) => (
  <div
    className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10 shadow-lg ${className}`}
  >
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </div>
);

export default ChartCard;
