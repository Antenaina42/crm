import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "mit_crm_session";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setSession(user: { id: string; email: string; name: string; role: string }) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  // Base64 encoded payload
  const token = Buffer.from(sessionData).toString("base64");

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (sessionCookie?.value) {
      const decoded = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
      const data = JSON.parse(decoded);
      return data;
    }

    // En production, un utilisateur sans cookie n'est pas authentifié
    if (process.env.NODE_ENV === "production") {
      return null;
    }

    // En développement uniquement : fallback sur le premier SUPER_ADMIN pour simplifier les tests locaux
    try {
      const defaultAdmin = await prisma.user.findFirst({
        where: { role: "SUPER_ADMIN" },
      });

      if (defaultAdmin) {
        return {
          id: defaultAdmin.id,
          name: defaultAdmin.name,
          email: defaultAdmin.email,
          role: defaultAdmin.role,
        };
      }
    } catch {
      // Ignorer silencieusement si la base de données n'est pas joignable en local
      return null;
    }

    return null;
  } catch (error) {
    console.error("Erreur session utilisateur:", error);
    return null;
  }
}
