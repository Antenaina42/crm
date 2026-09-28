import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.active) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    console.error("Erreur login API:", error);
    const code = error?.code;
    let userMessage = "Erreur serveur lors de la connexion";

    if (code === "P1001") {
      userMessage = "Impossible de se connecter à MySQL. Vérifiez que MySQL est actif et accessible dans .env (host et port).";
    } else if (code === "P1000") {
      userMessage = "Échec d'authentification MySQL. Vérifiez l'utilisateur et le mot de passe dans .env.";
    } else if (code === "P2021" || error?.message?.includes("doesn't exist")) {
      userMessage = "Les tables de la base de données n'existent pas encore. Importez le fichier database_hostinger.sql dans phpMyAdmin.";
    }

    return NextResponse.json(
      {
        error: userMessage,
        code: code || "DB_ERROR",
        details: error?.message ? String(error.message).split("\n")[0] : undefined,
      },
      { status: 500 }
    );
  }
}
