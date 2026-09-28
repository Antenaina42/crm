import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: { include: { tasks: true } },
        offers: { include: { items: true } },
        proformas: { include: { items: true } },
        contracts: true,
        invoices: { include: { items: true, payments: true } },
        payments: true,
        domains: true,
        hostings: true,
        documents: true,
        activityLogs: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération fiche client" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        company: body.company,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        address: body.address,
        city: body.city,
        nif: body.nif,
        stat: body.stat,
        website: body.website,
        notes: body.notes,
        status: body.status,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erreur mise à jour client" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression client" }, { status: 500 });
  }
}
