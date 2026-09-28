import { prisma } from "@/lib/prisma";
import { HostingsView } from "@/components/hostings/HostingsView";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function HostingsPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [hostings, clients] = await Promise.all([
    prisma.hosting.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <HostingsView initialHostings={hostings} clients={clients} />;
}
