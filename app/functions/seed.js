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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("./prisma");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, admin, instructor, students, techSimulation, retailSimulation, simulationAccess, companies, products, financeRecords, period, i, baseRevenue, revenue, costs, profit, i, revenue, costs, profit, hrDecisions, _loop_1, period, rdDecisions, period, i, productionDecisions, period, i, unitsProduced, costPerUnit, marketingDecisions, period, i, totalBudget, onlineBudget, offlineBudget, productPerformances, period, _i, products_1, product, salesVolume, revenue, costs, profit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🌱 Starting database seeding...");
                    // Clean existing data (optional - uncomment if needed)
                    return [4 /*yield*/, prisma_1.default.product_performance.deleteMany()];
                case 1:
                    // Clean existing data (optional - uncomment if needed)
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.marketing.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.rd.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.production.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.hr_role_decision.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.hr_decision.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.finance.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.product.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.company_access.deleteMany()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.simulation_access.deleteMany()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.company.deleteMany()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.simulation.deleteMany()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, prisma_1.default.user.deleteMany()];
                case 13:
                    _a.sent();
                    // Create Users
                    console.log("👥 Creating users...");
                    hashedPassword = "$2y$10$N/ohrDUZObMGWG30oskpee40vFV8CtG7nCwkDO6vrx9IL6f8OuQZu";
                    return [4 /*yield*/, prisma_1.default.user.create({
                            data: {
                                name: "Admin User",
                                email: "admin@simulation.com",
                                password_hash: hashedPassword,
                                role: "admin",
                            },
                        })];
                case 14:
                    admin = _a.sent();
                    return [4 /*yield*/, prisma_1.default.user.create({
                            data: {
                                name: "Dr. Sarah Johnson",
                                email: "sarah.johnson@university.edu",
                                password_hash: hashedPassword,
                                role: "instructor",
                            },
                        })];
                case 15:
                    instructor = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma_1.default.user.create({
                                data: {
                                    name: "Alice Chen",
                                    email: "alice.chen@student.edu",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                            prisma_1.default.user.create({
                                data: {
                                    name: "Bob Martinez",
                                    email: "bob.martinez@student.edu",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                            prisma_1.default.user.create({
                                data: {
                                    name: "Carol Williams",
                                    email: "carol.williams@student.edu",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                            prisma_1.default.user.create({
                                data: {
                                    name: "David Kim",
                                    email: "david.kim@student.edu",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                        ])];
                case 16:
                    students = _a.sent();
                    // Create Simulations
                    console.log("🎮 Creating simulations...");
                    return [4 /*yield*/, prisma_1.default.simulation.create({
                            data: {
                                name: "Tech Industry Competition 2024",
                                description: "A comprehensive business simulation focusing on technology companies competing in the smartphone and laptop markets.",
                                config: JSON.stringify({
                                    maxPeriods: 12,
                                    startingCash: 1000000,
                                    marketSize: 10000000,
                                    inflationRate: 0.03,
                                    interestRate: 0.05,
                                }),
                                current_period: 3,
                                status: "active",
                                created_by: instructor.id,
                            },
                        })];
                case 17:
                    techSimulation = _a.sent();
                    return [4 /*yield*/, prisma_1.default.simulation.create({
                            data: {
                                name: "Retail Business Challenge",
                                description: "A simulation focused on retail operations, inventory management, and customer satisfaction.",
                                config: JSON.stringify({
                                    maxPeriods: 8,
                                    startingCash: 500000,
                                    marketSize: 5000000,
                                    seasonality: true,
                                }),
                                current_period: 1,
                                status: "active",
                                created_by: admin.id,
                            },
                        })];
                case 18:
                    retailSimulation = _a.sent();
                    // Create Simulation Access
                    console.log("🔑 Setting up simulation access...");
                    return [4 /*yield*/, Promise.all(__spreadArray(__spreadArray([], students.map(function (student) {
                            return prisma_1.default.simulation_access.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: student.id,
                                    access_level: "participant",
                                },
                            });
                        }), true), [
                            // Retail simulation access for first two students
                            prisma_1.default.simulation_access.create({
                                data: {
                                    simulation_id: retailSimulation.id,
                                    user_id: students[0].id,
                                    access_level: "participant",
                                },
                            }),
                            prisma_1.default.simulation_access.create({
                                data: {
                                    simulation_id: retailSimulation.id,
                                    user_id: students[1].id,
                                    access_level: "participant",
                                },
                            }),
                        ], false))];
                case 19:
                    simulationAccess = _a.sent();
                    // Create Companies
                    console.log("🏢 Creating companies...");
                    return [4 /*yield*/, Promise.all([
                            // Tech simulation companies
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[0].id,
                                    name: "TechNova Inc.",
                                    description: "Innovative technology solutions for the modern world",
                                    logo_url: "https://example.com/technova-logo.png",
                                    cash_balance: 950000,
                                    current_period: 3,
                                    data: JSON.stringify({
                                        employees: 45,
                                        locations: ["San Francisco", "Austin"],
                                        founded: 2020,
                                    }),
                                    total_assets: 1200000,
                                    total_liabilities: 250000,
                                    marketing_budget: 150000,
                                    credit_rating: "A-",
                                    brand_value: 75000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[1].id,
                                    name: "Digital Dynamics",
                                    description: "Cutting-edge digital products and services",
                                    logo_url: "https://example.com/digital-dynamics-logo.png",
                                    cash_balance: 820000,
                                    current_period: 3,
                                    data: JSON.stringify({
                                        employees: 38,
                                        locations: ["Seattle", "Denver"],
                                        founded: 2019,
                                    }),
                                    total_assets: 1050000,
                                    total_liabilities: 300000,
                                    marketing_budget: 120000,
                                    credit_rating: "B+",
                                    brand_value: 62000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[2].id,
                                    name: "Quantum Systems",
                                    description: "Next-generation computing solutions",
                                    logo_url: "https://example.com/quantum-logo.png",
                                    cash_balance: 1100000,
                                    current_period: 3,
                                    data: JSON.stringify({
                                        employees: 52,
                                        locations: ["Boston", "Raleigh"],
                                        founded: 2018,
                                    }),
                                    total_assets: 1350000,
                                    total_liabilities: 200000,
                                    marketing_budget: 180000,
                                    credit_rating: "A",
                                    brand_value: 88000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[3].id,
                                    name: "InnovateTech",
                                    description: "Breakthrough technology for everyday problems",
                                    logo_url: "https://example.com/innovate-logo.png",
                                    cash_balance: 780000,
                                    current_period: 3,
                                    data: JSON.stringify({
                                        employees: 31,
                                        locations: ["Portland", "Nashville"],
                                        founded: 2021,
                                    }),
                                    total_assets: 920000,
                                    total_liabilities: 180000,
                                    marketing_budget: 100000,
                                    credit_rating: "B",
                                    brand_value: 45000,
                                },
                            }),
                            // Retail simulation companies
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: retailSimulation.id,
                                    user_id: students[0].id,
                                    name: "Urban Style Co.",
                                    description: "Trendy fashion for the modern consumer",
                                    logo_url: "https://example.com/urban-style-logo.png",
                                    cash_balance: 450000,
                                    current_period: 1,
                                    data: JSON.stringify({
                                        employees: 25,
                                        stores: 8,
                                        founded: 2022,
                                    }),
                                    total_assets: 600000,
                                    total_liabilities: 150000,
                                    marketing_budget: 75000,
                                    credit_rating: "B+",
                                    brand_value: 30000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: retailSimulation.id,
                                    user_id: students[1].id,
                                    name: "EcoGoods Market",
                                    description: "Sustainable products for conscious consumers",
                                    logo_url: "https://example.com/ecogoods-logo.png",
                                    cash_balance: 520000,
                                    current_period: 1,
                                    data: JSON.stringify({
                                        employees: 18,
                                        stores: 5,
                                        founded: 2023,
                                    }),
                                    total_assets: 550000,
                                    total_liabilities: 80000,
                                    marketing_budget: 60000,
                                    credit_rating: "A-",
                                    brand_value: 25000,
                                },
                            }),
                        ])];
                case 20:
                    companies = _a.sent();
                    // Create Products
                    console.log("📱 Creating products...");
                    return [4 /*yield*/, Promise.all([
                            // TechNova products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[0].id,
                                    name: "TechNova Smartphone Pro",
                                    description: "Premium smartphone with advanced AI features",
                                    category: "smartphones",
                                    quality_rating: 8.5,
                                    innovation_rating: 9.2,
                                    sustainability_rating: 7.1,
                                    production_cost: 420,
                                    selling_price: 899,
                                    inventory_level: 1250,
                                    production_capacity: 3000,
                                    development_cost: 2500000,
                                    marketing_budget: 500000,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[0].id,
                                    name: "TechNova Laptop Ultra",
                                    description: "High-performance laptop for professionals",
                                    category: "laptops",
                                    quality_rating: 8.8,
                                    innovation_rating: 8.5,
                                    sustainability_rating: 6.9,
                                    production_cost: 780,
                                    selling_price: 1599,
                                    inventory_level: 890,
                                    production_capacity: 2000,
                                    development_cost: 3200000,
                                    marketing_budget: 400000,
                                    status: "active",
                                    launch_period: 2,
                                },
                            }),
                            // Digital Dynamics products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[1].id,
                                    name: "DD Smart Device",
                                    description: "Versatile smart device for home and office",
                                    category: "smart_devices",
                                    quality_rating: 7.8,
                                    innovation_rating: 8.9,
                                    sustainability_rating: 8.2,
                                    production_cost: 350,
                                    selling_price: 749,
                                    inventory_level: 1100,
                                    production_capacity: 2500,
                                    development_cost: 1800000,
                                    marketing_budget: 350000,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            // Quantum Systems products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[2].id,
                                    name: "Quantum Workstation",
                                    description: "Professional workstation with quantum processing",
                                    category: "workstations",
                                    quality_rating: 9.1,
                                    innovation_rating: 9.8,
                                    sustainability_rating: 7.5,
                                    production_cost: 1200,
                                    selling_price: 2999,
                                    inventory_level: 420,
                                    production_capacity: 1000,
                                    development_cost: 5000000,
                                    marketing_budget: 600000,
                                    status: "active",
                                    launch_period: 2,
                                },
                            }),
                            // Urban Style products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[4].id,
                                    name: "Urban Classic Jeans",
                                    description: "Premium denim with contemporary fit",
                                    category: "apparel",
                                    quality_rating: 7.5,
                                    innovation_rating: 6.8,
                                    sustainability_rating: 8.5,
                                    production_cost: 45,
                                    selling_price: 129,
                                    inventory_level: 2500,
                                    production_capacity: 5000,
                                    development_cost: 150000,
                                    marketing_budget: 80000,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                        ])];
                case 21:
                    products = _a.sent();
                    // Create Finance Records
                    console.log("💰 Creating finance records...");
                    financeRecords = [];
                    // Create finance records for periods 1-3 for tech companies
                    for (period = 1; period <= 3; period++) {
                        for (i = 0; i < 4; i++) {
                            baseRevenue = 500000 + Math.random() * 300000;
                            revenue = baseRevenue * (1 + (period - 1) * 0.15);
                            costs = revenue * (0.6 + Math.random() * 0.2);
                            profit = revenue - costs;
                            financeRecords.push(prisma_1.default.finance.create({
                                data: {
                                    company_id: companies[i].id,
                                    user_id: students[i].id,
                                    period: period,
                                    total_revenue: revenue,
                                    net_profit: profit,
                                    cash_balance: companies[i].cash_balance + profit * period,
                                    operating_costs: costs,
                                    roi: (profit / costs) * 100,
                                    burn_rate: costs / 12,
                                    finalised: period < 3,
                                    investment_amount: period === 1 ? 200000 : 0,
                                    loan_amount: period === 2 ? 100000 : 0,
                                    repay_loan: 0,
                                    dividend_payout: period === 3 ? profit * 0.1 : 0,
                                    equity_issue: 0,
                                    processed: period < 3,
                                    processed_at: period < 3 ? new Date() : null,
                                },
                            }));
                        }
                    }
                    // Create finance record for retail companies (period 1)
                    for (i = 4; i < 6; i++) {
                        revenue = 200000 + Math.random() * 150000;
                        costs = revenue * (0.7 + Math.random() * 0.15);
                        profit = revenue - costs;
                        financeRecords.push(prisma_1.default.finance.create({
                            data: {
                                company_id: companies[i].id,
                                user_id: students[i - 4].id,
                                period: 1,
                                total_revenue: revenue,
                                net_profit: profit,
                                cash_balance: companies[i].cash_balance + profit,
                                operating_costs: costs,
                                roi: (profit / costs) * 100,
                                burn_rate: costs / 12,
                                finalised: true,
                                processed: true,
                                processed_at: new Date(),
                            },
                        }));
                    }
                    return [4 /*yield*/, Promise.all(financeRecords)];
                case 22:
                    _a.sent();
                    // Create HR Decisions
                    console.log("👨‍💼 Creating HR decisions...");
                    hrDecisions = [];
                    _loop_1 = function (period) {
                        for (var i = 0; i < 4; i++) {
                            // Tech companies
                            hrDecisions.push(prisma_1.default.hr_decision
                                .create({
                                data: {
                                    company_id: companies[i].id,
                                    period: period,
                                    is_submitted: period < 3,
                                    salary_budget: 120000 + period * 20000,
                                    training_budget: 15000 + period * 5000,
                                    total_budget: 135000 + period * 25000,
                                    employee_satisfaction: 7.5 + Math.random() * 1.5,
                                    recruitment_cost: 25000,
                                    firing_cost: period === 2 ? 10000 : 0,
                                },
                            })
                                .then(function (hrDecision) {
                                // Create role decisions for each HR decision
                                return Promise.all([
                                    prisma_1.default.hr_role_decision.create({
                                        data: {
                                            hr_decision_id: hrDecision.id,
                                            role_name: "Software Engineer",
                                            salary_per_head: 95000,
                                            head_count: 8 + period,
                                        },
                                    }),
                                    prisma_1.default.hr_role_decision.create({
                                        data: {
                                            hr_decision_id: hrDecision.id,
                                            role_name: "Product Manager",
                                            salary_per_head: 110000,
                                            head_count: 2 + Math.floor(period / 2),
                                        },
                                    }),
                                    prisma_1.default.hr_role_decision.create({
                                        data: {
                                            hr_decision_id: hrDecision.id,
                                            role_name: "Marketing Specialist",
                                            salary_per_head: 70000,
                                            head_count: 3 + period,
                                        },
                                    }),
                                ]);
                            }));
                        }
                    };
                    for (period = 1; period <= 3; period++) {
                        _loop_1(period);
                    }
                    return [4 /*yield*/, Promise.all(hrDecisions)];
                case 23:
                    _a.sent();
                    // Create R&D Decisions
                    console.log("🔬 Creating R&D decisions...");
                    rdDecisions = [];
                    for (period = 1; period <= 3; period++) {
                        for (i = 0; i < 4; i++) {
                            rdDecisions.push(prisma_1.default.rd.create({
                                data: {
                                    company_id: companies[i].id,
                                    period: period,
                                    budget: 180000 + period * 30000,
                                    pip: 3 + Math.floor(Math.random() * 3), // Products in pipeline
                                    time_to_market: 6 + Math.floor(Math.random() * 6),
                                    total_development: 2 + period,
                                    patented: Math.floor(Math.random() * 2),
                                    quality_changes: Math.floor(Math.random() * 3) - 1, // -1 to 1
                                    finalised: period < 3,
                                },
                            }));
                        }
                    }
                    return [4 /*yield*/, Promise.all(rdDecisions)];
                case 24:
                    _a.sent();
                    // Create Production Decisions
                    console.log("🏭 Creating production decisions...");
                    productionDecisions = [];
                    for (period = 1; period <= 3; period++) {
                        for (i = 0; i < 4; i++) {
                            unitsProduced = 1500 + Math.floor(Math.random() * 1000);
                            costPerUnit = 300 + Math.floor(Math.random() * 200);
                            productionDecisions.push(prisma_1.default.production.create({
                                data: {
                                    company_id: companies[i].id,
                                    period: period,
                                    units_to_produce: unitsProduced,
                                    cost_per_unit: costPerUnit,
                                    production_capacity: 2500 + period * 200,
                                    storage_capacity: 3000,
                                    inventory_value: unitsProduced * costPerUnit,
                                    defect_rate: Math.floor(Math.random() * 5), // 0-4% defect rate
                                    finalised: period < 3,
                                },
                            }));
                        }
                    }
                    return [4 /*yield*/, Promise.all(productionDecisions)];
                case 25:
                    _a.sent();
                    // Create Marketing Decisions
                    console.log("📢 Creating marketing decisions...");
                    marketingDecisions = [];
                    for (period = 1; period <= 3; period++) {
                        for (i = 0; i < 4; i++) {
                            totalBudget = 100000 + period * 20000;
                            onlineBudget = Math.floor(totalBudget * (0.6 + Math.random() * 0.3));
                            offlineBudget = totalBudget - onlineBudget;
                            marketingDecisions.push(prisma_1.default.marketing.create({
                                data: {
                                    company_id: companies[i].id,
                                    period: period,
                                    budget: totalBudget,
                                    offline: offlineBudget,
                                    online: onlineBudget,
                                    roi: Math.floor(120 + Math.random() * 80), // 120-200% ROI
                                    conversion_rate: Math.floor(3 + Math.random() * 7), // 3-10% conversion
                                    finalised: period < 3,
                                },
                            }));
                        }
                    }
                    return [4 /*yield*/, Promise.all(marketingDecisions)];
                case 26:
                    _a.sent();
                    // Create Product Performance Records
                    console.log("📊 Creating product performance records...");
                    productPerformances = [];
                    for (period = 1; period <= 3; period++) {
                        for (_i = 0, products_1 = products; _i < products_1.length; _i++) {
                            product = products_1[_i];
                            if (product.launch_period && product.launch_period <= period) {
                                salesVolume = 800 + Math.floor(Math.random() * 600);
                                revenue = salesVolume * product.selling_price;
                                costs = salesVolume * product.production_cost;
                                profit = revenue - costs;
                                productPerformances.push(prisma_1.default.product_performance.create({
                                    data: {
                                        product_id: product.id,
                                        period: period,
                                        data: JSON.stringify({
                                            advertising_effectiveness: Math.random() * 10,
                                            competitor_activity: Math.random() * 5,
                                            market_trends: Math.random() * 8,
                                        }),
                                        sales_volume: salesVolume,
                                        revenue: revenue,
                                        costs: costs,
                                        profit: profit,
                                        market_share: 5 + Math.random() * 15, // 5-20% market share
                                        customer_satisfaction: 7 + Math.random() * 2, // 7-9 satisfaction
                                    },
                                }));
                            }
                        }
                    }
                    return [4 /*yield*/, Promise.all(productPerformances)];
                case 27:
                    _a.sent();
                    console.log("✅ Database seeding completed successfully!");
                    console.log("\n  \uD83D\uDCC8 Created:\n  - ".concat(6, " users (1 admin, 1 instructor, 4 students)\n  - ").concat(2, " simulations\n  - ").concat(6, " companies\n  - ").concat(5, " products\n  - ").concat(14, " finance records\n  - ").concat(12, " HR decisions with role breakdowns\n  - ").concat(12, " R&D decisions\n  - ").concat(12, " production decisions  \n  - ").concat(12, " marketing decisions\n  - ").concat(13, " product performance records\n  "));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error("❌ Error during seeding:", e);
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
