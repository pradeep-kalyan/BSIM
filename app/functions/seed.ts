import prisma from "./prisma";

async function main() {

  // Clean existing data in correct order (respecting foreign key constraints)
  await prisma.product_performance.deleteMany();
  await prisma.marketing.deleteMany();
  await prisma.rd.deleteMany();
  await prisma.production.deleteMany();
  await prisma.hr_role_decision.deleteMany();
  await prisma.hr_decision.deleteMany();
  await prisma.finance.deleteMany();
  await prisma.product.deleteMany();
  await prisma.company_history.deleteMany();
  await prisma.company_access.deleteMany();
  await prisma.simulation_access.deleteMany();
  await prisma.company.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword =
    "$2y$10$N/ohrDUZObMGWG30oskpee40vFV8CtG7nCwkDO6vrx9IL6f8OuQZu"; // "password123"

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
      role: "user", // Schema only has "user" and "admin" roles
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
    prisma.user.create({
      data: {
        name: "Emma Rodriguez",
        email: "emma.rodriguez@student.edu",
        password_hash: hashedPassword,
        role: "user",
      },
    }),
    prisma.user.create({
      data: {
        name: "Frank Liu",
        email: "frank.liu@student.edu",
        password_hash: hashedPassword,
        role: "user",
      },
    }),
  ]);

  // Create Simulations
  console.log("🎮 Creating simulations...");
  const techSimulation = await prisma.simulation.create({
    data: {
      name: "Technology Industry Competition Q1-Q4 2024",
      description:
        "A comprehensive business simulation where teams compete as technology companies in smartphone, laptop, and smart device markets. Focus on R&D, production efficiency, marketing strategies, and financial management.",
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
  });

  const retailSimulation = await prisma.simulation.create({
    data: {
      name: "Retail Fashion & Lifestyle Challenge",
      description:
        "A retail-focused simulation covering fashion, home goods, and lifestyle products. Emphasis on inventory management, seasonal trends, customer satisfaction, and omnichannel strategies.",
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
  });

  const manufacturingSimulation = await prisma.simulation.create({
    data: {
      name: "Advanced Manufacturing & Supply Chain",
      description:
        "Industrial manufacturing simulation focusing on automotive parts, machinery, and industrial equipment. Covers supply chain optimization, quality control, and international trade.",
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
  });

  // Create Simulation Access
  console.log("🔑 Setting up simulation access...");
  const simulationAccess = [
    // Tech simulation - all 4 main students
    ...students.slice(0, 4).map((student) => ({
      simulation_id: techSimulation.id,
      user_id: student.id,
      access_level: "editor",
    })),
    // Retail simulation - 2 students
    ...students.slice(4, 6).map((student) => ({
      simulation_id: retailSimulation.id,
      user_id: student.id,
      access_level: "editor",
    })),
    // Manufacturing simulation - instructor only for now
    {
      simulation_id: manufacturingSimulation.id,
      user_id: instructor.id,
      access_level: "owner",
    },
  ];

  await Promise.all(
    simulationAccess.map((access) =>
      prisma.simulation_access.create({ data: access })
    )
  );

  // Create Companies with realistic business data
  console.log("🏢 Creating companies...");
  const companies = await Promise.all([
    // Tech Simulation Companies
    prisma.company.create({
      data: {
        simulation_id: techSimulation.id,
        user_id: students[0].id,
        name: "TechNova Solutions",
        description:
          "Leading provider of AI-powered consumer electronics and enterprise solutions",
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

    prisma.company.create({
      data: {
        simulation_id: techSimulation.id,
        user_id: students[1].id,
        name: "Quantum Dynamics Corp",
        description:
          "Next-generation quantum computing solutions and advanced semiconductors",
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

    prisma.company.create({
      data: {
        simulation_id: techSimulation.id,
        user_id: students[2].id,
        name: "Nexus Interactive",
        description:
          "Immersive AR/VR experiences and interactive digital solutions",
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

    prisma.company.create({
      data: {
        simulation_id: techSimulation.id,
        user_id: students[3].id,
        name: "GreenTech Innovations",
        description:
          "Sustainable technology solutions for renewable energy and smart cities",
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
    prisma.company.create({
      data: {
        simulation_id: retailSimulation.id,
        user_id: students[4].id,
        name: "Urban Threads Co.",
        description:
          "Contemporary fashion brand focusing on sustainable streetwear and lifestyle products",
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

    prisma.company.create({
      data: {
        simulation_id: retailSimulation.id,
        user_id: students[5].id,
        name: "EcoLifestyle Market",
        description:
          "Premium eco-friendly lifestyle products and wellness accessories",
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
  ]);

  // Create Products with realistic specifications
  console.log("📱 Creating products...");
  const products = await Promise.all([
    // TechNova Products
    prisma.product.create({
      data: {
        company_id: companies[0].id,
        name: "TechNova Pro X1",
        description:
          "Flagship smartphone with advanced AI camera and 5G connectivity",
        category: "smartphones",
        quality_rating: 8.7,
        innovation_rating: 9.1,
        sustainability_rating: 7.3,
        status: "active",
        launch_period: 1,
      },
    }),

    prisma.product.create({
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

    prisma.product.create({
      data: {
        company_id: companies[0].id,
        name: "TechNova Smart Hub",
        description:
          "AI-powered smart home control center with voice recognition",
        category: "smart_devices",
        quality_rating: 8.2,
        innovation_rating: 8.8,
        sustainability_rating: 8.1,
        status: "active",
        launch_period: 3,
      },
    }),

    // Quantum Dynamics Products
    prisma.product.create({
      data: {
        company_id: companies[1].id,
        name: "QuantumBook Pro",
        description:
          "Quantum-enhanced laptop with breakthrough processing capabilities",
        category: "laptops",
        quality_rating: 9.3,
        innovation_rating: 9.8,
        sustainability_rating: 7.1,
        status: "active",
        launch_period: 2,
      },
    }),

    prisma.product.create({
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
    prisma.product.create({
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

    prisma.product.create({
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
    prisma.product.create({
      data: {
        company_id: companies[3].id,
        name: "EcoPhone Green",
        description:
          "Fully recyclable smartphone with solar charging capability",
        category: "smartphones",
        quality_rating: 8.1,
        innovation_rating: 8.6,
        sustainability_rating: 9.5,
        status: "active",
        launch_period: 1,
      },
    }),

    prisma.product.create({
      data: {
        company_id: companies[3].id,
        name: "GreenTech Solar Tablet",
        description:
          "Solar-powered tablet for field work and outdoor activities",
        category: "tablets",
        quality_rating: 7.9,
        innovation_rating: 8.3,
        sustainability_rating: 9.2,
        status: "active",
        launch_period: 2,
      },
    }),

    // Urban Threads Products
    prisma.product.create({
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

    prisma.product.create({
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
    prisma.product.create({
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
  ]);

  // Create comprehensive Finance Records
  console.log("💰 Creating finance records...");
  const financeData = [
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

  for (const {
    companyIndex,
    periods,
    baseRevenue,
    growthRate,
    profitMargin,
  } of financeData) {
    for (let period = 1; period <= periods; period++) {
      const revenue =
        baseRevenue *
        Math.pow(1 + growthRate, period - 1) *
        (0.9 + Math.random() * 0.2);
      const operatingCosts =
        revenue * (1 - profitMargin - 0.05 + Math.random() * 0.1);
      const netProfit = revenue - operatingCosts;
      const roi = (netProfit / operatingCosts) * 100;

      await prisma.finance.create({
        data: {
          company_id: companies[companyIndex].id,
          user_id: companies[companyIndex].user_id,
          period: period,
          total_revenue: Math.round(revenue),
          net_profit: Math.round(netProfit),
          cash_balance:
            companies[companyIndex].cash_balance +
            Math.round(netProfit * period * 0.7),
          operating_costs: Math.round(operatingCosts),
          roi: Math.round(roi * 100) / 100,
          burn_rate: Math.round(operatingCosts / 12),
          finalised: period < periods,
          investment_amount: period === 1 ? Math.round(baseRevenue * 0.3) : 0,
          loan_amount: period === 2 ? Math.round(baseRevenue * 0.15) : 0,
          repay_loan: period === 3 ? Math.round(baseRevenue * 0.08) : 0,
          dividend_payout:
            period === periods && netProfit > 0
              ? Math.round(netProfit * 0.1)
              : 0,
          equity_issue: 0,
          processed: period < periods,
          processed_at:
            period < periods
              ? new Date(
                  Date.now() - (periods - period) * 30 * 24 * 60 * 60 * 1000
                )
              : null,
        },
      });
    }
  }

  // Create HR Decisions with realistic role structures
  console.log("👨‍💼 Creating HR decisions...");
  const hrData = [
    { companyIndex: 0, periods: 4, baseSalaryBudget: 180000 }, // TechNova
    { companyIndex: 1, periods: 4, baseSalaryBudget: 160000 }, // Quantum
    { companyIndex: 2, periods: 4, baseSalaryBudget: 140000 }, // Nexus
    { companyIndex: 3, periods: 4, baseSalaryBudget: 155000 }, // GreenTech
    { companyIndex: 4, periods: 2, baseSalaryBudget: 85000 }, // Urban Threads
    { companyIndex: 5, periods: 2, baseSalaryBudget: 70000 }, // EcoLifestyle
  ];

  for (const { companyIndex, periods, baseSalaryBudget } of hrData) {
    for (let period = 1; period <= periods; period++) {
      const salaryBudget = baseSalaryBudget + (period - 1) * 25000;
      const trainingBudget = salaryBudget * 0.08;
      const totalBudget = salaryBudget + trainingBudget;

      const hrDecision = await prisma.hr_decision.create({
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
          total_employee_count: Math.floor(
            20 + period * 8 + Math.random() * 10
          ),
        },
      });

      // Create role decisions for each HR decision
      const roles =
        companyIndex < 4
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

      await Promise.all(
        roles.map((role) =>
          prisma.hr_role_decision.create({
            data: {
              hr_decision_id: hrDecision.id,
              role_name: role.name,
              salary_per_head: role.salary,
              head_count: role.count,
            },
          })
        )
      );
    }
  }

  // Create R&D Decisions
  console.log("🔬 Creating R&D decisions...");
  for (const { companyIndex, periods } of hrData.slice(0, 4)) {
    // Only tech companies
    for (let period = 1; period <= periods; period++) {
      const budget = 200000 + period * 40000 + Math.random() * 50000;

      await prisma.rd.create({
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
      });
    }
  }

  // Create Production Decisions for products that have launched
  console.log("🏭 Creating production decisions...");
  for (const product of products) {
    if (product.launch_period) {
      const company = companies.find((c) => c.id === product.company_id);
      const maxPeriod = company?.current_period ?? 100;

      for (
        let period = product.launch_period;
        period <= maxPeriod;
        period++
      ) {
        const baseProduction = 1200;
        const unitsToProduced =
          baseProduction +
          Math.floor(Math.random() * 800) +
          (period - product.launch_period) * 200;
        const costPerUnit = 180 + Math.floor(Math.random() * 120);
        const totalCost = unitsToProduced * costPerUnit;

        await prisma.production.create({
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
        });
      }
    }
  }

  // Create Marketing Decisions
  console.log("📢 Creating marketing decisions...");
  for (const { companyIndex, periods } of hrData) {
    for (let period = 1; period <= periods; period++) {
      const baseBudget = companyIndex < 4 ? 120000 : 60000; // Tech vs Retail
      const totalBudget = baseBudget + period * 20000;
      const onlineRatio = 0.6 + Math.random() * 0.3; // 60-90% online
      const onlineBudget = Math.floor(totalBudget * onlineRatio);
      const offlineBudget = totalBudget - onlineBudget;

      await prisma.marketing.create({
        data: {
          company_id: companies[companyIndex].id,
          period: period,
          budget: totalBudget,
          offline: offlineBudget,
          online: onlineBudget,
          finalised: period < periods,
        },
      });
    }
  }

  // Create Product Performance Records
  console.log("📊 Creating product performance records...");
  for (const product of products) {
    if (product.launch_period) {
      const company = companies.find((c) => c.id === product.company_id);
      const maxPeriod = company?.current_period;

      if (typeof maxPeriod === "number") {
        for (let period = product.launch_period; period <= maxPeriod; period++) {
          const baseSales = 800 + Math.floor(Math.random() * 600);
          const seasonalMultiplier = 0.8 + Math.random() * 0.4; // ±20% seasonal variation
          const salesVolume = Math.floor(
            baseSales *
              seasonalMultiplier *
              (1 + (period - product.launch_period) * 0.15)
          );

        const basePrice =
          product.category === "apparel"
            ? 89
            : product.category === "smartphones"
            ? 799
            : product.category === "laptops"
            ? 1299
            : 599;

        const sellingPrice = basePrice + Math.floor(Math.random() * 200) - 100;
        const revenue = salesVolume * sellingPrice;
        const costs = revenue * (0.4 + Math.random() * 0.2);
        const profit = revenue - costs;

        await prisma.product_performance.create({
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
        });
        }
      }
    }
  }
  
    // Create Company History Records (snapshots for each period)
    console.log("📈 Creating company history records...");
  for (const { companyIndex, periods } of hrData) {
    for (let period = 1; period <= periods; period++) {
      const company = companies[companyIndex];
      // Calculate historical values based on finance records
      const financeRecord = await prisma.finance.findUnique({
        where: {
          company_id_period: {
            company_id: company.id,
            period: period,
          },
        },
      });

      if (financeRecord) {
        await prisma.company_history.create({
          data: {
            company_id: company.id,
            period: period,
            cash_balance: financeRecord.cash_balance,
            total_assets:
              company.total_assets + financeRecord.net_profit * period * 0.5,
            total_liabilities:
              company.total_liabilities +
              Math.max(0, -financeRecord.net_profit * 0.2),
            marketing_budget: company.marketing_budget,
            credit_rating: company.credit_rating,
            brand_value:
              company.brand_value + Math.max(0, financeRecord.net_profit * 0.1),
            data: JSON.stringify({
              employees: Math.floor(20 + period * 8 + Math.random() * 10),
              market_position: Math.floor(1 + Math.random() * 4),
              innovation_index: (7 + Math.random() * 2).toFixed(1),
              sustainability_score: (6 + Math.random() * 3).toFixed(1),
              customer_base: Math.floor(
                5000 + period * 1500 + Math.random() * 2000
              ),
              geographic_reach: period >= 2 ? "National" : "Regional",
            }),
          },
        });
      }
    }
  }

  // Create Company Access Records
  console.log("🔐 Creating company access records...");
  const companyAccessRecords = [
    // Each student owns their company
    ...companies.map((company) => ({
      company_id: company.id,
      user_id: company.user_id,
      access_level: "owner",
    })),
    // Instructor has viewer access to all companies in tech simulation
    ...companies.slice(0, 4).map((company) => ({
      company_id: company.id,
      user_id: instructor.id,
      access_level: "viewer",
    })),
    // Admin has viewer access to retail companies
    ...companies.slice(4, 6).map((company) => ({
      company_id: company.id,
      user_id: admin.id,
      access_level: "viewer",
    })),
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
  ];

  await Promise.all(
    companyAccessRecords.map((access) =>
      prisma.company_access.create({ data: access })
    )
  );

  // Summary Statistics
  const userCount = await prisma.user.count();
  const simulationCount = await prisma.simulation.count();
  const companyCount = await prisma.company.count();
  const productCount = await prisma.product.count();
  const financeCount = await prisma.finance.count();
  const hrCount = await prisma.hr_decision.count();
  const rdCount = await prisma.rd.count();
  const productionCount = await prisma.production.count();
  const marketingCount = await prisma.marketing.count();
  const performanceCount = await prisma.product_performance.count();
  const historyCount = await prisma.company_history.count();

  console.log("✅ Database seeding completed successfully!");
  console.log(`
📊 SEEDING SUMMARY:
┌─────────────────────────────┬───────┐
│ Entity Type                 │ Count │
├─────────────────────────────┼───────┤
│ Users                       │   ${userCount.toString().padStart(3)} │
│ Simulations                 │   ${simulationCount.toString().padStart(3)} │
│ Companies                   │   ${companyCount.toString().padStart(3)} │
│ Products                    │   ${productCount.toString().padStart(3)} │
│ Finance Records             │   ${financeCount.toString().padStart(3)} │
│ HR Decisions                │   ${hrCount.toString().padStart(3)} │
│ R&D Decisions               │   ${rdCount.toString().padStart(3)} │
│ Production Records          │   ${productionCount.toString().padStart(3)} │
│ Marketing Decisions         │   ${marketingCount.toString().padStart(3)} │
│ Product Performances        │   ${performanceCount.toString().padStart(3)} │
│ Company Histories           │   ${historyCount.toString().padStart(3)} │
└─────────────────────────────┴───────┘

🎯 KEY FEATURES SEEDED:
• Multi-industry simulations (Tech, Retail, Manufacturing)
• Realistic financial progression with growth patterns
• Comprehensive HR structures with role hierarchies
• Product lifecycle management with performance tracking
• Historical company snapshots for trend analysis
• Proper access control and permissions
• Business-ready KPIs and metrics

🚀 Ready for business simulation platform!
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
