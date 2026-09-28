import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { onOfferAccepted } from "@/lib/automations";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (body.action === "accept") {
      const result = await onOfferAccepted(id);
      return NextResponse.json({ success: true, result });
    }

    const updated = await prisma.offer.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes,
        terms: body.terms,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour offre:", error);
    return NextResponse.json({ error: "Erreur mise à jour offre" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression offre" }, { status: 500 });
  }
}
