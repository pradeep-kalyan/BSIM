"use client";

import React, { useState } from "react";
import Inputbox from "@/ui/Input-Box";
import createSim from "@/app/_actions/createSim"; // import with named import
import DynamicConfigFields from "./DynamicConfigFields";
import { FlaskConical, Rocket } from "lucide-react";

const CreateSim = ({ onCreated }: { onCreated: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [newConfigFields, setNewConfigFields] = useState([
    { key: "", value: "" },
  ]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    await createSim(formData);
    setLoading(false);

    onCreated();
  };

  return (
    <div className="w-full max-w-2xl mt-1 bg-slate-900 p-8 rounded-2xl shadow-md border border-slate-700">
      <div className="flex items-center gap-2 mb-6">
        <FlaskConical size={28} className="text-blue-400" />
        <h2 className="text-3xl font-semibold text-white">Create Simulation</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Inputbox
          label="Simulation Name"
          type="text"
          placeholder_text="Enter simulation name"
          id="name"
          name="name"
        />

        <Inputbox
          label="Description"
          type="text"
          placeholder_text="Optional description"
          id="description"
          name="description"
        />

        <Inputbox
          label="Grant Access (Email IDs)"
          type="text"
          placeholder_text="Enter comma-separated email addresses"
          id="accessEmails"
          name="accessEmails"
        />

        <DynamicConfigFields
          fields={newConfigFields}
          setFields={setNewConfigFields}
        />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
          >
            <Rocket size={18} />
            {loading ? "Launching..." : "Launch Simulation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSim;
