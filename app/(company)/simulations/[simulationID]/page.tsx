import prisma from "@/app/functions/prisma";
import React from "react";
import Card from "../_components/ComCard";
import CreateCom from "../_components/CreateCom";
import { getServerUser } from "@/app/context/ServerUserContext";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    simulationID: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { simulationID } = await params;
  const user = await getServerUser();

  // If user is not authenticated, they shouldn't reach here due to middleware
  // but let's handle it as a safety measure
  if (!user) {
    redirect("/login");
  }

  // First, check if the simulation exists at all
  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationID, created_by: user.id },
    include: {
      companies: true,
    },
  });

  // If simulation doesn't exist, return 404
  if (!simulation) {
    notFound();
  }

  // If simulation exists but user is not the owner, redirect to simulations page
  if (simulation.created_by !== user.id) {
    redirect("/simulations");
  }


  return (
    <div className="min-h-screen flex flex-col justify-start items-start p-8 bg-slate-900 text-white text-xl font-medium">
      <div className="flex justify-between w-full h-fit m-3 p-3">
        <h2>Welcome to {simulation.name}</h2>
      </div>
      {simulation.companies && simulation.companies.length > 0 ? (
        <>
          <Card companies={simulation.companies} simulationID={simulationID} />
          <CreateCom />
        </>
      ) : (
        <CreateCom />
      )}
    </div>
  );
}
