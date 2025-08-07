import React from "react";
import HomePage from "../../_components/HomePage";
import { notFound } from "next/navigation";
import { getCompanyDashboardData } from "@/app/_actions/getCompanyData";

const Page = async ({ params }: { params: Promise<{ companyID: string }> }) => {
  const { companyID } = await params;
  const data = await getCompanyDashboardData(companyID);

  if (!data) {
    notFound();
  }

  return <HomePage data={data} comID={companyID} />;
};
 
export default Page;
 