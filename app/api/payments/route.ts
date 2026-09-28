import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod } from "@prisma/client";
import { onPaymentRecorded } from "@/lib/automations";

export async function GET(req: NextRequest) {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        invoice: true,
      },
    });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération paiements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const count = await prisma.payment.count();
    const paymentNumber = `PAI-2026-${String(count + 1).padStart(4, "0")}`;

    const payment = await prisma.payment.create({
      data: {
        paymentNumber,
        invoiceId: body.invoiceId,
        clientId: body.clientId,
        amount: parseFloat(body.amount),
        method: body.method || PaymentMethod.MVOLA,
        reference: body.reference || null,
        notes: body.notes || null,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    // Déclencher l'automatisation de rapprochement facture & CA
    await onPaymentRecorded(payment.id);

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Erreur enregistrement paiement:", error);
    return NextResponse.json({ error: "Erreur enregistrement paiement" }, { status: 500 });
  }
}
