"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateDecision from "./CreateDecision"; // ✅ FIXED
import ViewDecisions from "./ViewDecisions";
import { PlusCircle, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const DecisionTab = () => {
  const pathname = usePathname();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getDepartmentFromPath = () => {
    const segments = pathname.split("/");
    const dept = segments.find((seg) =>
      ["finance", "hr", "marketing", "production", "rd"].includes(seg)
    );
    return dept || "";
  };

  const department = getDepartmentFromPath();
  if (!department) return null;

  const departmentLabel =
    department.charAt(0).toUpperCase() + department.slice(1);

  return (
    <div className="min-h-screen px-6 py-10 bg-slate-900 text-white relative">
      {/* Title */}
      <div className="text-2xl font-bold mb-6">
        {departmentLabel} Department Decisions
      </div>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateForm((prev) => !prev)}
        className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:to-purple-700 rounded-lg text-white font-medium shadow-md z-10"
      >
        {showCreateForm ? (
          <span className="flex items-center gap-1">
            <LayoutDashboard size={18} /> View Decisions
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <PlusCircle size={18} /> Create Decision
          </span>
        )}
      </motion.button>

      {/* Main Content */}
      <div className="mt-6">
        {showCreateForm ? (
          <CreateDecision
            department={department}
            onSuccess={() => setShowCreateForm(false)} // ✅ FIXED
          />
        ) : (
          <ViewDecisions department={department} />
        )}
      </div>
    </div>
  );
};

export default DecisionTab;
