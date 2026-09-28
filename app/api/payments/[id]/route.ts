import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        client: true,
        invoice: true,
      },
    });
    if (!payment) {
      return NextResponse.json({ error: "Paiement non trouvé" }, { status: 404 });
    }
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération paiement" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.payment.update({
      where: { id },
      data: {
        method: body.method,
        reference: body.reference,
        notes: body.notes,
        date: body.date ? new Date(body.date) : undefined,
      },
      include: { client: true, invoice: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour paiement:", error);
    return NextResponse.json({ error: "Erreur mise à jour paiement" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      return NextResponse.json({ error: "Paiement non trouvé" }, { status: 404 });
    }

    // Readjust linked invoice if any
    if (payment.invoiceId) {
      const invoice = await prisma.invoice.findUnique({ where: { id: payment.invoiceId } });
      if (invoice) {
        const newRemaining = invoice.remainingAmount + payment.amount;
        const newStatus =
          newRemaining >= invoice.total
            ? InvoiceStatus.ENVOYEE
            : InvoiceStatus.PARTIELLEMENT_PAYEE;

        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            remainingAmount: newRemaining,
            status: newStatus,
          },
        });
      }
    }

    await prisma.payment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression paiement:", error);
    return NextResponse.json({ error: "Erreur suppression paiement" }, { status: 500 });
  }
}
