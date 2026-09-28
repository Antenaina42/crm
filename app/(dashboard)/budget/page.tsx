import { prisma } from "@/lib/prisma";
import { BudgetView } from "@/components/budget/BudgetView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function BudgetPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [expenses, invoices, payments] = await Promise.all([
    prisma.expense.findMany({
      orderBy: { date: "desc" },
    }),
    prisma.invoice.findMany(),
    prisma.payment.findMany(),
  ]);

  const totalIncome = invoices.reduce((s, i) => s + i.total, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalRemaining = Math.max(0, totalIncome - totalCollected);

  return (
    <BudgetView
      initialExpenses={expenses}
      totalIncome={totalIncome}
      totalCollected={totalCollected}
      totalRemaining={totalRemaining}
    />
  );
}
