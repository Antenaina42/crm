import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const hosting = await prisma.hosting.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!hosting) {
      return NextResponse.json({ error: "Hébergement non trouvé" }, { status: 404 });
    }
    return NextResponse.json(hosting);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération hébergement" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const costPrice = body.costPrice !== undefined ? parseFloat(body.costPrice) : undefined;
    const sellingPrice = body.sellingPrice !== undefined ? parseFloat(body.sellingPrice) : undefined;
    let margin = undefined;
    if (costPrice !== undefined && sellingPrice !== undefined) {
      margin = sellingPrice - costPrice;
    }

    const updated = await prisma.hosting.update({
      where: { id },
      data: {
        domainName: body.domainName,
        provider: body.provider,
        plan: body.plan,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
        costPrice,
        sellingPrice,
        margin,
        status: body.status,
        notes: body.notes,
      },
      include: { client: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour hébergement:", error);
    return NextResponse.json({ error: "Erreur mise à jour hébergement" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.hosting.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression hébergement:", error);
    return NextResponse.json({ error: "Erreur suppression hébergement" }, { status: 500 });
  }
}
