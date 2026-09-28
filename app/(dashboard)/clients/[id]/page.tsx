import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientDetailView } from "@/components/clients/ClientDetailView";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 0;

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: { include: { tasks: true } },
      offers: { include: { items: true } },
      proformas: { include: { items: true } },
      contracts: true,
      invoices: { include: { items: true, payments: true } },
      payments: true,
      domains: true,
      hostings: true,
      documents: true,
      activityLogs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) {
    notFound();
  }

  return <ClientDetailView client={client} userRole={user?.role} />;
}
