import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OfferStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const [offers, catalog] = await Promise.all([
      prisma.offer.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
          prospect: true,
          items: true,
        },
      }),
      prisma.offerCatalog.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
      }),
    ]);
    return NextResponse.json({ offers, catalog });
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération offres" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const count = await prisma.offer.count();
    const offerNumber = `OFF-2026-${String(count + 1).padStart(4, "0")}`;

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

    const offer = await prisma.offer.create({
      data: {
        offerNumber,
        title: body.title || "Proposition Commerciale Digitale",
        clientId: body.clientId || null,
        prospectId: body.prospectId || null,
        subtotal,
        discount,
        total,
        depositPercent,
        depositAmount,
        remainderAmount,
        currency: body.currency || "Ar",
        validityDate: body.validityDate ? new Date(body.validityDate) : new Date(Date.now() + 30 * 86400000),
        notes: body.notes || null,
        terms: body.terms || "TVA non applicable – entreprise non assujettie à la TVA. Offre valable 30 jours.",
        status: OfferStatus.ENVOYEE,
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

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Erreur création offre:", error);
    return NextResponse.json({ error: "Erreur création offre" }, { status: 500 });
  }
}
