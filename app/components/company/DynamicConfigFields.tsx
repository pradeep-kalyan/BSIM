"use client";

import { Plus, Trash2 } from "lucide-react";

interface Props {
  fields: { key: string; value: string }[];
  setFields: (fields: { key: string; value: string }[]) => void;
}

export default function DynamicConfigFields({ fields, setFields }: Props) {
  const addField = () => {
    setFields([...fields, { key: "", value: "" }]);
  };

  const removeField = (index: number) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated.length > 0 ? updated : [{ key: "", value: "" }]);
  };

  const handleChange = (index: number, type: "key" | "value", value: string) => {
    const updated = [...fields];
    updated[index][type] = value;
    setFields(updated);
  };

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-white text-base font-semibold">Custom Config Fields</h3>

      {fields.map((field, idx) => (
        <div
          key={idx}
          className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg"
        >
          <input
            name={`config_key_${idx}`}
            value={field.key}
            placeholder="Key"
            onChange={(e) => handleChange(idx, "key", e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-1.5 rounded-md bg-slate-700 text-white placeholder:text-slate-400 text-sm"
          />
          <input
            name={`config_value_${idx}`}
            value={field.value}
            placeholder="Value"
            onChange={(e) => handleChange(idx, "value", e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-1.5 rounded-md bg-slate-700 text-white placeholder:text-slate-400 text-sm"
          />
          <button
            type="button"
            onClick={() => removeField(idx)}
            className="text-red-400 hover:text-red-500 p-1"
            title="Remove Field"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-500 transition"
      >
        <Plus size={14} />
        Add Config Field
      </button>
    </div>
  );
}
