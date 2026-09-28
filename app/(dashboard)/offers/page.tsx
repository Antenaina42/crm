import { prisma } from "@/lib/prisma";
import { OffersView } from "@/components/offers/OffersView";

export const revalidate = 0;

export default async function OffersPage() {
  const [offers, catalog, clients, prospects] = await Promise.all([
    prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    }),
    prisma.offerCatalog.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.prospect.findMany({ orderBy: { firstName: "asc" } }),
  ]);

  return (
    <OffersView
      initialOffers={offers}
      catalog={catalog}
      clients={clients}
      prospects={prospects}
    />
  );
}
