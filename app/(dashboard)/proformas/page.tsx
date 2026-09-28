import { prisma } from "@/lib/prisma";
import { ProformasListView } from "@/components/documents/ProformasListView";

export const revalidate = 0;

export default async function ProformasPage() {
  const [proformas, clients, prospects] = await Promise.all([
    prisma.proforma.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.prospect.findMany({ orderBy: { firstName: "asc" } }),
  ]);

  return (
    <ProformasListView
      initialProformas={proformas}
      clients={clients}
      prospects={prospects}
    />
  );
}
