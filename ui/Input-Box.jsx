import React from "react";

const Inputbox = ({
  label,
  styles,
  placeholder_text,
  name,
  id = "input-field",
}) => {
  return (
    <div className="flex flex-col w-full max-w-md bg-white rounded-md ">
      <label htmlFor={id} className="text-gray-700 font-semibold text-md m-2">
        {label}
      </label>
      <input
        id={id}
        type="text"
        name={name}
        className="w-full border rounded-lg px-5 py-2 text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
        placeholder={placeholder_text}
        required
      />
    </div>
  );
};

export default Inputbox;
