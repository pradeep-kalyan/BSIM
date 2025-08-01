"use client";
import {
  IndianRupee,
  Globe,
  Store,
  TrendingUp,
  BarChart3,
  Loader2,
  Eye,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Inputbox from "@/ui/Input-Box";
import DashboardCard from "./Card";
import MarketingComparisonModal from "./MarketingComparison";
import { useMarketingForm } from "@/app/context/FormContext";
import {
  getCompanyData,
  getHistoricalMarketingData,
  getCurrentMarketingDecision,
  submitMarketingDecisionForPeriod,
} from "@/app/_actions/marketing-actions";

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Use FormContext for marketing form state
  const { data: marketingData, updateData: updateMarketingData } =
    useMarketingForm();

  const [previousData, setPreviousData] = useState({
    budget: 0,
    online: 0,
    offline: 0,
    roi: 0,
    conversion_rate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [company, historical] = await Promise.all([
          getCompanyData(companyId),
          getHistoricalMarketingData(companyId),
        ]);

        setCompanyData(company);
        setHistoricalData(historical);

        // Set default values based on last period
        if (historical.length > 0) {
          const lastPeriod = historical[historical.length - 1];
          const decision = await getCurrentMarketingDecision(
            company.id,
            company.current_period
          );

          updateMarketingData({
            advertising_budget: decision?.budget || lastPeriod.budget || 0,
            promotion_budget: decision?.online || lastPeriod.online || 0,
            market_research_budget:
              decision?.offline || lastPeriod.offline || 0,
            brand_investment: 0,
            digital_marketing_budget: 0,
          });

          setPreviousData({
            budget: lastPeriod.budget,
            online: lastPeriod.online,
            offline: lastPeriod.offline,
            roi: lastPeriod.roi,
            conversion_rate: lastPeriod.conversion_rate,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, updateMarketingData]);

  const handleBudgetChange = (
    field: "budget" | "online" | "offline",
    value: number
  ) => {
    if (field === "budget") {
      // When total budget changes, maintain the ratio of online/offline
      const totalCurrent =
        (marketingData.promotion_budget || 0) +
        (marketingData.market_research_budget || 0);
      const onlineRatio =
        totalCurrent > 0
          ? (marketingData.promotion_budget || 0) / totalCurrent
          : 0.5;
      const offlineRatio =
        totalCurrent > 0
          ? (marketingData.market_research_budget || 0) / totalCurrent
          : 0.5;

      updateMarketingData({
        ...marketingData,
        advertising_budget: value,
        promotion_budget: Math.round(value * onlineRatio),
        market_research_budget: Math.round(value * offlineRatio),
      });
    } else {
      // When online or offline changes, update the total budget
      const newPromotion =
        field === "online" ? value : marketingData.promotion_budget || 0;
      const newResearch =
        field === "offline" ? value : marketingData.market_research_budget || 0;
      const newTotal = newPromotion + newResearch;

      updateMarketingData({
        ...marketingData,
        advertising_budget: newTotal,
        promotion_budget: newPromotion,
        market_research_budget: newResearch,
      });
    }
  };

  const handleSubmit = async () => {
    if (!companyData) return;

    try {
      setSubmitting(true);
      setError(null);

      await submitMarketingDecisionForPeriod({
        company_id: companyId,
        period: companyData.current_period,
        budget: marketingData.advertising_budget || 0,
        online: marketingData.promotion_budget || 0,
        offline: marketingData.market_research_budget || 0,
      });

      // Refresh the data after successful submission
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit marketing decision"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading marketing dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-300">No company data found</p>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const budgetChange = calculateChange(
    marketingData.advertising_budget || 0,
    previousData.budget
  );
  const onlineChange = calculateChange(
    marketingData.promotion_budget || 0,
    previousData.online
  );
  const offlineChange = calculateChange(
    marketingData.market_research_budget || 0,
    previousData.offline
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      {showComparison && (
        <MarketingComparisonModal
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          companyData={companyData}
          currentDecision={{
            budget: marketingData.advertising_budget || 0,
            online: marketingData.promotion_budget || 0,
            offline: marketingData.market_research_budget || 0,
          }}
          previousDecision={{
            budget: previousData.budget,
            online: previousData.online,
            offline: previousData.offline,
          }}
        />
      )}

      {!showComparison && (
        <div className="max-w-7xl mx-auto mt-2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Marketing Dashboard
                </h1>
                <p className="text-slate-400">
                  Period {companyData.current_period} • {companyData.name}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowComparison(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <DashboardCard
              title="Total Budget"
              value={formatCurrency(marketingData.advertising_budget || 0)}
              subtitle="Marketing Budget"
              icon={IndianRupee}
              size="small"
              gradient={true}
              change={budgetChange}
            />
            <DashboardCard
              title="Online Marketing"
              value={formatCurrency(marketingData.promotion_budget || 0)}
              subtitle="Digital Channels"
              icon={Globe}
              size="small"
              gradient={true}
              change={onlineChange}
            />
            <DashboardCard
              title="Offline Marketing"
              value={formatCurrency(marketingData.market_research_budget || 0)}
              subtitle="Traditional Channels"
              icon={Store}
              size="small"
              gradient={true}
              change={offlineChange}
            />
          </div>

          {/* Historical Performance */}
          {historicalData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {previousData.roi}%
                </div>
                <div className="text-slate-400 text-sm">Previous ROI</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {(previousData.conversion_rate * 100).toFixed(1)}%
                </div>
                <div className="text-slate-400 text-sm">
                  Previous Conversion Rate
                </div>
              </div>
            </div>
          )}

          {/* Marketing Budget Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              Set Marketing Budget
            </h2>

            <div className="space-y-6">
              {/* Total Budget */}
              <div>
                <Inputbox
                  label="Total Marketing Budget"
                  name="total_budget"
                  type="number"
                  value={(marketingData.advertising_budget || 0).toString()}
                  onChange={(e) =>
                    handleBudgetChange("budget", parseInt(e.target.value) || 0)
                  }
                />
              </div>

              {/* Online Budget */}
              <div>
                <Inputbox
                  label="Online Marketing Budget"
                  name="online_budget"
                  type="number"
                  value={(marketingData.promotion_budget || 0).toString()}
                  onChange={(e) =>
                    handleBudgetChange("online", parseInt(e.target.value) || 0)
                  }
                />
                <p className="text-slate-400 text-xs mt-1">
                  {(marketingData.advertising_budget || 0) > 0
                    ? `${(
                        ((marketingData.promotion_budget || 0) /
                          (marketingData.advertising_budget || 1)) *
                        100
                      ).toFixed(1)}% of total budget`
                    : "0% of total budget"}
                </p>
              </div>

              {/* Offline Budget */}
              <div>
                <Inputbox
                  label="Offline Marketing Budget"
                  name="offline_budget"
                  type="number"
                  value={(marketingData.market_research_budget || 0).toString()}
                  onChange={(e) =>
                    handleBudgetChange("offline", parseInt(e.target.value) || 0)
                  }
                />
                <p className="text-slate-400 text-xs mt-1">
                  {(marketingData.advertising_budget || 0) > 0
                    ? `${(
                        ((marketingData.market_research_budget || 0) /
                          (marketingData.advertising_budget || 1)) *
                        100
                      ).toFixed(1)}% of total budget`
                    : "0% of total budget"}
                </p>
              </div>

              {/* Budget Validation */}
              {(marketingData.promotion_budget || 0) +
                (marketingData.market_research_budget || 0) !==
                (marketingData.advertising_budget || 0) && (
                <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ Online and offline budgets should sum to total budget.
                    Current sum:{" "}
                    {formatCurrency(
                      (marketingData.promotion_budget || 0) +
                        (marketingData.market_research_budget || 0)
                    )}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    (marketingData.promotion_budget || 0) +
                      (marketingData.market_research_budget || 0) !==
                      (marketingData.advertising_budget || 0) ||
                    (marketingData.advertising_budget || 0) <= 0
                  }
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Marketing Decision"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingForm;
