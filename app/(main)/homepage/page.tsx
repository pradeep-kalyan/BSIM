"use server";
import Card from "@/ui/Card";
import prisma from "@/app/functions/prisma";

const Page = async () => {
  const data = await prisma.user.findUnique({
    where: { email: "john@example.com" },
    include: { companies: true },
  });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center bg-red-500 gap-6 py-8">
      <div className="max-w-full max-h-20"></div>
    </div>
  );
};

export default Page;
