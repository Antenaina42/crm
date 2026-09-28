import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM M-It LevelUp — Agence Digitale & Solutions Web",
  description: "Plateforme CRM interne, facturation, contrats, projets et suivi clients pour l'agence M-It LevelUp",
  icons: {
    icon: "/logo-official.jpg",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full bg-slate-50">
      <body className="h-full antialiased text-slate-900 bg-slate-50 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
