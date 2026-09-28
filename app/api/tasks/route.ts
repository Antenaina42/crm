import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskPriority, TaskStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { order: "asc" },
      include: {
        project: { include: { client: true } },
        assignee: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Erreur récupération tâches" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = await prisma.task.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        description: body.description || null,
        priority: body.priority || TaskPriority.NORMALE,
        status: body.status || TaskStatus.A_FAIRE,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assigneeId: body.assigneeId || null,
      },
      include: {
        project: true,
        assignee: true,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Erreur création tâche:", error);
    return NextResponse.json({ error: "Erreur création tâche" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, priority, title, description, assigneeId, dueDate } = body;
    const task = await prisma.task.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        priority: priority !== undefined ? priority : undefined,
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        assigneeId: assigneeId !== undefined ? assigneeId : undefined,
        dueDate: dueDate ? new Date(dueDate) : (dueDate === null ? null : undefined),
      },
      include: {
        project: true,
        assignee: true,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Erreur mise à jour tâche:", error);
    return NextResponse.json({ error: "Erreur mise à jour tâche" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");
    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch (e) {}
    }
    if (!id) {
      return NextResponse.json({ error: "ID de tâche requis" }, { status: 400 });
    }
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression tâche:", error);
    return NextResponse.json({ error: "Erreur suppression tâche" }, { status: 500 });
  }
}
