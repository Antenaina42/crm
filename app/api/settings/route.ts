import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.companySettings.findFirst();
    const templates = await prisma.messageTemplate.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ settings, templates });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lecture paramètres" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await prisma.companySettings.findFirst();

    if (body.templates && Array.isArray(body.templates)) {
      for (const tpl of body.templates) {
        if (tpl.id) {
          await prisma.messageTemplate.update({
            where: { id: tpl.id },
            data: {
              name: tpl.name,
              content: tpl.content,
              subject: tpl.subject,
            },
          });
        }
      }
    }

    if (existing) {
      const updated = await prisma.companySettings.update({
        where: { id: existing.id },
        data: {
          companyName: body.companyName,
          managerName: body.managerName,
          nif: body.nif,
          stat: body.stat,
          email: body.email,
          phone: body.phone,
          website: body.website,
          address: body.address,
          city: body.city,
          country: body.country,
          currency: body.currency,
          invoicePrefix: body.invoicePrefix,
          proformaPrefix: body.proformaPrefix,
          termsAndConditions: body.termsAndConditions,
        },
      });
      return NextResponse.json(updated);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur enregistrement paramètres" }, { status: 500 });
  }
}
