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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, users, simulations, companies, techCompany, retailCompany, manufacturingCompany, companyAccessData, products, productData, _i, productData_1, productInfo, product, hrRoles, _a, companies_1, company, hrDecision, _b, hrRoles_1, role, _c, companies_2, company, _d, products_1, product, _e, companies_3, company, _f, companies_4, company, _g, products_2, product;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    console.log('🌱 Starting seed process...');
                    // Clear existing data
                    return [4 /*yield*/, prisma.product_performance.deleteMany()];
                case 1:
                    // Clear existing data
                    _h.sent();
                    return [4 /*yield*/, prisma.marketing.deleteMany()];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, prisma.rd.deleteMany()];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, prisma.hr_role_decision.deleteMany()];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, prisma.hr_decision.deleteMany()];
                case 5:
                    _h.sent();
                    return [4 /*yield*/, prisma.production.deleteMany()];
                case 6:
                    _h.sent();
                    return [4 /*yield*/, prisma.finance.deleteMany()];
                case 7:
                    _h.sent();
                    return [4 /*yield*/, prisma.product.deleteMany()];
                case 8:
                    _h.sent();
                    return [4 /*yield*/, prisma.company_history.deleteMany()];
                case 9:
                    _h.sent();
                    return [4 /*yield*/, prisma.company_access.deleteMany()];
                case 10:
                    _h.sent();
                    return [4 /*yield*/, prisma.simulation_access.deleteMany()];
                case 11:
                    _h.sent();
                    return [4 /*yield*/, prisma.company.deleteMany()];
                case 12:
                    _h.sent();
                    return [4 /*yield*/, prisma.simulation.deleteMany()];
                case 13:
                    _h.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 14:
                    _h.sent();
                    hashedPassword = "$2y$10$N/ohrDUZObMGWG30oskpee40vFV8CtG7nCwkDO6vrx9IL6f8OuQZu";
                    return [4 /*yield*/, Promise.all([
                            prisma.user.create({
                                data: {
                                    id: 'user1',
                                    name: 'Alice Johnson',
                                    email: 'alice.johnson@example.com',
                                    password_hash: hashedPassword,
                                    role: 'admin',
                                },
                            }),
                            prisma.user.create({
                                data: {
                                    id: 'user2',
                                    name: 'Bob Smith',
                                    email: 'bob.smith@example.com',
                                    password_hash: hashedPassword,
                                    role: 'user',
                                },
                            }),
                            prisma.user.create({
                                data: {
                                    id: 'user3',
                                    name: 'Carol Williams',
                                    email: 'carol.williams@example.com',
                                    password_hash: hashedPassword,
                                    role: 'user',
                                },
                            }),
                        ])];
                case 15:
                    users = _h.sent();
                    console.log('✅ Created 3 users');
                    return [4 /*yield*/, Promise.all([
                            prisma.simulation.create({
                                data: {
                                    id: 'sim1',
                                    name: 'Tech Startup Challenge',
                                    description: 'Navigate the competitive world of technology startups. Build innovative products, manage resources, and capture market share in the fast-paced tech industry.',
                                    config: JSON.stringify({
                                        duration: 12,
                                        starting_cash: 1000000,
                                        market_conditions: 'competitive',
                                        industry: 'technology',
                                        difficulty: 'medium'
                                    }),
                                    current_period: 1,
                                    status: 'active',
                                    created_by: 'user1',
                                },
                            }),
                            prisma.simulation.create({
                                data: {
                                    id: 'sim2',
                                    name: 'Retail Empire Builder',
                                    description: 'Build a retail empire from the ground up. Manage supply chains, optimize inventory, and create customer loyalty in various retail segments.',
                                    config: JSON.stringify({
                                        duration: 16,
                                        starting_cash: 750000,
                                        market_conditions: 'stable',
                                        industry: 'retail',
                                        difficulty: 'easy'
                                    }),
                                    current_period: 1,
                                    status: 'active',
                                    created_by: 'user2',
                                },
                            }),
                            prisma.simulation.create({
                                data: {
                                    id: 'sim3',
                                    name: 'Manufacturing Mastery',
                                    description: 'Master the art of manufacturing excellence. Optimize production processes, implement lean methodologies, and compete in global markets.',
                                    config: JSON.stringify({
                                        duration: 20,
                                        starting_cash: 2000000,
                                        market_conditions: 'volatile',
                                        industry: 'manufacturing',
                                        difficulty: 'hard'
                                    }),
                                    current_period: 1,
                                    status: 'active',
                                    created_by: 'user3',
                                },
                            }),
                        ])];
                case 16:
                    simulations = _h.sent();
                    console.log('✅ Created 3 simulations');
                    // Create simulation access permissions
                    return [4 /*yield*/, Promise.all([
                            // User1 has access to all simulations
                            prisma.simulation_access.create({
                                data: { simulation_id: 'sim1', user_id: 'user1', access_level: 'owner' }
                            }),
                            prisma.simulation_access.create({
                                data: { simulation_id: 'sim2', user_id: 'user1', access_level: 'editor' }
                            }),
                            prisma.simulation_access.create({
                                data: { simulation_id: 'sim3', user_id: 'user1', access_level: 'editor' }
                            }),
                            // User2 owns sim2 and has viewer access to sim1
                            prisma.simulation_access.create({
                                data: { simulation_id: 'sim2', user_id: 'user2', access_level: 'owner' }
                            }),
                            prisma.simulation_access.create({
                                data: { simulation_id: 'sim1', user_id: 'user2', access_level: 'viewer' }
                            }),
                            // User3 owns sim3 and has viewer access to sim1
                            prisma.simulation_access.create({
                                data: { simulation_id: 'sim3', user_id: 'user3', access_level: 'owner' }
                            }),
                            prisma.simulation_access.create({
                                data: { simulation_id: 'sim1', user_id: 'user3', access_level: 'viewer' }
                            }),
                        ])];
                case 17:
                    // Create simulation access permissions
                    _h.sent();
                    console.log('✅ Created simulation access permissions');
                    companies = [];
                    return [4 /*yield*/, prisma.company.create({
                            data: {
                                id: 'comp1',
                                simulation_id: 'sim1',
                                user_id: 'user1',
                                name: 'InnovateTech Solutions',
                                description: 'Cutting-edge AI and machine learning solutions for enterprise clients',
                                logo_url: 'https://example.com/logos/innovatetech.png',
                                cash_balance: 9850000,
                                current_period: 1,
                                total_assets: 1200000,
                                total_liabilities: 200000,
                                marketing_budget: 75000,
                                credit_rating: 'A-',
                                brand_value: 150000,
                                data: JSON.stringify({
                                    employee_count: 45,
                                    office_locations: ['San Francisco', 'Austin'],
                                    key_partnerships: ['Google Cloud', 'AWS']
                                }),
                            },
                        })];
                case 18:
                    techCompany = _h.sent();
                    return [4 /*yield*/, prisma.company.create({
                            data: {
                                id: 'comp2',
                                simulation_id: 'sim2',
                                user_id: 'user2',
                                name: 'TechGadget Central',
                                description: 'Premier retailer of cutting-edge consumer electronics and gadgets',
                                logo_url: 'https://example.com/logos/techgadget.png',
                                cash_balance: 9580000,
                                current_period: 1,
                                total_assets: 920000,
                                total_liabilities: 200000,
                                marketing_budget: 85000,
                                credit_rating: 'A-',
                                brand_value: 140000,
                                data: JSON.stringify({
                                    employee_count: 42,
                                    store_locations: ['New York', 'Chicago', 'Miami', 'Dallas'],
                                    vendor_partnerships: ['Apple', 'Samsung', 'Sony']
                                }),
                            },
                        })];
                case 19:
                    retailCompany = _h.sent();
                    return [4 /*yield*/, prisma.company.create({
                            data: {
                                id: 'comp3',
                                simulation_id: 'sim3',
                                user_id: 'user3',
                                name: 'Precision Auto Parts',
                                description: 'High-precision automotive components for luxury vehicle manufacturers',
                                logo_url: 'https://example.com/logos/precision.png',
                                cash_balance: 8800000,
                                current_period: 1,
                                total_assets: 2500000,
                                total_liabilities: 400000,
                                marketing_budget: 120000,
                                credit_rating: 'AA-',
                                brand_value: 300000,
                                data: JSON.stringify({
                                    employee_count: 150,
                                    manufacturing_facilities: ['Detroit', 'Stuttgart', 'Tokyo'],
                                    certifications: ['ISO 9001', 'TS 16949']
                                }),
                            },
                        })];
                case 20:
                    manufacturingCompany = _h.sent();
                    companies.push(techCompany, retailCompany, manufacturingCompany);
                    console.log('✅ Created 3 companies (1 per simulation)');
                    companyAccessData = companies.map(function (company) { return ({
                        company_id: company.id,
                        user_id: company.user_id,
                        access_level: 'owner',
                    }); });
                    return [4 /*yield*/, prisma.company_access.createMany({
                            data: companyAccessData,
                        })];
                case 21:
                    _h.sent();
                    console.log('✅ Created company access permissions');
                    products = [];
                    productData = [
                        // InnovateTech Solutions products
                        { company_id: 'comp1', name: 'AI Analytics Suite', category: 'Software', description: 'Advanced AI-powered business analytics platform' },
                        { company_id: 'comp1', name: 'ML Prediction Engine', category: 'Software', description: 'Machine learning-based predictive analytics tool' },
                        { company_id: 'comp1', name: 'Smart Automation Hub', category: 'Software', description: 'Intelligent process automation platform' },
                        // TechGadget Central products
                        { company_id: 'comp2', name: 'Smart Home Bundle', category: 'Electronics', description: 'Complete smart home automation package' },
                        { company_id: 'comp2', name: 'Gaming Peripherals Set', category: 'Electronics', description: 'High-performance gaming accessories collection' },
                        { company_id: 'comp2', name: 'Wireless Audio System', category: 'Electronics', description: 'Premium wireless speaker and headphone system' },
                        // Precision Auto Parts products
                        { company_id: 'comp3', name: 'Precision Engine Components', category: 'Automotive', description: 'High-performance engine parts for luxury vehicles' },
                        { company_id: 'comp3', name: 'Advanced Brake Systems', category: 'Automotive', description: 'State-of-the-art braking technology' },
                        { company_id: 'comp3', name: 'Smart Suspension Kit', category: 'Automotive', description: 'Intelligent adaptive suspension systems' },
                    ];
                    _i = 0, productData_1 = productData;
                    _h.label = 22;
                case 22:
                    if (!(_i < productData_1.length)) return [3 /*break*/, 25];
                    productInfo = productData_1[_i];
                    return [4 /*yield*/, prisma.product.create({
                            data: {
                                company_id: productInfo.company_id,
                                name: productInfo.name,
                                description: productInfo.description,
                                category: productInfo.category,
                                quality_rating: 7,
                                innovation_rating: 8,
                                sustainability_rating: 9,
                                status: 'active',
                                launch_period: 1,
                            },
                        })];
                case 23:
                    product = _h.sent();
                    products.push(product);
                    _h.label = 24;
                case 24:
                    _i++;
                    return [3 /*break*/, 22];
                case 25:
                    console.log('✅ Created 9 products (3 per company)');
                    hrRoles = [
                        { role_name: 'Software Engineer', salary_per_head: 120000, head_count: 8 },
                        { role_name: 'Product Manager', salary_per_head: 140000, head_count: 3 },
                        { role_name: 'Sales Representative', salary_per_head: 85000, head_count: 5 },
                    ];
                    _a = 0, companies_1 = companies;
                    _h.label = 26;
                case 26:
                    if (!(_a < companies_1.length)) return [3 /*break*/, 32];
                    company = companies_1[_a];
                    return [4 /*yield*/, prisma.hr_decision.create({
                            data: {
                                company_id: company.id,
                                period: 1,
                                is_submitted: true,
                                salary_budget: 500000,
                                training_budget: 50000,
                                total_budget: 600000,
                                employee_satisfaction: 78,
                                recruitment_cost: 25000,
                                firing_cost: 15000,
                                total_employee_count: 16,
                            },
                        })];
                case 27:
                    hrDecision = _h.sent();
                    _b = 0, hrRoles_1 = hrRoles;
                    _h.label = 28;
                case 28:
                    if (!(_b < hrRoles_1.length)) return [3 /*break*/, 31];
                    role = hrRoles_1[_b];
                    return [4 /*yield*/, prisma.hr_role_decision.create({
                            data: {
                                hr_decision_id: hrDecision.id,
                                role_name: role.role_name,
                                salary_per_head: role.salary_per_head,
                                head_count: role.head_count,
                            },
                        })];
                case 29:
                    _h.sent();
                    _h.label = 30;
                case 30:
                    _b++;
                    return [3 /*break*/, 28];
                case 31:
                    _a++;
                    return [3 /*break*/, 26];
                case 32:
                    console.log('✅ Created HR decisions with role decisions for all companies');
                    _c = 0, companies_2 = companies;
                    _h.label = 33;
                case 33:
                    if (!(_c < companies_2.length)) return [3 /*break*/, 36];
                    company = companies_2[_c];
                    return [4 /*yield*/, prisma.finance.create({
                            data: {
                                company_id: company.id,
                                user_id: company.user_id,
                                period: 1,
                                total_revenue: 250000,
                                net_profit: 125000,
                                cash_balance: company.cash_balance,
                                operating_costs: 5000,
                                roi: 5,
                                burn_rate: 500,
                                finalised: true,
                                investment_amount: 100000,
                                loan_amount: 0,
                                repay_loan: 0,
                                dividend_payout: 25000,
                                equity_issue: 0,
                                notes: 'Strong performance this period',
                                processed: true,
                                processed_at: new Date(),
                            },
                        })];
                case 34:
                    _h.sent();
                    _h.label = 35;
                case 35:
                    _c++;
                    return [3 /*break*/, 33];
                case 36:
                    console.log('✅ Created finance decisions for all companies');
                    _d = 0, products_1 = products;
                    _h.label = 37;
                case 37:
                    if (!(_d < products_1.length)) return [3 /*break*/, 40];
                    product = products_1[_d];
                    return [4 /*yield*/, prisma.production.create({
                            data: {
                                company_id: product.company_id,
                                product_id: product.id,
                                period: 1,
                                units_to_produce: 1250,
                                cost_per_unit: 250,
                                total_cost: 75000,
                                production_capacity: 2000,
                                storage_capacity: 500,
                                inventory_value: 50000,
                                defect_rate: 5,
                                finalised: true,
                            },
                        })];
                case 38:
                    _h.sent();
                    _h.label = 39;
                case 39:
                    _d++;
                    return [3 /*break*/, 37];
                case 40:
                    console.log('✅ Created production decisions for all products');
                    _e = 0, companies_3 = companies;
                    _h.label = 41;
                case 41:
                    if (!(_e < companies_3.length)) return [3 /*break*/, 44];
                    company = companies_3[_e];
                    return [4 /*yield*/, prisma.rd.create({
                            data: {
                                company_id: company.id,
                                period: 1,
                                budget: 50000,
                                pip: 1,
                                time_to_market: 2,
                                total_development: 5,
                                patented: 2,
                                quality_changes: 5,
                                finalised: true,
                            },
                        })];
                case 42:
                    _h.sent();
                    _h.label = 43;
                case 43:
                    _e++;
                    return [3 /*break*/, 41];
                case 44:
                    console.log('✅ Created R&D decisions for all companies');
                    _f = 0, companies_4 = companies;
                    _h.label = 45;
                case 45:
                    if (!(_f < companies_4.length)) return [3 /*break*/, 48];
                    company = companies_4[_f];
                    return [4 /*yield*/, prisma.marketing.create({
                            data: {
                                company_id: company.id,
                                period: 1,
                                budget: 10000,
                                offline: 5000,
                                online: 5000,
                                finalised: true,
                            },
                        })];
                case 46:
                    _h.sent();
                    _h.label = 47;
                case 47:
                    _f++;
                    return [3 /*break*/, 45];
                case 48:
                    console.log('✅ Created marketing decisions for all companies');
                    _g = 0, products_2 = products;
                    _h.label = 49;
                case 49:
                    if (!(_g < products_2.length)) return [3 /*break*/, 52];
                    product = products_2[_g];
                    return [4 /*yield*/, prisma.product_performance.create({
                            data: {
                                product_id: product.id,
                                period: 1,
                                sales_volume: 1000,
                                selling_price: 5000,
                                revenue: 150000,
                                profit: 50000,
                                market_share: 5,
                                customer_satisfaction: 8,
                                costs: 100000,
                                data: JSON.stringify({
                                    customer_reviews: 5,
                                    return_rate: 5,
                                    repeat_customers: 50
                                }),
                            },
                        })];
                case 50:
                    _h.sent();
                    _h.label = 51;
                case 51:
                    _g++;
                    return [3 /*break*/, 49];
                case 52:
                    console.log('✅ Created product performances for all products');
                    console.log('🎉 Seed completed successfully!');
                    console.log('\n📊 Summary:');
                    console.log('- 3 Users created');
                    console.log('- 3 Simulations created (all at period 1)');
                    console.log('- 3 Companies created (1 per simulation, all at period 1)');
                    console.log('- 9 Products created (3 per company)');
                    console.log('- HR decisions with 3 roles each created for all companies');
                    console.log('- Finance, Production, R&D, and Marketing decisions created');
                    console.log('- Product performances created for all products');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
