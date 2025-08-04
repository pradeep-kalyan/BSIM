import React from "react";
import HomePage from "../../_components/HomePage";
import { notFound } from "next/navigation";
import { getDashboardData } from "@/app/_actions/getDashboardData";

const Page = async ({ params }: { params: { companyID: string } }) => {
  const { companyID } = await params;

  const data = await getDashboardData({ comID: companyID });

  // If company not found, show 404 page
  if (!data) {
    notFound();
  }


  return (
    <HomePage data={data} comID={companyID} />
  );
};

export default Page;
