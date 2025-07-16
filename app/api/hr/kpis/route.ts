import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/functions/prisma";

export async function GET(req: NextRequest) {
  const company_id = req.nextUrl.searchParams.get("company_id");

  if (!company_id) {
    return NextResponse.json({ message: "Missing company_id" }, { status: 400 });
  }

  try {
    const results = await prisma.performance_result.findMany({
      where: { company_id },
      orderBy: { period: "asc" },
    });

    const hrDecisions = await prisma.hr_decision.findMany({
      where: { company_id },
    });

    const merged = results.map((result) => {
      const hr = hrDecisions.find((d) => d.period === result.period);
      return {
        period: result.period,
        employee_satisfaction: result.employee_satisfaction,
        salary_budget: hr?.salary_budget,
        training_budget: hr?.training_budget,
        hires: hr?.hires,
        fires: hr?.fires,
      };
    });

    return NextResponse.json(merged);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
