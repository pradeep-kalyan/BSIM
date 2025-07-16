import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/functions/prisma";

export async function POST(req: NextRequest) {
  try {
    const {
      company_id,
      period,
      training_budget,
      salary_budget,
      hires,
      fires,
      employee_satisfaction,
    } = await req.json();

    if (
      !company_id ||
      period === undefined ||
      employee_satisfaction === undefined
    ) {
      return NextResponse.json(
        { message: "Missing company_id, period, or satisfaction" },
        { status: 400 }
      );
    }

    await prisma.hr_decision.upsert({
      where: {
        company_id_period: { company_id, period },
      },
      update: {
        training_budget,
        salary_budget,
        hires,
        fires,
      },
      create: {
        company_id,
        period,
        training_budget,
        salary_budget,
        hires,
        fires,
      },
    });

    await prisma.performance_result.upsert({
      where: {
        company_id_period: { company_id, period },
      },
      update: {
        employee_satisfaction,
      },
      create: {
        company_id,
        period,
        employee_satisfaction,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
