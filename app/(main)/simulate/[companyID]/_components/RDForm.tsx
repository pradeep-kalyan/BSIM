"use client";
import {
  IndianRupee,
  FlaskConical,
  Lightbulb,
  Timer,
  BarChart3,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "./Card";
import {
  getCompanyData,
  getHistoricalRDData,
  getCurrentRDDecision,
  submitRDDecisionForPeriod,
} from "@/app/_actions/rd-actions";

interface CompanyData {
  id: string;
  name: string;
  current_period: number;
  cash_balance: number;
}

interface HistoricalData {
  period: number;
  budget: number;
  pip: number;
  time_to_market: number;
  total_development: number;
  patented: number;
  quality_changes: number;
}

interface RDFormProps {
  companyId: string;
}

const RDForm: React.FC<RDFormProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  const [rdData, setRdData] = useState({
    current: {
      budget: 0,
      pip: 0,
      time_to_market: 0,
      total_development: 0,
      patented: 0,
      quality_changes: 0,
    },
    previous: {
      budget: 0,
      pip: 0,
      time_to_market: 0,
      total_development: 0,
      patented: 0,
      quality_changes: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [company, historical] = await Promise.all([
          getCompanyData(companyId),
          getHistoricalRDData(companyId),
        ]);

        setCompanyData(company);
        setHistoricalData(historical);

        // Set default values based on last period
        if (historical.length > 0) {
          const lastPeriod = historical[historical.length - 1];
          const decision = await getCurrentRDDecision(
            company.id,
            company.current_period
          );

          setRdData({
            current: {
              budget: decision?.budget || lastPeriod.budget || 0,
              pip: decision?.pip || lastPeriod.pip || 0,
              time_to_market:
                decision?.time_to_market || lastPeriod.time_to_market || 0,
              total_development:
                decision?.total_development ||
                lastPeriod.total_development ||
                0,
              patented: decision?.patented || lastPeriod.patented || 0,
              quality_changes:
                decision?.quality_changes || lastPeriod.quality_changes || 0,
            },
            previous: {
              budget: lastPeriod.budget,
              pip: lastPeriod.pip,
              time_to_market: lastPeriod.time_to_market,
              total_development: lastPeriod.total_development,
              patented: lastPeriod.patented,
              quality_changes: lastPeriod.quality_changes,
            },
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const handleInputChange = (
    field: keyof typeof rdData.current,
    value: number
  ) => {
    setRdData((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!companyData) return;

    try {
      setSubmitting(true);
      setError(null);

      await submitRDDecisionForPeriod({
        company_id: companyId,
        period: companyData.current_period,
        budget: rdData.current.budget,
        pip: rdData.current.pip,
        time_to_market: rdData.current.time_to_market,
        total_development: rdData.current.total_development,
        patented: rdData.current.patented,
        quality_changes: rdData.current.quality_changes,
      });

      // Refresh the data after successful submission
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit R&D decision"
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
          <p className="text-slate-300">Loading R&D dashboard...</p>
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
    rdData.current.budget,
    rdData.previous.budget
  );
  const pipChange = calculateChange(rdData.current.pip, rdData.previous.pip);
  const timeToMarketChange = calculateChange(
    rdData.current.time_to_market,
    rdData.previous.time_to_market
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2">
      <div className="max-w-7xl mx-auto mt-2">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">R&D Dashboard</h1>
              <p className="text-slate-400">
                Period {companyData.current_period} • {companyData.name}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <DashboardCard
            title="R&D Budget"
            value={formatCurrency(rdData.current.budget)}
            subtitle="Research & Development"
            icon={IndianRupee}
            size="small"
            gradient={true}
            change={budgetChange}
          />
          <DashboardCard
            title="Products in Pipeline"
            value={rdData.current.pip.toString()}
            subtitle="Development Pipeline"
            icon={FlaskConical}
            size="small"
            gradient={true}
            change={pipChange}
          />
          <DashboardCard
            title="Time to Market"
            value={`${rdData.current.time_to_market} months`}
            subtitle="Average Development Time"
            icon={Timer}
            size="small"
            gradient={true}
            change={timeToMarketChange}
          />
        </div>

        {/* Historical Performance */}
        {historicalData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <Lightbulb className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {rdData.previous.patented}
              </div>
              <div className="text-slate-400 text-sm">Previous Patents</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">
                {rdData.previous.quality_changes}%
              </div>
              <div className="text-slate-400 text-sm">
                Previous Quality Improvements
              </div>
            </div>
          </div>
        )}

        {/* R&D Decision Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            Set R&D Strategy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* R&D Budget */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                R&D Budget
              </label>
              <input
                type="number"
                value={rdData.current.budget}
                onChange={(e) =>
                  handleInputChange("budget", parseInt(e.target.value) || 0)
                }
                placeholder="Enter R&D budget"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Products in Pipeline */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Products in Pipeline
              </label>
              <input
                type="number"
                value={rdData.current.pip}
                onChange={(e) =>
                  handleInputChange("pip", parseInt(e.target.value) || 0)
                }
                placeholder="Number of products in development"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Time to Market */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Time to Market (months)
              </label>
              <input
                type="number"
                value={rdData.current.time_to_market}
                onChange={(e) =>
                  handleInputChange(
                    "time_to_market",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Expected time to market"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Total Development Cost */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Total Development Cost
              </label>
              <input
                type="number"
                value={rdData.current.total_development}
                onChange={(e) =>
                  handleInputChange(
                    "total_development",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Total development investment"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Patents Expected */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Patents Expected
              </label>
              <input
                type="number"
                value={rdData.current.patented}
                onChange={(e) =>
                  handleInputChange("patented", parseInt(e.target.value) || 0)
                }
                placeholder="Number of patents expected"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>

            {/* Quality Improvements (%)*/}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Quality Improvements (%)
              </label>
              <input
                type="number"
                value={rdData.current.quality_changes}
                onChange={(e) =>
                  handleInputChange(
                    "quality_changes",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Expected quality improvement percentage"
                className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                rdData.current.budget <= 0 ||
                companyData.cash_balance < rdData.current.budget
              }
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit R&D Decision"
              )}
            </button>
          </div>

          {/* Budget Validation */}
          {companyData.cash_balance < rdData.current.budget && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mt-4">
              <p className="text-red-200 text-sm">
                ⚠️ Insufficient cash balance. Required:{" "}
                {formatCurrency(rdData.current.budget)}, Available:{" "}
                {formatCurrency(companyData.cash_balance)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RDForm;
