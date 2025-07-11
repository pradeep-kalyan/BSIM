import React from "react";
import { simulation } from "@prisma/client";
import Link from "next/link";

interface CardProps {
  simulations: simulation[];
}

const Card: React.FC<CardProps> = ({ simulations }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Simulations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((simulation) => (
          <div
            key={simulation.id}
            className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-lg p-5 transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
            aria-label={`Simulation: ${simulation.name}`}
          >
            <Link
              href={`simulations/${simulation.id}`}
              className="text-lg font-semibold text-white mb-2 truncate hover:text-blue-500"
            >
              {simulation.name}
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
              {simulation.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
