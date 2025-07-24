"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useSimulation } from "@/app/context/SimulationContext";
import ProductionDecisionForm from "@/app/(main)/_components/ProductionDescision";
import { getProductionDecisions } from "@/app/_actions/products";

// --- Types

type Decision = {
  id: string;
  period: number;
  processed: boolean;
  company_id: string;
  type: string;
  decision_data: string;
  submitted_at: Date;
  processed_at: Date | null;
};

type ProductionDecisionData = {
  inventory_level: number;
  production_capacity: number;
};

type DecisionTabProps = {
  companyID?: string;
  showTitle?: boolean;
  onDecisionCreated?: (decision: Omit<Decision, "id">) => void;
};

// --- List Component

function DecisionsList({ decisions }: { decisions: Decision[] }) {
  if (!decisions || !decisions.length) {
    return (
      <div role="status" aria-live="polite" style={{ padding: 24 }}>
        <p>No decisions yet. Create your first strategic decision to begin.</p>
      </div>
    );
  }
  return (
    <ul aria-label="Company Decisions List" style={{ padding: 0, margin: 0 }}>
      {decisions.map((decision) => (
        <li
          key={decision.id}
          style={{
            marginBottom: 16,
            border: "1px solid #eee",
            borderRadius: 6,
            padding: 12,
          }}
        >
          <h3 style={{ marginBottom: 4 }}>Period {decision.period}</h3>
          <div style={{ fontSize: 12, marginTop: 4 }}>
            <span>
              Status: {decision.processed ? <b>Processed</b> : "Pending"}
            </span>
          </div>
          <div>
            <span>
              {(() => {
                try {
                  const data = JSON.parse(
                    decision.decision_data
                  ) as ProductionDecisionData;
                  return `Inventory: ${data.inventory_level} units / ${data.production_capacity} units`;
                } catch {
                  return "Invalid decision data";
                }
              })()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

// --- Main Component

export default function DecisionTab({
  companyID,
  showTitle = true,
  onDecisionCreated,
}: DecisionTabProps) {
  const simulation = useSimulation();
  const comId = companyID || simulation?.comId;
  // const period = simulation?.period; // This property doesn't exist in SimulationContext

  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Fetch and update decision list
  const fetchDecisions = () => {
    if (typeof comId === "string" && comId) {
      setLoading(true);
      getProductionDecisions(comId)
        .then((data) => setDecisions(data || []))
        .catch(() => setDecisions([]))
        .finally(() => setLoading(false));
    } else {
      setDecisions([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comId]);

  // After new decision added
  const handleDecisionCreated = (decision: {
    id: string;
    period: number;
    processed: boolean;
    company_id: string;
    inventory_level: number;
    production_capacity: number;
    submitted_at: Date;
  }) => {
    // Convert to our Decision type format
    const newDecision: Decision = {
      id: decision.id,
      period: decision.period,
      processed: decision.processed,
      company_id: decision.company_id,
      type: "production",
      decision_data: JSON.stringify({
        inventory_level: decision.inventory_level,
        production_capacity: decision.production_capacity,
      }),
      submitted_at: decision.submitted_at,
      processed_at: null,
    };
    setShowForm(false);
    setDecisions((prev) => [newDecision, ...prev]);
    if (onDecisionCreated) onDecisionCreated(newDecision);
  };

  return (
    <section aria-label="Company Decisions" style={{ marginTop: 32 }}>
      {showTitle && <h2 style={{ marginBottom: 18 }}>Decisions</h2>}

      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <button
          aria-label="Create new decision"
          onClick={() => setShowForm((s) => !s)}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#d6f5d6",
            border: "1px solid #52c452",
            padding: "6px 14px",
            borderRadius: 18,
            cursor: "pointer",
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          <PlusCircle size={20} style={{ marginRight: 6, color: "#388b37" }} />
          New Decision
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            style={{ marginBottom: 16 }}
          >
            <ProductionDecisionForm
              companyID={comId}
              onCreated={handleDecisionCreated}
              period={1}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ padding: 24 }}>Loading Decisions...</div>
      ) : (
        <DecisionsList decisions={decisions} />
      )}
    </section>
  );
}
