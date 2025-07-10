"use server";

import prisma from "../functions/prisma";

const createSim = (formData: FormData) => {
  prisma.simulation.create({
    data: {
      name: formData.get("name") as string,
    },
  });
};

export default createSim;
