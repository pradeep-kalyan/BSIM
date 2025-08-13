"use client";
import { LogOut } from "lucide-react";
import React from "react";
import { logoutUser } from "@/app/_actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSimulation } from "@/app/context/SimulationContext";

const Logout = () => {
  const router = useRouter();
  const { clearAll } = useSimulation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAll();
      toast.info("Logout successful");

      setTimeout(() => {
        router.push("/login");
      }, 100);
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <button
      className="w-full flex cursor-pointer items-center font-roboto-sans justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
};

export default Logout;
