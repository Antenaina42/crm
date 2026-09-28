import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const domain = await prisma.domain.findUnique({
      where: { id },
      include: { client: true },
    });
    if (!domain) {
      return NextResponse.json({ error: "Domaine non trouvé" }, { status: 404 });
    }
    return NextResponse.json(domain);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération domaine" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.domain.update({
      where: { id },
      data: {
        domainName: body.domainName,
        extension: body.extension,
        registrar: body.registrar,
        purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : undefined,
        expirationDate: body.expirationDate ? new Date(body.expirationDate) : undefined,
        costPrice: body.costPrice !== undefined ? parseFloat(body.costPrice) : undefined,
        sellingPrice: body.sellingPrice !== undefined ? parseFloat(body.sellingPrice) : undefined,
        status: body.status,
        autoRenew: body.autoRenew !== undefined ? Boolean(body.autoRenew) : undefined,
        notes: body.notes,
      },
      include: { client: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour domaine:", error);
    return NextResponse.json({ error: "Erreur mise à jour domaine" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.domain.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression domaine:", error);
    return NextResponse.json({ error: "Erreur suppression domaine" }, { status: 500 });
  }
}
