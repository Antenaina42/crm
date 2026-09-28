import { prisma } from "@/lib/prisma";
import { ProspectsView } from "@/components/prospects/ProspectsView";

export const revalidate = 0;

export default async function ProspectsPage() {
  const prospects = await prisma.prospect.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: true,
    },
  });

  return <ProspectsView initialProspects={prospects} />;
}
