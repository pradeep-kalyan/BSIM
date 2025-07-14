"use client";
import React from "react";
import Inputbox from "@/ui/Input-Box";
import { usePathname } from "next/navigation";
import { createCompany } from "@/app/_actions/Company";
import { useAuth } from "@/app/context/AuthContext";

const CreateCom = () => {
  const path = usePathname().split("/")[2];
  const { user, loading } = useAuth();

  // Handler to adapt FormData to the expected object for createCompany
  const handleCreateCompany = async (formData: FormData) => {
    const data = {
      simulation_id: formData.get("simulationID") as string,
      user_id: user?.id || "", // Ensure user ID is provided
      name: formData.get("name") as string,
      description: formData.get("description") as string | undefined,
      logo_url: undefined,
      cash_balance: formData.get("CashBalance")
        ? Number(formData.get("CashBalance"))
        : undefined,
      total_assets: formData.get("TotalAssets")
        ? Number(formData.get("TotalAssets"))
        : undefined,
      total_liabilities: formData.get("TotalLiabilities")
        ? Number(formData.get("TotalLiabilities"))
        : undefined,
      credit_rating: formData.get("CreditRating") as string | undefined,
      brand_value: formData.get("BrandValue")
        ? Number(formData.get("BrandValue"))
        : undefined,
    };
    await createCompany(data);
  };

  return (
    <div className="w-full h-screen m-5">
      <h2 className="text-left text-2xl text-white/30 m-3">Create Company</h2>
      <form
        action={handleCreateCompany}
        className="max-w-xl flex flex-col gap-10"
      >
        <Inputbox
          label={"Name"}
          type={"text"}
          placeholder_text={"eg. technova Technologies"}
          id="input-field"
          name={"name"}
        />
        <Inputbox
          label={"Description"}
          type={"text"}
          placeholder_text={"Description about the Company"}
          id="input-field"
          name={"description"}
        />
        <div className="grid grid-cols-2 gap-8">
          <Inputbox
            label={"cash Balance"}
            type={"number"}
            placeholder_text={"eg. 1000000"}
            id="input-field"
            name={"CashBalance"}
          />
          <Inputbox
            label={"Total Assets"}
            type={"number"}
            placeholder_text={"eg. 1000000"}
            id="input-field"
            name={"TotalAssets"}
          />
          <Inputbox
            label={"Total Liabilities"}
            type={"number"}
            placeholder_text={"eg. 1000000"}
            id="input-field"
            name={"TotalLiabilities"}
          />
          <Inputbox
            label={"credit rating"}
            type={"number"}
            placeholder_text={"eg. A"}
            id="input-field"
            name={"CreditRating"}
          />
          <Inputbox
            label={"Brand Value"}
            type={"number"}
            placeholder_text={"eg. 1000000"}
            id="input-field"
            name={"BrandValue"}
          />
          <input type="text" defaultValue={path} name="simulationID" hidden />
        </div>
        <button
          type="submit"
          className="bg-blue-400 hover:bg-blue-500 cursor-pointer text-white px-8 flex justify-center items-center flex-row py-3 rounded-xl shadow-md font-medium gap-3 transition-colors duration-300 ease-in-out"
        >
          submit
        </button>
      </form>
    </div>
  );
};

export default CreateCom;
