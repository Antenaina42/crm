import { prisma } from "@/lib/prisma";
import { SettingsView } from "@/components/settings/SettingsView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [settings, templates] = await Promise.all([
    prisma.companySettings.findFirst(),
    prisma.messageTemplate.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return <SettingsView initialSettings={settings} templates={templates} />;
}
