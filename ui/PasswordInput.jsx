import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label,
  placeholder,
  showPassword,
  setShowPassword,
  id = "password",
  name,
}) => {
  return (
    <div className="flex flex-col w-full max-w-md  bg-white rounded-md">
      <label htmlFor={id} className="text-gray-700 font-semibold text-md m-2">
        {label}
      </label>
      <div className="flex items-center border rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className="w-full text-black placeholder-gray-400 outline-none bg-transparent"
          placeholder={placeholder}
          name={name}
          required
          autoFocus
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
