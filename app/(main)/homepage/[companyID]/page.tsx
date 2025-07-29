import prisma from "@/app/functions/prisma";
import React from "react";
import HomePage from "../../_components/HomePage";
import { company, product } from "@prisma/client";
import { notFound } from "next/navigation";

type CompanyWithProducts = company & {
  products: product[];

};

const Page = async ({ params }: { params: { companyID: string } }) => {
  const { companyID } = params;

  const companyData = await prisma.company.findUnique({
    where: { id: companyID },
    include: {
      products: true,
    },
  });

  // If company not found, show 404 page
  if (!companyData) {
    notFound();
  }

  return <HomePage company={companyData as CompanyWithProducts} />;
};

export default Page;
