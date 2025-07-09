"use server";
import React from "react";
import Card from "@/ui/Card";
import prisma from "@/app/functions/prisma";

const Page = async () => {
  const data = await prisma.user.findUnique({
    where: {
      email: "mike@example.com",
    },
    include: {
      companies: true,
    },
  });
  return (
    <div className="w-full h-full flex flex-col justify-start items-center bg-red-500 gap-6">
      {data?.companies.map((company) => (
        <li
          key={company.id}
          className="w-96 h-96 flex justify-center items-center"
        >
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-lg">Company ID: {company.id}</p>
          <p className="text-lg">Company Type: {company.brand_value}</p>
        </li>
      ))}
    </div>
  );
};

export default Page;
