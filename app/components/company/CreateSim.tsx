"use client";

import React, { useState } from "react";
import Inputbox from "@/app/ui/Input-Box";
import createSim from "@/app/_actions/createSim";
import DynamicConfigFields from "./DynamicConfigFields";
import { FlaskConical, Rocket } from "lucide-react";

const CreateSim = ({ onCreated }: { onCreated: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [newConfigFields, setNewConfigFields] = useState([
    { key: "", value: "" },
  ]);
  const [accessEmail, setAccessEmail] = useState("");
  const [accessEmails, setAccessEmails] = useState<string[]>([]);
  const [name, setName] = useState("");

  const handleAddEmail = () => {
    if (accessEmail && !accessEmails.includes(accessEmail)) {
      setAccessEmails((prev) => [...prev, accessEmail]);
      setAccessEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setAccessEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("accessEmails", accessEmails.join(","));

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
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Inputbox
          label="Description"
          type="text"
          placeholder_text="Optional description"
          id="description"
          name="description"
        />

        {/* Access Management */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Grant Access (Email IDs)
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={accessEmail}
              onChange={(e) => setAccessEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Enter email to grant access"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              disabled={!accessEmail || accessEmails.includes(accessEmail)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition"
            >
              Add
            </button>
          </div>

          {accessEmails.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Access Granted
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {accessEmails.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl"
                  >
                    <span className="text-white text-sm">{email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DynamicConfigFields
          fields={newConfigFields}
          setFields={setNewConfigFields}
        />

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
             hover:bg-blue-700 text-white font-medium rounded-xl transition 
             disabled:opacity-50 disabled:cursor-not-allowed"
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
