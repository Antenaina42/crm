import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const catalog = await prisma.offerCatalog.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(catalog);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération catalogue" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item = await prisma.offerCatalog.create({
      data: {
        name: body.name,
        category: body.category || "Développement Web",
        basePrice: parseFloat(body.basePrice || "0"),
        duration: body.duration || null,
        description: body.description || null,
        included: body.included || null,
        options: body.options || null,
        conditions: body.conditions || null,
        currency: body.currency || "Ar",
        active: body.active !== undefined ? Boolean(body.active) : true,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Erreur création pack catalogue:", error);
    return NextResponse.json({ error: "Erreur création pack catalogue" }, { status: 500 });
  }
}
