import prisma from "./prisma";
 
 
 
async function main() {
  console.log("🌱 Starting database seeding...");
 
  // Clean existing data (optional - uncomment if needed)
  await prisma.product_performance.deleteMany();
  await prisma.marketing.deleteMany();
  await prisma.rd.deleteMany();
  await prisma.production.deleteMany();
  await prisma.hr_role_decision.deleteMany();
  await prisma.hr_decision.deleteMany();
  await prisma.finance.deleteMany();
  await prisma.product.deleteMany();
  await prisma.company_access.deleteMany();
  await prisma.simulation_access.deleteMany();
  await prisma.company.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.user.deleteMany();
 
  // Create Users
  console.log("👥 Creating users...");
  const hashedPassword =
    "$2y$10$N/ohrDUZObMGWG30oskpee40vFV8CtG7nCwkDO6vrx9IL6f8OuQZu";
 
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@simulation.com",
      password_hash: hashedPassword,
      role: "admin",
    },
  });
 
  const instructor = await prisma.user.create({
    data: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      password_hash: hashedPassword,
      role: "instructor",
    },
  });
 
  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Chen",
        email: "alice.chen@student.edu",
        password_hash: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Martinez",
        email: "bob.martinez@student.edu",
        password_hash: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carol Williams",
        email: "carol.williams@student.edu",
        password_hash: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Kim",
        email: "david.kim@student.edu",
        password_hash: hashedPassword,
        role: "user",
      },
    }),
  ]);
 
  // Create Simulations
  console.log("🎮 Creating simulations...");
  const techSimulation = await prisma.simulation.create({
    data: {
      name: "Tech Industry Competition 2024",
      description:
        "A comprehensive business simulation focusing on technology companies competing in the smartphone and laptop markets.",
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
  });
 
  const retailSimulation = await prisma.simulation.create({
    data: {
      name: "Retail Business Challenge",
      description:
        "A simulation focused on retail operations, inventory management, and customer satisfaction.",
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
  });
 
  // Create Simulation Access
  console.log("🔑 Setting up simulation access...");
  const simulationAccess = await Promise.all([
    // Tech simulation access
    ...students.map((student) =>
      prisma.simulation_access.create({
        data: {
          simulation_id: techSimulation.id,
          user_id: student.id,
          access_level: "participant",
        },
      })
    ),
    // Retail simulation access for first two students
    prisma.simulation_access.create({
      data: {
        simulation_id: retailSimulation.id,
        user_id: students[0].id,
        access_level: "participant",
      },
    }),
    prisma.simulation_access.create({
      data: {
        simulation_id: retailSimulation.id,
        user_id: students[1].id,
        access_level: "participant",
      },
    }),
  ]);
 
  // Create Companies
  console.log("🏢 Creating companies...");
  const companies = await Promise.all([
    // Tech simulation companies
    prisma.company.create({
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
    prisma.company.create({
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
    prisma.company.create({
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
    prisma.company.create({
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
    prisma.company.create({
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
    prisma.company.create({
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
  ]);
 
  // Create Products
  console.log("📱 Creating products...");
  const products = await Promise.all([
    // TechNova products
    prisma.product.create({
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
    prisma.product.create({
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
    prisma.product.create({
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
    prisma.product.create({
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
    prisma.product.create({
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
  ]);
 
  // Create Finance Records
  console.log("💰 Creating finance records...");
  const financeRecords = [];
 
  // Create finance records for periods 1-3 for tech companies
  for (let period = 1; period <= 3; period++) {
    for (let i = 0; i < 4; i++) {
      // First 4 companies are tech companies
      const baseRevenue = 500000 + Math.random() * 300000;
      const revenue = baseRevenue * (1 + (period - 1) * 0.15); // Growth over periods
      const costs = revenue * (0.6 + Math.random() * 0.2);
      const profit = revenue - costs;
 
      financeRecords.push(
        prisma.finance.create({
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
        })
      );
    }
  }
 
  // Create finance record for retail companies (period 1)
  for (let i = 4; i < 6; i++) {
    const revenue = 200000 + Math.random() * 150000;
    const costs = revenue * (0.7 + Math.random() * 0.15);
    const profit = revenue - costs;
 
    financeRecords.push(
      prisma.finance.create({
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
      })
    );
  }
 
  await Promise.all(financeRecords);
 
  // Create HR Decisions
  console.log("👨‍💼 Creating HR decisions...");
  const hrDecisions = [];
 
  for (let period = 1; period <= 3; period++) {
    for (let i = 0; i < 4; i++) {
      // Tech companies
      hrDecisions.push(
        prisma.hr_decision
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
          .then((hrDecision) => {
            // Create role decisions for each HR decision
            return Promise.all([
              prisma.hr_role_decision.create({
                data: {
                  hr_decision_id: hrDecision.id,
                  role_name: "Software Engineer",
                  salary_per_head: 95000,
                  head_count: 8 + period,
                },
              }),
              prisma.hr_role_decision.create({
                data: {
                  hr_decision_id: hrDecision.id,
                  role_name: "Product Manager",
                  salary_per_head: 110000,
                  head_count: 2 + Math.floor(period / 2),
                },
              }),
              prisma.hr_role_decision.create({
                data: {
                  hr_decision_id: hrDecision.id,
                  role_name: "Marketing Specialist",
                  salary_per_head: 70000,
                  head_count: 3 + period,
                },
              }),
            ]);
          })
      );
    }
  }
 
  await Promise.all(hrDecisions);
 
  // Create R&D Decisions
  console.log("🔬 Creating R&D decisions...");
  const rdDecisions = [];
 
  for (let period = 1; period <= 3; period++) {
    for (let i = 0; i < 4; i++) {
      rdDecisions.push(
        prisma.rd.create({
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
        })
      );
    }
  }
 
  await Promise.all(rdDecisions);
 
  // Create Production Decisions
  console.log("🏭 Creating production decisions...");
  const productionDecisions = [];
 
  for (let period = 1; period <= 3; period++) {
    for (let i = 0; i < 4; i++) {
      const unitsProduced = 1500 + Math.floor(Math.random() * 1000);
      const costPerUnit = 300 + Math.floor(Math.random() * 200);
 
      productionDecisions.push(
        prisma.production.create({
          data: {
            company_id: companies[i].id,
            period: period,
            units_produced: unitsProduced,
            cost_per_unit: costPerUnit,
            production_capacity: 2500 + period * 200,
            storage_capacity: 3000,
            inventory_value: unitsProduced * costPerUnit,
            defect_rate: Math.floor(Math.random() * 5), // 0-4% defect rate
            finalised: period < 3,
          },
        })
      );
    }
  }
 
  await Promise.all(productionDecisions);
 
  // Create Marketing Decisions
  console.log("📢 Creating marketing decisions...");
  const marketingDecisions = [];
 
  for (let period = 1; period <= 3; period++) {
    for (let i = 0; i < 4; i++) {
      const totalBudget = 100000 + period * 20000;
      const onlineBudget = Math.floor(
        totalBudget * (0.6 + Math.random() * 0.3)
      );
      const offlineBudget = totalBudget - onlineBudget;
 
      marketingDecisions.push(
        prisma.marketing.create({
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
        })
      );
    }
  }
 
  await Promise.all(marketingDecisions);
 
  // Create Product Performance Records
  console.log("📊 Creating product performance records...");
  const productPerformances = [];
 
  for (let period = 1; period <= 3; period++) {
    for (const product of products) {
      if (product.launch_period && product.launch_period <= period) {
        const salesVolume = 800 + Math.floor(Math.random() * 600);
        const revenue = salesVolume * product.selling_price;
        const costs = salesVolume * product.production_cost;
        const profit = revenue - costs;
 
        productPerformances.push(
          prisma.product_performance.create({
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
          })
        );
      }
    }
  }
 
  await Promise.all(productPerformances);
 
  console.log("✅ Database seeding completed successfully!");
  console.log(`
  📈 Created:
  - ${6} users (1 admin, 1 instructor, 4 students)
  - ${2} simulations
  - ${6} companies
  - ${5} products
  - ${14} finance records
  - ${12} HR decisions with role breakdowns
  - ${12} R&D decisions
  - ${12} production decisions  
  - ${12} marketing decisions
  - ${13} product performance records
  `);
}
 
main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 