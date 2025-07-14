import React from "react";
import { company } from "@prisma/client";
import Link from "next/link";

interface CardProps {
  companies: company[];
  simulationName: string;
}

const CompanyList: React.FC<CardProps> = ({ companies, simulationName }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Companies in {simulationName}</h1>

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
