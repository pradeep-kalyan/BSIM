"use client";
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { DashboardCardProps } from "@/app/(main)/homepage/[companyID]/types";

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  loading = false,
  onClick,
  gradient = false,
  size = "normal",
  className = "",
}) => {
  const isPositive = typeof change === "number" && change > 0;
  const isNegative = typeof change === "number" && change < 0;
  const cardHeight =
    size === "large" ? "h-48" : size === "small" ? "h-32" : "h-40";

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl p-6 shadow-lg border border-white/10 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${cardHeight} ${
        gradient
          ? "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"
          : "bg-gradient-to-br from-gray-800 to-gray-900"
      } text-white ${className}`}
    >
      {loading ? (
        <div className="animate-pulse space-y-4 relative z-10">
          <div className="h-4 bg-gray-400/30 rounded w-1/3"></div>
          <div className="h-8 bg-gray-400/30 rounded w-1/2"></div>
          <div className="h-3 bg-gray-400/30 rounded w-1/4"></div>
        </div>
      ) : (
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold opacity-90 mb-1">{title}</h3>
              {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
            </div>
            {Icon && (
              <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                <Icon size={size === "large" ? 28 : 20} />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div
              className={`font-bold ${
                size === "large" ? "text-4xl" : "text-3xl"
              } mb-2`}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            {typeof change === "number" && (
              <div
                className={`text-sm font-medium flex items-center ${
                  isPositive
                    ? "text-green-300"
                    : isNegative
                    ? "text-red-300"
                    : "text-white"
                }`}
              >
                {change > 0 ? (
                  <TrendingUp size={16} />
                ) : change < 0 ? (
                  <TrendingDown size={16} />
                ) : null}
                <span className="ml-1">
                  {Math.abs(change) > 500
                    ? `${(Math.abs(change) / 100).toFixed(1)}x`
                    : `${Math.abs(change).toFixed(1)}%`}
                </span>
                <span className="ml-1 opacity-60">vs last period</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
