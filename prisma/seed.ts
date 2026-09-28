import { PrismaClient, RoleType, ProspectStatus, ClientStatus, OfferStatus, ProformaStatus, InvoiceStatus, InvoiceType, PaymentMethod, ContractStatus, ProjectStatus, TaskPriority, TaskStatus, AssetStatus, ExpenseCategory, NotificationType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du remplissage de la base de données M-It LevelUp...");

  // Nettoyage préalable
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.task.deleteMany();
  await prisma.signature.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.proformaItem.deleteMany();
  await prisma.proforma.deleteMany();
  await prisma.offerItem.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.contractTemplate.deleteMany();
  await prisma.project.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.hosting.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.document.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.prospect.deleteMany();
  await prisma.client.deleteMany();
  await prisma.offerCatalog.deleteMany();
  await prisma.messageTemplate.deleteMany();
  await prisma.companySettings.deleteMany();
  await prisma.user.deleteMany();

  // 1. Paramètres Entreprise M-It LevelUp
  await prisma.companySettings.create({
    data: {
      companyName: "M-It LevelUp",
      managerName: "Miora Antenaina RAZAKATIANA",
      nif: "5019189714",
      stat: "62011 11 2025 0 03126",
      email: "razakatiana.antenaina@yahoo.com",
      phone: "+261 34 54 038 98",
      website: "https://m-itlevelup.com/",
      address: "Lot : D79 Soalazaina Ambatolampy",
      city: "Antananarivo 102",
      country: "Madagascar",
      defaultVatRate: 0,
      currency: "Ar",
      invoicePrefix: "FAC-2026-",
      proformaPrefix: "PRO-2026-",
      contractPrefix: "CTR-2026-",
      termsAndConditions: "TVA non applicable – entreprise non assujettie à la TVA. Règlement par virement bancaire ou Mobile Money (MVola / Orange Money). Validité de l'offre : 30 jours.",
    },
  });

  // 2. Utilisateurs & Équipe
  const passwordHash = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Miora Antenaina RAZAKATIANA",
      email: "admin@m-itlevelup.com",
      password: passwordHash,
      role: RoleType.SUPER_ADMIN,
      phone: "+261 34 54 038 98",
      active: true,
    },
  });

  const commercial = await prisma.user.create({
    data: {
      name: "Sarah Ramanantsoa",
      email: "sarah.commercial@m-itlevelup.com",
      password: passwordHash,
      role: RoleType.COMMERCIAL,
      phone: "+261 34 11 222 33",
      active: true,
    },
  });

  const devLead = await prisma.user.create({
    data: {
      name: "Faly Rakotondrabe",
      email: "faly.dev@m-itlevelup.com",
      password: passwordHash,
      role: RoleType.PROJECT_MANAGER,
      phone: "+261 33 44 555 66",
      active: true,
    },
  });

  const accountant = await prisma.user.create({
    data: {
      name: "Volana Randria",
      email: "comptabilite@m-itlevelup.com",
      password: passwordHash,
      role: RoleType.ACCOUNTANT,
      phone: "+261 32 77 888 99",
      active: true,
    },
  });

  // 3. Catalogue d'Offres
  await prisma.offerCatalog.createMany({
    data: [
      {
        name: "Création Site Vitrine Professionnel",
        description: "Site vitrine moderne, responsive, optimisé SEO avec page de contact, présentation des services et galerie.",
        category: "Web",
        basePrice: 950000,
        duration: "2 à 3 semaines",
        included: "Design sur mesure, responsive mobile/tablette, SEO de base, formulaire de contact, intégration WhatsApp.",
        options: "Blog (+200 000 Ar), Multilingue (+300 000 Ar).",
        conditions: "Acompte 50% au lancement, 50% à la livraison.",
      },
      {
        name: "Création Site E-commerce / Boutique en Ligne",
        description: "Plateforme de vente en ligne complète avec panier, gestion des stocks, passerelles de paiement (MVola, carte) et interface d'administration.",
        category: "E-Commerce",
        basePrice: 1850000,
        duration: "4 à 6 semaines",
        included: "Catalogue produits illimité, passerelle de paiement local/international, gestion des commandes et factures, notifications.",
        options: "Application mobile e-commerce (+1 500 000 Ar).",
        conditions: "Acompte 50%, solde avant mise en production.",
      },
      {
        name: "Développement Application Web Sur-Mesure",
        description: "Architecture technique complète (UX/UI, Frontend, Backend, Base de données), gestion tableaux de bord, rapports, documents, notifications.",
        category: "Logiciel Métier",
        basePrice: 2700000,
        duration: "6 à 8 semaines",
        included: "UX/UI design moderne, Frontend Next.js/React, Backend API sécurisé, base de données optimisée, rôles utilisateurs RBAC.",
        options: "Module IA générative (+800 000 Ar), synchronisation API tierce (+500 000 Ar).",
        conditions: "50% à la commande, 50% à la livraison.",
      },
      {
        name: "Développement Application Mobile (iOS & Android)",
        description: "Application mobile native ou hybride réactive avec synchronisation temps réel, notifications push et mode hors-ligne.",
        category: "Mobile",
        basePrice: 3500000,
        duration: "8 à 10 semaines",
        included: "Publication Google Play Store & Apple App Store, backend API, authentification, notifications push.",
        options: "Support tablette (+500 000 Ar).",
        conditions: "40% à la signature, 30% à mi-parcours, 30% à la validation.",
      },
      {
        name: "Hébergement Cloud Haute Performance & Sécurité",
        description: "Hébergement cloud infogéré avec sauvegardes quotidiennes, certificat SSL gratuit et surveillance 24/7.",
        category: "Infrastructure",
        basePrice: 300000,
        duration: "1 an (renouvelable)",
        included: "Serveur NVMe ultra-rapide, SSL Let's Encrypt, backups automatiques, bande passante illimitée.",
        options: "IP dédiée (+150 000 Ar/an).",
        conditions: "Facturation annuelle d'avance.",
      },
      {
        name: "Enregistrement & Gestion Nom de Domaine",
        description: "Réservation de votre nom de domaine (.com, .mg, .net, .org) avec gestion DNS sécurisée et redirection.",
        category: "Infrastructure",
        basePrice: 300000,
        duration: "1 an (renouvelable)",
        included: "Protection WHOIS, DNS Anycast rapide, support technique.",
        options: "Domaine .mg officiel (+200 000 Ar).",
        conditions: "Paiement 100% à la commande.",
      },
      {
        name: "Pack Digital Complet (Site + Hébergement + Domaine + SEO)",
        description: "Solution tout-en-un clé en main pour propulser votre entreprise sur internet sans soucis techniques.",
        category: "Pack",
        basePrice: 3200000,
        duration: "4 semaines",
        included: "Site internet cinématique, domaine offert 1 an, hébergement haute vitesse 1 an, audit & optimisation SEO.",
        options: "Maintenance annuelle incluse (+600 000 Ar).",
        conditions: "50% acompte, 50% solde.",
      },
    ],
  });

  // 4. Modèles de Contrats
  await prisma.contractTemplate.createMany({
    data: [
      {
        name: "Contrat de Conception de Site Internet",
        type: "SITE_WEB",
        content: `ENTRE LES SOUSSIGNÉS :
L'agence M-It LevelUp, représentée par Miora Antenaina RAZAKATIANA, NIF 5019189714, STAT 62011 11 2025 0 03126, sise à Lot D79 Soalazaina Ambatolampy, Antananarivo 102 Madagascar.
ET :
Le Client {{client_name}}, représentant la société {{company_name}}.

ARTICLE 1 — OBJET DU CONTRAT
Le présent contrat a pour objet la conception, le développement et la mise en ligne du projet : {{project_name}}.

ARTICLE 2 — PRESTATIONS INCLUSES
- Conception graphique et interface UI/UX moderne et responsive.
- Développement technique selon les standards du web actuel.
- Configuration du nom de domaine et de l'hébergement serveur.
- Période de garantie et corrections de 30 jours après livraison.

ARTICLE 3 — CONDITIONS FINANCIÈRES
Le montant total de la prestation s'élève à {{amount}} Ariary.
Modalités de paiement :
- Acompte de démarrage : {{deposit_amount}} Ariary (50%) à la signature du contrat.
- Reste dû à la livraison : {{remainder_amount}} Ariary (50%).
TVA non applicable – entreprise non assujettie à la TVA.

ARTICLE 4 — DÉLAIS D'EXÉCUTION
Le délai prévisionnel de livraison est fixé au {{delivery_date}}.`,
        variables: "{{client_name}}, {{company_name}}, {{project_name}}, {{amount}}, {{deposit_amount}}, {{remainder_amount}}, {{delivery_date}}",
      },
      {
        name: "Contrat de Développement Application Web",
        type: "APPLICATION_WEB",
        content: `CONTRAT DE DÉVELOPPEMENT D'APPLICATION WEB SUR-MESURE
Prestataire : M-It LevelUp (Miora Antenaina RAZAKATIANA)
Client : {{client_name}} ({{company_name}})

Projet : {{project_name}}
Montant global : {{amount}} Ar
Acompte : {{deposit_amount}} Ar
Reste à payer : {{remainder_amount}} Ar
Livraison : {{delivery_date}}

Architecture technique complète, gestion des rôles, tableau de bord, base de données MySQL et sécurisation des API.`,
        variables: "{{client_name}}, {{company_name}}, {{project_name}}, {{amount}}, {{deposit_amount}}, {{remainder_amount}}, {{delivery_date}}",
      },
      {
        name: "Contrat d'Hébergement & Maintenance Annuelle",
        type: "MAINTENANCE",
        content: `CONTRAT D'HÉBERGEMENT CLOUD ET DE MAINTENANCE ANNUELLE
Prestataire : M-It LevelUp
Client : {{client_name}} - {{company_name}}
Domaine couvert : {{domain_name}}
Montant annuel : {{amount}} Ar
Garantie de temps de fonctionnement, sauvegardes automatiques hebdomadaires et mises à jour de sécurité.`,
        variables: "{{client_name}}, {{company_name}}, {{domain_name}}, {{amount}}",
      },
    ],
  });

  // 5. Modèles de Messages WhatsApp
  await prisma.messageTemplate.createMany({
    data: [
      {
        code: "WHATSAPP_OFFER",
        name: "Proposition commerciale",
        type: "WHATSAPP",
        content: `Bonjour {{name}},

Nous avons le plaisir de vous transmettre notre proposition commerciale concernant le projet *{{project}}*.

Vous pouvez consulter votre offre détaillée directement sur ce lien :
{{link}}

Nous restons à votre entière disposition pour tout échange ou précision.

Cordialement,
*Miora Antenaina RAZAKATIANA*
*M-It LevelUp* — Agence Digitale
📞 +261 34 54 038 98 | 🌐 https://m-itlevelup.com/`,
      },
      {
        code: "WHATSAPP_INVOICE",
        name: "Envoi de facture",
        type: "WHATSAPP",
        content: `Bonjour {{name}},

Veuillez trouver ci-joint votre facture *{{invoice_number}}* d'un montant de *{{amount}} Ariary*.

Acompte / montant attendu : *{{due_amount}} Ariary*.
Règlement possible par MVola (+261 34 54 038 98) ou virement bancaire.

Lien de consultation sécurisé :
{{link}}

Merci pour votre confiance !
*M-It LevelUp*`,
      },
      {
        code: "WHATSAPP_CONTRACT",
        name: "Contrat à signer",
        type: "WHATSAPP",
        content: `Bonjour {{name}},

Le contrat pour le projet *{{project}}* est prêt pour signature électronique.
Vous pouvez le signer en quelques secondes depuis votre téléphone ou ordinateur ici :
{{link}}

Bien cordialement,
*M-It LevelUp*`,
      },
      {
        code: "WHATSAPP_RENEWAL",
        name: "Renouvellement Domaine / Hébergement",
        type: "WHATSAPP",
        content: `Bonjour {{name}},

Votre hébergement et/ou nom de domaine *{{domain}}* arrive à échéance le *{{date}}*.
Nous vous proposons son renouvellement pour un montant de *{{amount}} Ariary*.

Souhaitez-vous que nous procédions au renouvellement ?
Nous restons à votre écoute.

Bien cordialement,
*M-It LevelUp*`,
      },
      {
        code: "WHATSAPP_REMINDER",
        name: "Relance facture impayée",
        type: "WHATSAPP",
        content: `Bonjour {{name}},

Sauf erreur de notre part, la facture *{{invoice_number}}* d'un montant restant de *{{remainder}} Ariary* arrivée à échéance le {{date}} est toujours en attente de règlement.

Pourriez-vous nous confirmer l'état de votre règlement s'il vous plaît ?
Consulter la facture : {{link}}

Merci pour votre collaboration,
*M-It LevelUp*`,
      },
    ],
  });

  // 6. Clients Réels & Interconnectés
  // Client 1 : Mpanorina Nofy (exactement la facture fournie !)
  const clientMpanorina = await prisma.client.create({
    data: {
      name: "Direction Mpanorina Nofy",
      company: "Mpanorina Nofy",
      phone: "+261 34 00 123 45",
      whatsapp: "261340012345",
      email: "contact@mpanorinanofy.com",
      address: "Lot II M 45 Ankadifotsy",
      city: "Antananarivo",
      nif: "4001928374",
      stat: "62011 11 2024 0 01123",
      website: "https://www.mpanorinanofy.com",
      notes: "Plateforme web et CRM de gestion d'activités associatives et d'opportunités de formation.",
      status: ClientStatus.ACTIF,
      createdAt: new Date("2026-08-15"),
    },
  });

  // Facture Mpanorina Nofy conforme au PDF officiel
  const invoiceMpanorina = await prisma.invoice.create({
    data: {
      invoiceNumber: "FAC-2026-0001",
      baseNumber: "MPN1056233",
      clientId: clientMpanorina.id,
      type: InvoiceType.ACOMPTE,
      date: new Date("2026-09-05"),
      dueDate: new Date("2026-09-20"),
      subtotal: 1950000,
      vatRate: 0,
      vatAmount: 0,
      total: 1950000,
      depositPercent: 50,
      depositAmount: 1350000,
      remainingAmount: 1350000,
      amountInWords: "un million neuf cent cinquante mille Ariary",
      status: InvoiceStatus.PARTIELLEMENT_PAYEE,
      paymentTerms: "Reste à payer : 50% de somme : 1 350 000 Ar à la livraison finale.",
      notes: "Agence de développement de site / application web. Lot : D79 Soalazaina Ambatolampy Antananarivo 102 Madagascar",
      signatureMiora: true,
      signatureClient: true,
      items: {
        create: [
          {
            description: "Nom de domaine: www.mpanorinanofy.com\nOffre annuelle",
            quantity: 1,
            unitPrice: 300000,
            total: 300000,
          },
          {
            description: "Hébèrgement de l'application\nOffre annuelle",
            quantity: 1,
            unitPrice: 300000,
            total: 300000,
          },
          {
            description: "50% Avance → Développement application web : Architecture technique complète (UX/UI, Frontend, Backend, Base de données), Gestion tableaux de bord, Rapports, documents, notifications et messagerie Conception site internet interface Moderne et cinematique( Fonctionnalité , design, SEO), responsive(Desktop, Mobile et Tablette).",
            quantity: 1,
            unitPrice: 1350000,
            total: 1350000,
          },
        ],
      },
    },
  });

  // Paiement de l'acompte pour Mpanorina Nofy
  await prisma.payment.create({
    data: {
      paymentNumber: "PAI-2026-0001",
      invoiceId: invoiceMpanorina.id,
      clientId: clientMpanorina.id,
      amount: 1350000,
      date: new Date("2026-09-08"),
      method: PaymentMethod.MVOLA,
      reference: "MVOLA-TX-98745213",
      notes: "Paiement 50% avance développement application web et hébergement annuel.",
    },
  });

  // Projet Mpanorina Nofy
  const projectMpanorina = await prisma.project.create({
    data: {
      projectNumber: "PRJ-2026-0001",
      title: "Application Web & Plateforme Numérique Mpanorina Nofy",
      clientId: clientMpanorina.id,
      type: "Application Web / CRM",
      description: "Architecture complète, tableaux de bord, gestion des adhérents, rapports et notifications.",
      startDate: new Date("2026-09-08"),
      targetDeliveryDate: new Date("2026-10-15"),
      status: ProjectStatus.EN_DEVELOPPEMENT,
      managerId: devLead.id,
      totalAmount: 2700000,
      depositAmount: 1350000,
      remainderAmount: 1350000,
    },
  });

  // Tâches Mpanorina Nofy
  await prisma.task.createMany({
    data: [
      {
        projectId: projectMpanorina.id,
        title: "Maquettes UI/UX & validation client",
        description: "Figma des tableaux de bord et de l'interface mobile.",
        priority: TaskPriority.IMPORTANTE,
        status: TaskStatus.TERMINE,
        dueDate: new Date("2026-09-15"),
        assigneeId: devLead.id,
      },
      {
        projectId: projectMpanorina.id,
        title: "Développement Frontend Next.js & composants",
        description: "Création des vues de gestion, filtres et intégration Tailwind.",
        priority: TaskPriority.URGENTE,
        status: TaskStatus.EN_COURS,
        dueDate: new Date("2026-09-28"),
        assigneeId: devLead.id,
      },
      {
        projectId: projectMpanorina.id,
        title: "API Backend & Base de données MySQL",
        description: "Routes d'authentification, CRUD adhérents et génération de rapports.",
        priority: TaskPriority.IMPORTANTE,
        status: TaskStatus.EN_COURS,
        dueDate: new Date("2026-10-02"),
        assigneeId: devLead.id,
      },
      {
        projectId: projectMpanorina.id,
        title: "Tests finaux & Recette utilisateur",
        description: "Validation sur mobile et desktop avec le client.",
        priority: TaskPriority.NORMALE,
        status: TaskStatus.A_FAIRE,
        dueDate: new Date("2026-10-12"),
        assigneeId: devLead.id,
      },
    ],
  });

  // Contrat Mpanorina Nofy
  await prisma.contract.create({
    data: {
      contractNumber: "CTR-2026-0001",
      title: "Contrat de Développement Web — Mpanorina Nofy",
      clientId: clientMpanorina.id,
      projectId: projectMpanorina.id,
      content: "Contrat officiel de prestation digitale entre M-It LevelUp et Mpanorina Nofy.",
      totalAmount: 2700000,
      depositAmount: 1350000,
      remainderAmount: 1350000,
      startDate: new Date("2026-09-08"),
      deliveryDate: new Date("2026-10-15"),
      status: ContractStatus.SIGNE,
      signedAt: new Date("2026-09-07T14:32:00Z"),
      signerName: "Mpanorina Nofy (Direction)",
      signerIp: "102.16.24.89",
      signatureHash: "CCE77EA165994C947265FBA93E",
      signatureDataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==",
    },
  });

  // Domaine & Hébergement Mpanorina Nofy
  await prisma.domain.create({
    data: {
      clientId: clientMpanorina.id,
      domainName: "www.mpanorinanofy.com",
      extension: ".com",
      registrar: "Hostinger International",
      purchaseDate: new Date("2026-09-05"),
      expirationDate: new Date("2027-09-05"),
      costPrice: 65000,
      sellingPrice: 300000,
      status: AssetStatus.ACTIF,
      autoRenew: true,
    },
  });

  await prisma.hosting.create({
    data: {
      clientId: clientMpanorina.id,
      domainName: "www.mpanorinanofy.com",
      provider: "Hostinger Cloud",
      plan: "Cloud Startup NVMe",
      startDate: new Date("2026-09-05"),
      expirationDate: new Date("2027-09-05"),
      costPrice: 120000,
      sellingPrice: 300000,
      margin: 180000,
      status: AssetStatus.ACTIF,
    },
  });

  // Client 2 : Hasina Madagascar Tours
  const clientHasina = await prisma.client.create({
    data: {
      name: "Hasina Rakoto",
      company: "Hasina Madagascar Tours",
      phone: "+261 34 88 999 00",
      whatsapp: "261348899900",
      email: "hasina@madagascar-tours.mg",
      address: "Enceinte Hôtel Colbert, Antaninarenina",
      city: "Antananarivo",
      nif: "3001847291",
      stat: "79110 11 2023 0 00451",
      website: "https://www.hasina-tours.mg",
      notes: "Agence réceptive de voyages touristiques à Madagascar. Circuits Sud, Tsingy et Sainte-Marie.",
      status: ClientStatus.ACTIF,
      createdAt: new Date("2026-07-10"),
    },
  });

  const invoiceHasina = await prisma.invoice.create({
    data: {
      invoiceNumber: "FAC-2026-0002",
      baseNumber: "HMT20260715",
      clientId: clientHasina.id,
      type: InvoiceType.STANDARD,
      date: new Date("2026-07-20"),
      dueDate: new Date("2026-08-05"),
      subtotal: 2400000,
      vatRate: 0,
      vatAmount: 0,
      total: 2400000,
      depositPercent: 100,
      depositAmount: 2400000,
      remainingAmount: 0,
      amountInWords: "deux millions quatre cent mille Ariary",
      status: InvoiceStatus.PAYEE,
      paymentTerms: "Paiement 100% effectué par virement bancaire BNI Madagascar.",
      notes: "Site vitrine multilingue et système de réservation de circuits avec paiement sécurisé.",
      signatureMiora: true,
      signatureClient: true,
      items: {
        create: [
          {
            description: "Conception Site Web Agence de Tourisme Multilingue (Français, Anglais)",
            quantity: 1,
            unitPrice: 1800000,
            total: 1800000,
          },
          {
            description: "Module de réservation en ligne & fiches circuits personnalisées",
            quantity: 1,
            unitPrice: 600000,
            total: 600000,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      paymentNumber: "PAI-2026-0002",
      invoiceId: invoiceHasina.id,
      clientId: clientHasina.id,
      amount: 2400000,
      date: new Date("2026-07-22"),
      method: PaymentMethod.VIREMENT_BANCAIRE,
      reference: "BNI-VIR-45091238",
      notes: "Règlement solde total projet web tourisme.",
    },
  });

  // Domaine & Hébergement Hasina (expirant dans 18 jours pour tester l'alerte !)
  const expHasina = new Date();
  expHasina.setDate(expHasina.getDate() + 18);

  await prisma.domain.create({
    data: {
      clientId: clientHasina.id,
      domainName: "www.hasina-tours.mg",
      extension: ".mg",
      registrar: "NIC-MG",
      purchaseDate: new Date("2025-10-10"),
      expirationDate: expHasina,
      costPrice: 85000,
      sellingPrice: 350000,
      status: AssetStatus.EXPIRE_BIENTOT,
      autoRenew: false,
    },
  });

  await prisma.hosting.create({
    data: {
      clientId: clientHasina.id,
      domainName: "www.hasina-tours.mg",
      provider: "Hostinger Cloud",
      plan: "Cloud Professional",
      startDate: new Date("2025-10-10"),
      expirationDate: expHasina,
      costPrice: 140000,
      sellingPrice: 350000,
      margin: 210000,
      status: AssetStatus.EXPIRE_BIENTOT,
    },
  });

  // Client 3 : Tunic (Boutique de Mode)
  const clientTunic = await prisma.client.create({
    data: {
      name: "Mme Voahangy",
      company: "Tunic Madagascar",
      phone: "+261 32 40 555 77",
      whatsapp: "261324055577",
      email: "contact@tunic-mode.mg",
      address: "Galerie Smart Tanjombato",
      city: "Antananarivo",
      website: "https://www.tunic-mode.mg",
      status: ClientStatus.ACTIF,
      createdAt: new Date("2026-09-01"),
    },
  });

  const invoiceTunic = await prisma.invoice.create({
    data: {
      invoiceNumber: "FAC-2026-0003",
      baseNumber: "TNC20260902",
      clientId: clientTunic.id,
      type: InvoiceType.ACOMPTE,
      date: new Date("2026-09-02"),
      dueDate: new Date("2026-09-17"),
      subtotal: 1850000,
      vatRate: 0,
      vatAmount: 0,
      total: 1850000,
      depositPercent: 50,
      depositAmount: 925000,
      remainingAmount: 925000,
      amountInWords: "un million huit cent cinquante mille Ariary",
      status: InvoiceStatus.PARTIELLEMENT_PAYEE,
      paymentTerms: "Acompte de 50% payé par Orange Money. Reste 925 000 Ar à la livraison.",
      items: {
        create: [
          {
            description: "Création Boutique en Ligne E-Commerce Tunic (Prêt-à-porter)",
            quantity: 1,
            unitPrice: 1850000,
            total: 1850000,
          },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      paymentNumber: "PAI-2026-0003",
      invoiceId: invoiceTunic.id,
      clientId: clientTunic.id,
      amount: 925000,
      date: new Date("2026-09-03"),
      method: PaymentMethod.ORANGE_MONEY,
      reference: "OM-2026-991823",
      notes: "Acompte 50% e-commerce Tunic",
    },
  });

  // Client 4 : Pizza Factory (Facture en retard pour alimenter le dashboard !)
  const clientPizza = await prisma.client.create({
    data: {
      name: "M. Andry",
      company: "Pizza Factory",
      phone: "+261 34 99 888 77",
      whatsapp: "261349988877",
      email: "commande@pizzafactory.mg",
      address: "Près de l'Esplanade Ankatso",
      city: "Antananarivo",
      status: ClientStatus.ACTIF,
    },
  });

  await prisma.invoice.create({
    data: {
      invoiceNumber: "FAC-2026-0004",
      baseNumber: "PZF10293",
      clientId: clientPizza.id,
      type: InvoiceType.SOLDE,
      date: new Date("2026-08-20"),
      dueDate: new Date("2026-09-05"), // Échue dans le passé -> en retard !
      subtotal: 650000,
      vatRate: 0,
      vatAmount: 0,
      total: 650000,
      depositPercent: 100,
      depositAmount: 650000,
      remainingAmount: 650000,
      amountInWords: "six cent cinquante mille Ariary",
      status: InvoiceStatus.EN_RETARD,
      paymentTerms: "Solde final pour le module de commande en ligne QR code.",
      items: {
        create: [
          {
            description: "Module Click & Collect et Menu Digital QR Code",
            quantity: 1,
            unitPrice: 650000,
            total: 650000,
          },
        ],
      },
    },
  });

  // Clients additionnels réels pour la richesse des données
  const otherClients = [
    { name: "Mme Nomena", company: "Yum Box", phone: "+261 34 22 333 44", email: "contact@yumbox.mg", status: ClientStatus.ACTIF },
    { name: "M. Herizo", company: "Prestige Occasion", phone: "+261 33 11 444 55", email: "info@prestige-occasion.mg", status: ClientStatus.ACTIF },
    { name: "Chef Li", company: "Sushis Panda", phone: "+261 34 77 666 55", email: "sushispanda.mg@gmail.com", status: ClientStatus.ACTIF },
    { name: "Mme Clara", company: "Miss'Aile Beauté", phone: "+261 32 99 111 22", email: "clara@missaile.mg", status: ClientStatus.ACTIF },
    { name: "M. Rado", company: "Lavage Raitra", phone: "+261 34 55 444 33", email: "contact@lavageraitra.mg", status: ClientStatus.ACTIF },
  ];

  for (const c of otherClients) {
    await prisma.client.create({
      data: {
        ...c,
        whatsapp: c.phone.replace(/[^0-9]/g, ""),
        city: "Antananarivo",
      },
    });
  }

  // 7. Prospects Commerciaux
  const prospectsData = [
    {
      firstName: "Jean",
      lastName: "Ratsimba",
      company: "Madagascar Eco Lodge",
      phone: "+261 34 12 345 67",
      whatsapp: "261341234567",
      email: "jean.ratsimba@ecolodge.mg",
      sector: "Hôtellerie / Écotourisme",
      source: "Recommandation client",
      needType: "Site web réservation avec passerelle de paiement internationale",
      estimatedBudget: 2800000,
      status: ProspectStatus.NEGOCIATION,
      notes: "Très intéressé. A demandé une réduction sur l'acompte de 50%. Relance prévue cette semaine.",
      assignedToId: commercial.id,
    },
    {
      firstName: "Beby",
      lastName: "Rasoa",
      company: "Pharmacie de l'Avenue",
      phone: "+261 33 22 111 44",
      whatsapp: "261332211144",
      email: "beby@pharmacie-avenue.mg",
      sector: "Santé / Pharmacie",
      source: "Facebook Ads",
      needType: "Application web de suivi des stocks et commande de médicaments de garde",
      estimatedBudget: 3200000,
      status: ProspectStatus.OFFRE_ENVOYEE,
      notes: "Offre envoyée via WhatsApp le 18 septembre. En attente de décision du gérant.",
      assignedToId: commercial.id,
    },
    {
      firstName: "Mamy",
      lastName: "Andriambelo",
      company: "Express Transports Mada",
      phone: "+261 34 66 777 88",
      whatsapp: "261346677788",
      email: "mamy@expresstransports.mg",
      sector: "Transport & Logistique",
      source: "Prospection directe",
      needType: "Système de suivi de flotte et facturation automatique",
      estimatedBudget: 4500000,
      status: ProspectStatus.OFFRE_A_PREPARER,
      notes: "Rendez-vous téléphonique effectué le 20 septembre. Préparer une offre sur-mesure.",
      assignedToId: commercial.id,
    },
    {
      firstName: "Aina",
      lastName: "Randriamampianina",
      company: "Cabinet d'Avocats LexMada",
      phone: "+261 32 11 999 88",
      whatsapp: "261321199988",
      email: "contact@lexmada.mg",
      sector: "Juridique",
      source: "LinkedIn",
      needType: "Site vitrine épuré et espace documentaire sécurisé pour les clients",
      estimatedBudget: 1500000,
      status: ProspectStatus.INTERESSE,
      notes: "A vu les réalisations M-It LevelUp sur LinkedIn. Veut une démo.",
      assignedToId: commercial.id,
    },
    {
      firstName: "Tahina",
      lastName: "Razafy",
      company: "Gourmet Bakery Antanimena",
      phone: "+261 34 44 222 11",
      whatsapp: "261344422211",
      email: "tahina@gourmetbakery.mg",
      sector: "Restauration / Boulangerie",
      source: "Instagram",
      needType: "Site catalogue gâteaux d'anniversaire et commande en ligne",
      estimatedBudget: 1200000,
      status: ProspectStatus.RELANCE,
      notes: "Devis envoyé il y a 10 jours. À relancer sur WhatsApp aujourd'hui.",
      assignedToId: commercial.id,
    },
    {
      firstName: "Hery",
      lastName: "Rakotoarisoa",
      company: "Mada Solar Energy",
      phone: "+261 34 88 123 99",
      whatsapp: "261348812399",
      email: "hery@madasolar.mg",
      sector: "Énergie solaire",
      source: "Site web contact",
      needType: "Générateur de devis solaire en ligne et site institutionnel",
      estimatedBudget: 2200000,
      status: ProspectStatus.NOUVEAU,
      notes: "Demande reçue hier soir via le formulaire contact de m-itlevelup.com.",
      assignedToId: commercial.id,
    },
  ];

  for (const p of prospectsData) {
    await prisma.prospect.create({
      data: p,
    });
  }

  // 8. Dépenses de l'agence (pour le module budgétaire & calcul de rentabilité)
  await prisma.expense.createMany({
    data: [
      {
        category: ExpenseCategory.HEBERGEMENT,
        amount: 360000,
        supplier: "Hostinger International",
        invoiceRef: "HOST-INV-2026-08",
        description: "Abonnement VPS Cloud Entreprise pour les applications clients",
        date: new Date("2026-08-01"),
      },
      {
        category: ExpenseCategory.DOMAINE,
        amount: 195000,
        supplier: "Namecheap Inc.",
        invoiceRef: "NC-RENEW-8821",
        description: "Renouvellement groupé de noms de domaine clients",
        date: new Date("2026-08-10"),
      },
      {
        category: ExpenseCategory.LOGICIELS,
        amount: 120000,
        supplier: "Canva Pro & GitHub Team",
        invoiceRef: "SOFT-2026-08",
        description: "Licences design et gestion du code source",
        date: new Date("2026-08-15"),
      },
      {
        category: ExpenseCategory.PUBLICITE,
        amount: 250000,
        supplier: "Meta Ads / Facebook",
        invoiceRef: "FB-ADS-202608",
        description: "Campagnes sponsorisées acquisition prospects à Madagascar",
        date: new Date("2026-08-25"),
      },
      {
        category: ExpenseCategory.TRANSPORT,
        amount: 80000,
        supplier: "Carburant & Déplacements",
        invoiceRef: "TRP-2026-09",
        description: "Rendez-vous clients en ville (Ankorondrano, Analakely)",
        date: new Date("2026-09-04"),
      },
    ],
  });

  // 9. Notifications récentes
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        title: "Nouvelle signature électronique",
        message: "Mpanorina Nofy a signé le contrat CTR-2026-0001 avec succès.",
        type: NotificationType.SIGNATURE,
        link: "/contracts",
        isRead: false,
      },
      {
        userId: admin.id,
        title: "Acompte reçu de 1 350 000 Ar",
        message: "Paiement MVola enregistré pour la facture FAC-2026-0001 (Mpanorina Nofy).",
        type: NotificationType.PAIEMENT,
        link: "/payments",
        isRead: false,
      },
      {
        userId: admin.id,
        title: "Facture en retard",
        message: "La facture FAC-2026-0004 de Pizza Factory (650 000 Ar) est échue.",
        type: NotificationType.RETARD,
        link: "/invoices",
        isRead: false,
      },
      {
        userId: admin.id,
        title: "Domaine arrive à expiration",
        message: "Le domaine hasina-tours.mg expire dans 18 jours. Tâche de relance créée.",
        type: NotificationType.EXPIRATION,
        link: "/domains",
        isRead: false,
      },
    ],
  });

  // 10. Audit Log & Timeline
  await prisma.activityLog.createMany({
    data: [
      {
        clientId: clientMpanorina.id,
        userId: admin.id,
        action: "PROSPECT_CREE",
        details: "Création de la fiche prospect Mpanorina Nofy",
        createdAt: new Date("2026-08-15T09:00:00Z"),
      },
      {
        clientId: clientMpanorina.id,
        userId: commercial.id,
        action: "APPEL_EFFECTUE",
        details: "Premier échange téléphonique de cadrage avec la direction",
        createdAt: new Date("2026-08-16T14:30:00Z"),
      },
      {
        clientId: clientMpanorina.id,
        userId: commercial.id,
        action: "OFFRE_ENVOYEE",
        details: "Envoi de la proposition pour le développement web et hébergement",
        createdAt: new Date("2026-08-20T10:15:00Z"),
      },
      {
        clientId: clientMpanorina.id,
        userId: admin.id,
        action: "CONTRAT_SIGNE",
        details: "Signature électronique validée avec le hash CCE77EA165994C947265FBA93E",
        createdAt: new Date("2026-09-07T14:32:00Z"),
      },
      {
        clientId: clientMpanorina.id,
        userId: accountant.id,
        action: "ACOMPTE_RECU",
        details: "Encaissement de 1 350 000 Ar par MVola pour l'avance 50%",
        createdAt: new Date("2026-09-08T11:00:00Z"),
      },
      {
        clientId: clientMpanorina.id,
        userId: devLead.id,
        action: "PROJET_COMMENCE",
        details: "Lancement du sprint 1 de développement Frontend et maquettes",
        createdAt: new Date("2026-09-09T08:00:00Z"),
      },
    ],
  });

  console.log("✅ Remplissage de la base de données terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
