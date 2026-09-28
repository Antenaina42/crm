import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });
    if (!expense) {
      return NextResponse.json({ error: "Dépense non trouvée" }, { status: 404 });
    }
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération dépense" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.expense.update({
      where: { id },
      data: {
        category: body.category,
        amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
        supplier: body.supplier,
        invoiceRef: body.invoiceRef,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour dépense:", error);
    return NextResponse.json({ error: "Erreur mise à jour dépense" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression dépense:", error);
    return NextResponse.json({ error: "Erreur suppression dépense" }, { status: 500 });
  }
}
