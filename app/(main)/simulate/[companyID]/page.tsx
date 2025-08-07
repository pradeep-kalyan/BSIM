import { getCurrentUser } from "@/app/_actions/auth";
import React from "react";
import Form from "./_components/form";

interface PageProps {
  params: {
    companyID: string;
  };
}

const Page = async ({ params }: PageProps) => {
  await getCurrentUser();
  const { companyID } = params;

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-gradient-to-br from-[#0c0c0c] via-[#1a1a2e] to-[#16213e]">
      {/* Background radial overlays */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-full h-full">
          <div
            className="absolute"
            style={{
              top: "80%",
              left: "20%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(120,119,198,0.1) 0%, transparent 50%)",
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
              background: "radial-gradient(circle, rgba(255,119,198,0.1) 0%, transparent 50%)",
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
              background: "radial-gradient(circle, rgba(120,219,255,0.1) 0%, transparent 50%)",
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
