import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ClientStatus, ProspectStatus } from "@prisma/client";
import { logActivity } from "@/lib/audit";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();

    // Si action de conversion en client
    if (body.action === "convert") {
      const prospect = await prisma.prospect.findUnique({ where: { id } });
      if (!prospect) {
        return NextResponse.json({ error: "Prospect non trouvé" }, { status: 404 });
      }

      const client = await prisma.client.create({
        data: {
          name: `${prospect.firstName} ${prospect.lastName}`,
          company: prospect.company || `${prospect.firstName} ${prospect.lastName}`,
          phone: prospect.phone,
          whatsapp: prospect.whatsapp || prospect.phone.replace(/[^0-9]/g, ""),
          email: prospect.email || "client@m-itlevelup.com",
          address: prospect.address,
          city: prospect.city || "Antananarivo",
          website: prospect.website,
          notes: prospect.notes,
          status: ClientStatus.ACTIF,
        },
      });

      await prisma.prospect.update({
        where: { id },
        data: {
          status: ProspectStatus.GAGNE,
          convertedClientId: client.id,
        },
      });

      await logActivity({
        clientId: client.id,
        action: "PROSPECT_CONVERTI",
        details: `Prospect ${prospect.firstName} ${prospect.lastName} converti en client officiel`,
        entityType: "Client",
        entityId: client.id,
      });

      return NextResponse.json({ success: true, client });
    }

    const updated = await prisma.prospect.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        company: body.company,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        address: body.address,
        city: body.city,
        sector: body.sector,
        source: body.source,
        website: body.website,
        facebook: body.facebook,
        instagram: body.instagram,
        linkedin: body.linkedin,
        needType: body.needType,
        estimatedBudget: body.estimatedBudget ? parseFloat(body.estimatedBudget) : null,
        status: body.status,
        notes: body.notes,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur mise à jour prospect:", error);
    return NextResponse.json({ error: "Erreur mise à jour prospect" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.prospect.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
