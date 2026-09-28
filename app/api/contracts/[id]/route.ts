import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        client: true,
        project: true,
        template: true,
      },
    });
    if (!contract) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 });
    }
    return NextResponse.json(contract);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération contrat" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const totalAmount = body.totalAmount !== undefined ? parseFloat(body.totalAmount) : undefined;
    const depositAmount = body.depositAmount !== undefined ? parseFloat(body.depositAmount) : undefined;
    let remainderAmount = undefined;
    if (totalAmount !== undefined && depositAmount !== undefined) {
      remainderAmount = totalAmount - depositAmount;
    }

    const updated = await prisma.contract.update({
      where: { id },
      data: {
        title: body.title,
        status: body.status,
        content: body.content,
        totalAmount,
        depositAmount,
        remainderAmount,
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : undefined,
      },
      include: {
        client: true,
        project: true,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour contrat:", error);
    return NextResponse.json({ error: "Erreur mise à jour contrat" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.contract.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression contrat:", error);
    return NextResponse.json({ error: "Erreur suppression contrat" }, { status: 500 });
  }
}
