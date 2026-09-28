import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ClientStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        projects: true,
        invoices: true,
        domains: true,
        hostings: true,
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await prisma.client.create({
      data: {
        name: body.name,
        company: body.company || body.name,
        phone: body.phone,
        whatsapp: body.whatsapp || body.phone.replace(/[^0-9]/g, ""),
        email: body.email,
        address: body.address || null,
        city: body.city || "Antananarivo",
        nif: body.nif || null,
        stat: body.stat || null,
        website: body.website || null,
        notes: body.notes || null,
        status: body.status || ClientStatus.ACTIF,
      },
    });
    return NextResponse.json(client);
  } catch (error) {
    console.error("Erreur création client:", error);
    return NextResponse.json({ error: "Erreur création client" }, { status: 500 });
  }
}
