import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { RoleType } from "@prisma/client";

// GET /api/users/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur GET /api/users/[id]:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, role, phone, active, password } = body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Protection : un administrateur ne peut pas désactiver son propre compte
    if (session.id === id && active === false) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas désactiver votre propre compte administrateur" },
        { status: 400 }
      );
    }

    // Protection : si email modifié, vérifier unicité
    let cleanEmail = existingUser.email;
    if (email && email.toLowerCase().trim() !== existingUser.email) {
      cleanEmail = email.toLowerCase().trim();
      const duplicate = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (duplicate) {
        return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 });
      }
    }

    // Données à mettre à jour
    const updateData: any = {
      name: name ? name.trim() : existingUser.name,
      email: cleanEmail,
      phone: phone !== undefined ? phone : existingUser.phone,
      active: active !== undefined ? Boolean(active) : existingUser.active,
    };

    if (role) {
      updateData.role = role as RoleType;
    }

    if (password && password.trim().length > 0) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        active: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur PUT /api/users/[id]:", error);
    return NextResponse.json({ error: "Erreur mise à jour utilisateur" }, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    if (session.id === id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      );
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Si l'utilisateur est le super admin fondateur, interdire la suppression
    if (userToDelete.email === "admin@m-itlevelup.com") {
      return NextResponse.json(
        { error: "Le compte administrateur principal ne peut pas être supprimé" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/users/[id]:", error);
    return NextResponse.json({ error: "Erreur suppression utilisateur" }, { status: 500 });
  }
}
