import prisma from "@/app/functions/prisma";
import Card from "@/app/(company)/simulations/_components/SimCard";
import React from "react";
import CreateSim from "./_components/CreateSim";

const page = async () => {
  const data = await prisma.user.findUnique({
    where: { email: "testuser@example.com" },
    include: {
      simulations: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {data?.name || "User"} 👋
        </h1>
      </div>
      {data?.simulations && data.simulations.length > 0 ? (
        <Card simulations={data.simulations} />
      ) : (
        <div className="w-full h-full flex justify-center flex-col items-center">
          <CreateSim />
        </div>
      )}
    </div>
  );
};

export default page;
