import React from "react";
import { getCookie, verifyToken } from "@/app/functions/jwt";

const Page = async () => {
  const token = (await getCookie()) as string;
  const user = await verifyToken(token);

  return <div className="text-white  text-5xl">Hello {user.name}</div>;
};

export default Page;
