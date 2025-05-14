import Image from "next/image";
import Link from "next/link";
import { BarChart3, Users, TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center md:text-left md:max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              <span className="block text-blue-400">Business Simulation</span>
              <span className="block">Platform</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10">
              Experience real-world business scenarios in a risk-free
              environment. Make decisions, analyze outcomes, and learn from the
              results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors border border-slate-700"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Key Features</h2>
            <p className="mt-4 text-xl text-slate-300">
              Our platform offers everything you need to simulate business
              scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg">
              <div className="bg-blue-500/20 p-4 rounded-lg inline-block mb-4">
                <BarChart3 size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Data Analytics
              </h3>
              <p className="text-slate-300">
                Comprehensive data visualization and analytics to help you
                understand the impact of your decisions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg">
              <div className="bg-purple-500/20 p-4 rounded-lg inline-block mb-4">
                <Users size={28} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Team Collaboration
              </h3>
              <p className="text-slate-300">
                Work together with your team to make strategic decisions and
                analyze outcomes collectively.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg">
              <div className="bg-green-500/20 p-4 rounded-lg inline-block mb-4">
                <TrendingUp size={28} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Performance Tracking
              </h3>
              <p className="text-slate-300">
                Track your progress over time and see how your decision-making
                skills improve with practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to start your business simulation?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Join thousands of users who are improving their business skills
            through our simulation platform.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
          >
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
