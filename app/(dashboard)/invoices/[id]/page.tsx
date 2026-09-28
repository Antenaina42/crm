import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoicePrintView } from "@/components/documents/InvoicePrintView";

export const revalidate = 0;

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, companySettings] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    }),
    prisma.companySettings.findFirst(),
  ]);

  if (!invoice) {
    notFound();
  }

  return <InvoicePrintView invoice={invoice} companySettings={companySettings} />;
}
