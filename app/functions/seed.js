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
        var hashedPassword, admin, instructor, students, techSimulation, retailSimulation, manufacturingSimulation, simulationAccess, companies, products, financeData, _i, financeData_1, _a, companyIndex, periods, baseRevenue, growthRate, profitMargin, period, revenue, operatingCosts, netProfit, roi, hrData, _b, hrData_1, _c, companyIndex, periods, baseSalaryBudget, _loop_1, period, _d, _e, _f, companyIndex, periods, period, budget, _loop_2, _g, products_1, product, _h, hrData_2, _j, companyIndex, periods, period, baseBudget, totalBudget, onlineRatio, onlineBudget, offlineBudget, _loop_3, _k, products_2, product, _l, hrData_3, _m, companyIndex, periods, period, company, financeRecord, companyAccessRecords, userCount, simulationCount, companyCount, productCount, financeCount, hrCount, rdCount, productionCount, marketingCount, performanceCount, historyCount;
        var _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    console.log("🌱 Starting database seeding...");
                    // Clean existing data in correct order (respecting foreign key constraints)
                    return [4 /*yield*/, prisma_1.default.product_performance.deleteMany()];
                case 1:
                    // Clean existing data in correct order (respecting foreign key constraints)
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.marketing.deleteMany()];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.rd.deleteMany()];
                case 3:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.production.deleteMany()];
                case 4:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.hr_role_decision.deleteMany()];
                case 5:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.hr_decision.deleteMany()];
                case 6:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.finance.deleteMany()];
                case 7:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.product.deleteMany()];
                case 8:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.company_history.deleteMany()];
                case 9:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.company_access.deleteMany()];
                case 10:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.simulation_access.deleteMany()];
                case 11:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.company.deleteMany()];
                case 12:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.simulation.deleteMany()];
                case 13:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.user.deleteMany()];
                case 14:
                    _p.sent();
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
                case 15:
                    admin = _p.sent();
                    return [4 /*yield*/, prisma_1.default.user.create({
                            data: {
                                name: "Dr. Sarah Johnson",
                                email: "sarah.johnson@university.edu",
                                password_hash: hashedPassword,
                                role: "user", // Schema only has "user" and "admin" roles
                            },
                        })];
                case 16:
                    instructor = _p.sent();
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
                            prisma_1.default.user.create({
                                data: {
                                    name: "Emma Rodriguez",
                                    email: "emma.rodriguez@student.edu",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                            prisma_1.default.user.create({
                                data: {
                                    name: "Frank Liu",
                                    email: "frank.liu@student.edu",
                                    password_hash: hashedPassword,
                                    role: "user",
                                },
                            }),
                        ])];
                case 17:
                    students = _p.sent();
                    // Create Simulations
                    console.log("🎮 Creating simulations...");
                    return [4 /*yield*/, prisma_1.default.simulation.create({
                            data: {
                                name: "Technology Industry Competition Q1-Q4 2024",
                                description: "A comprehensive business simulation where teams compete as technology companies in smartphone, laptop, and smart device markets. Focus on R&D, production efficiency, marketing strategies, and financial management.",
                                config: JSON.stringify({
                                    maxPeriods: 12,
                                    startingCash: 1000000,
                                    marketSize: 50000000,
                                    inflationRate: 0.025,
                                    interestRate: 0.055,
                                    taxRate: 0.21,
                                    marketGrowthRate: 0.08,
                                    categories: ["smartphones", "laptops", "tablets", "smart_devices"],
                                    competitorCount: 4,
                                    economicFactors: {
                                        recession_risk: 0.15,
                                        supply_chain_disruption: 0.1,
                                        currency_volatility: 0.05,
                                    },
                                }),
                                current_period: 4,
                                status: "active",
                                created_by: instructor.id,
                            },
                        })];
                case 18:
                    techSimulation = _p.sent();
                    return [4 /*yield*/, prisma_1.default.simulation.create({
                            data: {
                                name: "Retail Fashion & Lifestyle Challenge",
                                description: "A retail-focused simulation covering fashion, home goods, and lifestyle products. Emphasis on inventory management, seasonal trends, customer satisfaction, and omnichannel strategies.",
                                config: JSON.stringify({
                                    maxPeriods: 8,
                                    startingCash: 500000,
                                    marketSize: 25000000,
                                    seasonality: true,
                                    seasons: ["Spring", "Summer", "Fall", "Winter"],
                                    categories: ["apparel", "accessories", "home_goods", "beauty"],
                                    retailChannels: ["online", "physical_stores", "marketplace"],
                                }),
                                current_period: 2,
                                status: "active",
                                created_by: admin.id,
                            },
                        })];
                case 19:
                    retailSimulation = _p.sent();
                    return [4 /*yield*/, prisma_1.default.simulation.create({
                            data: {
                                name: "Advanced Manufacturing & Supply Chain",
                                description: "Industrial manufacturing simulation focusing on automotive parts, machinery, and industrial equipment. Covers supply chain optimization, quality control, and international trade.",
                                config: JSON.stringify({
                                    maxPeriods: 10,
                                    startingCash: 2000000,
                                    marketSize: 100000000,
                                    globalMarkets: true,
                                    supplyChainComplexity: "high",
                                    qualityStandards: ["ISO9001", "Six Sigma"],
                                    categories: ["automotive_parts", "machinery", "industrial_equipment"],
                                }),
                                current_period: 1,
                                status: "paused",
                                created_by: instructor.id,
                            },
                        })];
                case 20:
                    manufacturingSimulation = _p.sent();
                    // Create Simulation Access
                    console.log("🔑 Setting up simulation access...");
                    simulationAccess = __spreadArray(__spreadArray(__spreadArray([], students.slice(0, 4).map(function (student) { return ({
                        simulation_id: techSimulation.id,
                        user_id: student.id,
                        access_level: "editor",
                    }); }), true), students.slice(4, 6).map(function (student) { return ({
                        simulation_id: retailSimulation.id,
                        user_id: student.id,
                        access_level: "editor",
                    }); }), true), [
                        // Manufacturing simulation - instructor only for now
                        {
                            simulation_id: manufacturingSimulation.id,
                            user_id: instructor.id,
                            access_level: "owner",
                        },
                    ], false);
                    return [4 /*yield*/, Promise.all(simulationAccess.map(function (access) {
                            return prisma_1.default.simulation_access.create({ data: access });
                        }))];
                case 21:
                    _p.sent();
                    // Create Companies with realistic business data
                    console.log("🏢 Creating companies...");
                    return [4 /*yield*/, Promise.all([
                            // Tech Simulation Companies
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[0].id,
                                    name: "TechNova Solutions",
                                    description: "Leading provider of AI-powered consumer electronics and enterprise solutions",
                                    logo_url: "https://example.com/logos/technova.svg",
                                    cash_balance: 1250000,
                                    current_period: 4,
                                    data: JSON.stringify({
                                        headquarters: "San Francisco, CA",
                                        founded: 2019,
                                        employees: 120,
                                        offices: ["SF", "Austin", "Seattle"],
                                        certifications: ["ISO27001", "SOC2"],
                                        patents: 23,
                                        awards: ["Tech Innovation 2023", "Best Employer 2024"],
                                    }),
                                    total_assets: 2800000,
                                    total_liabilities: 650000,
                                    marketing_budget: 280000,
                                    credit_rating: "A-",
                                    brand_value: 450000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[1].id,
                                    name: "Quantum Dynamics Corp",
                                    description: "Next-generation quantum computing solutions and advanced semiconductors",
                                    logo_url: "https://example.com/logos/quantum.svg",
                                    cash_balance: 980000,
                                    current_period: 4,
                                    data: JSON.stringify({
                                        headquarters: "Boston, MA",
                                        founded: 2018,
                                        employees: 85,
                                        offices: ["Boston", "Research Triangle", "Boulder"],
                                        specialization: ["Quantum Computing", "AI Chips"],
                                        partnerships: ["IBM", "Intel", "MIT"],
                                        patents: 41,
                                    }),
                                    total_assets: 2200000,
                                    total_liabilities: 580000,
                                    marketing_budget: 190000,
                                    credit_rating: "A",
                                    brand_value: 520000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[2].id,
                                    name: "Nexus Interactive",
                                    description: "Immersive AR/VR experiences and interactive digital solutions",
                                    logo_url: "https://example.com/logos/nexus.svg",
                                    cash_balance: 750000,
                                    current_period: 4,
                                    data: JSON.stringify({
                                        headquarters: "Los Angeles, CA",
                                        founded: 2020,
                                        employees: 65,
                                        offices: ["LA", "Portland", "Vancouver"],
                                        focus: ["AR/VR", "Gaming", "Digital Media"],
                                        clients: ["Netflix", "Disney", "Sony"],
                                        awards: ["VR Innovation Award 2023"],
                                    }),
                                    total_assets: 1800000,
                                    total_liabilities: 420000,
                                    marketing_budget: 220000,
                                    credit_rating: "B+",
                                    brand_value: 280000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: techSimulation.id,
                                    user_id: students[3].id,
                                    name: "GreenTech Innovations",
                                    description: "Sustainable technology solutions for renewable energy and smart cities",
                                    logo_url: "https://example.com/logos/greentech.svg",
                                    cash_balance: 1100000,
                                    current_period: 4,
                                    data: JSON.stringify({
                                        headquarters: "Denver, CO",
                                        founded: 2017,
                                        employees: 95,
                                        offices: ["Denver", "Phoenix", "Portland"],
                                        focus: ["Solar Tech", "Smart Grid", "IoT"],
                                        certifications: ["B-Corp", "LEED Platinum"],
                                        sustainability_score: 9.2,
                                    }),
                                    total_assets: 2400000,
                                    total_liabilities: 380000,
                                    marketing_budget: 160000,
                                    credit_rating: "A-",
                                    brand_value: 380000,
                                },
                            }),
                            // Retail Simulation Companies
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: retailSimulation.id,
                                    user_id: students[4].id,
                                    name: "Urban Threads Co.",
                                    description: "Contemporary fashion brand focusing on sustainable streetwear and lifestyle products",
                                    logo_url: "https://example.com/logos/urban-threads.svg",
                                    cash_balance: 420000,
                                    current_period: 2,
                                    data: JSON.stringify({
                                        headquarters: "New York, NY",
                                        founded: 2021,
                                        employees: 45,
                                        stores: 12,
                                        online_presence: true,
                                        target_demographic: "18-35 urban professionals",
                                        sustainability_initiatives: [
                                            "recycled materials",
                                            "carbon neutral shipping",
                                        ],
                                    }),
                                    total_assets: 850000,
                                    total_liabilities: 280000,
                                    marketing_budget: 95000,
                                    credit_rating: "B+",
                                    brand_value: 120000,
                                },
                            }),
                            prisma_1.default.company.create({
                                data: {
                                    simulation_id: retailSimulation.id,
                                    user_id: students[5].id,
                                    name: "EcoLifestyle Market",
                                    description: "Premium eco-friendly lifestyle products and wellness accessories",
                                    logo_url: "https://example.com/logos/eco-lifestyle.svg",
                                    cash_balance: 380000,
                                    current_period: 2,
                                    data: JSON.stringify({
                                        headquarters: "Portland, OR",
                                        founded: 2022,
                                        employees: 28,
                                        stores: 6,
                                        online_marketplace: true,
                                        certifications: ["Organic", "Fair Trade", "Cruelty Free"],
                                        customer_base: "eco-conscious millennials",
                                    }),
                                    total_assets: 650000,
                                    total_liabilities: 180000,
                                    marketing_budget: 75000,
                                    credit_rating: "B",
                                    brand_value: 85000,
                                },
                            }),
                        ])];
                case 22:
                    companies = _p.sent();
                    // Create Products with realistic specifications
                    console.log("📱 Creating products...");
                    return [4 /*yield*/, Promise.all([
                            // TechNova Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[0].id,
                                    name: "TechNova Pro X1",
                                    description: "Flagship smartphone with advanced AI camera and 5G connectivity",
                                    category: "smartphones",
                                    quality_rating: 8.7,
                                    innovation_rating: 9.1,
                                    sustainability_rating: 7.3,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[0].id,
                                    name: "TechNova Workstation Elite",
                                    description: "High-performance laptop for professionals and creatives",
                                    category: "laptops",
                                    quality_rating: 8.9,
                                    innovation_rating: 8.4,
                                    sustainability_rating: 6.8,
                                    status: "active",
                                    launch_period: 2,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[0].id,
                                    name: "TechNova Smart Hub",
                                    description: "AI-powered smart home control center with voice recognition",
                                    category: "smart_devices",
                                    quality_rating: 8.2,
                                    innovation_rating: 8.8,
                                    sustainability_rating: 8.1,
                                    status: "active",
                                    launch_period: 3,
                                },
                            }),
                            // Quantum Dynamics Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[1].id,
                                    name: "QuantumBook Pro",
                                    description: "Quantum-enhanced laptop with breakthrough processing capabilities",
                                    category: "laptops",
                                    quality_rating: 9.3,
                                    innovation_rating: 9.8,
                                    sustainability_rating: 7.1,
                                    status: "active",
                                    launch_period: 2,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[1].id,
                                    name: "Quantum Dev Kit",
                                    description: "Professional quantum computing development platform",
                                    category: "development_tools",
                                    quality_rating: 9.0,
                                    innovation_rating: 9.9,
                                    sustainability_rating: 6.5,
                                    status: "active",
                                    launch_period: 3,
                                },
                            }),
                            // Nexus Interactive Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[2].id,
                                    name: "NexusVR Immersion",
                                    description: "Next-generation VR headset with haptic feedback",
                                    category: "vr_devices",
                                    quality_rating: 8.5,
                                    innovation_rating: 9.2,
                                    sustainability_rating: 6.9,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[2].id,
                                    name: "Nexus AR Glasses",
                                    description: "Lightweight AR glasses for everyday use",
                                    category: "ar_devices",
                                    quality_rating: 7.8,
                                    innovation_rating: 8.9,
                                    sustainability_rating: 7.5,
                                    status: "development",
                                    launch_period: 4,
                                },
                            }),
                            // GreenTech Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[3].id,
                                    name: "EcoPhone Green",
                                    description: "Fully recyclable smartphone with solar charging capability",
                                    category: "smartphones",
                                    quality_rating: 8.1,
                                    innovation_rating: 8.6,
                                    sustainability_rating: 9.5,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[3].id,
                                    name: "GreenTech Solar Tablet",
                                    description: "Solar-powered tablet for field work and outdoor activities",
                                    category: "tablets",
                                    quality_rating: 7.9,
                                    innovation_rating: 8.3,
                                    sustainability_rating: 9.2,
                                    status: "active",
                                    launch_period: 2,
                                },
                            }),
                            // Urban Threads Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[4].id,
                                    name: "Urban Classic Denim",
                                    description: "Premium sustainable denim collection",
                                    category: "apparel",
                                    quality_rating: 8.0,
                                    innovation_rating: 7.2,
                                    sustainability_rating: 8.8,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[4].id,
                                    name: "Street Style Accessories",
                                    description: "Urban-inspired bags, hats, and accessories",
                                    category: "accessories",
                                    quality_rating: 7.5,
                                    innovation_rating: 6.8,
                                    sustainability_rating: 8.3,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                            // EcoLifestyle Products
                            prisma_1.default.product.create({
                                data: {
                                    company_id: companies[5].id,
                                    name: "Bamboo Wellness Set",
                                    description: "Complete bamboo wellness and self-care product line",
                                    category: "wellness",
                                    quality_rating: 8.3,
                                    innovation_rating: 7.1,
                                    sustainability_rating: 9.4,
                                    status: "active",
                                    launch_period: 1,
                                },
                            }),
                        ])];
                case 23:
                    products = _p.sent();
                    // Create comprehensive Finance Records
                    console.log("💰 Creating finance records...");
                    financeData = [
                        // TechNova - 4 periods of growth
                        {
                            companyIndex: 0,
                            periods: 4,
                            baseRevenue: 800000,
                            growthRate: 0.18,
                            profitMargin: 0.25,
                        },
                        // Quantum Dynamics - 4 periods with high R&D costs
                        {
                            companyIndex: 1,
                            periods: 4,
                            baseRevenue: 650000,
                            growthRate: 0.22,
                            profitMargin: 0.2,
                        },
                        // Nexus Interactive - 4 periods with seasonal variation
                        {
                            companyIndex: 2,
                            periods: 4,
                            baseRevenue: 520000,
                            growthRate: 0.15,
                            profitMargin: 0.18,
                        },
                        // GreenTech - 4 periods with steady growth
                        {
                            companyIndex: 3,
                            periods: 4,
                            baseRevenue: 720000,
                            growthRate: 0.2,
                            profitMargin: 0.22,
                        },
                        // Urban Threads - 2 periods
                        {
                            companyIndex: 4,
                            periods: 2,
                            baseRevenue: 350000,
                            growthRate: 0.12,
                            profitMargin: 0.15,
                        },
                        // EcoLifestyle - 2 periods
                        {
                            companyIndex: 5,
                            periods: 2,
                            baseRevenue: 280000,
                            growthRate: 0.08,
                            profitMargin: 0.12,
                        },
                    ];
                    _i = 0, financeData_1 = financeData;
                    _p.label = 24;
                case 24:
                    if (!(_i < financeData_1.length)) return [3 /*break*/, 29];
                    _a = financeData_1[_i], companyIndex = _a.companyIndex, periods = _a.periods, baseRevenue = _a.baseRevenue, growthRate = _a.growthRate, profitMargin = _a.profitMargin;
                    period = 1;
                    _p.label = 25;
                case 25:
                    if (!(period <= periods)) return [3 /*break*/, 28];
                    revenue = baseRevenue *
                        Math.pow(1 + growthRate, period - 1) *
                        (0.9 + Math.random() * 0.2);
                    operatingCosts = revenue * (1 - profitMargin - 0.05 + Math.random() * 0.1);
                    netProfit = revenue - operatingCosts;
                    roi = (netProfit / operatingCosts) * 100;
                    return [4 /*yield*/, prisma_1.default.finance.create({
                            data: {
                                company_id: companies[companyIndex].id,
                                user_id: companies[companyIndex].user_id,
                                period: period,
                                total_revenue: Math.round(revenue),
                                net_profit: Math.round(netProfit),
                                cash_balance: companies[companyIndex].cash_balance +
                                    Math.round(netProfit * period * 0.7),
                                operating_costs: Math.round(operatingCosts),
                                roi: Math.round(roi * 100) / 100,
                                burn_rate: Math.round(operatingCosts / 12),
                                finalised: period < periods,
                                investment_amount: period === 1 ? Math.round(baseRevenue * 0.3) : 0,
                                loan_amount: period === 2 ? Math.round(baseRevenue * 0.15) : 0,
                                repay_loan: period === 3 ? Math.round(baseRevenue * 0.08) : 0,
                                dividend_payout: period === periods && netProfit > 0
                                    ? Math.round(netProfit * 0.1)
                                    : 0,
                                equity_issue: 0,
                                processed: period < periods,
                                processed_at: period < periods
                                    ? new Date(Date.now() - (periods - period) * 30 * 24 * 60 * 60 * 1000)
                                    : null,
                            },
                        })];
                case 26:
                    _p.sent();
                    _p.label = 27;
                case 27:
                    period++;
                    return [3 /*break*/, 25];
                case 28:
                    _i++;
                    return [3 /*break*/, 24];
                case 29:
                    // Create HR Decisions with realistic role structures
                    console.log("👨‍💼 Creating HR decisions...");
                    hrData = [
                        { companyIndex: 0, periods: 4, baseSalaryBudget: 180000 }, // TechNova
                        { companyIndex: 1, periods: 4, baseSalaryBudget: 160000 }, // Quantum
                        { companyIndex: 2, periods: 4, baseSalaryBudget: 140000 }, // Nexus
                        { companyIndex: 3, periods: 4, baseSalaryBudget: 155000 }, // GreenTech
                        { companyIndex: 4, periods: 2, baseSalaryBudget: 85000 }, // Urban Threads
                        { companyIndex: 5, periods: 2, baseSalaryBudget: 70000 }, // EcoLifestyle
                    ];
                    _b = 0, hrData_1 = hrData;
                    _p.label = 30;
                case 30:
                    if (!(_b < hrData_1.length)) return [3 /*break*/, 35];
                    _c = hrData_1[_b], companyIndex = _c.companyIndex, periods = _c.periods, baseSalaryBudget = _c.baseSalaryBudget;
                    _loop_1 = function (period) {
                        var salaryBudget, trainingBudget, totalBudget, hrDecision, roles;
                        return __generator(this, function (_q) {
                            switch (_q.label) {
                                case 0:
                                    salaryBudget = baseSalaryBudget + (period - 1) * 25000;
                                    trainingBudget = salaryBudget * 0.08;
                                    totalBudget = salaryBudget + trainingBudget;
                                    return [4 /*yield*/, prisma_1.default.hr_decision.create({
                                            data: {
                                                company_id: companies[companyIndex].id,
                                                period: period,
                                                is_submitted: period < periods,
                                                salary_budget: salaryBudget,
                                                training_budget: trainingBudget,
                                                total_budget: totalBudget,
                                                employee_satisfaction: 7.0 + Math.random() * 2.0,
                                                recruitment_cost: period === 1 ? 35000 : 15000,
                                                firing_cost: period === 3 ? 12000 : 0,
                                                total_employee_count: Math.floor(20 + period * 8 + Math.random() * 10),
                                            },
                                        })];
                                case 1:
                                    hrDecision = _q.sent();
                                    roles = companyIndex < 4
                                        ? [
                                            { name: "Software Engineer", salary: 95000, count: 6 + period },
                                            {
                                                name: "Product Manager",
                                                salary: 120000,
                                                count: 2 + Math.floor(period / 2),
                                            },
                                            { name: "Data Scientist", salary: 105000, count: 2 + period },
                                            { name: "UI/UX Designer", salary: 85000, count: 3 },
                                            {
                                                name: "Marketing Specialist",
                                                salary: 75000,
                                                count: 3 + period,
                                            },
                                        ]
                                        : [
                                            { name: "Store Manager", salary: 55000, count: 2 + period },
                                            { name: "Sales Associate", salary: 35000, count: 8 + period * 2 },
                                            { name: "Marketing Coordinator", salary: 50000, count: 2 },
                                            { name: "Visual Merchandiser", salary: 45000, count: 1 + period },
                                        ];
                                    return [4 /*yield*/, Promise.all(roles.map(function (role) {
                                            return prisma_1.default.hr_role_decision.create({
                                                data: {
                                                    hr_decision_id: hrDecision.id,
                                                    role_name: role.name,
                                                    salary_per_head: role.salary,
                                                    head_count: role.count,
                                                },
                                            });
                                        }))];
                                case 2:
                                    _q.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    period = 1;
                    _p.label = 31;
                case 31:
                    if (!(period <= periods)) return [3 /*break*/, 34];
                    return [5 /*yield**/, _loop_1(period)];
                case 32:
                    _p.sent();
                    _p.label = 33;
                case 33:
                    period++;
                    return [3 /*break*/, 31];
                case 34:
                    _b++;
                    return [3 /*break*/, 30];
                case 35:
                    // Create R&D Decisions
                    console.log("🔬 Creating R&D decisions...");
                    _d = 0, _e = hrData.slice(0, 4);
                    _p.label = 36;
                case 36:
                    if (!(_d < _e.length)) return [3 /*break*/, 41];
                    _f = _e[_d], companyIndex = _f.companyIndex, periods = _f.periods;
                    period = 1;
                    _p.label = 37;
                case 37:
                    if (!(period <= periods)) return [3 /*break*/, 40];
                    budget = 200000 + period * 40000 + Math.random() * 50000;
                    return [4 /*yield*/, prisma_1.default.rd.create({
                            data: {
                                company_id: companies[companyIndex].id,
                                period: period,
                                budget: Math.round(budget),
                                pip: 2 + Math.floor(Math.random() * 4), // Products in pipeline
                                time_to_market: 4 + Math.floor(Math.random() * 8),
                                total_development: 1 + period + Math.floor(Math.random() * 2),
                                patented: Math.floor(Math.random() * 3),
                                quality_changes: Math.floor(Math.random() * 5) - 2, // -2 to 2
                                finalised: period < periods,
                            },
                        })];
                case 38:
                    _p.sent();
                    _p.label = 39;
                case 39:
                    period++;
                    return [3 /*break*/, 37];
                case 40:
                    _d++;
                    return [3 /*break*/, 36];
                case 41:
                    // Create Production Decisions for products that have launched
                    console.log("🏭 Creating production decisions...");
                    _loop_2 = function (product) {
                        var company, maxPeriod, period, baseProduction, unitsToProduced, costPerUnit, totalCost;
                        return __generator(this, function (_r) {
                            switch (_r.label) {
                                case 0:
                                    if (!product.launch_period) return [3 /*break*/, 4];
                                    company = companies.find(function (c) { return c.id === product.company_id; });
                                    maxPeriod = (_o = company === null || company === void 0 ? void 0 : company.current_period) !== null && _o !== void 0 ? _o : 100;
                                    period = product.launch_period;
                                    _r.label = 1;
                                case 1:
                                    if (!(period <= maxPeriod)) return [3 /*break*/, 4];
                                    baseProduction = 1200;
                                    unitsToProduced = baseProduction +
                                        Math.floor(Math.random() * 800) +
                                        (period - product.launch_period) * 200;
                                    costPerUnit = 180 + Math.floor(Math.random() * 120);
                                    totalCost = unitsToProduced * costPerUnit;
                                    return [4 /*yield*/, prisma_1.default.production.create({
                                            data: {
                                                product_id: product.id,
                                                company_id: product.company_id,
                                                period: period,
                                                units_to_produce: unitsToProduced,
                                                cost_per_unit: costPerUnit,
                                                total_cost: totalCost,
                                                production_capacity: Math.floor(unitsToProduced * 1.3),
                                                storage_capacity: Math.floor(unitsToProduced * 0.4),
                                                inventory_value: totalCost * 0.8,
                                                defect_rate: Math.random() * 3, // 0-3% defect rate
                                                finalised: period < maxPeriod,
                                            },
                                        })];
                                case 2:
                                    _r.sent();
                                    _r.label = 3;
                                case 3:
                                    period++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _g = 0, products_1 = products;
                    _p.label = 42;
                case 42:
                    if (!(_g < products_1.length)) return [3 /*break*/, 45];
                    product = products_1[_g];
                    return [5 /*yield**/, _loop_2(product)];
                case 43:
                    _p.sent();
                    _p.label = 44;
                case 44:
                    _g++;
                    return [3 /*break*/, 42];
                case 45:
                    // Create Marketing Decisions
                    console.log("📢 Creating marketing decisions...");
                    _h = 0, hrData_2 = hrData;
                    _p.label = 46;
                case 46:
                    if (!(_h < hrData_2.length)) return [3 /*break*/, 51];
                    _j = hrData_2[_h], companyIndex = _j.companyIndex, periods = _j.periods;
                    period = 1;
                    _p.label = 47;
                case 47:
                    if (!(period <= periods)) return [3 /*break*/, 50];
                    baseBudget = companyIndex < 4 ? 120000 : 60000;
                    totalBudget = baseBudget + period * 20000;
                    onlineRatio = 0.6 + Math.random() * 0.3;
                    onlineBudget = Math.floor(totalBudget * onlineRatio);
                    offlineBudget = totalBudget - onlineBudget;
                    return [4 /*yield*/, prisma_1.default.marketing.create({
                            data: {
                                company_id: companies[companyIndex].id,
                                period: period,
                                budget: totalBudget,
                                offline: offlineBudget,
                                online: onlineBudget,
                                finalised: period < periods,
                            },
                        })];
                case 48:
                    _p.sent();
                    _p.label = 49;
                case 49:
                    period++;
                    return [3 /*break*/, 47];
                case 50:
                    _h++;
                    return [3 /*break*/, 46];
                case 51:
                    // Create Product Performance Records
                    console.log("📊 Creating product performance records...");
                    _loop_3 = function (product) {
                        var company, maxPeriod, period, baseSales, seasonalMultiplier, salesVolume, basePrice, sellingPrice, revenue, costs, profit;
                        return __generator(this, function (_s) {
                            switch (_s.label) {
                                case 0:
                                    if (!product.launch_period) return [3 /*break*/, 4];
                                    company = companies.find(function (c) { return c.id === product.company_id; });
                                    maxPeriod = company === null || company === void 0 ? void 0 : company.current_period;
                                    if (!(typeof maxPeriod === "number")) return [3 /*break*/, 4];
                                    period = product.launch_period;
                                    _s.label = 1;
                                case 1:
                                    if (!(period <= maxPeriod)) return [3 /*break*/, 4];
                                    baseSales = 800 + Math.floor(Math.random() * 600);
                                    seasonalMultiplier = 0.8 + Math.random() * 0.4;
                                    salesVolume = Math.floor(baseSales *
                                        seasonalMultiplier *
                                        (1 + (period - product.launch_period) * 0.15));
                                    basePrice = product.category === "apparel"
                                        ? 89
                                        : product.category === "smartphones"
                                            ? 799
                                            : product.category === "laptops"
                                                ? 1299
                                                : 599;
                                    sellingPrice = basePrice + Math.floor(Math.random() * 200) - 100;
                                    revenue = salesVolume * sellingPrice;
                                    costs = revenue * (0.4 + Math.random() * 0.2);
                                    profit = revenue - costs;
                                    return [4 /*yield*/, prisma_1.default.product_performance.create({
                                            data: {
                                                product_id: product.id,
                                                period: period,
                                                sales_volume: salesVolume,
                                                selling_price: sellingPrice,
                                                revenue: Math.round(revenue),
                                                profit: Math.round(profit),
                                                costs: Math.round(costs),
                                                market_share: 3 + Math.random() * 12, // 3-15% market share
                                                customer_satisfaction: 6.5 + Math.random() * 2.5, // 6.5-9.0 satisfaction
                                            },
                                        })];
                                case 2:
                                    _s.sent();
                                    _s.label = 3;
                                case 3:
                                    period++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _k = 0, products_2 = products;
                    _p.label = 52;
                case 52:
                    if (!(_k < products_2.length)) return [3 /*break*/, 55];
                    product = products_2[_k];
                    return [5 /*yield**/, _loop_3(product)];
                case 53:
                    _p.sent();
                    _p.label = 54;
                case 54:
                    _k++;
                    return [3 /*break*/, 52];
                case 55:
                    // Create Company History Records (snapshots for each period)
                    console.log("📈 Creating company history records...");
                    _l = 0, hrData_3 = hrData;
                    _p.label = 56;
                case 56:
                    if (!(_l < hrData_3.length)) return [3 /*break*/, 62];
                    _m = hrData_3[_l], companyIndex = _m.companyIndex, periods = _m.periods;
                    period = 1;
                    _p.label = 57;
                case 57:
                    if (!(period <= periods)) return [3 /*break*/, 61];
                    company = companies[companyIndex];
                    return [4 /*yield*/, prisma_1.default.finance.findUnique({
                            where: {
                                company_id_period: {
                                    company_id: company.id,
                                    period: period,
                                },
                            },
                        })];
                case 58:
                    financeRecord = _p.sent();
                    if (!financeRecord) return [3 /*break*/, 60];
                    return [4 /*yield*/, prisma_1.default.company_history.create({
                            data: {
                                company_id: company.id,
                                period: period,
                                cash_balance: financeRecord.cash_balance,
                                total_assets: company.total_assets + financeRecord.net_profit * period * 0.5,
                                total_liabilities: company.total_liabilities +
                                    Math.max(0, -financeRecord.net_profit * 0.2),
                                marketing_budget: company.marketing_budget,
                                credit_rating: company.credit_rating,
                                brand_value: company.brand_value + Math.max(0, financeRecord.net_profit * 0.1),
                                data: JSON.stringify({
                                    employees: Math.floor(20 + period * 8 + Math.random() * 10),
                                    market_position: Math.floor(1 + Math.random() * 4),
                                    innovation_index: (7 + Math.random() * 2).toFixed(1),
                                    sustainability_score: (6 + Math.random() * 3).toFixed(1),
                                    customer_base: Math.floor(5000 + period * 1500 + Math.random() * 2000),
                                    geographic_reach: period >= 2 ? "National" : "Regional",
                                }),
                            },
                        })];
                case 59:
                    _p.sent();
                    _p.label = 60;
                case 60:
                    period++;
                    return [3 /*break*/, 57];
                case 61:
                    _l++;
                    return [3 /*break*/, 56];
                case 62:
                    // Create Company Access Records
                    console.log("🔐 Creating company access records...");
                    companyAccessRecords = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], companies.map(function (company) { return ({
                        company_id: company.id,
                        user_id: company.user_id,
                        access_level: "owner",
                    }); }), true), companies.slice(0, 4).map(function (company) { return ({
                        company_id: company.id,
                        user_id: instructor.id,
                        access_level: "viewer",
                    }); }), true), companies.slice(4, 6).map(function (company) { return ({
                        company_id: company.id,
                        user_id: admin.id,
                        access_level: "viewer",
                    }); }), true), [
                        // Cross-company viewer access for learning purposes
                        {
                            company_id: companies[0].id, // TechNova
                            user_id: students[1].id, // Bob can view Alice's company
                            access_level: "viewer",
                        },
                        {
                            company_id: companies[1].id, // Quantum
                            user_id: students[0].id, // Alice can view Bob's company
                            access_level: "viewer",
                        },
                    ], false);
                    return [4 /*yield*/, Promise.all(companyAccessRecords.map(function (access) {
                            return prisma_1.default.company_access.create({ data: access });
                        }))];
                case 63:
                    _p.sent();
                    return [4 /*yield*/, prisma_1.default.user.count()];
                case 64:
                    userCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.simulation.count()];
                case 65:
                    simulationCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.company.count()];
                case 66:
                    companyCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.product.count()];
                case 67:
                    productCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.finance.count()];
                case 68:
                    financeCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.hr_decision.count()];
                case 69:
                    hrCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.rd.count()];
                case 70:
                    rdCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.production.count()];
                case 71:
                    productionCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.marketing.count()];
                case 72:
                    marketingCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.product_performance.count()];
                case 73:
                    performanceCount = _p.sent();
                    return [4 /*yield*/, prisma_1.default.company_history.count()];
                case 74:
                    historyCount = _p.sent();
                    console.log("✅ Database seeding completed successfully!");
                    console.log("\n\uD83D\uDCCA SEEDING SUMMARY:\n\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 Entity Type                 \u2502 Count \u2502\n\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Users                       \u2502   ".concat(userCount.toString().padStart(3), " \u2502\n\u2502 Simulations                 \u2502   ").concat(simulationCount.toString().padStart(3), " \u2502\n\u2502 Companies                   \u2502   ").concat(companyCount.toString().padStart(3), " \u2502\n\u2502 Products                    \u2502   ").concat(productCount.toString().padStart(3), " \u2502\n\u2502 Finance Records             \u2502   ").concat(financeCount.toString().padStart(3), " \u2502\n\u2502 HR Decisions                \u2502   ").concat(hrCount.toString().padStart(3), " \u2502\n\u2502 R&D Decisions               \u2502   ").concat(rdCount.toString().padStart(3), " \u2502\n\u2502 Production Records          \u2502   ").concat(productionCount.toString().padStart(3), " \u2502\n\u2502 Marketing Decisions         \u2502   ").concat(marketingCount.toString().padStart(3), " \u2502\n\u2502 Product Performances        \u2502   ").concat(performanceCount.toString().padStart(3), " \u2502\n\u2502 Company Histories           \u2502   ").concat(historyCount.toString().padStart(3), " \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\uD83C\uDFAF KEY FEATURES SEEDED:\n\u2022 Multi-industry simulations (Tech, Retail, Manufacturing)\n\u2022 Realistic financial progression with growth patterns\n\u2022 Comprehensive HR structures with role hierarchies\n\u2022 Product lifecycle management with performance tracking\n\u2022 Historical company snapshots for trend analysis\n\u2022 Proper access control and permissions\n\u2022 Business-ready KPIs and metrics\n\n\uD83D\uDE80 Ready for business simulation platform!\n  "));
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
