"use client";

import React, { useState } from "react";
import FinanceDecisionForm from "./department-forms/FinanceDecisionForm";
import HRDecisionForm from "./department-forms/HRDecisionForm";
import MarketingDecisionForm from "./department-forms/MarketingDecisionForm";
import ProductionDecisionForm from "./department-forms/ProductionDecisionForm";
import RDDecisionForm from "./department-forms/RDDecisionForm";

interface HRRole {
  role_name: string;
  salary_per_head: number;
  head_count: number;
}

interface Props {
  department: string;
}

const allowedDepartments = ["finance", "hr", "marketing", "production", "rd"];

const CreateDecision = ({
  department,
  onSuccess,
}: {
  department: string;
  onSuccess: () => void;
}) => {
  const normalized = department.toLowerCase();

  // HR form state
  const [hrRoles, setHrRoles] = useState<HRRole[]>([
    { role_name: "", salary_per_head: 0, head_count: 0 },
  ]);
  const [trainingBudget, setTrainingBudget] = useState(0);
  const [employeeSatisfaction, setEmployeeSatisfaction] = useState(0);

  const handleRoleChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...hrRoles];
    updated[index] = { ...updated[index], [field]: value };
    setHrRoles(updated);
  };

  const handleAddRole = () => {
    setHrRoles([
      ...hrRoles,
      { role_name: "", salary_per_head: 0, head_count: 0 },
    ]);
  };

  const handleRemoveRole = (index: number) => {
    if (hrRoles.length > 1) {
      setHrRoles(hrRoles.filter((_, i) => i !== index));
    }
  };

  const renderForm = () => {
    switch (normalized) {
      case "finance":
        return <FinanceDecisionForm />;
      case "hr":
        return (
          <HRDecisionForm
            hrRoles={hrRoles}
            onRoleChange={handleRoleChange}
            onAddRole={handleAddRole}
            onRemoveRole={handleRemoveRole}
            trainingBudget={trainingBudget}
            onTrainingBudgetChange={setTrainingBudget}
            employeeSatisfaction={employeeSatisfaction}
            onEmployeeSatisfactionChange={setEmployeeSatisfaction}
          />
        );
      case "marketing":
        return <MarketingDecisionForm />;
      case "production":
        return <ProductionDecisionForm />;
      case "rd":
        return <RDDecisionForm onSuccess={onSuccess} />;
      default:
        return null;
    }
  };

  if (
    !["finance", "hr", "marketing", "production", "rd"].includes(normalized)
  ) {
    return (
      <div className="border p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
        Invalid department: <strong>{department}</strong>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg bg-slate-800/60">
      <h3 className="text-xl font-semibold mb-4">
        Create Decision for{" "}
        {department.charAt(0).toUpperCase() + department.slice(1)}
      </h3>
      {renderForm()}
    </div>
  );
};

export default CreateDecision;
