import { prisma } from "@/lib/prisma";
import { DomainsView } from "@/components/domains/DomainsView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function DomainsPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [domains, clients] = await Promise.all([
    prisma.domain.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <DomainsView initialDomains={domains} clients={clients} />;
}
