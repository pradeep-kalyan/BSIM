import prisma from "@/app/functions/prisma";
import Card from "@/app/(company)/simulations/_components/SimCard";
import React from "react";
import CreateSim from "./_components/CreateSim";
import { getServerUser } from "@/app/context/ServerUserContext";

const page = async () => {
  const user = await getServerUser();

  // Add null check to prevent hydration issues
  if (!user?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-10 px-4">
        <div className="w-full h-full flex justify-center flex-col items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Please log in to continue
            </h2>
            <CreateSim />
          </div>
        </div>
      </div>
    );
  }

  const data = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      simulations: true,
    },
  });

  // Handle case where user is not found in database
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-10 px-4">
        <div className="w-full h-full flex justify-center flex-col items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">User not found</h2>
            <CreateSim />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {data.name || "User"} 👋
        </h1>
      </div>
      {data.simulations && data.simulations.length > 0 ? (
        <>
          <Card simulations={data.simulations} />
          <CreateSim />
        </>
      ) : (
        <div className="w-full h-full flex justify-center flex-col items-center">
          <CreateSim />
        </div>
      )}
    </div>
  );
};

export default page;
