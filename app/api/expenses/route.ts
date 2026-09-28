import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ExpenseCategory } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération dépenses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const expense = await prisma.expense.create({
      data: {
        category: body.category || ExpenseCategory.AUTRE,
        amount: parseFloat(body.amount),
        supplier: body.supplier || "Fournisseur",
        invoiceRef: body.invoiceRef || null,
        description: body.description || "",
        date: body.date ? new Date(body.date) : new Date(),
      },
    });
    return NextResponse.json(expense);
  } catch (error) {
    console.error("Erreur création dépense:", error);
    return NextResponse.json({ error: "Erreur création dépense" }, { status: 500 });
  }
}
