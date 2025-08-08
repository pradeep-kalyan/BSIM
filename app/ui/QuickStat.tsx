"use client";
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { QuickStatProps } from "@/app/types";

const colorClasses = {
  blue: "text-blue-400 bg-blue-400/10 border border-blue-500/30",
  green: "text-green-400 bg-green-400/10 border border-green-500/30",
  yellow: "text-yellow-400 bg-yellow-400/10 border border-yellow-500/30",
  red: "text-red-400 bg-red-400/10 border border-red-500/30",
  purple: "text-purple-400 bg-purple-400/10 border border-purple-500/30",
};

const QuickStat: React.FC<QuickStatProps> = ({
  label,
  value,
  icon: Icon,
  color = "blue",
  trend,
}) => {
  const trendColor =
    typeof trend !== "number"
      ? "text-gray-400"
      : trend === 0
      ? "text-gray-400"
      : trend > 0
      ? "text-green-400"
      : "text-red-400";

  const TrendIcon =
    typeof trend === "number" && trend > 0 ? TrendingUp : TrendingDown;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl p-4 transition-colors duration-300 shadow-md ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <div className="p-3 rounded-full bg-current/20 text-current">
        <Icon size={22} />
      </div>
      <div className="flex-1">
        <div className="text-sm text-white/70">{label}</div>
        <div className="text-2xl font-semibold text-white">{value}</div>
        {typeof trend === "number" && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${trendColor}`}>
            <TrendIcon size={12} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStat;
