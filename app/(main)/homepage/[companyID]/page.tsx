import prisma from "@/app/functions/prisma";
import React from "react";
import Card from "@/ui/Card";
import HomePage from "../../_components/HomePage";
import { company } from "@prisma/client";
import { getServerUser } from "@/app/context/ServerUserContext";

const page = async (props: { params: Promise<{ companyID: string }> }) => {
  const { companyID } = await props.params;
  const user = await getServerUser();

  const company = await prisma.company.findUnique({
    where: { id: companyID },
    include: {
      products: true,
    },
  });

  // if (company?.user_id != user?.id) {
  //   return <div className="text-red-500">Unauthorized access</div>;
  // }

  return <HomePage company={company as company} />;
};

export default page;
