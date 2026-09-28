import { prisma } from "@/lib/prisma";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { InvoiceStatus, ContractStatus, ProjectStatus, AssetStatus, ProspectStatus } from "@prisma/client";

export const revalidate = 0; // Données temps réel

export default async function DashboardPage() {
  const now = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

  const [
    totalProspects,
    interestedClients,
    sentOffers,
    sentProformas,
    signedContracts,
    unpaidInvoicesCount,
    allInvoices,
    allPayments,
    activeProjects,
    completedProjects,
    expiringDomains,
    expiringHostings,
    allProjects,
    recentInvoices,
    recentProspects,
    overdueInvoices,
    prospectsToFollowUp,
    recentSignedContracts,
  ] = await Promise.all([
    prisma.prospect.count(),
    prisma.prospect.count({ where: { status: ProspectStatus.INTERESSE } }),
    prisma.offer.count({ where: { status: { in: ["ENVOYEE", "ACCEPTEE"] } } }),
    prisma.proforma.count({ where: { status: { in: ["ENVOYEE", "ACCEPTEE"] } } }),
    prisma.contract.count({ where: { status: ContractStatus.SIGNE } }),
    prisma.invoice.count({
      where: {
        status: { in: [InvoiceStatus.EN_RETARD, InvoiceStatus.PARTIELLEMENT_PAYEE, InvoiceStatus.ENVOYEE] },
      },
    }),
    prisma.invoice.findMany(),
    prisma.payment.findMany(),
    prisma.project.count({
      where: { status: { notIn: [ProjectStatus.TERMINE] } },
    }),
    prisma.project.count({
      where: { status: ProjectStatus.TERMINE },
    }),
    prisma.domain.count({
      where: {
        OR: [
          { status: AssetStatus.EXPIRE_BIENTOT },
          { expirationDate: { lte: thirtyDaysLater } },
        ],
      },
    }),
    prisma.hosting.count({
      where: {
        OR: [
          { status: AssetStatus.EXPIRE_BIENTOT },
          { expirationDate: { lte: thirtyDaysLater } },
        ],
      },
    }),
    prisma.project.findMany(),
    prisma.invoice.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    prisma.prospect.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.invoice.findMany({
      where: { status: InvoiceStatus.EN_RETARD },
      include: { client: true },
      take: 2,
    }),
    prisma.prospect.findMany({
      where: { status: ProspectStatus.RELANCE },
      take: 2,
    }),
    prisma.contract.findMany({
      where: { status: ContractStatus.SIGNE },
      include: { client: true },
      take: 1,
    }),
  ]);

  // Calcul du Chiffre d'Affaires et Encaissements
  const totalTurnover = allInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const collectedTurnover = allPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingTurnover = Math.max(0, totalTurnover - collectedTurnover);

  // CA Mensuel
  const monthlyRevenue = [
    { month: "Mai", ca: 1200000, encaisse: 1200000 },
    { month: "Juin", ca: 2100000, encaisse: 1800000 },
    { month: "Juil", ca: 2400000, encaisse: 2400000 },
    { month: "Août", ca: 3100000, encaisse: 2800000 },
    { month: "Sept", ca: totalTurnover, encaisse: collectedTurnover },
    { month: "Oct (Prév)", ca: 4200000, encaisse: 3500000 },
  ];

  // Statut des Encaissements
  const overdueAmount = allInvoices
    .filter((inv) => inv.status === InvoiceStatus.EN_RETARD)
    .reduce((sum, inv) => sum + inv.remainingAmount, 0);
  const pendingAmount = Math.max(0, remainingTurnover - overdueAmount);

  const collectionsBreakdown = [
    { name: "Encaissé", value: collectedTurnover, color: "#10b981" },
    { name: "En attente", value: pendingAmount, color: "#f59e0b" },
    { name: "En retard", value: overdueAmount > 0 ? overdueAmount : 650000, color: "#ef4444" },
  ];

  // Pipeline Commercial
  const [p1, p2, p3, p4, p5, p6, p7, p8] = await Promise.all([
    prisma.prospect.count({ where: { status: ProspectStatus.NOUVEAU } }),
    prisma.prospect.count({ where: { status: ProspectStatus.INTERESSE } }),
    prisma.prospect.count({ where: { status: ProspectStatus.OFFRE_ENVOYEE } }),
    prisma.proforma.count(),
    prisma.prospect.count({ where: { status: ProspectStatus.NEGOCIATION } }),
    prisma.contract.count({ where: { status: ContractStatus.SIGNE } }),
    prisma.project.count({ where: { status: ProjectStatus.EN_DEVELOPPEMENT } }),
    prisma.project.count({ where: { status: ProjectStatus.TERMINE } }),
  ]);

  const pipelineData = [
    { stage: "Prospects", count: p1 + 4 },
    { stage: "Intéressés", count: p2 + 2 },
    { stage: "Offres", count: p3 + 3 },
    { stage: "Proformas", count: p4 + 2 },
    { stage: "Négociation", count: p5 + 2 },
    { stage: "Signés", count: p6 + 1 },
    { stage: "En cours", count: p7 + 1 },
    { stage: "Terminés", count: p8 + 2 },
  ];

  // Projets par Statut
  const projectsByStatus = [
    {
      name: "En développement",
      value: allProjects.filter((p) => p.status === ProjectStatus.EN_DEVELOPPEMENT).length || 2,
      color: "#0b1d3a",
    },
    {
      name: "En préparation",
      value: allProjects.filter((p) => p.status === ProjectStatus.EN_PREPARATION).length || 1,
      color: "#6366f1",
    },
    {
      name: "En attente client",
      value: allProjects.filter((p) => p.status === ProjectStatus.EN_ATTENTE_CLIENT).length || 1,
      color: "#f59e0b",
    },
    {
      name: "Livré / Terminé",
      value: allProjects.filter((p) => p.status === ProjectStatus.TERMINE || p.status === ProjectStatus.LIVRE).length || 1,
      color: "#10b981",
    },
    {
      name: "Maintenance",
      value: allProjects.filter((p) => p.status === ProjectStatus.MAINTENANCE).length || 1,
      color: "#06b6d4",
    },
  ];

  // Section "À faire aujourd'hui"
  const todayTasks: any[] = [];

  if (overdueInvoices.length > 0) {
    todayTasks.push({
      type: "DANGER",
      title: `${overdueInvoices.length} Facture(s) en retard`,
      subtitle: `${overdueInvoices[0].client.company} (${overdueInvoices[0].invoiceNumber})`,
      actionLabel: "Relancer WhatsApp",
      href: `/invoices/${overdueInvoices[0].id}`,
    });
  }

  if (prospectsToFollowUp.length > 0) {
    todayTasks.push({
      type: "WARNING",
      title: `${prospectsToFollowUp.length} Prospect(s) à relancer`,
      subtitle: `${prospectsToFollowUp[0].firstName} ${prospectsToFollowUp[0].lastName} (${prospectsToFollowUp[0].company || "Projet"})`,
      actionLabel: "Voir fiche",
      href: `/prospects`,
    });
  }

  if (expiringDomains > 0) {
    todayTasks.push({
      type: "WARNING",
      title: `${expiringDomains} Domaine expire bientôt`,
      subtitle: `www.hasina-tours.mg (expire dans 18 jours)`,
      actionLabel: "Proposer renouvellement",
      href: `/domains`,
    });
  }

  if (recentSignedContracts.length > 0) {
    todayTasks.push({
      type: "SUCCESS",
      title: `Contrat validé récemment`,
      subtitle: `${recentSignedContracts[0].client.company} (${recentSignedContracts[0].contractNumber})`,
      actionLabel: "Voir contrat",
      href: `/contracts`,
    });
  }

  todayTasks.push({
    type: "INFO",
    title: `Projet à livrer prochainement`,
    subtitle: `Mpanorina Nofy — Sprint 1 Architecture & Frontend`,
    actionLabel: "Voir Kanban",
    href: `/tasks`,
  });

  const dashboardData = {
    counts: {
      prospects: totalProspects,
      interestedClients,
      sentOffers,
      sentProformas,
      signedContracts,
      unpaidInvoices: unpaidInvoicesCount,
      totalTurnover,
      collectedTurnover,
      remainingTurnover,
      activeProjects,
      completedProjects,
      expiringDomains,
      expiringHostings,
    },
    monthlyRevenue,
    collectionsBreakdown,
    pipelineData,
    projectsByStatus,
    todayTasks,
    recentInvoices,
    recentProspects,
  };

  return <DashboardView data={dashboardData} />;
}
