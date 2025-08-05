"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSimulation } from "@/app/context/SimulationContext";
import { getSimulationscompare } from "@/app/_actions/createSim";
import {
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Lightbulb,
  Star,
  Building2,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
  Trophy,
  PieChart,
} from "lucide-react";
import CheckboxDropdown from "@/ui/CheckboxDropDown";
import { getCompanyComparisonData } from "@/app/_actions/CompanyData";

// Types for better type safety
interface Company {
  id: string;
  name: string;
  cash_balance: number;
  total_assets: number;
  total_liabilities: number;
  brand_value: number;
  marketing_budget: number;
  current_period: number;
  finance: {
    total_revenue: number;
    net_profit: number;
    roi: number;
    burn_rate: number;
  };
  hr: {
    total_budget: number;
    employee_satisfaction: number;
  };
  rd: {
    budget: number;
    patented: number;
    quality_changes: number;
  };
  production: {
    production_capacity: number;
    defect_rate: number;
  };
  products: Array<{
    name: string;
    market_share: number;
    customer_satisfaction: number;
  }>;
}
interface CompanyOption {
  id: string;
  name: string;
}

type SortOption = "revenue" | "profit" | "assets" | "cash" | "roi";
type MetricType = "financial" | "operational" | "innovation";

const ComparePage: React.FC = () => {
  const { simId: simulationId } = useSimulation();
  const [allCompanies, setAllCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [companiesData, setCompaniesData] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparisonStarted, setComparisonStarted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("revenue");
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("financial");
  const [error, setError] = useState<string | null>(null);

  // Memoized formatters for better performance
  const formatNumber = useMemo(
    () =>
      (value: number): string => {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
        return value.toLocaleString();
      },
    []
  );

  const formatCurrency = useMemo(
    () =>
      (value: number): string => {
        if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
        return `$${value.toLocaleString()}`;
      },
    []
  );

  // Extract metric value for sorting with better type safety
  const getMetricValue = (company: Company, metric: SortOption): number => {
    switch (metric) {
      case "revenue":
        return company.finance.total_revenue;
      case "profit":
        return company.finance.net_profit;
      case "assets":
        return company.total_assets;
      case "cash":
        return company.cash_balance;
      case "roi":
        return company.finance.roi;
      default:
        return company.finance.total_revenue;
    }
  };

  // Memoized sorted companies for better performance
  const sortedCompanies = useMemo(() => {
    return [...companiesData].sort(
      (a, b) => getMetricValue(b, sortBy) - getMetricValue(a, sortBy)
    );
  }, [companiesData, sortBy]);

  // Memoized performance leaders
  const performanceLeaders = useMemo(() => {
    if (companiesData.length === 0)
      return { revenue: null, roi: null, satisfaction: null };

    const revenueLeader = [...companiesData].sort(
      (a, b) => b.finance.total_revenue - a.finance.total_revenue
    )[0];
    const roiLeader = [...companiesData].sort(
      (a, b) => b.finance.roi - a.finance.roi
    )[0];
    const satisfactionLeader = [...companiesData].sort(
      (a, b) => b.hr.employee_satisfaction - a.hr.employee_satisfaction
    )[0];

    return {
      revenue: revenueLeader,
      roi: roiLeader,
      satisfaction: satisfactionLeader,
    };
  }, [companiesData]);

  const ComparisonCard: React.FC<{
    title: React.ReactNode;
    children: React.ReactNode;
    className?: string;
  }> = ({ title, children, className = "" }) => (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10 shadow-lg ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        {title}
      </h3>
      {children}
    </div>
  );

  const MetricRow: React.FC<{
    label: string;
    companies: Company[];
    getValue: (company: Company) => number;
    format?: (value: number) => string;
  }> = ({ label, companies, getValue, format = formatCurrency }) => (
    <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
      <div className="text-gray-300 font-medium">{label}</div>
      {companies.map((company) => (
        <div key={company.id} className="text-white text-right">
          {format(getValue(company))}
        </div>
      ))}
    </div>
  );

  // Load companies on mount
  useEffect(() => {
    console.log("ComparePage MOUNTED");
    return () => {
      console.log("ComparePage UNMOUNTED");
    };
  }, []);

  const hasFetched = useRef(false); // survives remounts

  useEffect(() => {
    if (!simulationId || hasFetched.current) return;

    hasFetched.current = true; // set as soon as effect runs
    console.log("ComparePage fetching companies");

    const loadCompanies = async () => {
      try {
        setError(null);
        const simulations = await getSimulationscompare();
        const currentSim = simulations.find(
          (s: { id: string }) => s.id === simulationId
        );

        if (currentSim) {
          setAllCompanies(
            currentSim.companies.map((c: { id: string; name: string }) => ({
              id: c.id,
              name: c.name,
            }))
          );
        } else {
          setError("Simulation not found");
        }
      } catch (err) {
        setError("Failed to load companies");
        console.error("Error loading companies:", err);
      }
    };

    loadCompanies();
  }, [simulationId]);

  const handleCompareClick = async () => {
    if (selectedCompanyIds.length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getCompanyComparisonData(
        simulationId!,
        selectedCompanyIds
      );
      setCompaniesData(data);
      setComparisonStarted(true);
    } catch (err) {
      setError("Failed to fetch company data");
      console.error("Error fetching company data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedCompanyIds.length >= 2) {
      handleCompareClick();
    }
  };

  if (!simulationId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Simulation Selected</h2>
          <p className="text-gray-400">
            Please select a simulation to view company comparisons.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Company Comparison Dashboard</h1>
          {comparisonStarted && (
            <button
              onClick={handleRefresh}
              disabled={loading || selectedCompanyIds.length < 2}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          )}
        </div>

        <p className="mb-6 text-gray-400">
          Simulation N:{" "}
          <span className="text-white font-mono">{simulationId}</span>
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Company Selection */}
        <div className="flex items-center gap-4 mb-10 flex-wrap">
          <CheckboxDropdown
            options={allCompanies.map((c) => c.name)}
            selected={allCompanies
              .filter((c) => selectedCompanyIds.includes(c.id))
              .map((c) => c.name)}
            onChange={(selectedNames) => {
              const selectedIds = allCompanies
                .filter((c) => selectedNames.includes(c.name))
                .map((c) => c.id);

              if (selectedIds.length <= 3) {
                setSelectedCompanyIds(selectedIds);
              }
            }}
            placeholder="Select companies (max 3)"
          />

          <button
            onClick={handleCompareClick}
            disabled={selectedCompanyIds.length < 2 || loading}
            className={`px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 ${
              selectedCompanyIds.length >= 2 && !loading
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:brightness-110 shadow-lg"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" />
                Compare Companies
              </>
            )}
          </button>
          {selectedCompanyIds.length > 0 && (
            <span className="text-sm text-gray-400">
              {selectedCompanyIds.length} of 3 selected
            </span>
          )}
        </div>

        {/* Comparison Results */}
        {!loading && comparisonStarted && companiesData.length > 0 && (
          <>
            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="revenue">Revenue</option>
                  <option value="profit">Profit</option>
                  <option value="assets">Assets</option>
                  <option value="cash">Cash</option>
                  <option value="roi">ROI</option>
                </select>
              </div>

              <div className="flex gap-2">
                {(["financial", "operational", "innovation"] as const).map(
                  (metric) => (
                    <button
                      key={metric}
                      onClick={() => setSelectedMetric(metric)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedMetric === metric
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Company Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sortedCompanies.map((company, index) => (
                <div key={company.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-3 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      #1 Leader
                    </div>
                  )}

                  <div
                    className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border ${
                      index === 0
                        ? "border-yellow-500/50 shadow-lg shadow-yellow-500/20"
                        : "border-white/10"
                    } transition-all hover:shadow-lg hover:border-white/20`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {company.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Period {company.current_period}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue</span>
                        <span className="text-green-400 font-semibold">
                          {formatCurrency(company.finance.total_revenue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Net Profit</span>
                        <span className="text-blue-400 font-semibold">
                          {formatCurrency(company.finance.net_profit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ROI</span>
                        <span className="text-purple-400 font-semibold">
                          {company.finance.roi.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Comparison Tables */}
            {selectedMetric === "financial" && (
              <ComparisonCard
                title={
                  <>
                    <DollarSign className="w-5 h-5" />
                    Financial Metrics
                  </>
                }
              >
                <div className="grid grid-cols-4 gap-4 pb-3 border-b-2 border-gray-600 mb-2">
                  <div className="font-semibold text-gray-300">Metric</div>
                  {sortedCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="font-semibold text-white text-right"
                    >
                      {company.name}
                    </div>
                  ))}
                </div>

                <MetricRow
                  label="Total Revenue"
                  companies={sortedCompanies}
                  getValue={(c) => c.finance.total_revenue}
                />
                <MetricRow
                  label="Net Profit"
                  companies={sortedCompanies}
                  getValue={(c) => c.finance.net_profit}
                />
                <MetricRow
                  label="Cash Balance"
                  companies={sortedCompanies}
                  getValue={(c) => c.cash_balance}
                />
                <MetricRow
                  label="Total Assets"
                  companies={sortedCompanies}
                  getValue={(c) => c.total_assets}
                />
                <MetricRow
                  label="ROI %"
                  companies={sortedCompanies}
                  getValue={(c) => c.finance.roi}
                  format={(v) => `${v.toFixed(2)}%`}
                />
                <MetricRow
                  label="Brand Value"
                  companies={sortedCompanies}
                  getValue={(c) => c.brand_value}
                />
              </ComparisonCard>
            )}

            {selectedMetric === "operational" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComparisonCard
                  title={
                    <>
                      <Users className="w-5 h-5" />
                      HR & Operations
                    </>
                  }
                >
                  <div className="grid grid-cols-4 gap-4 pb-3 border-b-2 border-gray-600 mb-2">
                    <div className="font-semibold text-gray-300">Metric</div>
                    {sortedCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="font-semibold text-white text-right text-sm"
                      >
                        {company.name}
                      </div>
                    ))}
                  </div>

                  <MetricRow
                    label="HR Budget"
                    companies={sortedCompanies}
                    getValue={(c) => c.hr.total_budget}
                  />
                  <MetricRow
                    label="Employee Satisfaction"
                    companies={sortedCompanies}
                    getValue={(c) => c.hr.employee_satisfaction}
                    format={(v) => `${v.toFixed(2)}%`}
                  />
                  <MetricRow
                    label="Production Capacity"
                    companies={sortedCompanies}
                    getValue={(c) => c.production.production_capacity}
                    format={formatNumber}
                  />
                  <MetricRow
                    label="Defect Rate"
                    companies={sortedCompanies}
                    getValue={(c) => c.production.defect_rate}
                    format={(v) => `${v.toFixed(2)}%`}
                  />
                </ComparisonCard>

                <ComparisonCard
                  title={
                    <>
                      <Target className="w-5 h-5" />
                      Market Performance
                    </>
                  }
                >
                  <div className="space-y-4">
                    {sortedCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="border-b border-gray-700/50 pb-4 last:border-b-0"
                      >
                        <h4 className="font-semibold text-white mb-2">
                          {company.name}
                        </h4>
                        <div className="space-y-2">
                          {company.products.map((product, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-300">
                                {product.name}
                              </span>
                              <div className="flex gap-4">
                                <span className="text-blue-400">
                                  <PieChart className="w-4 h-4" />
                                  {(product.market_share ?? 0).toFixed(2)}%
                                  share
                                </span>
                                <span className="text-yellow-400">
                                  <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                                  {(product.customer_satisfaction ?? 0).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ComparisonCard>
              </div>
            )}

            {selectedMetric === "innovation" && (
              <ComparisonCard
                title={
                  <>
                    <Lightbulb className="w-5 h-5" />
                    R&D & Innovation
                  </>
                }
              >
                <div className="grid grid-cols-4 gap-4 pb-3 border-b-2 border-gray-600 mb-2">
                  <div className="font-semibold text-gray-300">Metric</div>
                  {sortedCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="font-semibold text-white text-right"
                    >
                      {company.name}
                    </div>
                  ))}
                </div>

                <MetricRow
                  label="R&D Budget"
                  companies={sortedCompanies}
                  getValue={(c) => c.rd.budget}
                />
                <MetricRow
                  label="Patents Filed"
                  companies={sortedCompanies}
                  getValue={(c) => c.rd.patented}
                  format={(v) => v.toString()}
                />
                <MetricRow
                  label="Quality Improvements"
                  companies={sortedCompanies}
                  getValue={(c) => c.rd.quality_changes}
                  format={(v) => v.toString()}
                />
                <MetricRow
                  label="Marketing Budget"
                  companies={sortedCompanies}
                  getValue={(c) => c.marketing_budget}
                />
              </ComparisonCard>
            )}

            {/* Performance Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Revenue Leader
                  </h3>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {performanceLeaders.revenue?.name}
                </p>
                <p className="text-green-300 text-sm">
                  {performanceLeaders.revenue &&
                    formatCurrency(
                      performanceLeaders.revenue.finance.total_revenue
                    )}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Highest ROI
                  </h3>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {performanceLeaders.roi?.name}
                </p>
                <p className="text-blue-300 text-sm">
                  {performanceLeaders.roi?.finance.roi.toFixed(2)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-800/30 to-yellow-900/30 rounded-xl p-6 border border-yellow-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Employee Satisfaction Leader
                  </h3>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {performanceLeaders.satisfaction?.name}
                </p>
                <p className="text-yellow-300 text-sm">
                  {performanceLeaders.satisfaction?.hr.employee_satisfaction}%
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
