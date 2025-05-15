import React from "react";
import { getCookie, verifyToken } from "@/app/functions/jwt";
import LogoutBtn from "../../(auth)/_components/Logout";
import { redirect } from "next/navigation";
const Page = async () => {
  const token = (await getCookie()) as string;
  const user = await verifyToken(token);
  if (!user){
    redirect('/login')
  }

  return (
    <div className="text-white  text-5xl">
      Hello {user.name}
      <LogoutBtn />
    </div>
  );
};

export default Page;
