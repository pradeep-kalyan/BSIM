// ui/Inputbox.tsx
import React from "react";

interface InputboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder_text?: string;
  name: string;
  id?: string;
  type: string;
  required?: boolean; // HTML validation
  isRequired?: boolean; // UI indicator only
}

const Inputbox: React.FC<InputboxProps> = ({
  label,
  placeholder_text = "",
  name,
  id = "input-field",
  type,
  required,
  isRequired,
  ...rest
}) => {
  const htmlRequired = required ?? type !== "text"; // Keep HTML required logic

  return (
    <div className="flex flex-col w-full bg-transparent rounded-md gap-1">
      <label
        htmlFor={id}
        className="text-white/60 font-semibold text-sm ml-1 flex items-center gap-1"
      >
        <span>{label}</span>
        {isRequired && <span className="text-red-500">*</span>}
      </label>

      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder_text}
        required={htmlRequired}
        className="w-full border border-slate-600 bg-slate-800/50 text-white/80 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200"
        {...rest}
      />
    </div>
  );
};

export default Inputbox;
