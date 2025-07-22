"use client";

import React, { useState } from "react";
import Inputbox from "@/ui/Input-Box";
import { Plus, Trash2 } from "lucide-react";

const FinanceDecisionForm = () => {
  const [allocations, setAllocations] = useState([{ department: "", amount: "" }]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...allocations];
    updated[index][field as "department" | "amount"] = value;
    setAllocations(updated);
  };

  const addAllocation = () => {
    setAllocations([...allocations, { department: "", amount: "" }]);
  };

  const removeAllocation = (index: number) => {
    const updated = allocations.filter((_, i) => i !== index);
    setAllocations(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted allocations:", allocations);
    // TODO: handle backend submission via action or API
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold">Department-wise Budget Allocation</h2>

      {allocations.map((entry, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <Inputbox
            label="Department"
            name={`department-${index}`}
            type="text"
            placeholder_text="e.g., R&D, HR, Marketing"
            value={entry.department}
            onChange={(e) => handleChange(index, "department", e.target.value)}
          />
          <Inputbox
            label="Amount"
            name={`amount-${index}`}
            type="number"
            placeholder_text="Enter amount"
            value={entry.amount}
            onChange={(e) => handleChange(index, "amount", e.target.value)}
          />
          {allocations.length > 1 && (
            <button
              type="button"
              onClick={() => removeAllocation(index)}
              className="text-red-600 hover:text-red-800 ml-1"
              title="Remove"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addAllocation}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
      >
        <Plus size={18} /> Add Another Department
      </button>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white"
      >
        Submit Finance Decision
      </button>
    </form>
  );
};

export default FinanceDecisionForm;
