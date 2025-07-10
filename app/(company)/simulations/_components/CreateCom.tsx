import React from "react";
import Inputbox from "@/ui/Input-Box";
import createSim from "@/app/_actions/createSim";
import { revalidatePath } from "next/cache";

const CreateCom = () => {
  return (
    <div className="w-full h-screen m-5">
      <h2 className="text-left text-2xl text-white/30 ">Create Simulation</h2>
      <form action={createSim} className="max-w-xl">
        <Inputbox
          label={"Name"}
          type={"text"}
          placeholder_text={"eg. Market Analysis"}
          id="input-field"
          name={"name"}
        />
        <Inputbox
          label={"Description"}
          type={"text"}
          placeholder_text={"Description about the simulation"}
          id="input-field"
          name={"name"}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default CreateCom;
