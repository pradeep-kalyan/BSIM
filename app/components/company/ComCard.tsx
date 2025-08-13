"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { company } from "@prisma/client";

import ViewDashboard from "./ViewDashboard";

interface ExtendedCompany extends company {
  canAccess?: boolean;
  canEdit?: boolean;
  user_id: string; // The creator's user ID
}

interface CompanyCardProps {
  companies: ExtendedCompany[];
  currentUserId?: string;
  onEdit?: (company: ExtendedCompany) => void;
  onDelete?: (id: string) => void;
  simulationName: string;
  simulationID?: string; // Optional, if you want to use it for navigation or other purposes
}

const CompanyList: React.FC<CompanyCardProps> = ({
  companies,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this company?")) {
      onDelete?.(id);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => {
        const isOwner = company.user_id === currentUserId;

        return (
          <div
            key={company.id}
            className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-lg p-5 flex flex-col justify-between relative"
          >
            {isOwner && (
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => onEdit?.(company)}
                  className="p-2 bg-green-700 hover:bg-green-800 text-white rounded-full"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2 text-white truncate">
                {company.name}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                {company.description || "No description provided."}
              </p>
            </div>

            <div className="flex justify-end items-center mt-2">
              {(isOwner || company.canAccess) && (
                <ViewDashboard companyId={company.id} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompanyList;
