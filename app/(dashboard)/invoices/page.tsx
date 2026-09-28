import { prisma } from "@/lib/prisma";
import { InvoicesListView } from "@/components/documents/InvoicesListView";

export const revalidate = 0;

export default async function InvoicesPage() {
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
