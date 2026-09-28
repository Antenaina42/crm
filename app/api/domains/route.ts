import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AssetStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
    });
    return NextResponse.json(domains);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération domaines" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const domain = await prisma.domain.create({
      data: {
        clientId: body.clientId,
        domainName: body.domainName,
        extension: body.extension || ".com",
        registrar: body.registrar || "Hostinger / Namecheap",
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : new Date(),
        expirationDate: new Date(body.expirationDate),
        costPrice: parseFloat(body.costPrice || "65000"),
        sellingPrice: parseFloat(body.sellingPrice || "300000"),
        status: body.status || AssetStatus.ACTIF,
        autoRenew: body.autoRenew ?? true,
        notes: body.notes || null,
      },
      include: { client: true },
    });
    return NextResponse.json(domain);
  } catch (error) {
    return NextResponse.json({ error: "Erreur création domaine" }, { status: 500 });
  }
}
