"use client";

import React, { useEffect, useState } from "react";
import {
  getCompaniesBySimulation,
  deleteCompany,
} from "@/app/_actions/company";
import { getCurrentUser } from "@/app/functions/jwt";
import CreateCompanyForm from "../_components/CreateCompanyForm";
import CompanyList from "../_components/ComCard";
import {
  CheckCircle,
  LayoutDashboard,
  PlusCircle,
  Building2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import EditCompanyForm from "../_components/EditCompanyForm";

interface Props {
  simulationID: string;
  simulationName: string;
}

const CompanyPage = ({ simulationID, simulationName }: Props) => {
  const [ownedCompanies, setOwnedCompanies] = useState<any[]>([]);
  const [accessibleCompanies, setAccessibleCompanies] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [success, setSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [editCompany, setEditCompany] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "created_at">("name");
  const [activeTab, setActiveTab] = useState<"owned" | "shared" | "all">(
    "owned"
  );
  const [simId, setSimId] = useState(simulationID);


  const fetchCompanies = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const companies = await getCompaniesBySimulation(simulationID);
    setCurrentUserId(user.id);

    setOwnedCompanies(companies.filter((c) => c.user_id === user.id));
    setAccessibleCompanies(companies.filter((c) => c.user_id !== user.id));
    setInitialLoad(false);
  };

  useEffect(() => {
    fetchCompanies();
    setSimId(simulationID);
  }, [simulationID]);

  const handleCreated = async () => {
    setInitialLoad(true);
    await fetchCompanies();
    setShowForm(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDelete = async (companyId: string) => {
    try {
      await deleteCompany(companyId);
      await fetchCompanies();
    } catch (err) {
      console.error("Failed to delete company:", err);
    }
  };

  const handleEdit = (company: any) => setEditCompany(company);

  const filterAndSort = (list: any[]) =>
    list
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) =>
        sortBy === "name"
          ? a.name.localeCompare(b.name)
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

  const allCompanies = [...ownedCompanies, ...accessibleCompanies];
  const visibleCompanies =
    activeTab === "owned"
      ? filterAndSort(ownedCompanies)
      : activeTab === "shared"
      ? filterAndSort(accessibleCompanies)
      : filterAndSort(allCompanies);

  if (initialLoad) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-300">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-slate-900 text-white relative">
      {/* Tab Filters */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          {["owned", "shared", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
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
           Company created successfully!
         </motion.div>
       )}

      {/* Company Counter */}
      <div className="mb-6 flex  text-slate-400 text-sm">
        Showing {visibleCompanies.length} of {allCompanies.length} total
        companies.
      </div>

      {/* Create/View Toggle Button */}
      {(ownedCompanies.length > 0 || accessibleCompanies.length > 0) && (
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

      {/* Main Section */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="create-company"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex justify-center"
          >
            <CreateCompanyForm
              simulationID={simulationID}
              onCreated={handleCreated}
            />
          </motion.div>
        ) : visibleCompanies.length > 0 ? (
          <motion.div
            key="company-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CompanyList
              companies={visibleCompanies}
              simulationName={simulationName}
              currentUserId={currentUserId}
              onDelete={(id: string) => setConfirmDeleteId(id)}
              onEdit={handleEdit}
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
              <Building2 className="w-10 h-10 text-blue-400" />
            </div>
<p className="text-lg text-slate-300 mb-4">
  {activeTab === "owned"
    ? "No owned companies yet."
    : activeTab === "shared"
    ? "No shared companies yet."
    : "No companies available."}
</p>

            {activeTab === "owned" && (
    <CreateCompanyForm
      simulationID={simulationID}
      onCreated={handleCreated}
    />
  )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {editCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <EditCompanyForm
              company={editCompany}
              onClose={() => setEditCompany(null)}
              onUpdated={fetchCompanies}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-xl shadow-xl w-full max-w-md mx-4 text-white">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this company?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                onClick={async () => {
                  await handleDelete(confirmDeleteId!);
                  setConfirmDeleteId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
