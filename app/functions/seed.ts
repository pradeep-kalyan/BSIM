// import prisma from "./prisma";


// async function main() {
//   // Password hash for 'password123'
//   const hashedPassword =
//     "$2y$10$oV0RDjW0/9FIJ87.db7Oied03ymlfQQOLY0u.JGznOm8Dpit6fniq";

//   console.log("🌱 Starting database seed...");

//   // Create Users
//   const users = await Promise.all([
//     prisma.user.create({
//       data: {
//         name: "John Smith",
//         email: "john@example.com",
//         password_hash: hashedPassword,
//         role: "admin",
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Sarah Johnson",
//         email: "sarah@example.com",
//         password_hash: hashedPassword,
//         role: "user",
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Mike Chen",
//         email: "mike@example.com",
//         password_hash: hashedPassword,
//         role: "user",
//       },
//     }),
//     prisma.user.create({
//       data: {
//         name: "Emily Davis",
//         email: "emily@example.com",
//         password_hash: hashedPassword,
//         role: "user",
//       },
//     }),
//   ]);
//   console.log("✅ Created users");

//   // Create Simulations
//   const electronicsConfig = {
//     duration: 12,
//     starting_budget: 1000000,
//     market_volatility: 0.3,
//     innovation_importance: 0.4,
//     sustainability_weight: 0.25,
//   };

//   const fashionConfig = {
//     duration: 8,
//     starting_budget: 500000,
//     market_volatility: 0.4,
//     innovation_importance: 0.3,
//     sustainability_weight: 0.5,
//   };

//   const simulations = await Promise.all([
//     prisma.simulation.create({
//       data: {
//         name: "Global Electronics Market",
//         description:
//           "A comprehensive simulation of the global electronics market including smartphones, laptops, and wearables",
//         config: JSON.stringify(electronicsConfig),
//         status: "active",
//         created_by: users[0].id,
//       },
//     }),
//     prisma.simulation.create({
//       data: {
//         name: "Sustainable Fashion Industry",
//         description:
//           "Simulation focused on sustainable fashion and apparel industry dynamics",
//         config: JSON.stringify(fashionConfig),
//         status: "active",
//         created_by: users[0].id,
//       },
//     }),
//   ]);
//   console.log("✅ Created simulations");

//   // Create Companies
//   const companies = await Promise.all([
//     // Electronics Market Companies
//     prisma.company.create({
//       data: {
//         simulation_id: simulations[0].id,
//         user_id: users[1].id,
//         name: "TechNova Solutions",
//         description:
//           "Innovative technology company specializing in consumer electronics",
//         logo_url: "https://example.com/logos/technova.png",
//         cash_balance: 850000,
//         total_assets: 1200000,
//         total_liabilities: 300000,
//         credit_rating: "A+",
//         brand_value: 150000,
//       },
//     }),
//     prisma.company.create({
//       data: {
//         simulation_id: simulations[0].id,
//         user_id: users[2].id,
//         name: "Digital Dynamics Corp",
//         description: "Leading manufacturer of mobile devices and accessories",
//         logo_url: "https://example.com/logos/digitaldynamics.png",
//         cash_balance: 750000,
//         total_assets: 1100000,
//         total_liabilities: 400000,
//         credit_rating: "A",
//         brand_value: 180000,
//       },
//     }),
//     // Fashion Industry Companies
//     prisma.company.create({
//       data: {
//         simulation_id: simulations[1].id,
//         user_id: users[3].id,
//         name: "EcoThread Fashion",
//         description:
//           "Sustainable fashion brand focusing on eco-friendly materials",
//         logo_url: "https://example.com/logos/ecothread.png",
//         cash_balance: 420000,
//         total_assets: 600000,
//         total_liabilities: 150000,
//         credit_rating: "B+",
//         brand_value: 80000,
//       },
//     }),
//     prisma.company.create({
//       data: {
//         simulation_id: simulations[1].id,
//         user_id: users[1].id,
//         name: "Urban Style Co",
//         description:
//           "Modern urban fashion retailer with focus on trendy designs",
//         logo_url: "https://example.com/logos/urbanstyle.png",
//         cash_balance: 380000,
//         total_assets: 550000,
//         total_liabilities: 200000,
//         credit_rating: "B",
//         brand_value: 95000,
//       },
//     }),
//   ]);
//   console.log("✅ Created companies");

//   // Create Products
//   const products = await Promise.all([
//     // TechNova Products
//     prisma.product.create({
//       data: {
//         company_id: companies[0].id,
//         name: "NovaPro Smartphone",
//         description: "High-performance smartphone with AI capabilities",
//         category: "Mobile Devices",
//         quality_rating: 8.5,
//         innovation_rating: 9.2,
//         sustainability_rating: 6.8,
//         production_cost: 250,
//         selling_price: 699,
//         inventory_level: 1500,
//         production_capacity: 3000,
//         development_cost: 150000,
//         marketing_budget: 75000,
//         status: "active",
//         launch_period: 1,
//       },
//     }),
//     prisma.product.create({
//       data: {
//         company_id: companies[0].id,
//         name: "Nova Earbuds Pro",
//         description: "Wireless earbuds with noise cancellation",
//         category: "Audio Accessories",
//         quality_rating: 7.8,
//         innovation_rating: 8.0,
//         sustainability_rating: 7.5,
//         production_cost: 45,
//         selling_price: 199,
//         inventory_level: 2800,
//         production_capacity: 5000,
//         development_cost: 80000,
//         marketing_budget: 40000,
//         status: "active",
//         launch_period: 2,
//       },
//     }),
//     // Digital Dynamics Product
//     prisma.product.create({
//       data: {
//         company_id: companies[1].id,
//         name: "DD Tablet Ultra",
//         description: "Premium tablet for professional use",
//         category: "Tablets",
//         quality_rating: 8.2,
//         innovation_rating: 7.8,
//         sustainability_rating: 6.2,
//         production_cost: 180,
//         selling_price: 549,
//         inventory_level: 800,
//         production_capacity: 2000,
//         development_cost: 120000,
//         marketing_budget: 60000,
//         status: "active",
//         launch_period: 1,
//       },
//     }),
//     // EcoThread Product
//     prisma.product.create({
//       data: {
//         company_id: companies[2].id,
//         name: "Organic Cotton T-Shirt",
//         description: "Sustainable t-shirt made from 100% organic cotton",
//         category: "Apparel",
//         quality_rating: 7.5,
//         innovation_rating: 6.5,
//         sustainability_rating: 9.2,
//         production_cost: 12,
//         selling_price: 39,
//         inventory_level: 5000,
//         production_capacity: 8000,
//         development_cost: 25000,
//         marketing_budget: 15000,
//         status: "active",
//         launch_period: 1,
//       },
//     }),
//     // Urban Style Product
//     prisma.product.create({
//       data: {
//         company_id: companies[3].id,
//         name: "Urban Denim Jacket",
//         description: "Trendy denim jacket with modern fit",
//         category: "Apparel",
//         quality_rating: 7.0,
//         innovation_rating: 6.0,
//         sustainability_rating: 5.8,
//         production_cost: 25,
//         selling_price: 89,
//         inventory_level: 1200,
//         production_capacity: 2500,
//         development_cost: 18000,
//         marketing_budget: 12000,
//         status: "active",
//         launch_period: 1,
//       },
//     }),
//   ]);
//   console.log("✅ Created products");

//   // Market Conditions
//   const marketConditions = await Promise.all([
//     // Electronics Market - Period 1
//     prisma.market_condition.create({
//       data: {
//         simulation_id: simulations[0].id,
//         period: 1,
//         total_market_size: 50000000,
//         segment_distribution: JSON.stringify({
//           smartphones: 0.45,
//           tablets: 0.25,
//           accessories: 0.3,
//         }),
//         economic_indicators: JSON.stringify({
//           gdp_growth: 0.032,
//           inflation_rate: 0.025,
//           unemployment: 0.045,
//           consumer_confidence: 0.68,
//         }),
//         consumer_preferences: JSON.stringify({
//           price_sensitivity: 0.7,
//           brand_loyalty: 0.4,
//           feature_importance: 0.8,
//           sustainability_concern: 0.3,
//         }),
//         technology_trends: JSON.stringify({
//           ai_adoption: 0.6,
//           "5g_penetration": 0.4,
//           iot_growth: 0.5,
//         }),
//         sustainability_importance: 0.35,
//       },
//     }),
//     // Electronics Market - Period 2
//     prisma.market_condition.create({
//       data: {
//         simulation_id: simulations[0].id,
//         period: 2,
//         total_market_size: 52000000,
//         segment_distribution: JSON.stringify({
//           smartphones: 0.44,
//           tablets: 0.26,
//           accessories: 0.3,
//         }),
//         economic_indicators: JSON.stringify({
//           gdp_growth: 0.028,
//           inflation_rate: 0.031,
//           unemployment: 0.042,
//           consumer_confidence: 0.71,
//         }),
//         consumer_preferences: JSON.stringify({
//           price_sensitivity: 0.72,
//           brand_loyalty: 0.42,
//           feature_importance: 0.82,
//           sustainability_concern: 0.38,
//         }),
//         technology_trends: JSON.stringify({
//           ai_adoption: 0.65,
//           "5g_penetration": 0.48,
//           iot_growth: 0.55,
//         }),
//         sustainability_importance: 0.38,
//       },
//     }),
//     // Fashion Market - Period 1
//     prisma.market_condition.create({
//       data: {
//         simulation_id: simulations[1].id,
//         period: 1,
//         total_market_size: 25000000,
//         segment_distribution: JSON.stringify({
//           casual_wear: 0.5,
//           formal_wear: 0.3,
//           accessories: 0.2,
//         }),
//         economic_indicators: JSON.stringify({
//           gdp_growth: 0.025,
//           inflation_rate: 0.028,
//           unemployment: 0.048,
//           consumer_confidence: 0.65,
//         }),
//         consumer_preferences: JSON.stringify({
//           price_sensitivity: 0.75,
//           brand_loyalty: 0.35,
//           style_importance: 0.85,
//           sustainability_concern: 0.55,
//         }),
//         technology_trends: JSON.stringify({
//           ecommerce_growth: 0.8,
//           social_media_influence: 0.9,
//           virtual_fitting: 0.2,
//         }),
//         sustainability_importance: 0.55,
//       },
//     }),
//   ]);
//   console.log("✅ Created market conditions");

//   // Performance Results
//   const performanceResults = await Promise.all([
//     prisma.performance_result.create({
//       data: {
//         company_id: companies[0].id,
//         period: 1,
//         revenue: 1050000,
//         costs: 750000,
//         profit: 300000,
//         market_share: 0.18,
//         cash_flow: 250000,
//         roi: 0.15,
//         customer_satisfaction: 8.2,
//         employee_satisfaction: 7.8,
//         sustainability_score: 6.5,
//         innovation_score: 8.8,
//         brand_value_change: 15000,
//       },
//     }),
//     prisma.performance_result.create({
//       data: {
//         company_id: companies[1].id,
//         period: 1,
//         revenue: 980000,
//         costs: 720000,
//         profit: 260000,
//         market_share: 0.16,
//         cash_flow: 220000,
//         roi: 0.13,
//         customer_satisfaction: 7.9,
//         employee_satisfaction: 7.5,
//         sustainability_score: 5.8,
//         innovation_score: 7.9,
//         brand_value_change: 12000,
//       },
//     }),
//     prisma.performance_result.create({
//       data: {
//         company_id: companies[2].id,
//         period: 1,
//         revenue: 585000,
//         costs: 420000,
//         profit: 165000,
//         market_share: 0.12,
//         cash_flow: 140000,
//         roi: 0.11,
//         customer_satisfaction: 8.5,
//         employee_satisfaction: 8.0,
//         sustainability_score: 9.2,
//         innovation_score: 6.8,
//         brand_value_change: 8000,
//       },
//     }),
//   ]);
//   console.log("✅ Created performance results");

//   // Decisions
//   const marketingDecision = {
//     product_id: products[0].id,
//     budget_allocation: 100000,
//     channels: ["digital", "tv", "social"],
//     target_demographics: ["18-35", "35-50"],
//     campaign_type: "awareness",
//   };

//   const rdDecision = {
//     product_id: products[1].id,
//     investment_amount: 75000,
//     focus_areas: ["battery_life", "sound_quality"],
//     timeline: 2,
//   };

//   const productionDecision = {
//     product_id: products[2].id,
//     quantity: 1500,
//     quality_investment: 50000,
//     sustainability_measures: ["recycled_materials", "carbon_offset"],
//   };


//   // Events
//   const events = await Promise.all([
//     prisma.event.create({
//       data: {
//         simulation_id: simulations[0].id,
//         period: 2,
//         type: "market_disruption",
//         name: "New Technology Breakthrough",
//         description:
//           "A major technological breakthrough in battery technology affects all electronic devices",
//         impact_area: "technology",
//         impact_strength: 0.8,
//         affected_companies: JSON.stringify([companies[0].id, companies[1].id]),
//       },
//     }),
//     prisma.event.create({
//       data: {
//         simulation_id: simulations[0].id,
//         period: 3,
//         type: "economic",
//         name: "Supply Chain Disruption",
//         description:
//           "Global supply chain disruption affects production costs and delivery times",
//         impact_area: "operations",
//         impact_strength: -0.6,
//         affected_companies: JSON.stringify([companies[0].id, companies[1].id]),
//       },
//     }),
//     prisma.event.create({
//       data: {
//         simulation_id: simulations[1].id,
//         period: 2,
//         type: "regulatory",
//         name: "Sustainability Regulations",
//         description:
//           "New environmental regulations require improved sustainability practices",
//         impact_area: "sustainability",
//         impact_strength: 0.7,
//         affected_companies: JSON.stringify([companies[2].id, companies[3].id]),
//       },
//     }),
//   ]);
//   console.log("✅ Created events");

//   // Product Performances
//   const productPerformances = await Promise.all([
//     prisma.product_performance.create({
//       data: {
//         product_id: products[0].id,
//         period: 1,
//         sales_volume: 1200,
//         revenue: 838800,
//         costs: 300000,
//         profit: 538800,
//         market_share: 0.15,
//         customer_satisfaction: 8.4,
//       },
//     }),
//     prisma.product_performance.create({
//       data: {
//         product_id: products[1].id,
//         period: 2,
//         sales_volume: 2100,
//         revenue: 417900,
//         costs: 94500,
//         profit: 323400,
//         market_share: 0.22,
//         customer_satisfaction: 8.1,
//       },
//     }),
//     prisma.product_performance.create({
//       data: {
//         product_id: products[2].id,
//         period: 1,
//         sales_volume: 680,
//         revenue: 373320,
//         costs: 122400,
//         profit: 250920,
//         market_share: 0.08,
//         customer_satisfaction: 7.9,
//       },
//     }),
//   ]);
//   console.log("✅ Created product performances");

//   console.log("🎉 Seed completed successfully!");

//   console.log("\n📊 Database Summary:");
//   console.log(`- Users: ${users.length}`);
//   console.log(`- Simulations: ${simulations.length}`);
//   console.log(`- Companies: ${companies.length}`);
//   console.log(`- Products: ${products.length}`);
//   console.log(`- Market Conditions: ${marketConditions.length}`);
//   console.log(`- Performance Results: ${performanceResults.length}`);
//   // console.log(`- Decisions: ${decisions.length}`);
//   console.log(`- Events: ${events.length}`);
//   console.log(`- Product Performances: ${productPerformances.length}`);
// }

// main()
//   .catch((e) => {
//     console.error("❌ Error during seed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
