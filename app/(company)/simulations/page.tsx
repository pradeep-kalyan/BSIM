"use client";

import React, { useEffect, useState } from "react";
import { getSimulations } from "@/app/_actions/createSim";
import Card from "./_components/SimCard";
import CreateSim from "./_components/CreateSim";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, PlusCircle, Rocket, LayoutDashboard } from "lucide-react";

const Page = () => {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [success, setSuccess] = useState(false);
  const fetchSimulations = async () => {
    const data = await getSimulations();
    setSimulations(data);
    setInitialLoad(false);
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const handleSimCreated = async () => {
    setInitialLoad(true);
    await fetchSimulations();
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="w-12 h-12 border-3 border-blue-500/30 rounded-full animate-spin mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-3 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-300 text-lg">Loading simulations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-10 px-4 relative">
      {/* Create Simulation Top Button */}
      {simulations.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm((prev) => !prev)}
          className="absolute top-1 right-1 flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md z-10"
        >
          {showForm ? (
            <>
              <LayoutDashboard className="w-5 h-5" />
              View Simulations
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5" />
              Create Simulation
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
          Simulation created successfully!
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center items-center w-full"
          >
            <CreateSim onCreated={handleSimCreated} />
          </motion.div>
        ) : simulations.length > 0 ? (
          <motion.div
            key="simulations-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card simulations={simulations} />
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center w-full min-h-[400px] flex-col"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Rocket className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to Start?
              </h3>
              <p className="text-slate-300 text-lg">
                Create your first business simulation to begin
              </p>
            </div>

            <CreateSim onCreated={handleSimCreated} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
};

export default Page;
