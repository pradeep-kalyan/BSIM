"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Inputbox from "@/app/ui/Input-Box";
import PasswordInput from "@/app/ui/PasswordInput";
import { loginUser } from "@/app/_actions/auth";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const { checkAuth } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    setDisabled(true);
    try {
      const result = await loginUser(formData);
      if (result.success) {
        toast.success("Login successful");
        await checkAuth();
        router.push("/simulations");
      } else {
        toast.error(
          result.message || "Login failed. Please check your credentials."
        );
      }
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-slate-900 overflow-auto px-4">
      <ToastContainer position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-10 flex flex-col justify-center items-center gap-5 bg-slate-800/90 border border-slate-700 transition-all ease-in-out duration-300 rounded-xl shadow-2xl w-full sm:w-[500px]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-2 mt-8 bg-slate-700/50 px-5 py-2 rounded-full shadow-md"
        >
          <LogIn className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Sign In</h2>
        </motion.div>

        <div className="w-full flex flex-col justify-start items-center rounded-xl px-4 py-3 -mt-4">
          <form
            className="flex flex-col justify-start items-center w-full h-full gap-5"
            action={handleSubmit}
          >
            <Inputbox
              label={"Email Address"}
              name={"mail"}
              type={"email"}
              placeholder_text={"Enter your email address"}
            />
            <PasswordInput
              label={"Password"}
              name={"password"}
              placeholder={"Enter your password"}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <div className="w-full mt-1 flex justify-center items-center">
              <button
                className={`bg-blue-600 text-white text-center px-4 py-3 rounded-lg text-base font-semibold transition-all transform hover:scale-[1.02] w-[50%] cursor-pointer ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-500 hover:shadow-lg"
                }`}
                type="submit"
                disabled={disabled}
              >
                <span className="flex items-center justify-center gap-2">
                  {disabled && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {disabled ? (
                    "Signing in..."
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          <div className="w-full border-t border-slate-700 mt-5 pt-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm">
              <h2 className="text-white/80">Don&apos;t have an account?</h2>
              <Link
                href={"/register"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 hover:underline"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
