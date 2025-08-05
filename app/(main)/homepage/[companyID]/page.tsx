import React from "react";
import HomePage from "../../_components/HomePage";
import { notFound } from "next/navigation";
import { getCompanyDashboardData } from "@/app/_actions/getCompanyData";

const Page = async ({ params }: { params: { companyID: string } }) => {
  const res = await params;
  const data = await getCompanyDashboardData(res.companyID);
  console.log(data);

  if (!data) {
    notFound();
  }

  return <HomePage data={data} comID={res.companyID} />;
};

export default Page;
