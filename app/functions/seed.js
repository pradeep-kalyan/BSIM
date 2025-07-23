"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("./prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, users, electronicsConfig, fashionConfig, simulations, companies, products, electronicsSegments, electronicsSegmentsPeriod2, fashionSegments, economicIndicatorsPeriod1, economicIndicatorsPeriod2, fashionEconomicIndicators, electronicsConsumerPrefs, electronicsConsumerPrefsPeriod2, fashionConsumerPrefs, electronicsTechTrends, electronicsTechTrendsPeriod2, fashionTechTrends, marketConditions, performanceResults, marketingDecision, rdDecision, productionDecision, decisions, events, productPerformances;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Starting database seed...");
                    // Clear existing data
                    return [4 /*yield*/, prisma_1.default.event.deleteMany()];
                case 1:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.product_performance.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.performance_result.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.market_condition.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.decision.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.product.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.company.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.simulation.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.user.deleteMany()];
                case 9:
                    _a.sent();
                    hashedPassword = "$2y$10$oV0RDjW0/9FIJ87.db7Oied03ymlfQQOLY0u.JGznOm8Dpit6fniq";
                    return [4 /*yield*/, Promise.all([
                            prisma_1.default.user.create({
                                data: {
                                    name: "John Smith",
                                    email: "john@example.com",
                                    password_hash: hashedPassword,
                                    role: "admin",
                                },
                            }),
                            prisma_1.default.user.create({
                                data: {
                                    name: "Sarah Johnson",
                                    email: "sarah@example.com",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                            prisma_1.default.user.create({
                                data: {
                                    name: "Mike Chen",
                                    email: "mike@example.com",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                            prisma_1.default.user.create({
                                data: {
                                    name: "Emily Davis",
                                    email: "emily@example.com",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                        ])];
                case 10:
                    users = _a.sent();
                    console.log("✅ Created users");
                    electronicsConfig = {
                        duration: 12,
                        starting_budget: 1000000,
                        market_volatility: 0.3,
                        innovation_importance: 0.4,
                        sustainability_weight: 0.25,
                    };
                    fashionConfig = {
                        duration: 8,
                        starting_budget: 500000,
                        market_volatility: 0.4,
                        innovation_importance: 0.3,
                        sustainability_weight: 0.5,
                    };
                    return [4 /*yield*/, Promise.all([
                            prisma_1.default.simulation.create({
                                data: {
                                    name: "Global Electronics Market",
                                    description: "A comprehensive simulation of the global electronics market including smartphones, laptops, and wearables",
                                    config: JSON.stringify(electronicsConfig),
                                    status: "active",
                                    created_by: users[0].id,
                                },
                            }),
                            prisma_1.default.simulation.create({
                                data: {
                                    name: "Sustainable Fashion Industry",
                                    description: "Simulation focused on sustainable fashion and apparel industry dynamics",
                                    config: JSON.stringify(fashionConfig),
                                    status: "active",
                                    created_by: users[0].id,
                                },
                            }),
                        ])];
                case 11:
                    simulations = _a.sent();
                    console.log("✅ Created simulations");
                    return [4 /*yield*/, Promise.all([
                            // Electronics Market Companies
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: simulations[0].id,
                                    user_id: users[1].id,
                                    name: "TechNova Solutions",
                                    description: "Innovative technology company specializing in consumer electronics",
                                    logo_url: "https://example.com/logos/technova.png",
                                    cash_balance: 850000,
                                    total_assets: 1200000,
                                    total_liabilities: 300000,
                                    credit_rating: "A+",
                                    brand_value: 150000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: simulations[0].id,
                                    user_id: users[2].id,
                                    name: "Digital Dynamics Corp",
                                    description: "Leading manufacturer of mobile devices and accessories",
                                    logo_url: "https://example.com/logos/digitaldynamics.png",
                                    cash_balance: 750000,
                                    total_assets: 1100000,
                                    total_liabilities: 400000,
                                    credit_rating: "A",
                                    brand_value: 180000,
                                },
                            }),
                            // Fashion Industry Companies
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: simulations[1].id,
                                    user_id: users[3].id,
                                    name: "EcoThread Fashion",
                                    description: "Sustainable fashion brand focusing on eco-friendly materials",
                                    logo_url: "https://example.com/logos/ecothread.png",
                                    cash_balance: 420000,
                                    total_assets: 600000,
                                    total_liabilities: 150000,
                                    credit_rating: "B+",
                                    brand_value: 80000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: simulations[1].id,
                                    user_id: users[1].id,
                                    name: "Urban Style Co",
                                    description: "Modern urban fashion retailer with focus on trendy designs",
                                    logo_url: "https://example.com/logos/urbanstyle.png",
                                    cash_balance: 380000,
                                    total_assets: 550000,
                                    total_liabilities: 200000,
                                    credit_rating: "B",
                                    brand_value: 95000,
                                },
                            }),
                        ])];
                case 12:
                    companies = _a.sent();
                    console.log("✅ Created companies");
                    return [4 /*yield*/, Promise.all([
                            // TechNova Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[0].id,
                                    name: "NovaPro Smartphone",
                                    description: "High-performance smartphone with AI capabilities",
                                    category: "Mobile Devices",
                                    quality_rating: 8.5,
                                    innovation_rating: 9.2,
                                    sustainability_rating: 6.8,
                                    production_cost: 250,
                                    selling_price: 699,
                                    inventory_level: 1500,
                                    production_capacity: 3000,
                                    development_cost: 150000,
                                    marketing_budget: 75000,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[0].id,
                                    name: "Nova Earbuds Pro",
                                    description: "Wireless earbuds with noise cancellation",
                                    category: "Audio Accessories",
                                    quality_rating: 7.8,
                                    innovation_rating: 8.0,
                                    sustainability_rating: 7.5,
                                    production_cost: 45,
                                    selling_price: 199,
                                    inventory_level: 2800,
                                    production_capacity: 5000,
                                    development_cost: 80000,
                                    marketing_budget: 40000,
                                    status: "active",
                                    launch_period: 2,
                                },
                            }),
                            // Digital Dynamics Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[1].id,
                                    name: "DD Tablet Ultra",
                                    description: "Premium tablet for professional use",
                                    category: "Tablets",
                                    quality_rating: 8.2,
                                    innovation_rating: 7.8,
                                    sustainability_rating: 6.2,
                                    production_cost: 180,
                                    selling_price: 549,
                                    inventory_level: 800,
                                    production_capacity: 2000,
                                    development_cost: 120000,
                                    marketing_budget: 60000,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            // EcoThread Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[2].id,
                                    name: "Organic Cotton T-Shirt",
                                    description: "Sustainable t-shirt made from 100% organic cotton",
                                    category: "Apparel",
                                    quality_rating: 7.5,
                                    innovation_rating: 6.5,
                                    sustainability_rating: 9.2,
                                    production_cost: 12,
                                    selling_price: 39,
                                    inventory_level: 5000,
                                    production_capacity: 8000,
                                    development_cost: 25000,
                                    marketing_budget: 15000,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            // Urban Style Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[3].id,
                                    name: "Urban Denim Jacket",
                                    description: "Trendy denim jacket with modern fit",
                                    category: "Apparel",
                                    quality_rating: 7.0,
                                    innovation_rating: 6.0,
                                    sustainability_rating: 5.8,
                                    production_cost: 25,
                                    selling_price: 89,
                                    inventory_level: 1200,
                                    production_capacity: 2500,
                                    development_cost: 18000,
                                    marketing_budget: 12000,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                        ])];
                case 13:
                    products = _a.sent();
                    console.log("✅ Created products");
                    electronicsSegments = {
                        smartphones: 0.45,
                        tablets: 0.25,
                        accessories: 0.3,
                    };
                    electronicsSegmentsPeriod2 = {
                        smartphones: 0.44,
                        tablets: 0.26,
                        accessories: 0.3,
                    };
                    fashionSegments = {
                        casual_wear: 0.5,
                        formal_wear: 0.3,
                        accessories: 0.2,
                    };
                    economicIndicatorsPeriod1 = {
                        gdp_growth: 0.032,
                        inflation_rate: 0.025,
                        unemployment: 0.045,
                        consumer_confidence: 0.68,
                    };
                    economicIndicatorsPeriod2 = {
                        gdp_growth: 0.028,
                        inflation_rate: 0.031,
                        unemployment: 0.042,
                        consumer_confidence: 0.71,
                    };
                    fashionEconomicIndicators = {
                        gdp_growth: 0.025,
                        inflation_rate: 0.028,
                        unemployment: 0.048,
                        consumer_confidence: 0.65,
                    };
                    electronicsConsumerPrefs = {
                        price_sensitivity: 0.7,
                        brand_loyalty: 0.4,
                        feature_importance: 0.8,
                        sustainability_concern: 0.3,
                    };
                    electronicsConsumerPrefsPeriod2 = {
                        price_sensitivity: 0.72,
                        brand_loyalty: 0.42,
                        feature_importance: 0.82,
                        sustainability_concern: 0.38,
                    };
                    fashionConsumerPrefs = {
                        price_sensitivity: 0.75,
                        brand_loyalty: 0.35,
                        style_importance: 0.85,
                        sustainability_concern: 0.55,
                    };
                    electronicsTechTrends = {
                        ai_adoption: 0.6,
                        "5g_penetration": 0.4,
                        iot_growth: 0.5,
                    };
                    electronicsTechTrendsPeriod2 = {
                        ai_adoption: 0.65,
                        "5g_penetration": 0.48,
                        iot_growth: 0.55,
                    };
                    fashionTechTrends = {
                        ecommerce_growth: 0.8,
                        social_media_influence: 0.9,
                        virtual_fitting: 0.2,
                    };
                    return [4 /*yield*/, Promise.all([
                            // Electronics Market - Period 1
                            prisma_1.default.market_condition.create({
                                data: {
                                    simulation_id: simulations[0].id,
                                    period: 1,
                                    total_market_size: 50000000,
                                    segment_distribution: JSON.stringify(electronicsSegments),
                                    economic_indicators: JSON.stringify(economicIndicatorsPeriod1),
                                    consumer_preferences: JSON.stringify(electronicsConsumerPrefs),
                                    technology_trends: JSON.stringify(electronicsTechTrends),
                                    sustainability_importance: 0.35,
                                },
                            }),
                            // Electronics Market - Period 2
                            prisma_1.default.market_condition.create({
                                data: {
                                    simulation_id: simulations[0].id,
                                    period: 2,
                                    total_market_size: 52000000,
                                    segment_distribution: JSON.stringify(electronicsSegmentsPeriod2),
                                    economic_indicators: JSON.stringify(economicIndicatorsPeriod2),
                                    consumer_preferences: JSON.stringify(electronicsConsumerPrefsPeriod2),
                                    technology_trends: JSON.stringify(electronicsTechTrendsPeriod2),
                                    sustainability_importance: 0.38,
                                },
                            }),
                            // Fashion Market - Period 1
                            prisma_1.default.market_condition.create({
                                data: {
                                    simulation_id: simulations[1].id,
                                    period: 1,
                                    total_market_size: 25000000,
                                    segment_distribution: JSON.stringify(fashionSegments),
                                    economic_indicators: JSON.stringify(fashionEconomicIndicators),
                                    consumer_preferences: JSON.stringify(fashionConsumerPrefs),
                                    technology_trends: JSON.stringify(fashionTechTrends),
                                    sustainability_importance: 0.55,
                                },
                            }),
                        ])];
                case 14:
                    marketConditions = _a.sent();
                    console.log("✅ Created market conditions");
                    return [4 /*yield*/, Promise.all([
                            // TechNova - Period 1
                            prisma_1.default.performance_result.create({
                                data: {
                                    company_id: companies[0].id,
                                    period: 1,
                                    revenue: 1050000,
                                    costs: 750000,
                                    profit: 300000,
                                    market_share: 0.18,
                                    cash_flow: 250000,
                                    roi: 0.15,
                                    customer_satisfaction: 8.2,
                                    employee_satisfaction: 7.8,
                                    sustainability_score: 6.5,
                                    innovation_score: 8.8,
                                    brand_value_change: 15000,
                                },
                            }),
                            // Digital Dynamics - Period 1
                            prisma_1.default.performance_result.create({
                                data: {
                                    company_id: companies[1].id,
                                    period: 1,
                                    revenue: 980000,
                                    costs: 720000,
                                    profit: 260000,
                                    market_share: 0.16,
                                    cash_flow: 220000,
                                    roi: 0.13,
                                    customer_satisfaction: 7.9,
                                    employee_satisfaction: 7.5,
                                    sustainability_score: 5.8,
                                    innovation_score: 7.9,
                                    brand_value_change: 12000,
                                },
                            }),
                            // EcoThread - Period 1
                            prisma_1.default.performance_result.create({
                                data: {
                                    company_id: companies[2].id,
                                    period: 1,
                                    revenue: 585000,
                                    costs: 420000,
                                    profit: 165000,
                                    market_share: 0.12,
                                    cash_flow: 140000,
                                    roi: 0.11,
                                    customer_satisfaction: 8.5,
                                    employee_satisfaction: 8.0,
                                    sustainability_score: 9.2,
                                    innovation_score: 6.8,
                                    brand_value_change: 8000,
                                },
                            }),
                        ])];
                case 15:
                    performanceResults = _a.sent();
                    console.log("✅ Created performance results");
                    marketingDecision = {
                        product_id: products[0].id,
                        budget_allocation: 100000,
                        channels: ["digital", "tv", "social"],
                        target_demographics: ["18-35", "35-50"],
                        campaign_type: "awareness",
                    };
                    rdDecision = {
                        product_id: products[1].id,
                        investment_amount: 75000,
                        focus_areas: ["battery_life", "sound_quality"],
                        timeline: 2,
                    };
                    productionDecision = {
                        product_id: products[2].id,
                        quantity: 1500,
                        quality_investment: 50000,
                        sustainability_measures: ["recycled_materials", "carbon_offset"],
                    };
                    return [4 /*yield*/, Promise.all([
                            prisma_1.default.decision.create({
                                data: {
                                    company_id: companies[0].id,
                                    period: 2,
                                    type: "marketing",
                                    decision_data: JSON.stringify(marketingDecision),
                                    processed: true,
                                    processed_at: new Date(),
                                },
                            }),
                            prisma_1.default.decision.create({
                                data: {
                                    company_id: companies[0].id,
                                    period: 2,
                                    type: "rd",
                                    decision_data: JSON.stringify(rdDecision),
                                    processed: true,
                                    processed_at: new Date(),
                                },
                            }),
                            prisma_1.default.decision.create({
                                data: {
                                    company_id: companies[1].id,
                                    period: 2,
                                    type: "production",
                                    decision_data: JSON.stringify(productionDecision),
                                    processed: false,
                                },
                            }),
                        ])];
                case 16:
                    decisions = _a.sent();
                    console.log("✅ Created decisions");
                    return [4 /*yield*/, Promise.all([
                            prisma_1.default.event.create({
                                data: {
                                    simulation_id: simulations[0].id,
                                    period: 2,
                                    type: "market_disruption",
                                    name: "New Technology Breakthrough",
                                    description: "A major technological breakthrough in battery technology affects all electronic devices",
                                    impact_area: "technology",
                                    impact_strength: 0.8,
                                    affected_companies: JSON.stringify([companies[0].id, companies[1].id]),
                                },
                            }),
                            prisma_1.default.event.create({
                                data: {
                                    simulation_id: simulations[0].id,
                                    period: 3,
                                    type: "economic",
                                    name: "Supply Chain Disruption",
                                    description: "Global supply chain disruption affects production costs and delivery times",
                                    impact_area: "operations",
                                    impact_strength: -0.6,
                                    affected_companies: JSON.stringify([companies[0].id, companies[1].id]),
                                },
                            }),
                            prisma_1.default.event.create({
                                data: {
                                    simulation_id: simulations[1].id,
                                    period: 2,
                                    type: "regulatory",
                                    name: "Sustainability Regulations",
                                    description: "New environmental regulations require improved sustainability practices",
                                    impact_area: "sustainability",
                                    impact_strength: 0.7,
                                    affected_companies: JSON.stringify([companies[2].id, companies[3].id]),
                                },
                            }),
                        ])];
                case 17:
                    events = _a.sent();
                    console.log("✅ Created events");
                    return [4 /*yield*/, Promise.all([
                            prisma_1.default.product_performance.create({
                                data: {
                                    product_id: products[0].id,
                                    period: 1,
                                    sales_volume: 1200,
                                    revenue: 838800,
                                    costs: 300000,
                                    profit: 538800,
                                    market_share: 0.15,
                                    customer_satisfaction: 8.4,
                                },
                            }),
                            prisma_1.default.product_performance.create({
                                data: {
                                    product_id: products[1].id,
                                    period: 2,
                                    sales_volume: 2100,
                                    revenue: 417900,
                                    costs: 94500,
                                    profit: 323400,
                                    market_share: 0.22,
                                    customer_satisfaction: 8.1,
                                },
                            }),
                            prisma_1.default.product_performance.create({
                                data: {
                                    product_id: products[2].id,
                                    period: 1,
                                    sales_volume: 680,
                                    revenue: 373320,
                                    costs: 122400,
                                    profit: 250920,
                                    market_share: 0.08,
                                    customer_satisfaction: 7.9,
                                },
                            }),
                        ])];
                case 18:
                    productPerformances = _a.sent();
                    console.log("✅ Created product performances");
                    console.log("🎉 Seed completed successfully!");
                    // Print summary
                    console.log("\n📊 Database Summary:");
                    console.log("- Users: ".concat(users.length));
                    console.log("- Simulations: ".concat(simulations.length));
                    console.log("- Companies: ".concat(companies.length));
                    console.log("- Products: ".concat(products.length));
                    console.log("- Market Conditions: ".concat(marketConditions.length));
                    console.log("- Performance Results: ".concat(performanceResults.length));
                    console.log("- Decisions: ".concat(decisions.length));
                    console.log("- Events: ".concat(events.length));
                    console.log("- Product Performances: ".concat(productPerformances.length));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error("❌ Error during seed:", e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
