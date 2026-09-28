import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [clients, prospects, projects, invoices, contracts, domains] = await Promise.all([
      prisma.client.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { company: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.prospect.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { company: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { projectNumber: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.invoice.findMany({
        where: {
          OR: [
            { invoiceNumber: { contains: q } },
            { baseNumber: { contains: q } },
          ],
        },
        include: { client: true },
        take: 5,
      }),
      prisma.contract.findMany({
        where: {
          OR: [
            { contractNumber: { contains: q } },
            { title: { contains: q } },
          ],
        },
        take: 5,
      }),
      prisma.domain.findMany({
        where: {
          domainName: { contains: q },
        },
        take: 5,
      }),
    ]);

    const results = [
      ...clients.map((c) => ({
        id: c.id,
        title: c.company || c.name,
        subtitle: `Client • ${c.phone} • ${c.email}`,
        category: "Client" as const,
        href: `/clients/${c.id}`,
      })),
      ...prospects.map((p) => ({
        id: p.id,
        title: `${p.firstName} ${p.lastName}${p.company ? ` (${p.company})` : ""}`,
        subtitle: `Prospect • Statut: ${p.status} • ${p.needType || "Projet"}`,
        category: "Prospect" as const,
        href: `/prospects`,
      })),
      ...projects.map((pr) => ({
        id: pr.id,
        title: pr.title,
        subtitle: `Projet ${pr.projectNumber} • Statut: ${pr.status}`,
        category: "Projet" as const,
        href: `/projects`,
      })),
      ...invoices.map((inv) => ({
        id: inv.id,
        title: `Facture ${inv.invoiceNumber}${inv.baseNumber ? ` (${inv.baseNumber})` : ""}`,
        subtitle: `${inv.client.company || inv.client.name} • ${inv.total.toLocaleString("fr-FR")} Ar`,
        category: "Facture" as const,
        href: `/invoices/${inv.id}`,
      })),
      ...contracts.map((ctr) => ({
        id: ctr.id,
        title: ctr.title,
        subtitle: `Contrat ${ctr.contractNumber} • ${ctr.status}`,
        category: "Contrat" as const,
        href: `/contracts`,
      })),
      ...domains.map((dom) => ({
        id: dom.id,
        title: dom.domainName,
        subtitle: `Domaine • Statut: ${dom.status} • Expire le ${dom.expirationDate.toLocaleDateString("fr-FR")}`,
        category: "Domaine" as const,
        href: `/domains`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Erreur API Search:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
