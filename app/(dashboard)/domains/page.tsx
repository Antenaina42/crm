import { prisma } from "@/lib/prisma";
import { DomainsView } from "@/components/domains/DomainsView";

export const revalidate = 0;

export default async function DomainsPage() {
  const [domains, clients] = await Promise.all([
    prisma.domain.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <DomainsView initialDomains={domains} clients={clients} />;
}
