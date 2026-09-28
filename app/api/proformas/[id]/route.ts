import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const proforma = await prisma.proforma.findUnique({
      where: { id },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    });

    if (!proforma) {
      return NextResponse.json({ error: "Proforma non trouvée" }, { status: 404 });
    }

    return NextResponse.json(proforma);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération proforma" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();

    const items = body.items;
    let subtotal = body.subtotal;
    let total = body.total;
    let depositAmount = body.depositAmount;
    let remainderAmount = body.remainderAmount;

    if (items && Array.isArray(items)) {
      subtotal = items.reduce(
        (sum: number, it: any) => sum + Number(it.unitPrice) * Number(it.quantity),
        0
      );
      const discount = Number(body.discount || 0);
      total = Math.max(0, subtotal - discount);
      const depositPercent = Number(body.depositPercent || 50);
      depositAmount = (total * depositPercent) / 100;
      remainderAmount = total - depositAmount;

      // Delete existing items and recreate
      await prisma.proformaItem.deleteMany({ where: { proformaId: id } });
      await prisma.proformaItem.createMany({
        data: items.map((it: any) => ({
          proformaId: id,
          description: it.description,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          total: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
        })),
      });
    }

    const updated = await prisma.proforma.update({
      where: { id },
      data: {
        status: body.status,
        discount: body.discount !== undefined ? Number(body.discount) : undefined,
        depositPercent: body.depositPercent !== undefined ? Number(body.depositPercent) : undefined,
        conditions: body.conditions,
        notes: body.notes,
        currency: body.currency,
        validityDate: body.validityDate ? new Date(body.validityDate) : undefined,
        subtotal,
        total,
        depositAmount,
        remainderAmount,
      },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour proforma:", error);
    return NextResponse.json({ error: "Erreur mise à jour proforma" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.proformaItem.deleteMany({ where: { proformaId: id } });
    await prisma.proforma.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression proforma:", error);
    return NextResponse.json({ error: "Erreur suppression proforma" }, { status: 500 });
  }
}
