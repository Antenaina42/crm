import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { RoleType } from "@prisma/client";

// GET /api/users - Liste des utilisateurs (Admin & Super Admin uniquement)
export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            prospects: true,
            projects: true,
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur GET /api/users:", error);
    return NextResponse.json({ error: "Erreur récupération utilisateurs" }, { status: 500 });
  }
}

// POST /api/users - Création d'un nouvel utilisateur
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Le nom, l'email et le mot de passe sont obligatoires" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un utilisateur avec cette adresse email existe déjà" },
        { status: 400 }
      );
    }

    // Valider le rôle
    const validRoles: RoleType[] = [
      RoleType.COMMERCIAL,
      RoleType.ADMIN,
      RoleType.SUPER_ADMIN,
      RoleType.ACCOUNTANT,
      RoleType.PROJECT_MANAGER,
    ];

    const targetRole = validRoles.includes(role) ? role : RoleType.COMMERCIAL;

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: targetRole,
        phone: phone ? phone.trim() : null,
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        active: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/users:", error);
    return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 });
  }
}
