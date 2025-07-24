// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   Cell,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";
// import {
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Target,
//   ShoppingCart,
//   Star,
//   BarChart3,
//   LucideIcon,
// } from "lucide-react";

// // Mock data based on your database schema


// const COLORS = [
//   "#8884d8",
//   "#82ca9d",
//   "#ffc658",
//   "#ff8042",
//   "#8dd1e1",
//   "#d0ed57",
//   "#a4de6c",
//   "#ff6b6b",
// ];

// interface CardProps {
//   title: string;
//   value: string | number;
//   change?: number;
//   icon: LucideIcon;
//   color?: string;
// }

// const Card = ({
//   title,
//   value,
//   change,
//   icon: Icon,
//   color = "blue",
// }: CardProps) => (
//   <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-gray-400 text-sm font-medium">{title}</p>
//         <p className="text-2xl font-bold text-white mt-1">{value}</p>
//         {change && (
//           <div
//             className={`flex items-center mt-2 ${
//               change > 0 ? "text-green-400" : "text-red-400"
//             }`}
//           >
//             {change > 0 ? (
//               <TrendingUp className="w-4 h-4 mr-1" />
//             ) : (
//               <TrendingDown className="w-4 h-4 mr-1" />
//             )}
//             <span className="text-sm">{Math.abs(change)}% vs last period</span>
//           </div>
//         )}
//       </div>
//       <Icon className={`w-8 h-8 text-${color}-400`} />
//     </div>
//   </div>
// );

// const MarketingDashboard = () => {
//   const [company] = useState();
//   const [performanceData] = useState()
//   const [loading] = useState(false);

//   const activeProducts = company.products.filter((p) => p.status === "active");
//   const totalMarketingBudget = activeProducts.reduce(
//     (sum, product) => sum + product.marketing_budget,
//     0
//   );
//   const averageCustomerSatisfaction =
//     performanceData[performanceData.length - 1]?.customer_satisfaction || 0;
//   const currentROI = performanceData[performanceData.length - 1]?.roi || 0;
//   const currentMarketShare =
//     performanceData[performanceData.length - 1]?.market_share || 0;

//   // Marketing budget distribution
//   const budgetDistribution = activeProducts.map((product) => ({
//     name: product.name,
//     value: product.marketing_budget,
//     percentage: (
//       (product.marketing_budget / totalMarketingBudget) *
//       100
//     ).toFixed(1),
//   }));

//   // Product performance metrics
//   const productMetrics = mockProductPerformance.map((product) => ({
//     name: product.product,
//     sales: product.sales_volume,
//     revenue: product.revenue,
//     market_share: product.market_share,
//     satisfaction: product.customer_satisfaction,
//   }));

//   // ROI and Revenue trend
//   const trendData = performanceData.map((data) => ({
//     period: `Period ${data.period}`,
//     revenue: data.revenue / 1000, // Convert to thousands
//     roi: data.roi,
//     market_share: data.market_share,
//   }));

//   if (loading) {
//     return <div className="text-white">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Marketing Dashboard
//           </h1>
//           <p className="text-gray-400">
//             Period {company.current_period} | {company.name}
//           </p>
//         </div>

//         {/* Key Metrics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card
//             title="Total Marketing Budget"
//             value={`$${totalMarketingBudget.toLocaleString()}`}
//             change={8.5}
//             icon={DollarSign}
//             color="green"
//           />
//           <Card
//             title="Market Share"
//             value={`${currentMarketShare}%`}
//             change={12.3}
//             icon={Target}
//             color="blue"
//           />
//           <Card
//             title="Customer Satisfaction"
//             value={`${averageCustomerSatisfaction}/5`}
//             change={4.7}
//             icon={Star}
//             color="yellow"
//           />
//           <Card
//             title="Marketing ROI"
//             value={`${currentROI}%`}
//             change={15.2}
//             icon={TrendingUp}
//             color="purple"
//           />
//         </div>

//         {/* Charts Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Marketing Budget Distribution */}
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <div className="flex items-center mb-4">
//               <h3 className="text-xl font-semibold text-white">
//                 Marketing Budget Distribution
//               </h3>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={budgetDistribution}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   label={({ name, percentage }) => `${name} (${percentage}%)`}
//                 >
//                   {budgetDistribution.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Revenue & ROI Trend */}
//           <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
//             <div className="flex items-center mb-4">
//               <BarChart3 className="w-5 h-5 text-green-400 mr-2" />
//               <h3 className="text-xl font-semibold text-white">
//                 Revenue & ROI Trend
//               </h3>
//             </div>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={trendData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="period" stroke="#9CA3AF" />
//                 <YAxis yAxisId="left" stroke="#9CA3AF" />
//                 <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#1F2937",
//                     border: "1px solid #374151",
//                   }}
//                   formatter={(value, name) => [
//                     name === "revenue" ? `$${value}K` : `${value}%`,
//                     name === "revenue" ? "Revenue" : "ROI",
//                   ]}
//                 />
//                 <Legend />
//                 <Area
//                   yAxisId="left"
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#10B981"
//                   fill="#10B981"
//                   fillOpacity={0.3}
//                 />
//                 <Line
//                   yAxisId="right"
//                   type="monotone"
//                   dataKey="roi"
//                   stroke="#F59E0B"
//                   strokeWidth={3}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Product Performance */}
//         <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
//           <div className="flex items-center mb-4">
//             <ShoppingCart className="w-5 h-5 text-purple-400 mr-2" />
//             <h3 className="text-xl font-semibold text-white">
//               Product Performance
//             </h3>
//           </div>
//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={productMetrics}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis dataKey="name" stroke="#9CA3AF" />
//               <YAxis yAxisId="left" stroke="#9CA3AF" />
//               <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#1F2937",
//                   border: "1px solid #374151",
//                 }}
//                 formatter={(value, name) => [
//                   name === "revenue"
//                     ? `$${value.toLocaleString()}`
//                     : name === "sales"
//                     ? `${value.toLocaleString()} units`
//                     : name === "market_share"
//                     ? `${value}%`
//                     : `${value}/5`,
//                   name === "revenue"
//                     ? "Revenue"
//                     : name === "sales"
//                     ? "Sales Volume"
//                     : name === "market_share"
//                     ? "Market Share"
//                     : "Customer Satisfaction",
//                 ]}
//               />
//               <Legend />
//               <Bar
//                 yAxisId="left"
//                 dataKey="sales"
//                 fill="#8884d8"
//                 name="Sales Volume"
//               />
//               <Bar
//                 yAxisId="right"
//                 dataKey="market_share"
//                 fill="#82ca9d"
//                 name="Market Share %"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Market Share Evolution */}
//         <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
//           <div className="flex items-center mb-4">
//             <Target className="w-5 h-5 text-red-400 mr-2" />
//             <h3 className="text-xl font-semibold text-white">
//               Market Share Evolution
//             </h3>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={trendData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//               <XAxis dataKey="period" stroke="#9CA3AF" />
//               <YAxis stroke="#9CA3AF" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#1F2937",
//                   border: "1px solid #374151",
//                 }}
//                 formatter={(value) => [`${value}%`, "Market Share"]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="market_share"
//                 stroke="#EF4444"
//                 strokeWidth={3}
//                 dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
//                 name="Market Share %"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Product Details Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {activeProducts.map((product) => (
//             <div
//               key={product.id}
//               className="bg-gray-800 rounded-lg p-6 border border-gray-700"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="text-lg font-semibold text-white">
//                   {product.name}
//                 </h4>
//                 <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
//                   {product.status}
//                 </span>
//               </div>

//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Marketing Budget:</span>
//                   <span className="text-white font-medium">
//                     ${product.marketing_budget.toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Selling Price:</span>
//                   <span className="text-white font-medium">
//                     ${product.selling_price}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Quality Rating:</span>
//                   <span className="text-white font-medium">
//                     {product.quality_rating}/5
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Innovation:</span>
//                   <span className="text-white font-medium">
//                     {product.innovation_rating}/5
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Sustainability:</span>
//                   <span className="text-white font-medium">
//                     {product.sustainability_rating}/5
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Inventory:</span>
//                   <span className="text-white font-medium">
//                     {product.inventory_level} units
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketingDashboard;
