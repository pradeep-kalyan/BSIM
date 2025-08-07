"use client";

import React, { useEffect, useState } from "react";

import { getSimulations,deleteSimulation,} from "@/app/_actions/createSim";

import { getCurrentUser } from "@/app/functions/jwt";
import CreateSim from "./_components/CreateSim";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, PlusCircle, LayoutDashboard, Rocket } from "lucide-react";
import Card from "./_components/SimCard";
import EditSimulationForm from "./_components/EditSimulationForm";
import { ExtendedSimulation } from "./simulation";

const Page = () => {
  const [simulations, setSimulations] = useState<ExtendedSimulation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [success, setSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [editSim, setEditSim] = useState<ExtendedSimulation | null>(null);
  const [activeTab, setActiveTab] = useState<"owned" | "shared" | "all">(
    "owned"
  );
  const [searchQuery] = useState("");
  const [sortBy] = useState<"name" | "created_at">("name");

  const fetchSimulations = async () => {
    const data = await getSimulations();
    const user = await getCurrentUser();

    // Type assertion since getSimulations already processes the data correctly
    setSimulations(data as unknown as ExtendedSimulation[]);

    setCurrentUserId(user?.id);
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

  const ownedSimulations = simulations.filter(
    (sim) => sim.created_by === currentUserId
  );
  const sharedSimulations = simulations.filter(
    (sim) => sim.created_by !== currentUserId && sim.canAccess
  );
  const allSimulations = [...ownedSimulations, ...sharedSimulations];

  const filterAndSort = (list: ExtendedSimulation[]) =>
    list
      .filter((sim) =>
        sim.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) =>
        sortBy === "name"
          ? a.name.localeCompare(b.name)
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

  const visibleSimulations =
    activeTab === "owned"
      ? filterAndSort(ownedSimulations)
      : activeTab === "shared"
      ? filterAndSort(sharedSimulations)
      : filterAndSort(allSimulations);

  if (initialLoad) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-300">Loading simulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-slate-900 text-white relative">
      {/* Tabs */}
      <div className="mb-6 mt-9 flex justify-between items-center">
        <div className="flex gap-2">
          {["owned", "shared", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "owned" | "shared" | "all")}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-blue-600"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              {tab === "owned" ? "Owned" : tab === "all" ? "All" : "Shared"}
            </button>
          ))}
        </div>
      </div>

      {/* Success Toast */}
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

      {/* Count */}
      <div className="mb-6 text-slate-400 text-sm">
        Showing {visibleSimulations.length} of {allSimulations.length} total
        simulations.
      </div>

      {/* Dropdowns + Toggle Button */}
      {allSimulations.length > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
          {/* Toggle Create/View */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow-md"
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
        </div>
      )}

      {/* Main View */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex justify-center"
          >
            <CreateSim onCreated={handleSimCreated} />
          </motion.div>
        ) : visibleSimulations.length > 0 ? (
          <motion.div
            key="sim-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card
              simulations={visibleSimulations}
              currentUserId={currentUserId}
              onEdit={setEditSim}
              onDelete={async (id: string) => {
                await deleteSimulation(id);
                fetchSimulations();
              }}
            />
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
              <Rocket className="w-10 h-10 text-blue-400" />
            </div>
            <p className="text-lg text-slate-300 mb-4">
              {activeTab === "owned"
                ? "No owned simulations yet."
                : activeTab === "shared"
                ? "No shared simulations yet."
                : "No simulations available."}
            </p>
            {activeTab === "owned" && (
              <CreateSim onCreated={handleSimCreated} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editSim && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <EditSimulationForm
              simulation={editSim}
              onClose={() => setEditSim(null)}
              onUpdatedPartial={fetchSimulations}
              onUpdated={async () => {
                await fetchSimulations();
                setEditSim(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
