"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 animate-pulse">
            <Image
              src="/logo.png"
              alt="Business Simulation Logo"
              width={120}
              height={120}
              className="mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight">
            Business Simulation
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 font-light">
            Where Strategy Meets Innovation
          </p>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Transform your business ideas into reality with our comprehensive simulation platform. 
            Model complex scenarios, analyze market dynamics, and make data-driven decisions 
            in a risk-free environment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
            <button className="border-2 border-slate-400 hover:border-white text-slate-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}</style>
    </main>
  );
}
