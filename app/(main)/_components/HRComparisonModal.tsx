"use client";

import React from "react";
import { X, TrendingUp, TrendingDown, Users, DollarSign, Award, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";

interface ExistingRole {
    role_name: string;
    salary_per_head: number;
    current_head_count: number;
    hires: number;
    fires: number;
}

interface NewRole {
    role_name: string;
    salary_per_head: number;
    hires: number;
}

interface CompanyData {
    id: string;
    name: string;
    current_period: number;
    cash_balance: number;
}

interface ComparisonData {
    previous: {
        totalBudget: number;
        salaryBudget: number;
        trainingBudget: number;
        employeeSatisfaction: number;
        totalEmployees: number;
        totalHires: number;
        totalFires: number;
        roles: Array<{
            role_name: string;
            salary_per_head: number;
            head_count: number;
        }>;
    };
    current: {
        totalBudget: number;
        salaryBudget: number;
        trainingBudget: number;
        employeeSatisfaction: number;
        totalEmployees: number;
        totalHires: number;
        totalFires: number;
        roles: Array<{
            role_name: string;
            salary_per_head: number;
            head_count: number;
        }>;
    };
}

interface HRComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyData: CompanyData;
    existingRoles: ExistingRole[];
    newRoles: NewRole[];
    trainingBudget: number;
    employeeSatisfaction: number;
    previousDecision: any; // The last submitted decision for current period
}

const HRComparisonModal: React.FC<HRComparisonModalProps> = ({
    isOpen,
    onClose,
    companyData,
    existingRoles,
    newRoles,
    trainingBudget,
    employeeSatisfaction,
    previousDecision
}) => {
    if (!isOpen || !previousDecision) return null;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

    const formatChange = (current: number, previous: number) => {
        const change = current - previous;
        const percentChange = previous !== 0 ? ((change / previous) * 100) : 0;
        const isPositive = change > 0;
        const isZero = change === 0;

        return {
            absolute: change,
            percentage: percentChange,
            isPositive,
            isZero,
            formatted: isZero ? "No change" : `${isPositive ? '+' : ''}${formatCurrency(change)} (${isPositive ? '+' : ''}${percentChange.toFixed(1)}%)`
        };
    };

    // Current decision calculations (what user is about to submit)
    const currentSalaryFromExisting = existingRoles.reduce((acc, r) => {
        const newHeadCount = r.current_head_count + r.hires - r.fires;
        return newHeadCount > 0 ? acc + newHeadCount * r.salary_per_head : acc;
    }, 0);

    const currentSalaryFromNew = newRoles.reduce((acc, r) => acc + r.hires * r.salary_per_head, 0);
    const currentSalaryBudget = currentSalaryFromExisting + currentSalaryFromNew;

    const currentRecruitmentCost = existingRoles.reduce((acc, r) => acc + r.hires * r.salary_per_head, 0) +
        newRoles.reduce((acc, r) => acc + r.hires * r.salary_per_head, 0);

    const currentFiringSavings = existingRoles.reduce((acc, r) => acc + r.fires * r.salary_per_head, 0);
    const currentTotalBudget = trainingBudget + currentRecruitmentCost - currentFiringSavings;
    
    const currentTotalHires = existingRoles.reduce((acc, r) => acc + r.hires, 0) + newRoles.reduce((acc, r) => acc + r.hires, 0);
    const currentTotalFires = existingRoles.reduce((acc, r) => acc + r.fires, 0);
    const currentEmployees = existingRoles.reduce((acc, r) => acc + r.current_head_count, 0);
    const currentProjectedEmployees = currentEmployees + currentTotalHires - currentTotalFires;

    // Previous decision data (last submitted decision for current period)
    const previousSalaryBudget = previousDecision.salary_budget || 0;
    const previousTrainingBudget = previousDecision.training_budget || 0;
    const previousRecruitmentCost = previousDecision.recruitment_cost || 0;
    const previousFiringSavings = previousDecision.firing_savings || 0;
    const previousTotalBudget = previousDecision.total_budget || previousTrainingBudget + previousRecruitmentCost - previousFiringSavings;
    const previousEmployeeSatisfaction = previousDecision.employee_satisfaction || 50;
    
    // Calculate previous total employees from roles
    const previousTotalEmployees = previousDecision.roles ? 
        previousDecision.roles.reduce((acc: number, r: any) => acc + (r.head_count || 0), 0) : 
        currentEmployees; // fallback to current if no previous roles data

    // Calculate previous hires/fires if available
    const previousTotalHires = previousDecision.total_hires || 0;
    const previousTotalFires = previousDecision.total_fires || 0;

    // Create comparison data
    const comparisonData: ComparisonData = {
        previous: {
            totalBudget: previousTotalBudget,
            salaryBudget: previousSalaryBudget,
            trainingBudget: previousTrainingBudget,
            employeeSatisfaction: previousEmployeeSatisfaction,
            totalEmployees: previousTotalEmployees,
            totalHires: previousTotalHires,
            totalFires: previousTotalFires,
            roles: previousDecision.roles || []
        },
        current: {
            totalBudget: currentTotalBudget,
            salaryBudget: currentSalaryBudget,
            trainingBudget: trainingBudget,
            employeeSatisfaction: employeeSatisfaction,
            totalEmployees: currentProjectedEmployees,
            totalHires: currentTotalHires,
            totalFires: currentTotalFires,
            roles: [
                ...existingRoles.map(r => ({
                    role_name: r.role_name,
                    salary_per_head: r.salary_per_head,
                    head_count: r.current_head_count + r.hires - r.fires
                })),
                ...newRoles.map(r => ({
                    role_name: r.role_name,
                    salary_per_head: r.salary_per_head,
                    head_count: r.hires
                }))
            ].filter(r => r.head_count > 0)
        }
    };

    // Calculate changes
    const budgetChange = formatChange(comparisonData.current.totalBudget, comparisonData.previous.totalBudget);
    const salaryChange = formatChange(comparisonData.current.salaryBudget, comparisonData.previous.salaryBudget);
    const trainingChange = formatChange(comparisonData.current.trainingBudget, comparisonData.previous.trainingBudget);
    const satisfactionChange = formatChange(comparisonData.current.employeeSatisfaction, comparisonData.previous.employeeSatisfaction);
    const employeeChange = formatChange(comparisonData.current.totalEmployees, comparisonData.previous.totalEmployees);

    // Chart data
    const budgetComparisonData = [
        {
            category: "Total Budget",
            previous: comparisonData.previous.totalBudget,
            current: comparisonData.current.totalBudget,
        },
        {
            category: "Salary Budget",
            previous: comparisonData.previous.salaryBudget,
            current: comparisonData.current.salaryBudget,
        },
        {
            category: "Training Budget",
            previous: comparisonData.previous.trainingBudget,
            current: comparisonData.current.trainingBudget,
        }
    ];

    // Role comparison data - improved logic
    const roleComparisonData = () => {
        const currentRoles = comparisonData.current.roles;
        const previousRoles = comparisonData.previous.roles;

        // Get all unique role names
        const allRoleNames = new Set([
            ...currentRoles.map(r => r.role_name),
            ...previousRoles.map(r => r.role_name)
        ]);

        return Array.from(allRoleNames).map(roleName => {
            const currentRole = currentRoles.find(r => r.role_name === roleName);
            const previousRole = previousRoles.find(r => r.role_name === roleName);

            return {
                role: roleName,
                previous: previousRole ? previousRole.head_count : 0,
                current: currentRole ? currentRole.head_count : 0,
            };
        });
    };

    const chartData = roleComparisonData();

    const satisfactionData = [
        { period: "Previous", value: comparisonData.previous.employeeSatisfaction },
        { period: "Current", value: comparisonData.current.employeeSatisfaction }
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

    const currentBudgetBreakdown = [
        { name: "Training", value: comparisonData.current.trainingBudget, color: "#10B981" },
        { name: "Recruitment", value: currentRecruitmentCost, color: "#3B82F6" },
    ].filter(item => item.value > 0);

    const previousBudgetBreakdown = [
        { name: "Training", value: comparisonData.previous.trainingBudget, color: "#10B981" },
        { name: "Recruitment", value: previousRecruitmentCost, color: "#3B82F6" },
    ].filter(item => item.value > 0);

    // Calculate remaining cash correctly
    const previousRemainingCash = companyData.cash_balance - comparisonData.previous.totalBudget;
    const currentRemainingCash = companyData.cash_balance - comparisonData.current.totalBudget;

    const MetricCard = ({ title, previous, current, formatter, icon: Icon }: any) => {
        const change = formatChange(current, previous);
        return (
            <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">{title}</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Previous:</span>
                        <span className="text-sm text-slate-300">{formatter(previous)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Current:</span>
                        <span className="text-sm text-white font-semibold">{formatter(current)}</span>
                    </div>
                    <div className="flex items-center gap-1 pt-1 border-t border-slate-600">
                        {change.isZero ? (
                            <span className="text-xs text-slate-400">No change</span>
                        ) : (
                            <>
                                {change.isPositive ? (
                                    <TrendingUp className="h-3 w-3 text-green-400" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-400" />
                                )}
                                <span className={`text-xs ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {change.formatted}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Decision Comparison</h2>
                        <p className="text-slate-400">Compare current changes with last submitted decision</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Key Metrics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <MetricCard
                            title="Total Budget"
                            previous={comparisonData.previous.totalBudget}
                            current={comparisonData.current.totalBudget}
                            formatter={formatCurrency}
                            icon={DollarSign}
                        />
                        <MetricCard
                            title="Salary Budget"
                            previous={comparisonData.previous.salaryBudget}
                            current={comparisonData.current.salaryBudget}
                            formatter={formatCurrency}
                            icon={Building2}
                        />
                        <MetricCard
                            title="Training Budget"
                            previous={comparisonData.previous.trainingBudget}
                            current={comparisonData.current.trainingBudget}
                            formatter={formatCurrency}
                            icon={Award}
                        />
                        <MetricCard
                            title="Employee Count"
                            previous={comparisonData.previous.totalEmployees}
                            current={comparisonData.current.totalEmployees}
                            formatter={(val: number) => val.toString()}
                            icon={Users}
                        />
                        <MetricCard
                            title="Satisfaction"
                            previous={comparisonData.previous.employeeSatisfaction}
                            current={comparisonData.current.employeeSatisfaction}
                            formatter={(val: number) => `${val}%`}
                            icon={TrendingUp}
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Budget Comparison */}
                        <div className="bg-slate-700/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Budget Comparison</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={budgetComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="category" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                            color: "#F3F4F6",
                                        }}
                                        formatter={(value: any) => [formatCurrency(value), ""]}
                                    />
                                    <Legend />
                                    <Bar dataKey="previous" fill="#64748B" name="Previous" />
                                    <Bar dataKey="current" fill="#3B82F6" name="Current" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Role Distribution Comparison */}
                        <div className="bg-slate-700/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Role Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="role" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                            color: "#F3F4F6",
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="previous" fill="#64748B" name="Previous" />
                                    <Bar dataKey="current" fill="#10B981" name="Current" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Employee Satisfaction Trend */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-slate-700/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Employee Satisfaction</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={satisfactionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="period" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1F2937",
                                            border: "1px solid #374151",
                                            borderRadius: "8px",
                                            color: "#F3F4F6",
                                        }}
                                        formatter={(value: any) => [`${value}%`, "Satisfaction"]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        dot={{ r: 6, fill: "#8B5CF6" }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Budget Breakdown Pie Charts */}
                        <div className="bg-slate-700/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Budget Breakdown Comparison</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-300 mb-2 text-center">Previous</h4>
                                    <ResponsiveContainer width="100%" height={120}>
                                        <PieChart>
                                            <Pie
                                                data={previousBudgetBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={40}
                                                dataKey="value"
                                            >
                                                {previousBudgetBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-300 mb-2 text-center">Current</h4>
                                    <ResponsiveContainer width="100%" height={120}>
                                        <PieChart>
                                            <Pie
                                                data={currentBudgetBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={40}
                                                dataKey="value"
                                            >
                                                {currentBudgetBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any) => formatCurrency(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="bg-slate-700/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Impact Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">
                                    {currentTotalHires}
                                </div>
                                <div className="text-sm text-slate-300">New Hires</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    {currentTotalFires} Fires
                                </div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${budgetChange.isPositive ? 'text-red-400' : budgetChange.isZero ? 'text-slate-400' : 'text-green-400'}`}>
                                    {budgetChange.isZero ? '→' : budgetChange.isPositive ? '↑' : '↓'}
                                </div>
                                <div className="text-sm text-slate-300">Budget Change</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    {budgetChange.formatted}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${currentRemainingCash < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {formatCurrency(currentRemainingCash)}
                                </div>
                                <div className="text-sm text-slate-300">Remaining Cash</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    After current decision
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Continue with Current Decision
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRComparisonModal;