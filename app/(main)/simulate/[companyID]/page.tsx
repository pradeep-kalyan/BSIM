import React from "react";

export default function SimulatePage({
  params,
}: {
  params: { companyID: string };
}) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-white">Simulation for Company ID: {params.companyID}</h1>
    </div>
  );
}
