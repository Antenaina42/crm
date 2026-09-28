import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProformaStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const proformas = await prisma.proforma.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    });
    return NextResponse.json(proformas);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération proformas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const count = await prisma.proforma.count();
    const proformaNumber = `PRO-2026-${String(count + 1).padStart(4, "0")}`;

    const items = body.items || [];
    const subtotal = items.reduce(
      (sum: number, it: any) => sum + Number(it.unitPrice) * Number(it.quantity),
      0
    );
    const discount = Number(body.discount || 0);
    const total = Math.max(0, subtotal - discount);
    const depositPercent = Number(body.depositPercent || 50);
    const depositAmount = (total * depositPercent) / 100;
    const remainderAmount = total - depositAmount;

    const proforma = await prisma.proforma.create({
      data: {
        proformaNumber,
        clientId: body.clientId || null,
        prospectId: body.prospectId || null,
        date: body.date ? new Date(body.date) : new Date(),
        validityDate: body.validityDate ? new Date(body.validityDate) : new Date(Date.now() + 30 * 86400000),
        subtotal,
        discount,
        total,
        depositPercent,
        depositAmount,
        remainderAmount,
        currency: body.currency || "Ar",
        conditions: body.conditions || "Facture Proforma valable 30 jours. TVA non applicable – entreprise non assujettie à la TVA. Acompte de 50% au lancement.",
        notes: body.notes || "M-It LevelUp vous remercie pour votre confiance. Prestation garantie avec support et accompagnement technique dédié.",
        status: ProformaStatus.ENVOYEE,
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
        prospect: true,
        items: true,
      },
    });

    return NextResponse.json(proforma);
  } catch (error) {
    console.error("Erreur création proforma:", error);
    return NextResponse.json({ error: "Erreur création proforma" }, { status: 500 });
  }
}
