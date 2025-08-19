"use client";
import React from "react";
import { Lightbulb, Award, Factory, Target } from "lucide-react";
import ChartCard from "@/app/ui/ChartCard";
import QuickStat from "@/app/ui/QuickStat";
import { RDDecisionType } from "@/app/types/homepage";

interface RDPipelineProps {
  activeProducts: number;
  rdDecision: RDDecisionType | null | undefined;
  rdBudget: number;
  selectedPeriod: number;
}

const RDPipeline: React.FC<RDPipelineProps> = ({
  activeProducts,
  rdDecision,
  rdBudget,
  selectedPeriod,
}) => {
  return (
    <div data-swapy-slot="slot-rd-pipeline" className="lg:col-span-1">
      <div data-swapy-item="item-rd-pipeline">
        <ChartCard title="R&D Pipeline">
          <div className="space-y-3">
            <QuickStat
              label="Active Projects"
              value={activeProducts.toString() || "0"}
              icon={Lightbulb}
              color="yellow"
              trend={selectedPeriod > 1 ? 12 : undefined}
            />
            <QuickStat
              label="Patents Filed"
              value={(rdDecision?.patented ?? 0).toString()}
              icon={Award}
              color="purple"
              trend={selectedPeriod > 1 ? 50 : undefined}
            />
            <QuickStat
              label="R&D Budget"
              value={`₹${(rdBudget / 10000000).toFixed(2)} Cr`}
              icon={Factory}
              color="blue"
              trend={selectedPeriod > 1 ? -5 : undefined}
            />
            <QuickStat
              label="Time to Market"
              value={`${rdDecision?.time_to_market || 0} mo`}
              icon={Target}
              color="green"
              trend={selectedPeriod > 1 ? -15 : undefined}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default RDPipeline;
