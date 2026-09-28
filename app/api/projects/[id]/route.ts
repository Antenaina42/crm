import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        manager: true,
        tasks: true,
      },
    });
    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération projet" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type,
        status: body.status,
        description: body.description,
        targetDeliveryDate: body.targetDeliveryDate ? new Date(body.targetDeliveryDate) : undefined,
        totalAmount: body.totalAmount !== undefined ? parseFloat(body.totalAmount) : undefined,
        depositAmount: body.depositAmount !== undefined ? parseFloat(body.depositAmount) : undefined,
        remainderAmount: body.remainderAmount !== undefined ? parseFloat(body.remainderAmount) : undefined,
      },
      include: {
        client: true,
        manager: true,
        tasks: true,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour projet:", error);
    return NextResponse.json({ error: "Erreur mise à jour projet" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Delete associated tasks first
    await prisma.task.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression projet:", error);
    return NextResponse.json({ error: "Erreur suppression projet" }, { status: 500 });
  }
}
