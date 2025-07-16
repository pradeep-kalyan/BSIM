import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/functions/prisma";
import { getAuthenticatedUser } from "@/app/functions/jwt";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user || !user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const company = await prisma.company.findFirst({
    where: { user_id: user.id },
    include: { simulation: true },
  });

  if (!company || !company.simulation) {
    return NextResponse.json({ message: "No data found" }, { status: 404 });
  }

  return NextResponse.json({
    company_id: company.id,
    company_name: company.name,
    simulation_id: company.simulation.id,
    simulation_name: company.simulation.name,
    current_period: company.simulation.current_period,
  });
}
