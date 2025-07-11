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
    <div className="flex flex-col w-full bg-transparent rounded-md">
      <label
        htmlFor={id}
        className="text-white font-semibold text-sm mb-1.5 ml-1"
      >
        {label}
      </label>
      <div className="flex items-center border border-slate-600 bg-slate-800/50 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all duration-200">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className="w-full text-white/80 text-sm placeholder-gray-400 outline-none bg-transparent"
          placeholder={placeholder}
          name={name}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="ml-2 text-gray-400 hover:text-blue-400 focus:outline-none transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
