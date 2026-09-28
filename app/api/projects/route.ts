import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        manager: true,
        tasks: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération projets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const count = await prisma.project.count();
    const projectNumber = `PRJ-2026-${String(count + 1).padStart(4, "0")}`;

    const project = await prisma.project.create({
      data: {
        projectNumber,
        title: body.title,
        clientId: body.clientId,
        type: body.type || "Application Web",
        description: body.description || null,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        targetDeliveryDate: body.targetDeliveryDate ? new Date(body.targetDeliveryDate) : null,
        status: body.status || ProjectStatus.A_DEMARRER,
        managerId: body.managerId || null,
        totalAmount: parseFloat(body.totalAmount || "0"),
        depositAmount: parseFloat(body.depositAmount || "0"),
        remainderAmount: parseFloat(body.remainderAmount || "0"),
      },
      include: {
        client: true,
        manager: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Erreur création projet:", error);
    return NextResponse.json({ error: "Erreur création projet" }, { status: 500 });
  }
}
