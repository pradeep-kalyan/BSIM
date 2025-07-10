"use server";

import prisma from "../functions/prisma";

const createSim = async (formData: FormData) => {
  const data = await prisma.simulation.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      creator: {
        connect: {
          id: "cmcx5wpoc0000fgn028ztbx8d", //user id
        },
      },
    },
  });

  console.log(data);
};

export default createSim;
