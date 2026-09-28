import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("mit_crm_session");

  // Vérifier si la route est publique
  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/sign") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/webhooks") ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|json|txt|pdf)$/);

  // Si l'utilisateur est déjà connecté et va sur /login -> redirection vers l'accueil
  if (pathname === "/login" && sessionCookie?.value) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si la route est publique, autoriser l'accès
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Si pas de session active
  if (!sessionCookie?.value) {
    // Pour les routes d'API protégées, retourner un JSON 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Pour les pages web, rediriger vers /login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
