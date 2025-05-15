"use client";
import { LogOut } from "lucide-react";
import React from "react";
import { motion } from "motion/react";
import { logoutHandler } from "@/app/functions/jwt";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Logout = () => {
  const router = useRouter();
  const logoutFxn = async () => {
    logoutHandler();
    toast.info("LogOut Suceessfull");
    setTimeout(() => {}, 200);
    router.push("/login");
  };

  return (
    <motion.button
      whileHover={{
        rotateX: -5,
        rotateY: 5,
        scale: 1.03,
        transition: { type: "spring", stiffness: 400, damping: 20 },
      }}
      whileTap={{ scale: 0.97 }}
      style={{ transformPerspective: 800 }}
      className="bg-blue-400 hover:bg-blue-500 cursor-pointer text-white px-8 flex justify-center items-center flex-row py-3 rounded-xl shadow-md font-medium  gap-3 transition-colors duration-300 ease-in-out"
      onClick={logoutFxn}
    >
      <LogOut className="w-8 h-8" /> Logout
    </motion.button>
  );
};

export default Logout;
