import { prisma } from "@/lib/prisma";
import { ClientsListView } from "@/components/clients/ClientsListView";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 0;

export default async function ClientsPage() {
  const user = await getCurrentUser();
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      projects: true,
      invoices: true,
      domains: true,
      hostings: true,
    },
  });

  return <ClientsListView initialClients={clients} userRole={user?.role} />;
}
