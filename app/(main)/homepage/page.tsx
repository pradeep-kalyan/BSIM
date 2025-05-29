"use client";
import React from "react";
import Card from "@/ui/Card";

const Page = () => {
  return (
    <div className="w-full h-full flex flex-col justify-start items-center bg-red-500 gap-6">
      <h2>Hello world</h2>
      <Card
        width={"200px"}
        height={"100px"}
        title={"total finance"}
        content={"100,000"}
      />
    </div>
  );
};

export default Page;
