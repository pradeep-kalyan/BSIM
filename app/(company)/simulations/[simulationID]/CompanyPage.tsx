"use client";

import React, { useEffect, useState } from "react";
import { getCompaniesBySimulation } from "@/app/_actions/company";
import CompanyList from "../_components/ComCard";
import CreateCompanyForm from "../_components/CreateCompanyForm";
import { CheckCircle, LayoutDashboard, PlusCircle, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  simulationID: string;
  simulationName: string;
}

const CompanyPage = ({ simulationID, simulationName }: Props) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [success, setSuccess] = useState(false);

  const fetchCompanies = async () => {
    const data = await getCompaniesBySimulation(simulationID);
    setCompanies(data || []);
    setInitialLoad(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreated = async () => {
    setInitialLoad(true);
    await fetchCompanies();
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-10 relative">

      {companies.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm((prev) => !prev)}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md z-10"
        >
          {showForm ? (
            <>
              <LayoutDashboard className="w-5 h-5" />
              View Companies
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              Create Company
            </>
          )}
        </motion.button>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 z-20"
        >
          <CheckCircle className="w-4 h-4" />
          Company created successfully!
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {showForm ? (
  <motion.div
    key="create-company"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="flex justify-center"
  >
    <CreateCompanyForm simulationID={simulationID} onCreated={handleCreated} />
  </motion.div>
) : companies.length > 0 ? (
  <motion.div
    key="company-list"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <CompanyList companies={companies} simulationName={simulationName} />
  </motion.div>
) : (
  <motion.div
    key="empty"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center"
  >
    <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6">
      <Building2 className="w-10 h-10 text-blue-400" />
    </div>
    <p className="text-lg text-slate-300 mb-4">No companies yet.</p>
    <CreateCompanyForm simulationID={simulationID} onCreated={handleCreated} />
  </motion.div>
)}

      </AnimatePresence>
    </div>
  );
};

export default CompanyPage;
