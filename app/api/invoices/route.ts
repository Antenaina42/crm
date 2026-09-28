import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus, InvoiceType } from "@prisma/client";
import { numberToFrenchWords, formatCurrency } from "@/lib/formatters";

export async function GET(req: NextRequest) {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération factures" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const count = await prisma.invoice.count();
    const invoiceNumber = `FAC-2026-${String(count + 1).padStart(4, "0")}`;

    const items = body.items || [];
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.unitPrice) * Number(item.quantity),
      0
    );

    const total = subtotal; // TVA 0%
    const depositPercent = Number(body.depositPercent || 50);
    const depositAmount = (total * depositPercent) / 100;
    const remainingAmount = depositPercent === 100 ? total : depositAmount;

    const currency = body.currency || "Ar";
    const amountInWords = numberToFrenchWords(total, currency);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        baseNumber: body.baseNumber || `MIT${Date.now().toString().slice(-6)}`,
        clientId: body.clientId,
        type: body.type || (depositPercent === 50 ? InvoiceType.ACOMPTE : InvoiceType.STANDARD),
        date: body.date ? new Date(body.date) : new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 15 * 86400000),
        subtotal,
        vatRate: 0,
        vatAmount: 0,
        total,
        depositPercent,
        depositAmount,
        remainingAmount,
        amountInWords,
        currency,
        status: InvoiceStatus.ENVOYEE,
        paymentTerms: body.paymentTerms || `Reste à payer : ${100 - depositPercent}% de somme : ${formatCurrency(total - depositAmount, currency)} à la livraison.`,
        notes: body.notes || "Agence de développement de site / application web. Lot : D79 Soalazaina Ambatolampy Antananarivo 102 Madagascar",
        signatureMiora: true,
        signatureClient: false,
        items: {
          create: items.map((it: any) => ({
            description: it.description,
            quantity: Number(it.quantity) || 1,
            unitPrice: Number(it.unitPrice) || 0,
            total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Erreur création facture:", error);
    return NextResponse.json({ error: "Erreur création facture" }, { status: 500 });
  }
}

