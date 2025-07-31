"use client";

import {
  IndianRupee,
  Globe,
  Store,
  Loader2,
  Eye,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Inputbox from "@/ui/Input-Box";
import DashboardCard from "@/ui/Card";
import MarketingComparisonModal from "./MarketingComparison";
import {
  getCompanyData,
  getHistoricalMarketingData,
  getCurrentMarketingDecision,
  submitMarketingDecisionForPeriod,
} from "@/app/_actions/marketing-actions";
import { useMarketingForm } from "@/app/context/FormContext";

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface HistoricalData {
  period: number;
  budget: number;
  offline: number;
  online: number;
  roi: number;
  conversion_rate: number;
}

interface MarketingFormProps {
  companyId: string;
}

const MarketingForm: React.FC<MarketingFormProps> = ({ companyId }) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [previousData, setPreviousData] = useState({
    budget: 0,
    online: 0,
    offline: 0,
    roi: 0,
    conversion_rate: 0,
  });
  const {
    data: marketingDataRaw,
    updateData,
    setError,
    getError,
  } = useMarketingForm();

  const marketingData = {
    budget: marketingDataRaw.budget ?? 0,
    online: marketingDataRaw.online ?? 0,
    offline: marketingDataRaw.offline ?? 0,
    roi: marketingDataRaw.roi ?? 0,
    conversion_rate: marketingDataRaw.conversion_rate ?? 0,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
        const [company, historical] = await Promise.all([
          getCompanyData(companyId),
          getHistoricalMarketingData(companyId),
        ]);
        setCompanyData(company);
        setHistoricalData(historical);

        if (historical.length > 0) {
          const last = historical[historical.length - 1];
          const decision = await getCurrentMarketingDecision(
            company.id,
            company.current_period
          );

          updateData({
            budget: decision?.budget ?? last.budget,
            online: decision?.online ?? last.online,
            offline: decision?.offline ?? last.offline,
          });

          setPreviousData(last);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  const handleBudgetChange = (
    field: "budget" | "online" | "offline",
    value: number
  ) => {
    const online = marketingData.online;
    const offline = marketingData.offline;

    if (field === "budget") {
      const total = online + offline || 1;
      updateData({
        budget: value,
        online: Math.round(value * (online / total)),
        offline: Math.round(value * (offline / total)),
      });
    } else {
      const newOnline = field === "online" ? value : online;
      const newOffline = field === "offline" ? value : offline;
      updateData({
        online: newOnline,
        offline: newOffline,
        budget: newOnline + newOffline,
      });
    }
  };

  const handleSubmit = async () => {
    if (!companyData) return;

    const { budget, online, offline } = marketingData;

    if ((online || 0) + (offline || 0) !== (budget || 0)) {
      setError("marketing", "Online + Offline must equal Total Budget");
      return;
    }

    try {
      setSubmitting(true);
      await submitMarketingDecisionForPeriod({
        company_id: companyId,
        period: companyData.current_period,
        budget: budget || 0,
        online: online || 0,
        offline: offline || 0,
      });
    } catch (error) {
      console.error("Submission error:", error);
      setError("marketing", "Failed to submit decision");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  const percent = (part: number, total: number) =>
    total > 0 ? ((part / total) * 100).toFixed(1) + "%" : "0%";

  return (
    <div className="p-4 bg-slate-900 min-h-screen">
      {showComparison && companyData && (
        <MarketingComparisonModal
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          companyData={companyData}
          currentDecision={marketingData}
          previousDecision={previousData}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl text-white font-bold">Marketing Dashboard</h1>
          <p className="text-slate-400">
            {companyData?.name ?? "Loading..."} – Period {companyData?.current_period ?? "-"}
          </p>
        </div>
        <button
          onClick={() => setShowComparison(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <Eye className="w-4 h-4" />
          View Analysis
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          title="Total Budget"
          value={formatCurrency(marketingData.budget)}
          subtitle="Marketing Budget"
          icon={IndianRupee}
          change={(marketingData.budget - previousData.budget) / (previousData.budget || 1)}
        />
        <DashboardCard
          title="Online Marketing"
          value={formatCurrency(marketingData.online)}
          subtitle="Digital Channels"
          icon={Globe}
          change={(marketingData.online - previousData.online) / (previousData.online || 1)}
        />
        <DashboardCard
          title="Offline Marketing"
          value={formatCurrency(marketingData.offline)}
          subtitle="Traditional Channels"
          icon={Store}
          change={(marketingData.offline - previousData.offline) / (previousData.offline || 1)}
        />
      </div>

      <div className="space-y-6 bg-slate-800/40 p-6 rounded-lg border border-slate-700">
        <h2 className="text-white text-xl font-bold">Set Marketing Budget</h2>

        <Inputbox
          label="Total Marketing Budget"
          name="budget"
          type="number"
          value={marketingData.budget.toString()}
          onChange={(e) => handleBudgetChange("budget", parseInt(e.target.value) || 0)}
        />

        <Inputbox
          label="Online Marketing Budget"
          name="online"
          type="number"
          value={marketingData.online.toString()}
          onChange={(e) => handleBudgetChange("online", parseInt(e.target.value) || 0)}
        />
        <p className="text-xs text-slate-400">
          {percent(marketingData.online, marketingData.budget)} of total
        </p>

        <Inputbox
          label="Offline Marketing Budget"
          name="offline"
          type="number"
          value={marketingData.offline.toString()}
          onChange={(e) => handleBudgetChange("offline", parseInt(e.target.value) || 0)}
        />
        <p className="text-xs text-slate-400">
          {percent(marketingData.offline, marketingData.budget)} of total
        </p>

        {marketingData.online + marketingData.offline !== marketingData.budget && (
          <div className="text-yellow-300 text-sm">
            ⚠️ Online + Offline budgets do not match total!
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || marketingData.budget <= 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-600"
        >
          {submitting ? "Submitting..." : "Submit Marketing Decision"}
        </button>
      </div>
    </div>
  );
};

export default MarketingForm;