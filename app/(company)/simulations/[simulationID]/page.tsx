import prisma from "@/app/functions/prisma";
import React from "react";
import Card from "../_components/ComCard";

interface PageProps {
  params: {
    simulationID: string;
  };
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const simID: string = await params.simulationID;
  const data = await prisma.simulation.findUnique({
    where: { id: simID },
    include: {
      companies: true,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xl font-medium">
      <Card companies={data?.companies || []} />
    </div>
  );
};

export default Page;
