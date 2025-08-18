import React from "react";
import HomePage from "../../../components/homepage/HomePage";
import { notFound } from "next/navigation";
import { getCompanyDashboardData } from "@/app/_actions/getCompanyData";
import prisma from "@/app/functions/prisma";
import { getCurrentUser } from "@/app/_actions/auth";

const Page = async ({ params }: { params: Promise<{ companyID: string }> }) => {
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

  if (!hasAccess) notFound();

  // ✅ Fetch company data
  const data = await getCompanyDashboardData(companyID);
  if (!data) notFound();

  return <HomePage data={data} comID={companyID} />;
};

export default Page;
