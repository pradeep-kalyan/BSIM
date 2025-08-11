"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ViewDashboardProps {
  companyId: string;
}

const ViewDashboard: React.FC<ViewDashboardProps> = ({ companyId }) => {
  return (
    <Link
      href={`/homepage/${companyId}`}
      className="group flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md transition-colors duration-200"
    >
      Open
      <ArrowRight
        size={16}
        className="transform transition-transform duration-200 group-hover:-rotate-45 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </Link>
  );
};

export default ViewDashboard;
