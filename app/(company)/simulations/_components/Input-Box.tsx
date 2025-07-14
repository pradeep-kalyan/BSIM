// ui/Input-Box.tsx
import React from "react";

interface Props {
  label: string;
  type: string;
  placeholder_text: string;
  id: string;
  name: string;
}

const Inputbox = ({ label, type, placeholder_text, id, name }: Props) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-white/60 text-sm">{label}</label>
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder_text}
      required={type !== "text"} // description can be optional
      className="px-4 py-2 rounded bg-slate-700 text-white outline-none"
    />
  </div>
);

export default Inputbox;
