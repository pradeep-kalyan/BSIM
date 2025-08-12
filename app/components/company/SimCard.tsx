"use client";

import React from "react";
import Link from "next/link";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import { CardProps } from "@/app/types/simulation";

const truncateChars = (text: string, charLimit: number) => {
  if (text.length <= charLimit) return text;
  return text.slice(0, charLimit) + " ...";
};

const Card: React.FC<CardProps> = ({
  simulations,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this simulation?")) {
      onDelete?.(id);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {simulations.map((sim) => {
        const isOwner = sim.created_by === currentUserId;

        return (
          <div
            key={sim.id}
            className="bg-slate-900/80 border border-slate-700 rounded-xl shadow-lg p-5 flex flex-col justify-between relative"
          >
            {isOwner && (
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => onEdit?.(sim)}
                  className="p-2 bg-green-700 hover:bg-green-800 text-white rounded-full"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(sim.id)}
                  className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <div>
              <h3
                className="text-lg font-semibold mb-2 text-white"
                title={sim.name}
              >
                {truncateChars(sim.name, 25)}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                {sim.description}
              </p>
            </div>

            <div className="group flex justify-end mt-2">
              {(isOwner || sim.canAccess) && (
                <Link
                  href={`/simulations/${sim.id}`}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md"
                >
                  Open
                  <ArrowRight
                    size={16}
                    className="transform transition-transform duration-200 group-hover:-rotate-45 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
