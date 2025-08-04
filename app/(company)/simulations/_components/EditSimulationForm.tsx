"use client";

import React, { useState } from "react";
import Inputbox from "@/ui/Input-Box";
import DynamicConfigFields from "./DynamicConfigFields";
import {
  updateSimulation,
  grantAccessByEmail,
  revokeAccessByEmail,
} from "@/app/_actions/createSim";
import {
  Trash2,
  Plus,
  Mail,
  Settings,
  Users,
  X,
  Save,
  Loader2,
} from "lucide-react";

interface Props {
  simulation: {
    id: string;
    name: string;
    description: string | null;
    config: Record<string, unknown>;
    simulation_access?: { user: { email: string } }[];
  };
  onClose: () => void;
  onUpdated: () => void;
  onUpdatedPartial: () => void;
}

const EditSimulationForm: React.FC<Props> = ({
  simulation,
  onClose,
  onUpdated,
  onUpdatedPartial,
}) => {
  const [name, setName] = useState(simulation.name);
  const [description, setDescription] = useState(simulation.description || "");
  const [config, setConfig] = useState<Record<string, unknown>>(
    typeof simulation.config === "string"
      ? JSON.parse(simulation.config)
      : simulation.config || {}
  );
  const [newConfigFields, setNewConfigFields] = useState([
    { key: "", value: "" },
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [accessList, setAccessList] = useState<string[]>(
    simulation.simulation_access
      ?.map((a) => a.user?.email)
      .filter(Boolean) || []
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const combinedConfig = { ...config };

    newConfigFields.forEach(({ key, value }) => {
      if (key.trim()) {
        let parsedValue: unknown = value.trim();
        if (parsedValue === "true") parsedValue = true;
        else if (parsedValue === "false") parsedValue = false;
        else if (typeof parsedValue === "string" && !isNaN(Number(parsedValue)) && /^\d+(\.\d+)?$/.test(parsedValue)) {
          parsedValue = Number(parsedValue);
        }
        combinedConfig[key.trim()] = parsedValue;
      }
    });

    setSaving(true);
    await updateSimulation(simulation.id, {
      name,
      description,
      config: combinedConfig,
    });
    setSaving(false);
    onUpdated();
  };

  const handleRemoveConfigKey = (key: string) => {
    const updated = { ...config };
    delete updated[key];
    setConfig(updated);
  };

  const handleAddEmail = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || accessList.includes(email)) return;
    await grantAccessByEmail(simulation.id, email);
    setAccessList((prev) => [...prev, email]);
    setNewEmail("");
    onUpdatedPartial();
  };

  const handleRemoveEmail = async (email: string) => {
    await revokeAccessByEmail(simulation.id, email);
    setAccessList((prev) => prev.filter((e) => e !== email));
    onUpdatedPartial();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-600 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Edit Simulation</h2>
              <p className="text-slate-400 text-sm">
                Configure your simulation settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 space-y-8 py-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Inputbox
                label="Simulation Name"
                id="sim-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Inputbox
                label="Description"
                id="sim-description"
                name="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Configuration Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Configuration
            </h3>

            {Object.keys(config).length > 0 && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h4 className="text-sm font-medium text-slate-300 mb-3">
                  Existing Config
                </h4>
                <div className="space-y-3">
                  {Object.entries(config).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <input
                        value={key}
                        readOnly
                        className="w-full sm:w-2/4 px-3 py-2 rounded-md bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        value={String(value)}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-full sm:w-2/4 px-3 py-2 rounded-md bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveConfigKey(key)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-3">
                Add New Config
              </h4>
              <DynamicConfigFields
                fields={newConfigFields}
                setFields={setNewConfigFields}
              />
            </div>
          </div>

          {/* Access Control Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Access Control
            </h3>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-400" />
                <h4 className="text-sm font-medium text-slate-300">
                  Authorized Users
                </h4>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded-full">
                  {accessList.length}
                </span>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 pl-10 rounded-md bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <button
                  onClick={handleAddEmail}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {accessList.length > 0 && (
                <div className="space-y-2 mb-4">
                  {accessList.map((email) => (
                    <div
                      key={email}
                      className="flex justify-between items-center bg-slate-700/50 px-4 py-3 rounded-lg border border-slate-600/50 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{email}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 rounded-md text-sm transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-slate-600/50 p-4 bg-slate-900/50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSimulationForm;
