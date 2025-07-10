import prisma from "@/app/functions/prisma";
import React from "react";
import Card from "../_components/ComCard";

interface PageProps {
  params: {
    simulationID: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { simulationID } = await params; // Await the entire params object first

  const data = await prisma.simulation.findUnique({
    where: { id: simulationID },
    include: {
      companies: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-start items-start p-8 bg-slate-900 text-white text-xl font-medium">
      <h2>Welcome to {data?.name}</h2>
      {data && data.companies && data.companies.length > 0 ? (
        <Card companies={data?.companies || []} />
      ) : (
        
      )}
    </div>
  );
}
