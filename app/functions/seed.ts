import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Clear existing data
  await prisma.product_performance.deleteMany();
  await prisma.marketing.deleteMany();
  await prisma.rd.deleteMany();
  await prisma.hr_role_decision.deleteMany();
  await prisma.hr_decision.deleteMany();
  await prisma.production.deleteMany();
  await prisma.finance.deleteMany();
  await prisma.product.deleteMany();
  await prisma.company_history.deleteMany();
  await prisma.company_access.deleteMany();
  await prisma.simulation_access.deleteMany();
  await prisma.company.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword =
    "$2y$10$N/ohrDUZObMGWG30oskpee40vFV8CtG7nCwkDO6vrx9IL6f8OuQZu"; // "password123"

  // Create 3 users
  const users = await Promise.all([
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
        email: 'bob.martinez@student.edu',
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
  ]);

  console.log('✅ Created 3 users');

  // Create 3 simulations
  const simulations = await Promise.all([
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
  ]);

  console.log('✅ Created 3 simulations');

  // Create simulation access permissions
  await Promise.all([
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
  ]);

  console.log('✅ Created simulation access permissions');

  // Create companies - 1 company per simulation
  const companies = [];

  // Tech Startup Challenge Company
  const techCompany = await prisma.company.create({
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
  });

  // Retail Empire Company
  const retailCompany = await prisma.company.create({
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
  });

  // Manufacturing Company
  const manufacturingCompany = await prisma.company.create({
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
  });

  companies.push(techCompany, retailCompany, manufacturingCompany);
  console.log('✅ Created 3 companies (1 per simulation)');

  // Create company access permissions
  const companyAccessData = companies.map(company => ({
    company_id: company.id,
    user_id: company.user_id,
    access_level: 'owner' as const,
  }));

  await prisma.company_access.createMany({
    data: companyAccessData,
  });

  console.log('✅ Created company access permissions');

  // Create products - 3 products per company
  const products = [];
  const productData = [
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

  for (const productInfo of productData) {
    const product = await prisma.product.create({
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
    });
    products.push(product);
  }

  console.log('✅ Created 9 products (3 per company)');

  // Create HR decisions with role decisions for each company
  const hrRoles = [
    { role_name: 'Software Engineer', salary_per_head: 120000, head_count: 8 },
    { role_name: 'Product Manager', salary_per_head: 140000, head_count: 3 },
    { role_name: 'Sales Representative', salary_per_head: 85000, head_count: 5 },
  ];

  for (const company of companies) {
    const hrDecision = await prisma.hr_decision.create({
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
    });

    // Create role decisions for this HR decision
    for (const role of hrRoles) {
      await prisma.hr_role_decision.create({
        data: {
          hr_decision_id: hrDecision.id,
          role_name: role.role_name,
          salary_per_head: role.salary_per_head,
          head_count: role.head_count,
        },
      });
    }
  }

  console.log('✅ Created HR decisions with role decisions for all companies');

  // Create finance decisions for all companies
  for (const company of companies) {
    await prisma.finance.create({
      data: {
        company_id: company.id,
        user_id: company.user_id,
        period: 1,
        total_revenue:250000, 
        net_profit: 125000, 
        cash_balance: company.cash_balance,
        operating_costs:5000, 
        roi: 5, 
        burn_rate:500, 
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
    });
  }

  console.log('✅ Created finance decisions for all companies');

  // Create production decisions for all products
  for (const product of products) {
    await prisma.production.create({
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
        defect_rate:  5, 
        finalised: true,
      },
    });
  }

  console.log('✅ Created production decisions for all products');

  // Create R&D decisions for all companies
  for (const company of companies) {
    await prisma.rd.create({
      data: {
        company_id: company.id,
        period: 1,
        budget: 50000,
        pip:1,
        time_to_market:2,
        total_development: 5,
        patented: 2,
        quality_changes: 5,
        finalised: true,
      },
    });
  }

  console.log('✅ Created R&D decisions for all companies');

  // Create marketing decisions for all companies
  for (const company of companies) {
    await prisma.marketing.create({
      data: {
        company_id: company.id,
        period: 1,
        budget: 10000,
        offline: 5000,
        online: 5000,
        finalised: true,
      },
    });
  }

  console.log('✅ Created marketing decisions for all companies');

  // Create product performances for all products
  for (const product of products) {
    await prisma.product_performance.create({
      data: {
        product_id: product.id,
        period: 1,
        sales_volume:1000,
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
    });
  }

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
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });