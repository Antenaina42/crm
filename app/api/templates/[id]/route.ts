import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.messageTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Modèle de message introuvable" },
        { status: 404 }
      );
    }

    const updated = await prisma.messageTemplate.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : existing.name,
        subject: body.subject !== undefined ? body.subject : existing.subject,
        content: body.content !== undefined ? body.content : existing.content,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Erreur mise à jour modèle :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du modèle" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const template = await prisma.messageTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Modèle introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lecture modèle" },
      { status: 500 }
    );
  }
}
