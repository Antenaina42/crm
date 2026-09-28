import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const templates = await prisma.messageTemplate.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des modèles" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.name || !body.content) {
      return NextResponse.json(
        { error: "Le code, le nom et le contenu sont requis" },
        { status: 400 }
      );
    }

    const template = await prisma.messageTemplate.create({
      data: {
        code: body.code,
        name: body.name,
        subject: body.subject || null,
        content: body.content,
        type: body.type || "WHATSAPP",
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erreur création modèle" },
      { status: 500 }
    );
  }
}
