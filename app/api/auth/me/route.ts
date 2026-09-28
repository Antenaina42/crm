import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        active: true,
        createdAt: true,
      },
    });

    if (!user || !user.active) {
      return NextResponse.json({ error: "Utilisateur introuvable ou inactif" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Erreur GET /api/auth/me:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
