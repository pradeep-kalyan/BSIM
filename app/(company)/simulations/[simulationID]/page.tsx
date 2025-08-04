// app/(yourroute)/[simulationID]/page.tsx
import prisma from "@/app/functions/prisma";
import CompanyPage from "./_components/CompanyPage";

interface PageProps {
  params: Promise<{ simulationID: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { simulationID } = await params;
  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationID },
  });

  if (!simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Simulation not found
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
