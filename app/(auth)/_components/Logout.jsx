// app/(auth)/_components/Logout.tsx
"use client";
import { LogOut } from "lucide-react";
import React from "react";
import { logoutUser } from "@/app/_actions/auth";
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
      await logoutUser();
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
      className="bg-blue-400 hover:bg-blue-500 cursor-pointer text-white px-8 flex justify-center items-center flex-row py-3 rounded-xl shadow-md font-medium gap-3 transition-colors duration-300 ease-in-out"
      onClick={handleLogout}
    >
      <LogOut className="w-8 h-8" /> Logout
    </button>
  );
};

export default Logout;
