"use client";
import React, { useState } from "react";
import Inputbox from "../../../ui/Input-Box";
import PasswordInput from "../../../ui/PasswordInput";

const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full h-screen flex justify-center items-center bg-red-600">
      <div className="w-[400px] h-[300px] flex flex-col justify-center items-center gap-6 bg-white ">
        <h1>Sign In</h1>
        <form
          action="loginUser"
          className="flex justify-center items-center p-5 gap-6 flex-col bg-yellow-500"
        >
          <Inputbox
            label={"Email"}
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
        </form>
      </div>
    </div>
  );
};

export default page;
