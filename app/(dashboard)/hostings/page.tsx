import { prisma } from "@/lib/prisma";
import { HostingsView } from "@/components/hostings/HostingsView";

export const revalidate = 0;

export default async function HostingsPage() {
  const [hostings, clients] = await Promise.all([
    prisma.hosting.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <HostingsView initialHostings={hostings} clients={clients} />;
}
