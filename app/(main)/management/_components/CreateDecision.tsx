"use client";

import React from "react";
import FinanceDecisionForm from "./department-forms/FinanceDecisionForm";
import HRDecisionForm from "./department-forms/HRDecisionForm";
import MarketingDecisionForm from "./department-forms/MarketingDecisionForm";
import ProductionDecisionForm from "./department-forms/ProductionDecisionForm";
import RDDecisionForm from "./department-forms/RDDecisionForm";

interface Props {
  department: string;
}

const CreateDecision = ({ department}: Props) => {
  const renderForm = () => {
    switch (department.toLowerCase()) {
      case "finance":
        return <FinanceDecisionForm  />;
      case "hr":
        return <HRDecisionForm />;
      case "marketing":
        return <MarketingDecisionForm />;
      case "production":
        return <ProductionDecisionForm />;
      case "rd":
        return <RDDecisionForm  />;
      default:
        return <div>Unsupported department</div>;
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-slate-800/60">
      <h3 className="text-xl font-semibold mb-4">
        Create Decision for {department.charAt(0).toUpperCase() + department.slice(1)}
      </h3>
      {renderForm()}
    </div>
  );
};

export default CreateDecision;
