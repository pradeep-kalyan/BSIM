"use client";

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { createBudgetRequest } from "@/app/_actions/budget";

export default function RDDecisionForm({ onSuccess }: { onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const segments = pathname.split("/");
  const department = segments[2]; // "rd"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!department) {
      alert("Department not found in URL.");
      return;
    }

    startTransition(async () => {
      try {
        await createBudgetRequest({
          amount: parseFloat(amount),
          notes,
          department,
        });
        alert("Budget request submitted");
        setAmount("");
        setNotes("");
        onSuccess(); // Toggle view
      } catch (err: any) {
        alert(err.message || "Failed to submit");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
        className="border p-2 w-full"
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes"
        className="border p-2 w-full"
      />
      <button type="submit" disabled={isPending} className="bg-blue-600 text-white p-2 rounded">
        {isPending ? "Submitting..." : `Submit ${department.toUpperCase()} Request`}
      </button>
    </form>
  );
}
