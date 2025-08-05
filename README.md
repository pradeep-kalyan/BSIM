# Business Simulation Platform

A comprehensive business simulation platform built with Next.js, TypeScript, and Prisma. This application allows users to create and manage virtual companies, make strategic business decisions across multiple departments, and see the results of their choices through detailed analytics and reporting.

## 🚀 Features

### Core Functionality

- **Multi-Company Management**: Create and manage multiple virtual companies
- **Period-Based Simulation**: Make decisions for discrete time periods and see results
- **Comprehensive Dashboard**: Real-time analytics and performance metrics
- **Role-Based Access**: User authentication and authorization system

### Business Modules

- **Human Resources**: Manage workforce, salaries, training, and employee satisfaction
- **Marketing**: Plan campaigns, allocate budgets between online and offline channels
- **Research & Development**: Invest in innovation, product development, and patents
- **Production**: Optimize production capacity, inventory, and quality control
- **Products**: Manage product portfolio, pricing, and lifecycle
- **Sales**: Track revenue, market share, and customer satisfaction
- **Finance**: Handle investments, loans, dividends, and financial planning

### Advanced Features

- **Interactive Form Wizard**: Step-by-step decision making process
- **Preview Dashboard**: Review all decisions before submission
- **Real-time Validation**: Form validation with detailed error messages
- **Responsive Design**: Mobile-first design with Material-UI components
- **Data Visualization**: Charts and graphs powered by Recharts

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Modern React component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **Recharts** - Composable charting library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Production database
- **JWT Authentication** - Secure user sessions
- **Zod** - Schema validation

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database management GUI
- **Turbopack** - Fast build tool for development

## 📦 Installation

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL database
- npm or yarn package manager

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/pradeep-kalyan/Business-Simulation.git
   cd Business-Simulation
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/business_simulation"
   JWT_SECRET="your-super-secret-jwt-key"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npm run seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Usage

### Getting Started

1. **Register an Account**: Create a new user account or login
2. **Create a Simulation**: Set up a new business simulation scenario
3. **Create a Company**: Add your first virtual company to the simulation
4. **Make Decisions**: Navigate through the multi-step form to make business decisions
5. **Submit & Analyze**: Submit your decisions and view the results on your dashboard

### Making Business Decisions

The platform guides you through 8 key areas:

1. **Human Resources**: Set staffing levels, salaries, and training budgets
2. **Marketing**: Allocate marketing spend across channels
3. **R&D**: Invest in product development and innovation
4. **Production**: Plan production capacity and quality improvements
5. **Products**: Manage your product portfolio and pricing
6. **Sales**: Set sales targets and customer service levels
7. **Finance**: Make financial decisions about loans, investments, and dividends
8. **Preview & Submit**: Review all decisions before final submission

### Dashboard Analytics

- **Financial Performance**: Revenue, costs, profit margins
- **Market Position**: Market share, competitive analysis
- **Operational Metrics**: Production efficiency, quality scores
- **HR Metrics**: Employee satisfaction, productivity
- **Trend Analysis**: Historical performance data and forecasting

## 📁 Project Structure

```
business-simulation/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (company)/                # Company management
│   │   └── simulations/
│   ├── (main)/                   # Main application
│   │   ├── homepage/
│   │   └── simulate/
│   ├── _actions/                 # Server actions
│   ├── components/               # Shared components
│   ├── context/                  # React context providers
│   ├── functions/                # Utility functions
│   └── hooks/                    # Custom React hooks
├── prisma/                       # Database schema and migrations
├── public/                       # Static assets
├── ui/                          # UI components
└── package.json
```

## 🚀 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database with sample data
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Run database migrations

## 🔐 Authentication

The platform uses JWT-based authentication with the following features:

- User registration and login
- Secure password hashing with bcryptjs
- Protected routes and API endpoints
- Session management with HTTP-only cookies

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts and authentication
- **Simulations**: Business simulation scenarios
- **Companies**: Virtual companies within simulations
- **Decisions**: Historical business decisions
- **Performance Data**: Results and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request