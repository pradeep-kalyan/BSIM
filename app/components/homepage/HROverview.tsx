"use client";
import React from "react";
import { Users, Plus, Award, Briefcase } from "lucide-react";
import ChartCard from "@/app/ui/ChartCard";
import QuickStat from "@/app/ui/QuickStat";
import formatCurrency from "@/app/functions/formatCurrency";

interface HROverviewProps {
  totalEmployees: number;
  newHires: number;
  avgSatisfaction: number;
  hrBudget: number;
  totalEmployeesChange?: number;
  newHiresChange?: number;
  avgSatisfactionChange?: number;
  hrBudgetChange?: number;
}

const HROverview: React.FC<HROverviewProps> = ({
  totalEmployees,
  newHires,
  avgSatisfaction,
  hrBudget,
  totalEmployeesChange,
  newHiresChange,
  avgSatisfactionChange,
  hrBudgetChange,
}) => {
  return (
    <div data-swapy-slot="slot-hr-overview" className="lg:col-span-1">
      <div data-swapy-item="item-hr-overview">
        <ChartCard title="HR Overview">
          <div className="space-y-3">
            <QuickStat
              label="Total Employees"
              value={totalEmployees.toString()}
              icon={Users}
              color="blue"
              trend={totalEmployeesChange}
            />
            <QuickStat
              label="New Hires"
              value={newHires.toString()}
              icon={Plus}
              color="green"
              trend={newHiresChange}
            />
            <QuickStat
              label="Avg Satisfaction"
              value={avgSatisfaction.toFixed(1)}
              icon={Award}
              color="yellow"
              trend={avgSatisfactionChange}
            />
            <QuickStat
              label="HR Budget"
              value={`${formatCurrency(hrBudget)}`}
              icon={Briefcase}
              color="purple"
              trend={hrBudgetChange}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default HROverview;
