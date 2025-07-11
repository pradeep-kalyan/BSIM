import React from "react";

const Inputbox = ({
  label,
  placeholder_text,
  name,
  id = "input-field",
  type,
}) => {
  return (
    <div className="flex flex-col w-full bg-transparent rounded-md">
      <label
        htmlFor={id}
        className="text-white font-semibold text-sm mb-1.5 ml-1"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        className="w-full border border-slate-600 bg-slate-800/50 text-white/80 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
        placeholder={placeholder_text}
        required
      />
    </div>
  );
};

export default Inputbox;
