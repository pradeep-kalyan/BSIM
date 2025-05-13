"use client";
import React from "react";
import Inputbox from "../../../ui/Input-Box";
import PasswordInput from "../../../ui/PasswordInput";
import { toast, ToastContainer } from "react-toastify";
import { registerUser } from "../../_actions/auth";
import Link from "next/link";

const Page = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const handleSubmit = async (formData: FormData) => {
    setDisabled(true);

    const userName = formData.get("userName")?.toString().trim() || "";
    const mail = formData.get("mail")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";

    // Basic Validation
    if (!userName || !mail || !password || !confirmPassword) {
      toast.error("Please fill all the fields");
      setDisabled(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
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
    } else {
      toast.error(response.message);
    }

    setDisabled(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-screen flex-col gap-5 overflow-auto">
      <ToastContainer position="top-right" />
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      <div className="md:w-[600px] w-full h-[500px] shadow-2xl  flex flex-col justify-start items-center rounded-lg">
        <form
          className="flex flex-col justify-start items-center w-full h-full p-5 gap-5"
          action={handleSubmit}
        >
          <Inputbox
            label={"User Name"}
            placeholder_text={"Enter Your User Name"}
            name={"userName"}
          />
          <Inputbox
            label={"Mail"}
            placeholder_text={"Enter Your Mail"}
            name={"mail"}
          />
          <PasswordInput
            label={"Password"}
            placeholder={"Enter Your Password"}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            name={"password"}
          />
          <PasswordInput
            label={"Confirm Password"}
            placeholder={"Enter Your Password again to confirm"}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            name={"confirmPassword"}
          />
          <button
            className={`bg-blue-400 text-white px-8 py-4 rounded-lg text-x transition ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
            }`}
            type="submit"
            disabled={disabled}
          >
            {disabled ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="flex justify-center items-center gap-3 mt-7">
          <h2 className="text-xl">Already have an account ? </h2>
          <Link
            href={"/login"}
            className="underline underline-offset-1 text-xl hover:scale-125 text-blue-400 hover:text-blue-500"
          >
            login..
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
