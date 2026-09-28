import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProspectStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const prospects = await prisma.prospect.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignedTo: true },
    });
    return NextResponse.json(prospects);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération prospects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prospect = await prisma.prospect.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        company: body.company || null,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone.replace(/[^0-9]/g, ""),
        email: body.email || null,
        address: body.address || null,
        city: body.city || "Antananarivo",
        sector: body.sector || null,
        source: body.source || "Prospection",
        website: body.website || null,
        facebook: body.facebook || null,
        instagram: body.instagram || null,
        linkedin: body.linkedin || null,
        needType: body.needType || null,
        estimatedBudget: body.estimatedBudget ? parseFloat(body.estimatedBudget) : null,
        status: body.status || ProspectStatus.NOUVEAU,
        notes: body.notes || null,
        assignedToId: body.assignedToId || null,
      },
    });
    return NextResponse.json(prospect);
  } catch (error) {
    console.error("Erreur création prospect:", error);
    return NextResponse.json({ error: "Erreur création prospect" }, { status: 500 });
  }
}
