import { prisma } from "@/lib/prisma";
import { SettingsView } from "@/components/settings/SettingsView";

export const revalidate = 0;

export default async function SettingsPage() {
  const [settings, templates] = await Promise.all([
    prisma.companySettings.findFirst(),
    prisma.messageTemplate.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return <SettingsView initialSettings={settings} templates={templates} />;
}
