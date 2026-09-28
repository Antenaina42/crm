import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawDbUrl = process.env.DATABASE_URL || "";
  // Masquer le mot de passe pour la sécurité
  const maskedDbUrl = rawDbUrl.replace(/:([^:@]+)@/, ":*****@");

  const diagnostics: {
    status: string;
    timestamp: string;
    environment: string | undefined;
    database: {
      urlConfigured: boolean;
      maskedUrl: string;
      ping: boolean;
      pingError?: string;
      tablesFound?: {
        users: number;
        clients: number;
        invoices: number;
        settings: number;
      };
      existingUsers?: { email: string; role: string; name: string }[];
    };
    recommendation?: string;
  } = {
    status: "unknown",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      urlConfigured: !!process.env.DATABASE_URL,
      maskedUrl: maskedDbUrl,
      ping: false,
    },
  };

  if (!process.env.DATABASE_URL) {
    diagnostics.status = "error";
    diagnostics.recommendation = "La variable d'environnement DATABASE_URL est manquante dans votre fichier .env.";
    return NextResponse.json(diagnostics, { status: 500 });
  }

  try {
    // 1. Test ping
    await prisma.$queryRaw`SELECT 1 as ping`;
    diagnostics.database.ping = true;

    // 2. Test tables
    const [userCount, clientCount, invoiceCount, settingsCount] = await Promise.all([
      prisma.user.count(),
      prisma.client.count(),
      prisma.invoice.count(),
      prisma.companySettings.count(),
    ]);

    diagnostics.database.tablesFound = {
      users: userCount,
      clients: clientCount,
      invoices: invoiceCount,
      settings: settingsCount,
    };

    const users = await prisma.user.findMany({
      select: { email: true, role: true, name: true },
      take: 10,
    });
    diagnostics.database.existingUsers = users;

    diagnostics.status = "healthy";
    diagnostics.recommendation = "Tout fonctionne parfaitement ! Vous pouvez vous connecter sur /login.";
    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error: any) {
    diagnostics.status = "unhealthy";
    diagnostics.database.pingError = error?.message ? String(error.message).split("\n")[0] : "Erreur inconnue";

    if (error?.code === "P1001") {
      diagnostics.recommendation =
        "Impossible de contacter le serveur MySQL. Vérifiez que MySQL écoute sur le port 3306 et que l'hôte est 'localhost' ou '127.0.0.1' dans le fichier .env de Hostinger.";
    } else if (error?.code === "P1000") {
      diagnostics.recommendation =
        "Identifiants MySQL refusés. Vérifiez l'utilisateur et le mot de passe dans le .env : mysql://u697568943_crm:Antenaina23@localhost:3306/u697568943_crm";
    } else if (error?.code === "P2021" || error?.message?.includes("doesn't exist")) {
      diagnostics.recommendation =
        "Connexion MySQL réussie mais les tables n'existent pas encore ! Veuillez importer le fichier database_hostinger.sql dans phpMyAdmin sur Hostinger.";
    } else {
      diagnostics.recommendation = `Erreur Prisma (${error?.code || "INCONNUE"}) : ${error?.message || "Consultez les logs du serveur"}`;
    }

    return NextResponse.json(diagnostics, { status: 500 });
  }
}
