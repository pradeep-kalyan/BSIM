// app/(auth)/_components/Logout.tsx
"use client";
import { LogOut } from "lucide-react";
import React from "react";
import { logoutHandler } from "@/app/functions/jwt";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Logout button component with animation
 */
const Logout = () => {
  const router = useRouter();

  /**
   * Handles the logout process and redirects to login page
   */
  const handleLogout = async () => {
    try {
      await logoutHandler();
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
      className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/10"
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" /> Logout
    </button>
  );
};

export default Logout;
