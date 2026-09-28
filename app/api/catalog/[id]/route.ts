import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const item = await prisma.offerCatalog.findUnique({
      where: { id },
    });
    if (!item) {
      return NextResponse.json({ error: "Pack catalogue non trouvé" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération pack catalogue" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.offerCatalog.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        basePrice: body.basePrice !== undefined ? parseFloat(body.basePrice) : undefined,
        duration: body.duration,
        description: body.description,
        included: body.included,
        options: body.options,
        conditions: body.conditions,
        currency: body.currency,
        active: body.active !== undefined ? Boolean(body.active) : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour pack catalogue:", error);
    return NextResponse.json({ error: "Erreur mise à jour pack catalogue" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.offerCatalog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression pack catalogue:", error);
    return NextResponse.json({ error: "Erreur suppression pack catalogue" }, { status: 500 });
  }
}
