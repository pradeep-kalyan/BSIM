"use client";

import React, { useEffect, useState } from "react";
import { useCompareStore } from "@/app/store/useCompareStore";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

// Dummy API function to fetch company details by simulation ID and company names
// Replace this with your real API call to get the data
async function fetchCompanyData(simulationId: string, companies: string[]) {
  // Example: Fetch companies details from your backend here
  // For now, mock some data structure with random numbers for demonstration

  return companies.map((name, i) => ({
    id: `${i}`,
    name,
    cash_balance: Math.floor(Math.random() * 5_000_000),
    total_assets: Math.floor(Math.random() * 10_000_000),
    total_liabilities: Math.floor(Math.random() * 3_000_000),
    brand_value: Math.floor(Math.random() * 1_500_000),
    marketing_budget: Math.floor(Math.random() * 500_000),
    current_period: 4,
    finance: {
      total_revenue: Math.floor(Math.random() * 3_000_000),
      net_profit: Math.floor(Math.random() * 700_000),
      roi: +(Math.random() * 20).toFixed(1),
      burn_rate: Math.floor(Math.random() * 150_000),
    },
    hr: {
      total_budget: Math.floor(Math.random() * 700_000),
      employee_satisfaction: Math.floor(Math.random() * 100),
    },
    rd: {
      budget: Math.floor(Math.random() * 400_000),
      patented: Math.floor(Math.random() * 10),
      quality_changes: Math.floor(Math.random() * 30),
    },
    production: {
      production_capacity: Math.floor(Math.random() * 10_000),
      defect_rate: +(Math.random() * 5).toFixed(2),
    },
    products: [
      {
        name: "Product A",
        market_share: +(Math.random() * 30).toFixed(1),
        customer_satisfaction: +(Math.random() * 5).toFixed(1),
      },
      {
        name: "Product B",
        market_share: +(Math.random() * 20).toFixed(1),
        customer_satisfaction: +(Math.random() * 5).toFixed(1),
      },
    ],
  }));
}

const ComparePage = () => {
  const { selectedCompanies, simulationId } = useCompareStore();
  const router = useRouter();
  const [companiesData, setCompaniesData] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>("revenue");
  const [selectedMetric, setSelectedMetric] = useState<string>("financial");
  const [loading, setLoading] = useState(true);

  // Format helpers
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  // Extract metric value for sorting
  const getMetricValue = (company: any, metric: string) => {
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

  // Sort companies by selected metric
  const sortedCompanies = [...companiesData].sort(
    (a, b) => getMetricValue(b, sortBy) - getMetricValue(a, sortBy)
  );

  // Fetch data when selectedCompanies or simulationId changes
  useEffect(() => {
    if (!simulationId || selectedCompanies.length < 2) {
      setCompaniesData([]);
      return;
    }
    setLoading(true);
    fetchCompanyData(simulationId, selectedCompanies)
      .then((data) => setCompaniesData(data))
      .finally(() => setLoading(false));
  }, [simulationId, selectedCompanies]);

  const ComparisonCard = ({ title, children, className = "" }: any) => (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10 shadow-lg ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        {title}
      </h3>
      {children}
    </div>
  );

  const MetricRow = ({
    label,
    companies,
    getValue,
    format = formatCurrency,
  }: any) => (
    <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-700/50">
      <div className="text-gray-300 font-medium">{label}</div>
      {companies.map((company: any) => (
        <div key={company.id} className="text-white text-right">
          {format(getValue(company))}
        </div>
      ))}
    </div>
  );

  if (!simulationId || selectedCompanies.length < 2) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white p-6">
        <p className="text-lg text-gray-400 text-center max-w-md">
          Please select at least two companies and a simulation to compare.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white p-6">
        <div className="w-12 h-12 border-4 border-blue-500/30 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Company Comparison Dashboard
          </h1>
          <p className="text-gray-400">
            Comparing selected companies in simulation:{" "}
            <span className="font-semibold">{simulationId}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-md px-3 py-1 text-white text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="profit">Profit</option>
              <option value="assets">Assets</option>
              <option value="cash">Cash</option>
              <option value="roi">ROI</option>
            </select>
          </div>

          <div className="flex gap-2">
            {["financial", "operational", "innovation"].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedMetric === metric
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Company Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sortedCompanies.map((company, index) => (
            <div key={company.id} className="relative">
              {index === 0 && (
                <div className="absolute -top-3 left-4 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold z-10">
                  #1 Leader
                </div>
              )}
              <div
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border ${
                  index === 0 ? "border-yellow-500/50" : "border-white/10"
                } shadow-lg`}
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
                      {company.finance.roi}%
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
              getValue={(c: any) => c.finance.total_revenue}
            />
            <MetricRow
              label="Net Profit"
              companies={sortedCompanies}
              getValue={(c: any) => c.finance.net_profit}
            />
            <MetricRow
              label="Cash Balance"
              companies={sortedCompanies}
              getValue={(c: any) => c.cash_balance}
            />
            <MetricRow
              label="Total Assets"
              companies={sortedCompanies}
              getValue={(c: any) => c.total_assets}
            />
            <MetricRow
              label="ROI %"
              companies={sortedCompanies}
              getValue={(c: any) => c.finance.roi}
              format={(v: number) => `${v}%`}
            />
            <MetricRow
              label="Brand Value"
              companies={sortedCompanies}
              getValue={(c: any) => c.brand_value}
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
                getValue={(c: any) => c.hr.total_budget}
              />
              <MetricRow
                label="Employee Satisfaction"
                companies={sortedCompanies}
                getValue={(c: any) => c.hr.employee_satisfaction}
                format={(v: number) => `${v}%`}
              />
              <MetricRow
                label="Production Capacity"
                companies={sortedCompanies}
                getValue={(c: any) => c.production.production_capacity}
                format={formatNumber}
              />
              <MetricRow
                label="Defect Rate"
                companies={sortedCompanies}
                getValue={(c: any) => c.production.defect_rate}
                format={(v: number) => `${v}%`}
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
                    className="border-b border-gray-700/50 pb-4"
                  >
                    <h4 className="font-semibold text-white mb-2">
                      {company.name}
                    </h4>
                    <div className="space-y-2">
                      {company.products.map((product: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-300">{product.name}</span>
                          <div className="flex gap-4">
                            <span className="text-blue-400">
                              {product.market_share}% share
                            </span>
                            <span className="text-yellow-400">
                              {product.customer_satisfaction}★
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
              getValue={(c: any) => c.rd.budget}
            />
            <MetricRow
              label="Patents Filed"
              companies={sortedCompanies}
              getValue={(c: any) => c.rd.patented}
              format={(v: number) => v.toString()}
            />
            <MetricRow
              label="Quality Improvements"
              companies={sortedCompanies}
              getValue={(c: any) => c.rd.quality_changes}
              format={(v: number) => v.toString()}
            />
            <MetricRow
              label="Marketing Budget"
              companies={sortedCompanies}
              getValue={(c: any) => c.marketing_budget}
            />
          </ComparisonCard>
        )}

        {/* Performance Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-800/30 to-green-900/30 rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Revenue Leader</h3>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {sortedCompanies[0]?.name}
            </p>
            <p className="text-green-300 text-sm">
              {formatCurrency(sortedCompanies[0]?.finance.total_revenue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Highest ROI</h3>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {[...companiesData].sort((a, b) => b.finance.roi - a.finance.roi)[0]
                ?.name}
            </p>
            <p className="text-blue-300 text-sm">
              {[
                ...companiesData,
              ].sort((a, b) => b.finance.roi - a.finance.roi)[0]?.finance.roi}
              %
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
              {[...companiesData].sort(
                (a, b) => b.hr.employee_satisfaction - a.hr.employee_satisfaction
              )[0]?.name}
            </p>
            <p className="text-yellow-300 text-sm">
              {[...companiesData].sort(
                (a, b) => b.hr.employee_satisfaction - a.hr.employee_satisfaction
              )[0]?.hr.employee_satisfaction}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;

