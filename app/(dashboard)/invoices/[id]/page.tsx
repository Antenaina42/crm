import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoicePrintView } from "@/components/documents/InvoicePrintView";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 0;

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

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
