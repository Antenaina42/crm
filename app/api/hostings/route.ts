import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AssetStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const hostings = await prisma.hosting.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
    });
    return NextResponse.json(hostings);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération hébergements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const costPrice = parseFloat(body.costPrice || "120000");
    const sellingPrice = parseFloat(body.sellingPrice || "300000");
    const margin = sellingPrice - costPrice;

    const hosting = await prisma.hosting.create({
      data: {
        clientId: body.clientId,
        domainName: body.domainName,
        provider: body.provider || "Hostinger Cloud",
        plan: body.plan || "Cloud Startup NVMe",
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        expirationDate: new Date(body.expirationDate),
        costPrice,
        sellingPrice,
        margin,
        status: body.status || AssetStatus.ACTIF,
        notes: body.notes || null,
      },
      include: { client: true },
    });
    return NextResponse.json(hosting);
  } catch (error) {
    return NextResponse.json({ error: "Erreur création hébergement" }, { status: 500 });
  }
}
