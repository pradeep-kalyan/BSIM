import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string; size?: number }>;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1 text-sm">{change}</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-500/20 rounded-lg">
        <Icon className="text-blue-400" size={24} />
      </div>
    </div>
  </div>
);

export default StatCard;
