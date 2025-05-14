"use client";
import React, { useState } from "react";
import Inputbox from "../../../ui/Input-Box";
import PasswordInput from "../../../ui/PasswordInput";
import { loginUser } from "@/app/_actions/auth";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { LogIn } from "lucide-react";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setDisabled(true);
    try {
      await loginUser(formData);
      toast.success("Login successful");
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setDisabled(false);
    }
  };

  const handleLogin = async (formData: FormData) => {
    const response = await loginUser(formData);

    if (response.status === 200 && response.redirectUrl) {
      window.location.href = response.redirectUrl; // Perform the redirection
    } else {
      console.error(response.message);
    }
  };

  return (
    <div className="flex group justify-center items-center w-full h-screen flex-col gap-5 overflow-auto bg-slate-900">
      <div className="z-10 flex flex-col justify-center items-center gap-5 bg-slate-800/90 border border-slate-700 transition-all ease-in-out duration-300 rounded-xl shadow-2xl max-w-[90%] sm:w-[500px]">
        <ToastContainer position="top-right" />
        <div className="flex items-center gap-2 mt-8 bg-slate-700/50 px-5 py-2 rounded-full -translate-y-6 shadow-md">
          <LogIn className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-center text-white">Sign In</h2>
        </div>
        <div className="w-full flex flex-col justify-start items-center rounded-xl px-4 py-3 -mt-4">
          <form
            className="flex flex-col justify-start items-center w-full h-full gap-5"
            action={handleSubmit}
          >
            <Inputbox
              label={"Email Address"}
              name={"mail"}
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
                {disabled ? (
                  <span className="flex items-center justify-center gap-2">
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </button>
            </div>
          </form>
          <div className="w-full border-t border-slate-700 mt-5 pt-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm">
              <h2 className="text-white/80">Don't have an account?</h2>
              <Link
                href={"/register"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 hover:underline"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
