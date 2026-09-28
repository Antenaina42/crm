import { prisma } from "@/lib/prisma";
import { ClientsListView } from "@/components/clients/ClientsListView";

export const revalidate = 0;

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      projects: true,
      invoices: true,
      domains: true,
      hostings: true,
    },
  });

  return <ClientsListView initialClients={clients} />;
}
