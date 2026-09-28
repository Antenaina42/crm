import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { isRead: false },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    return NextResponse.json(
      { error: "Erreur récupération notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true, unreadCount: 0 });
    }

    if (body.id) {
      await prisma.notification.update({
        where: { id: body.id },
        data: { isRead: true },
      });

      const unreadCount = await prisma.notification.count({
        where: { isRead: false },
      });

      return NextResponse.json({ success: true, unreadCount });
    }

    return NextResponse.json({ error: "Action non spécifiée" }, { status: 400 });
  } catch (error) {
    console.error("Erreur mise à jour notification:", error);
    return NextResponse.json(
      { error: "Erreur mise à jour notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await prisma.notification.delete({ where: { id } });
    } else {
      await prisma.notification.deleteMany();
    }

    const unreadCount = await prisma.notification.count({
      where: { isRead: false },
    });

    return NextResponse.json({ success: true, unreadCount });
  } catch (error) {
    console.error("Erreur suppression notification:", error);
    return NextResponse.json(
      { error: "Erreur suppression notification" },
      { status: 500 }
    );
  }
}
