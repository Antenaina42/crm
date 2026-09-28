import { prisma } from "@/lib/prisma";
import { ContractsListView } from "@/components/contracts/ContractsListView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ContractsPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [contracts, clients, templates] = await Promise.all([
    prisma.contract.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        project: true,
        template: true,
      },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.contractTemplate.findMany({ where: { active: true } }),
  ]);

  return (
    <ContractsListView
      initialContracts={contracts}
      clients={clients}
      templates={templates}
    />
  );
}
