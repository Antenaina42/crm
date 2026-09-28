import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContractStatus } from "@prisma/client";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        project: true,
        template: true,
      },
    });
    return NextResponse.json(contracts);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération contrats" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const count = await prisma.contract.count();
    const contractNumber = `CTR-2026-${String(count + 1).padStart(4, "0")}`;
    const signToken = crypto.randomUUID();

    const client = await prisma.client.findUnique({ where: { id: body.clientId } });
    const template = await prisma.contractTemplate.findUnique({ where: { id: body.templateId } });

    let content = template?.content || body.content || "Contrat officiel de prestation.";
    const totalAmount = parseFloat(body.totalAmount || "0");
    const depositAmount = parseFloat(body.depositAmount || String(totalAmount * 0.5));
    const remainderAmount = totalAmount - depositAmount;

    content = content
      .replace(/\{\{client_name\}\}/g, client?.name || "")
      .replace(/\{\{company_name\}\}/g, client?.company || "")
      .replace(/\{\{project_name\}\}/g, body.title || "Projet Digital")
      .replace(/\{\{amount\}\}/g, totalAmount.toLocaleString("fr-FR"))
      .replace(/\{\{deposit_amount\}\}/g, depositAmount.toLocaleString("fr-FR"))
      .replace(/\{\{remainder_amount\}\}/g, remainderAmount.toLocaleString("fr-FR"))
      .replace(/\{\{delivery_date\}\}/g, body.deliveryDate ? new Date(body.deliveryDate).toLocaleDateString("fr-FR") : "30 jours après acompte");

    const contract = await prisma.contract.create({
      data: {
        contractNumber,
        title: body.title || "Contrat de Prestation Digitale",
        clientId: body.clientId,
        projectId: body.projectId || null,
        templateId: body.templateId || null,
        content,
        totalAmount,
        depositAmount,
        remainderAmount,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        deliveryDate: body.deliveryDate ? new Date(body.deliveryDate) : null,
        status: ContractStatus.EN_ATTENTE_SIGNATURE,
        signToken,
      },
      include: {
        client: true,
        project: true,
      },
    });

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Erreur création contrat:", error);
    return NextResponse.json({ error: "Erreur création contrat" }, { status: 500 });
  }
}
