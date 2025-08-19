"use client";
import React from "react";
import { DollarSign, TrendingUp, BarChart3, Package } from "lucide-react";
import DashboardCard from "@/app/ui/Card";
import formatCurrency from "@/app/functions/formatCurrency";

interface MetricsCardsProps {
  cashBalance: number;
  netWorth: number;
  currentRevenue: number;
  activeProducts: number;
  selectedPeriod: number;
  isCurrentPeriod: boolean;
  cashChange?: number;
  netWorthChange?: number;
  revenueChange?: number;
  prodChange?: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
  cashBalance,
  netWorth,
  currentRevenue,
  activeProducts,
  selectedPeriod,
  isCurrentPeriod,
  cashChange,
  netWorthChange,
  revenueChange,
  prodChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
      <div data-swapy-slot="slot-1">
        <div data-swapy-item="item-cash">
          <DashboardCard
            title="Cash Balance"
            value={formatCurrency(cashBalance)}
            subtitle="Available Funds"
            icon={DollarSign}
            iconColor="text-green-400"
            change={cashChange}
            className="stagger-2"
          />
        </div>
      </div>

      <div data-swapy-slot="slot-2">
        <div data-swapy-item="item-networth">
          <DashboardCard
            title="Net Worth"
            value={formatCurrency(netWorth)}
            subtitle="Assets - Liabilities"
            icon={TrendingUp}
            iconColor="text-emerald-400"
            change={netWorthChange}
            className="stagger-2"
          />
        </div>
      </div>

      <div data-swapy-slot="slot-3">
        <div data-swapy-item="currentRevenue">
          <DashboardCard
            title="Total Revenue"
            value={formatCurrency(currentRevenue ?? 0)}
            subtitle={`Period ${selectedPeriod}${
              isCurrentPeriod ? " (Current)" : ""
            }`}
            icon={BarChart3}
            iconColor="text-blue-400"
            change={revenueChange}
            className="stagger-3"
          />
        </div>
      </div>

      <div data-swapy-slot="slot-4">
        <div data-swapy-item="activeProducts">
          <DashboardCard
            title="Active Products"
            value={activeProducts}
            subtitle="In Market"
            icon={Package}
            iconColor="text-yellow-400"
            change={prodChange}
            className="stagger-4"
          />
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
