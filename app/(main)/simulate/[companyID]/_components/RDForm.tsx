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
import DashboardCard from "@/ui/Card";
import {
  getCompanyData,
  getHistoricalRDData,
  getCurrentRDDecision,
  submitRDDecisionForPeriod,
} from "@/app/_actions/rd-actions";
import RdComparison from "./RdComparison";
import { useRDForm, useCashBalance, useForm } from "@/app/context/FormContext";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [previousData, setPreviousData] = useState<Partial<HistoricalData>>({});
  const [showComparison, setShowComparison] = useState(false);

  const { data: rdData, updateData } = useRDForm();
  const { projectedCashBalance, setOriginalCashBalance } = useCashBalance();
  const { state } = useForm();



  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setError(null);

        const [company, historical] = await Promise.all([
          getCompanyData(companyId),
          getHistoricalRDData(companyId),
        ]);

        if (cancelled) return;

        setCompanyData(company);
        setOriginalCashBalance(company.cash_balance); 
        setHistoricalData(historical);

        const hasUserModified = Object.values(rdData).some(
          (val) => val !== undefined && val !== 0
        );

        if (!hasUserModified && historical.length > 0) {
          const lastPeriod = historical[historical.length - 1];
          const decision = await getCurrentRDDecision(
            company.id,
            company.current_period
          );

          updateData({
            budget: decision?.budget ?? lastPeriod.budget ?? 0,
            pip: decision?.pip ?? lastPeriod.pip ?? 0,
            time_to_market:
              decision?.time_to_market ?? lastPeriod.time_to_market ?? 0,
            total_development:
              decision?.total_development ?? lastPeriod.total_development ?? 0,
            patented: decision?.patented ?? lastPeriod.patented ?? 0,
            quality_changes:
              decision?.quality_changes ?? lastPeriod.quality_changes ?? 0,
          });

          setPreviousData({
            budget: lastPeriod.budget ?? 0,
            pip: lastPeriod.pip ?? 0,
            time_to_market: lastPeriod.time_to_market ?? 0,
            total_development: lastPeriod.total_development ?? 0,
            patented: lastPeriod.patented ?? 0,
            quality_changes: lastPeriod.quality_changes ?? 0,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const handleInputChange = (field: keyof typeof rdData, value: number) => {
    updateData({ [field]: value });
  };

  const handleSubmit = async () => {
    if (!companyData) return;

    try {
      setSubmitting(true);
      setError(null);

      await submitRDDecisionForPeriod({
        company_id: companyId,
        period: companyData.current_period,
        budget: rdData.budget ?? 0,
        pip: rdData.pip ?? 0,
        time_to_market: rdData.time_to_market ?? 0,
        total_development: rdData.total_development ?? 0,
        patented: rdData.patented ?? 0,
        quality_changes: rdData.quality_changes ?? 0,
      });

      setShowComparison(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit R&D decision"
      );
    } finally {
      setSubmitting(false);
    }
  };

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
    rdData.budget ?? 0,
    previousData.budget ?? 0
  );
  const pipChange = calculateChange(rdData.pip ?? 0, previousData.pip ?? 0);
  const timeToMarketChange = calculateChange(
    rdData.time_to_market ?? 0,
    previousData.time_to_market ?? 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">R&D Dashboard</h1>
          <p className="text-slate-400">
            Period {companyData?.current_period ?? "–"} •{" "}
            {companyData?.name ?? "–"}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <DashboardCard
            title="R&D Budget"
            value={formatCurrency(rdData.budget ?? 0)}
            subtitle="Research & Development"
            icon={IndianRupee}
            size="small"
            gradient={false}
            change={budgetChange}
          />
          <DashboardCard
            title="Products in Pipeline"
            value={(rdData.pip ?? 0).toString()}
            subtitle="Development Pipeline"
            icon={FlaskConical}
            size="small"
            gradient={false}
            change={pipChange}
          />
          <DashboardCard
            title="Time to Market"
            value={`${rdData.time_to_market ?? 0} months`}
            subtitle="Avg Dev Time"
            icon={Timer}
            size="small"
            gradient={false}
            change={timeToMarketChange}
          />
        </div>

        {/* Historical Snapshot */}
        {previousData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <Lightbulb className="h-8 w-8 text-yellow-400 mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {previousData.patented ?? 0}
              </div>
              <div className="text-slate-400 text-sm">Previous Patents</div>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <BarChart3 className="h-8 w-8 text-green-400 mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {previousData.quality_changes ?? 0}%
              </div>
              <div className="text-slate-400 text-sm">Quality Improvement</div>
            </div>
          </div>
        )}

        {/* R&D Inputs */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Set R&D Strategy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(
              [
                ["budget", "R&D Budget"],
                ["pip", "Products in Pipeline"],
                ["time_to_market", "Time to Market (months)"],
                ["total_development", "Total Development Cost"],
                ["patented", "Patents Expected"],
                ["quality_changes", "Quality Improvements (%)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="block text-white text-sm font-semibold mb-2">
                  {label}
                </label>
                <input
                  type="number"
                  value={rdData[key] ?? 0}
                  onChange={(e) =>
                    handleInputChange(key, parseInt(e.target.value) || 0)
                  }
                  className="w-full p-3 rounded bg-slate-700 text-white border border-slate-600 focus:border-blue-400"
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              R&D Summary
            </h4>
            <div className="bg-slate-700/50 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-slate-300 text-sm">R&D Budget</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(rdData.budget ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm">Quality Improvement</p>
                <p className="text-xl font-bold text-white">
                  {rdData.quality_changes ?? 0}%
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm">Development Cost</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(rdData.total_development ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm">Cash After</p>
                <p
                  className={`text-xl font-bold ${
                    projectedCashBalance < 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {formatCurrency(projectedCashBalance)}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-7 flex justify-end space-x-4">
            <button
              className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center space-x-2"
              onClick={() => setShowComparison(true)}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Compare Changes</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                (rdData.budget ?? 0) <= 0 ||
                projectedCashBalance < 0
              }
              className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2"
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

          {/* Cash warning */}
          {projectedCashBalance < 0 && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mt-4">
              <p className="text-red-200 text-sm">
                ⚠️ Insufficient cash balance. Required:{" "}
                {formatCurrency(rdData.budget ?? 0)}, Available:{" "}
                {formatCurrency(companyData?.cash_balance ?? 0)}
              </p>
            </div>
          )}
        </div>

        {/* Comparison Modal */}
        {showComparison && (
          <RdComparison
            current={{
              budget: rdData.budget ?? 0,
              pip: rdData.pip ?? 0,
              time_to_market: rdData.time_to_market ?? 0,
              total_development: rdData.total_development ?? 0,
              patented: rdData.patented ?? 0,
              quality_changes: rdData.quality_changes ?? 0,
            }}
            previous={{
              budget: previousData.budget ?? 0,
              pip: previousData.pip ?? 0,
              time_to_market: previousData.time_to_market ?? 0,
              total_development: previousData.total_development ?? 0,
              patented: previousData.patented ?? 0,
              quality_changes: previousData.quality_changes ?? 0,
            }}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RDForm;
