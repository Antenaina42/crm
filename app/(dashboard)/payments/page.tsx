import { prisma } from "@/lib/prisma";
import { PaymentsView } from "@/components/payments/PaymentsView";

export const revalidate = 0;

export default async function PaymentsPage() {
  const [payments, invoices] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        invoice: true,
      },
    }),
    prisma.invoice.findMany({
      orderBy: { date: "desc" },
      include: { client: true },
    }),
  ]);

  return <PaymentsView initialPayments={payments} invoices={invoices} />;
}
