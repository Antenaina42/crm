import { prisma } from "@/lib/prisma";
import { InvoicesListView } from "@/components/documents/InvoicesListView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [invoices, clients] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return <InvoicesListView initialInvoices={invoices} clients={clients} />;
}
