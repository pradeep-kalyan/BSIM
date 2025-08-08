// app/(auth)/_components/Logout.tsx
"use client";
import { LogOut } from "lucide-react";
import React from "react";
import { logoutUser } from "@/app/_actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSimulation } from "@/app/context/SimulationContext";

/**
 * Logout button component with animation
 */
const Logout = () => {
  const router = useRouter();
  const { clearAll } = useSimulation();

  /**
   * Handles the logout process and redirects to login page
   */
  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAll();
      toast.info("Logout successful");

      // Short delay to allow toast to display before redirect
      setTimeout(() => {
        router.push("/login");
      }, 300);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      className="w-full flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
};

export default Logout;
