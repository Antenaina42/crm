import { prisma } from "./prisma";
import { logActivity } from "./audit";
import { InvoiceStatus, InvoiceType, ProjectStatus, TaskPriority, NotificationType, AssetStatus } from "@prisma/client";
import { numberToFrenchWords } from "./formatters";

/**
 * Automatisation lors de l'acceptation d'une offre commerciale
 */
export async function onOfferAccepted(offerId: string) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      prospect: true,
      client: true,
      items: true,
    },
  });

  if (!offer) return;

  // 1. Convertir le prospect en client si ce n'est pas déjà un client
  let clientId = offer.clientId;
  if (!clientId && offer.prospect) {
    const newClient = await prisma.client.create({
      data: {
        name: `${offer.prospect.firstName} ${offer.prospect.lastName}`,
        company: offer.prospect.company || `${offer.prospect.firstName} ${offer.prospect.lastName}`,
        phone: offer.prospect.phone,
        whatsapp: offer.prospect.whatsapp || offer.prospect.phone.replace(/[^0-9]/g, ""),
        email: offer.prospect.email || "client@m-itlevelup.com",
        address: offer.prospect.address,
        city: offer.prospect.city || "Antananarivo",
        notes: `Converti depuis le prospect ${offer.prospect.firstName} ${offer.prospect.lastName}`,
      },
    });
    clientId = newClient.id;

    // Mettre à jour l'offre et le prospect
    await prisma.offer.update({
      where: { id: offerId },
      data: { clientId: newClient.id, status: "ACCEPTEE" },
    });

    await prisma.prospect.update({
      where: { id: offer.prospect.id },
      data: { status: "GAGNE", convertedClientId: newClient.id },
    });

    await logActivity({
      clientId: newClient.id,
      action: "PROSPECT_CONVERTI",
      details: `Prospect converti en client suite à l'acceptation de l'offre ${offer.offerNumber}`,
      entityType: "Offer",
      entityId: offer.id,
    });
  } else {
    await prisma.offer.update({
      where: { id: offerId },
      data: { status: "ACCEPTEE" },
    });
  }

  if (!clientId) return;

  // 2. Créer automatiquement le projet
  const countProjects = await prisma.project.count();
  const projectNumber = `PRJ-2026-${String(countProjects + 1).padStart(4, "0")}`;

  const project = await prisma.project.create({
    data: {
      projectNumber,
      title: offer.title,
      clientId,
      type: "Projet Web & Digital",
      description: `Projet initié depuis l'offre ${offer.offerNumber}`,
      status: ProjectStatus.A_DEMARRER,
      totalAmount: offer.total,
      depositAmount: offer.depositAmount,
      remainderAmount: offer.remainderAmount,
      startDate: new Date(),
    },
  });

  // 3. Créer une tâche de démarrage pour le chef de projet
  await prisma.task.create({
    data: {
      projectId: project.id,
      title: `Cadrage et lancement du projet ${project.title}`,
      description: "Prendre contact avec le client pour recueillir les contenus, logos et spécifications.",
      priority: TaskPriority.URGENTE,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  // 4. Générer automatiquement le contrat
  const countContracts = await prisma.contract.count();
  const contractNumber = `CTR-2026-${String(countContracts + 1).padStart(4, "0")}`;
  const template = await prisma.contractTemplate.findFirst({
    where: { active: true },
  });

  const client = await prisma.client.findUnique({ where: { id: clientId } });

  let contractContent = template?.content || "Contrat de réalisation de projet digital.";
  contractContent = contractContent
    .replace(/\{\{client_name\}\}/g, client?.name || "")
    .replace(/\{\{company_name\}\}/g, client?.company || "")
    .replace(/\{\{project_name\}\}/g, project.title)
    .replace(/\{\{amount\}\}/g, offer.total.toLocaleString("fr-FR"))
    .replace(/\{\{deposit_amount\}\}/g, offer.depositAmount.toLocaleString("fr-FR"))
    .replace(/\{\{remainder_amount\}\}/g, offer.remainderAmount.toLocaleString("fr-FR"))
    .replace(/\{\{delivery_date\}\}/g, "30 jours après réception de l'acompte");

  const contract = await prisma.contract.create({
    data: {
      contractNumber,
      title: `Contrat de prestation — ${offer.title}`,
      clientId,
      projectId: project.id,
      templateId: template?.id,
      content: contractContent,
      totalAmount: offer.total,
      depositAmount: offer.depositAmount,
      remainderAmount: offer.remainderAmount,
      status: "EN_ATTENTE_SIGNATURE",
    },
  });

  // 5. Préparer la facture d'acompte de 50%
  const countInvoices = await prisma.invoice.count();
  const invoiceNumber = `FAC-2026-${String(countInvoices + 1).padStart(4, "0")}`;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientId,
      type: InvoiceType.ACOMPTE,
      date: new Date(),
      dueDate,
      subtotal: offer.total,
      vatRate: 0,
      vatAmount: 0,
      total: offer.total,
      depositPercent: offer.depositPercent,
      depositAmount: offer.depositAmount,
      remainingAmount: offer.depositAmount, // Montant à régler pour l'acompte
      currency: offer.currency || "Ar",
      amountInWords: numberToFrenchWords(offer.total, offer.currency || "Ar"),
      status: InvoiceStatus.ENVOYEE,
      paymentTerms: `Acompte de ${offer.depositPercent}% requis au démarrage. Reste dû à la livraison : ${offer.remainderAmount.toLocaleString("fr-FR")} ${offer.currency || "Ar"}.`,
      items: {
        create: offer.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        })),
      },
    },
  });

  // 6. Notification pour l'équipe
  await prisma.notification.create({
    data: {
      title: "Nouvelle opportunité gagnée ! 🎉",
      message: `L'offre ${offer.offerNumber} (${offer.title}) a été acceptée. Projet ${projectNumber} et Facture ${invoiceNumber} créés.`,
      type: NotificationType.OFFRE,
      link: `/projects`,
    },
  });

  return { project, contract, invoice };
}

/**
 * Automatisation lors de la signature électronique d'un contrat
 */
export async function onContractSigned(contractId: string, signatureInfo: {
  signerName: string;
  ipAddress?: string;
  signatureDataUrl: string;
  signatureHash: string;
}) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { client: true, project: true },
  });

  if (!contract) return;

  const now = new Date();

  // 1. Mettre à jour le contrat
  await prisma.contract.update({
    where: { id: contractId },
    data: {
      status: "SIGNE",
      signedAt: now,
      signerName: signatureInfo.signerName,
      signerIp: signatureInfo.ipAddress || "127.0.0.1",
      signatureHash: signatureInfo.signatureHash,
      signatureDataUrl: signatureInfo.signatureDataUrl,
    },
  });

  // 2. Créer l'enregistrement de signature avec audit
  await prisma.signature.create({
    data: {
      contractId,
      signerName: signatureInfo.signerName,
      ipAddress: signatureInfo.ipAddress || "127.0.0.1",
      documentHash: signatureInfo.signatureHash,
      signatureData: signatureInfo.signatureDataUrl,
      signedAt: now,
    },
  });

  // 3. Activer le statut du projet
  if (contract.projectId) {
    await prisma.project.update({
      where: { id: contract.projectId },
      data: { status: ProjectStatus.EN_PREPARATION },
    });
  }

  // 4. Notification & Journal
  await prisma.notification.create({
    data: {
      title: "Contrat signé électroniquement ✍️",
      message: `${signatureInfo.signerName} a signé le contrat ${contract.contractNumber} (${contract.title}).`,
      type: NotificationType.SIGNATURE,
      link: `/contracts`,
    },
  });

  await logActivity({
    clientId: contract.clientId,
    action: "CONTRAT_SIGNE",
    details: `Contrat ${contract.contractNumber} signé par ${signatureInfo.signerName} (Hash: ${signatureInfo.signatureHash.substring(0, 16)}...)`,
    entityType: "Contract",
    entityId: contract.id,
  });
}

/**
 * Automatisation lors de l'enregistrement d'un paiement
 */
export async function onPaymentRecorded(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { invoice: true, client: true },
  });

  if (!payment || !payment.invoice) return;

  // Calculer la somme totale déjà payée pour cette facture
  const totalPaidAgg = await prisma.payment.aggregate({
    where: { invoiceId: payment.invoiceId },
    _sum: { amount: true },
  });

  const totalPaid = totalPaidAgg._sum.amount || 0;
  const invoiceTargetAmount = payment.invoice.type === InvoiceType.ACOMPTE
    ? payment.invoice.depositAmount
    : payment.invoice.total;

  const remaining = Math.max(0, invoiceTargetAmount - totalPaid);

  let newStatus = payment.invoice.status;
  if (remaining <= 0) {
    newStatus = InvoiceStatus.PAYEE;
  } else if (totalPaid > 0) {
    newStatus = InvoiceStatus.PARTIELLEMENT_PAYEE;
  }

  await prisma.invoice.update({
    where: { id: payment.invoiceId },
    data: {
      status: newStatus,
      remainingAmount: remaining,
    },
  });

  await prisma.notification.create({
    data: {
      title: "Paiement reçu 💳",
      message: `Paiement de ${payment.amount.toLocaleString("fr-FR")} Ar enregistré pour la facture ${payment.invoice.invoiceNumber}.`,
      type: NotificationType.PAIEMENT,
      link: `/invoices`,
    },
  });

  await logActivity({
    clientId: payment.clientId,
    action: "PAIEMENT_ENREGISTRE",
    details: `Encaissement de ${payment.amount.toLocaleString("fr-FR")} Ar via ${payment.method} pour ${payment.invoice.invoiceNumber}`,
    entityType: "Payment",
    entityId: payment.id,
  });
}
