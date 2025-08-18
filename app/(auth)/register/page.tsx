"use client";
import React, { useState } from "react";
import Inputbox from "@/app/ui/Input-Box";
import PasswordInput from "@/app/ui/PasswordInput";
import { toast, ToastContainer } from "react-toastify";
import { registerUser } from "../../_actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { UserPlus } from "lucide-react";

const Page = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setDisabled(true);

    const userName = formData.get("userName")?.toString().trim() || "";
    const mail = formData.get("mail")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    if (!userName || !mail || !password || !confirmPassword) {
      // toast.error("Please fill all the fields");
      setError("please fill all the fields");
      setDisabled(false);
      return;
    }

    if (password !== confirmPassword) {
      // toast.error("Passwords do not match");
      setError("password does not match");
      setDisabled(false);
      return;
    }

    const response = await registerUser({
      name: userName,
      email: mail,
      password,
      confirmPassword,
    });

    if (response.status === 200) {
      toast.success("User Created Successfully");
      setTimeout(() => {
        router.push("/login");
      }, 600); // Matches the animation duration
      return;
    } else if (response.status === 409) {
      // toast.error("Email already exists. Please log in or use another email.");
      setError("Email already exists. Please log in or use another email.");
    } else {
      // toast.error(response.message);
      setError(response.message);
    }

    setDisabled(false);
  };

  return (
    <div className="flex group justify-center items-center w-full h-screen flex-col gap-5 overflow-auto bg-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-10 flex flex-col justify-center items-center gap-5 bg-slate-800/90 border border-slate-700 transition-all ease-in-out duration-300 rounded-xl shadow-2xl max-w-[90%] sm:w-[500px]"
      >
        <ToastContainer position="top-right" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-2 mt-8 bg-slate-700/50 px-5 py-2 rounded-full -translate-y-6 shadow-md"
        >
          <UserPlus className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-center text-white">
            Create an Account
          </h2>
        </motion.div>
        <div className="w-full flex flex-col justify-start items-center rounded-xl px-4 py-3 -mt-4">
          <form
            className="flex flex-col justify-start items-center w-full h-full gap-5"
            action={handleSubmit}
          >
            <Inputbox
              label={"User Name"}
              placeholder_text={"eg. John Doe"}
              name={"userName"}
              type={"text"}
            />
            <Inputbox
              label={"Email Address"}
              placeholder_text={"eg. johndoe@gmail.com"}
              name={"mail"}
              type={"email"}
            />
            <PasswordInput
              label={"Password"}
              placeholder={"Enter a strong password"}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              name={"password"}
            />
            <PasswordInput
              label={"Confirm Password"}
              placeholder={"Re-enter your password"}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              name={"confirmPassword"}
            />
            {error && (
              <h2 className="text-md text-red-500 font-mono text-center p-3">
                {error}
              </h2>
            )}
            <div className="w-full mt-1 flex justify-center items-center">
              <button
                className={`bg-blue-600 cursor-pointer text-white w-[50%] px-4 py-3 rounded-lg text-base font-semibold cupo transition-all transform hover:scale-[1.02] ${
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
                    Registering...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Register
                  </span>
                )}
              </button>
            </div>
          </form>
          <div className="w-full border-t border-slate-700 mt-5 pt-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm">
              <h2 className="text-white/80">Already have an account?</h2>
              <Link
                href={"/login"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 hover:underline"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
