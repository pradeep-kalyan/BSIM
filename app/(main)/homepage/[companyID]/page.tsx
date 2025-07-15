import prisma from "@/app/functions/prisma";
import React from "react";
import HomePage from "../../_components/HomePage";
import { company, product } from "@prisma/client";
import { notFound } from "next/navigation";

type CompanyWithProducts = company & {
  products: product[];
};

const page = async (props: { params: Promise<{ companyID: string }> }) => {
  const { companyID } = await props.params;
  // const user = await getServerUser();

  const companyData = await prisma.company.findUnique({
    where: { id: companyID },
    include: {
      products: true,
    },
  });

  // Handle case where company is not found
  if (!companyData) {
    notFound();
  }


  // if (companyData?.user_id != user?.id) {
  //   return <div className="text-red-500">Unauthorized access</div>;
  // }

  return <HomePage company={companyData as CompanyWithProducts} />;
};

export default page;
