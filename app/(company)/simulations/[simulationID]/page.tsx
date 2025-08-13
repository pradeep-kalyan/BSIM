// app/(yourroute)/[simulationID]/page.tsx
import prisma from "@/app/functions/prisma";
import CompanyPage from "../../../components/company/CompanyPage";
import { getCurrentUser } from "@/app/_actions/auth";

interface PageProps {
  params: Promise<{ simulationID: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { simulationID } = await params;

  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationID },
  });

  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  if (!simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Simulation not found
      </div>
    );
  }

  // ✅ Access check: creator or simulation_access entry
  const hasAccess =
    simulation.created_by === user.id ||
    (await prisma.simulation_access.findFirst({
      where: { simulation_id: simulationID, user_id: user.id },
    }));

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        You do not have access to this simulation.
      </div>
    );
  }

  return (
    <CompanyPage
      simulationID={simulation.id}
      simulationName={simulation.name}
    />
  );
};

export default Page;
