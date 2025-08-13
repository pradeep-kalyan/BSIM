import { getCurrentUser } from "@/app/_actions/auth";
import prisma from "@/app/functions/prisma";
import React from "react";
import Form from "../../../components/simulate/form";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ companyID: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { companyID } = await params;

  // ✅ Check authentication
  const user = await getCurrentUser();
  if (!user) notFound();

  // ✅ Check company access
  const hasAccess = await prisma.company.findFirst({
    where: {
      id: companyID,
      OR: [
        { user_id: user.id }, // Owner
        { company_access: { some: { user_id: user.id } } }, // Has access
      ],
    },
  });

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        You do not have access to this company.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-gradient-to-br from-[#0c0c0c] via-[#1a1a2e] to-[#16213e]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-full h-full">
          <div
            className="absolute"
            style={{
              top: "80%",
              left: "20%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(120,119,198,0.1) 0%, transparent 50%)",
              width: "80vw",
              height: "80vh",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "20%",
              left: "80%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(255,119,198,0.1) 0%, transparent 50%)",
              width: "60vw",
              height: "60vh",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "40%",
              left: "40%",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(120,219,255,0.1) 0%, transparent 50%)",
              width: "70vw",
              height: "70vh",
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full h-screen flex flex-col">
        <Form companyId={companyID} />
      </div>
    </div>
  );
};

export default Page;
