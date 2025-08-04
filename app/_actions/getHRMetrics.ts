"use server";

import prisma from "../functions/prisma";

export const getHRMetrics = async (comID: string) => {
  const company = await prisma.company.findUnique({
    where: { id: comID },
    select: { current_period: true },
  });

  if (!company) return [];

  // Get HR decisions for the current period
  const hrDecision = await prisma.hr_decision.findUnique({
    where: {
      company_id_period: {
        company_id: comID,
        period: company.current_period,
      },
    },
    include: {
      roles: true,
    },
  });

  if (!hrDecision) return [];

  // Transform role decisions into department metrics
  const departments = hrDecision.roles.map((role) => ({
    department: role.role_name,
    employees: role.head_count,
    satisfaction: hrDecision.employee_satisfaction,
    newHires: Math.round(role.head_count * 0.1), // Estimate new hires as 10% of workforce
  }));

  return departments;
};
