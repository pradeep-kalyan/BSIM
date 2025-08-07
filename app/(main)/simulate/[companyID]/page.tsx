import { getCurrentUser } from "@/app/_actions/auth";
import React from "react";
import Form from "./_components/form";

interface PageProps {
  params: Promise<{
    companyID: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await getCurrentUser();
  const { companyID } = await params;

  return (
    <div className="min-h-screen w-screen relative overflow-hidden bg-[linear-gradient(135deg,#0c0c0c_0%,#1a1a2e_50%,#16213e_100%)] bg-fixed">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.1)_0%,transparent_50%)]" />
      </div>
      <div className="relative z-10 flex flex-col w-full min-h-screen">
        <Form companyId={companyID} />
      </div>
    </div>
  );
};

export default Page;
