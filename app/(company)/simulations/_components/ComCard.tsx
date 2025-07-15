"use client";
import React, { useEffect } from "react";
import { company } from "@prisma/client";
import Link from "next/link";
import { useSimulation } from "@/app/context/SimulationContext";

interface CardProps {
  companies: company[];
  simulationID: string;
  simulationName: string;
}

const Card: React.FC<CardProps> = ({ companies, simulationID }) => {
  const { setSimId } = useSimulation();

  useEffect(() => {
    setSimId(simulationID);
    console.log("sim ID set in context:", simulationID);
  }, [simulationID]);

  return (
    <div className="w-full sm:px-6 lg:px-8 py-6 m-5 flex flex-col justify-start items-start">
      <h2 className="text-2xl font-bold text-white mb-6">Companies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-lg p-5 transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <Link
              href={`/homepage/${company.id}`}
              className="text-lg font-semibold text-white mb-2 truncate hover:text-blue-500 block"
            >
              {company.name}
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
              {company.description || "No description provided."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
