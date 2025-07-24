"use client";

import FinanceView from "./department-view/FinanceView";
import HRView from "./department-view/HRView";
import MarketingView from "./department-view/MarketingView";
import ProductionView from "./department-view/ProductionView";
import RDView from "./department-view/RDView";

interface Props {
  department: string;
}

const ViewDecisions = ({ department }: Props) => {
  const renderDepartmentView = () => {
    switch (department) {
      case "finance":
        return <FinanceView />;
      case "hr":
        return <HRView />;
      case "marketing":
        return <MarketingView />;
      case "production":
        return <ProductionView />;
      case "rd":
        return <RDView />;
      default:
        return <div>Invalid department</div>;
    }
  };

  return (
    <div className="border p-4 bg-slate-800 rounded-md shadow text-white">
      {renderDepartmentView()}
    </div>
  );
};

export default ViewDecisions;
