import React from "react";
import { motion } from "motion/react";

const Card = ({ width, height, title, content }) => {
  return (
    <div
      style={{ width, height }}
      className="rounded-xl py-3 px-8 flex flex-col justify-center items-center bg-[#d9d9d9]/80 hover:bg-[#d9d9d9] shadow-md"
    >
      <motion.div
        initial={{ opacity: 0, x: 0, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="w-full h-full text-center flex justify-center items-center flex-col gap-y-3 p-5"
      >
        <h1>{title}</h1>
        <h2>{content}</h2>
      </motion.div>
    </div>
  );
};

export default Card;
