import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const defaultDbUrl = "mysql://u697568943_crm:Antenaina23@localhost:3306/u697568943_crm";

export async function GET() {
  const currentDbUrl = process.env.DATABASE_URL || defaultDbUrl;
  const maskedDbUrl = currentDbUrl.replace(/:([^:@]+)@/, ":*****@");

  const cwd = process.cwd();
  const envPath = path.join(cwd, ".env");
  const envExists = fs.existsSync(envPath);

  let filesInCwd: string[] = [];
  try {
    filesInCwd = fs.readdirSync(cwd).filter((f) => !f.startsWith(".git") && f !== "node_modules");
  } catch {}

  const diagnostics: {
    status: string;
    timestamp: string;
    environment: string | undefined;
    system: {
      cwd: string;
      envFileFound: boolean;
      filesInRoot: string[];
    };
    database: {
      urlSource: string;
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
    system: {
      cwd,
      envFileFound: envExists,
      filesInRoot: filesInCwd,
    },
    database: {
      urlSource: process.env.DATABASE_URL ? "ENV_VARIABLE" : "DEFAULT_FALLBACK",
      maskedUrl: maskedDbUrl,
      ping: false,
    },
  };

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
    diagnostics.recommendation = "Base de données connectée avec succès ! Vous pouvez vous connecter sur /login.";
    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error: any) {
    diagnostics.status = "unhealthy";
    const errorMsg = error?.message ? String(error.message).split("\n")[0] : "Erreur inconnue";
    diagnostics.database.pingError = `${error?.code || "ERR"} : ${errorMsg}`;

    if (error?.code === "P1001") {
      diagnostics.recommendation =
        "Impossible de contacter le serveur MySQL sur ce port/hôte. Vérifiez si MySQL utilise localhost ou 127.0.0.1.";
    } else if (error?.code === "P1000") {
      diagnostics.recommendation =
        "Identifiants MySQL refusés (nom d'utilisateur ou mot de passe incorrect pour u697568943_crm).";
    } else if (error?.code === "P2021" || error?.message?.includes("doesn't exist")) {
      diagnostics.recommendation =
        "Connexion MySQL réussie mais les tables sont absentes ! Veuillez importer database_hostinger.sql dans phpMyAdmin.";
    } else {
      diagnostics.recommendation = `Erreur Prisma (${error?.code || "INCONNUE"}) : ${errorMsg}`;
    }

    return NextResponse.json(diagnostics, { status: 500 });
  }
}
