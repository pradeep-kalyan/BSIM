import { prisma } from "@/app/functions/prisma";
import HRDecisionPanel from "../../../_components/HRDecisionPanel";
import { notFound } from "next/navigation";

export default async function HRPage(props: { params: { companyID: string } }) {
  const { params } = await Promise.resolve(props);
  const { companyID } = params;

  const company = await prisma.company.findUnique({
    where: { id: companyID },
    include: { simulation: true },
  });

  if (!company || !company.simulation) return notFound();

  const performanceHistory = await prisma.performance_result.findMany({
    where: { company_id: companyID },
    orderBy: { period: "asc" },
  });

  return (
    <HRDecisionPanel
      companyId={companyID}
      currentPeriod={company.simulation.current_period ?? 0}
      initialHistory={performanceHistory}
    />
  );
}
