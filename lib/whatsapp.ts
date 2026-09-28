/**
 * Générateur de messages WhatsApp professionnels pour M-It LevelUp
 */

export function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  // Si commence par 0, remplacer par 261 (Madagascar)
  if (cleaned.startsWith("0")) {
    cleaned = "261" + cleaned.slice(1);
  } else if (!cleaned.startsWith("261") && cleaned.length === 9) {
    cleaned = "261" + cleaned;
  }
  return cleaned;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}

export function renderWhatsAppTemplate(
  templateContent: string,
  variables: Record<string, string | number | undefined | null>
): string {
  let result = templateContent;
  for (const [key, value] of Object.entries(variables)) {
    const stringVal = value !== undefined && value !== null ? String(value) : "";
    result = result.split(`{{${key}}}`).join(stringVal);
  }
  return result;
}

export function generateOfferMessage(params: {
  clientName: string;
  projectName: string;
  totalAmount: string;
  depositAmount?: string;
  link?: string;
  customTemplate?: string;
}): string {
  if (params.customTemplate) {
    return renderWhatsAppTemplate(params.customTemplate, {
      name: params.clientName,
      project: params.projectName,
      amount: params.totalAmount,
      deposit: params.depositAmount || "",
      link: params.link || "",
    });
  }

  return `Bonjour ${params.clientName},

Nous avons le grand plaisir de vous transmettre notre proposition commerciale concernant le projet *${params.projectName}*.

💰 *Montant global* : ${params.totalAmount}${params.depositAmount ? `\n📌 *Acompte prévu (50%)* : ${params.depositAmount}` : ""}
${params.link ? `\n📄 *Consulter votre offre en ligne* :\n${params.link}` : ""}

Nous restons à votre entière disposition pour échanger sur vos besoins et démarrer ce projet.

Bien cordialement,
*Miora Antenaina RAZAKATIANA*
*M-It LevelUp* — Agence Digitale
📞 +261 34 54 038 98 | 🌐 https://m-itlevelup.com/`;
}

export function generateInvoiceMessage(params: {
  clientName: string;
  invoiceNumber: string;
  totalAmount: string;
  dueAmount: string;
  link?: string;
  customTemplate?: string;
}): string {
  if (params.customTemplate) {
    return renderWhatsAppTemplate(params.customTemplate, {
      name: params.clientName,
      invoice_number: params.invoiceNumber,
      amount: params.totalAmount,
      due_amount: params.dueAmount,
      link: params.link || "",
    });
  }

  return `Bonjour ${params.clientName},

Veuillez trouver les détails de votre facture *${params.invoiceNumber}*.

💵 *Montant total* : ${params.totalAmount}
👉 *Montant à régler* : *${params.dueAmount}*

Règlements acceptés :
- MVola : +261 34 54 038 98 (Miora Antenaina RAZAKATIANA)
- Virement bancaire BNI Madagascar
${params.link ? `\n🔗 *Voir la facture officielle* :\n${params.link}` : ""}

Merci pour votre confiance !
*M-It LevelUp*`;
}

export function generateContractMessage(params: {
  clientName: string;
  projectName: string;
  signLink: string;
  customTemplate?: string;
}): string {
  if (params.customTemplate) {
    return renderWhatsAppTemplate(params.customTemplate, {
      name: params.clientName,
      project: params.projectName,
      link: params.signLink,
    });
  }

  return `Bonjour ${params.clientName},

Le contrat officiel pour le projet *${params.projectName}* a été préparé et est prêt pour signature électronique.

✍️ *Signer directement en ligne (sécurisé)* :
${params.signLink}

La signature prend moins d'une minute depuis votre smartphone ou ordinateur.

Bien cordialement,
*M-It LevelUp*`;
}

export function generateRenewalMessage(params: {
  clientName: string;
  domainName: string;
  expirationDate: string;
  amount: string;
  customTemplate?: string;
}): string {
  if (params.customTemplate) {
    return renderWhatsAppTemplate(params.customTemplate, {
      name: params.clientName,
      domain: params.domainName,
      date: params.expirationDate,
      amount: params.amount,
    });
  }

  return `Bonjour ${params.clientName},

Votre hébergement et/ou nom de domaine *${params.domainName}* arrive à expiration le *${params.expirationDate}*.

Afin d'éviter toute interruption de vos services et de votre site web, nous vous proposons son renouvellement annuel pour *${params.amount}*.

Souhaitez-vous que nous procédions au renouvellement ?
Nous restons disponibles.

Bien cordialement,
*M-It LevelUp*`;
}

export function generateReminderMessage(params: {
  clientName: string;
  invoiceNumber: string;
  remainingAmount: string;
  dueDate: string;
  link?: string;
  customTemplate?: string;
}): string {
  if (params.customTemplate) {
    return renderWhatsAppTemplate(params.customTemplate, {
      name: params.clientName,
      invoice_number: params.invoiceNumber,
      remainder: params.remainingAmount,
      date: params.dueDate,
      link: params.link || "",
    });
  }

  return `Bonjour ${params.clientName},

Sauf erreur de notre part, la facture *${params.invoiceNumber}* d'un montant de *${params.remainingAmount}* arrivée à échéance le ${params.dueDate} est toujours en attente de règlement.

Pourriez-vous nous confirmer l'état de votre règlement s'il vous plaît ?
${params.link ? `\nFacture : ${params.link}` : ""}

Merci beaucoup pour votre collaboration,
*M-It LevelUp*`;
}
