import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { onContractSigned } from "@/lib/automations";
import { logActivity } from "@/lib/audit";
import { NotificationType } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    // 1. Chercher un Contrat
    const contract = await prisma.contract.findUnique({
      where: { signToken: token },
      include: {
        client: true,
        project: true,
      },
    });

    if (contract) {
      return NextResponse.json({
        type: "CONTRACT",
        data: contract,
      });
    }

    // 2. Chercher une Facture
    const invoice = await prisma.invoice.findUnique({
      where: { signToken: token },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    });

    if (invoice) {
      return NextResponse.json({
        type: "INVOICE",
        data: invoice,
      });
    }

    // 3. Chercher une Proforma
    const proforma = await prisma.proforma.findUnique({
      where: { signToken: token },
      include: {
        client: true,
        prospect: true,
        items: true,
      },
    });

    if (proforma) {
      return NextResponse.json({
        type: "PROFORMA",
        data: proforma,
      });
    }

    return NextResponse.json(
      { error: "Lien de signature invalide ou expiré" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Erreur GET /api/sign/[token]:", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture du document" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const body = await req.json();
    const forwarded = req.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const signerName = (body.signerName || "Client").trim();
    const signatureDataUrl = body.signatureDataUrl;

    if (!signatureDataUrl) {
      return NextResponse.json(
        { error: "Le tracé de la signature est requis" },
        { status: 400 }
      );
    }

    const now = new Date();

    // 1. Vérifier si c'est un Contrat
    const contract = await prisma.contract.findUnique({
      where: { signToken: token },
      include: { client: true },
    });

    if (contract) {
      if (contract.status === "SIGNE") {
        return NextResponse.json(
          { error: "Ce contrat est déjà signé" },
          { status: 400 }
        );
      }

      const hash = crypto
        .createHash("sha256")
        .update(`CONTRACT-${contract.contractNumber}-${contract.content}-${signerName}-${now.getTime()}-${ipAddress}`)
        .digest("hex")
        .toUpperCase();

      await onContractSigned(contract.id, {
        signerName,
        ipAddress,
        signatureDataUrl,
        signatureHash: hash,
      });

      return NextResponse.json({
        success: true,
        type: "CONTRACT",
        hash,
        signedAt: now.toISOString(),
      });
    }

    // 2. Vérifier si c'est une Facture
    const invoice = await prisma.invoice.findUnique({
      where: { signToken: token },
      include: { client: true },
    });

    if (invoice) {
      if (invoice.signatureClient) {
        return NextResponse.json(
          { error: "Cette facture a déjà été signée" },
          { status: 400 }
        );
      }

      const hash = crypto
        .createHash("sha256")
        .update(`INVOICE-${invoice.invoiceNumber}-${invoice.total}-${signerName}-${now.getTime()}-${ipAddress}`)
        .digest("hex")
        .toUpperCase();

      // Mettre à jour la facture
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          signatureClient: true,
          signedAt: now,
          signerName,
          signerIp: ipAddress,
          signatureHash: hash,
          signatureDataUrl,
        },
      });

      // Enregistrer dans la table d'audit Signature
      await prisma.signature.create({
        data: {
          invoiceId: invoice.id,
          signerName,
          ipAddress,
          documentHash: hash,
          signatureData: signatureDataUrl,
          signedAt: now,
        },
      });

      // Créer une notification dans le CRM
      await prisma.notification.create({
        data: {
          title: "Facture signée électroniquement ✍️",
          message: `${signerName} a validé et signé électroniquement la facture ${invoice.invoiceNumber}.`,
          type: NotificationType.SIGNATURE,
          link: `/invoices/${invoice.id}`,
        },
      });

      // Tracer l'activité
      await logActivity({
        clientId: invoice.clientId,
        action: "FACTURE_SIGNEE",
        details: `Facture ${invoice.invoiceNumber} signée électroniquement par ${signerName} (IP: ${ipAddress})`,
        entityType: "Invoice",
        entityId: invoice.id,
      });

      return NextResponse.json({
        success: true,
        type: "INVOICE",
        hash,
        signedAt: now.toISOString(),
      });
    }

    // 3. Vérifier si c'est une Proforma
    const proforma = await prisma.proforma.findUnique({
      where: { signToken: token },
      include: { client: true, prospect: true },
    });

    if (proforma) {
      if (proforma.signatureClient) {
        return NextResponse.json(
          { error: "Cette facture proforma a déjà été signée" },
          { status: 400 }
        );
      }

      const hash = crypto
        .createHash("sha256")
        .update(`PROFORMA-${proforma.proformaNumber}-${proforma.total}-${signerName}-${now.getTime()}-${ipAddress}`)
        .digest("hex")
        .toUpperCase();

      // Mettre à jour la proforma
      await prisma.proforma.update({
        where: { id: proforma.id },
        data: {
          signatureClient: true,
          status: "ACCEPTEE",
          signedAt: now,
          signerName,
          signerIp: ipAddress,
          signatureHash: hash,
          signatureDataUrl,
        },
      });

      // Enregistrer dans la table d'audit Signature
      await prisma.signature.create({
        data: {
          proformaId: proforma.id,
          signerName,
          ipAddress,
          documentHash: hash,
          signatureData: signatureDataUrl,
          signedAt: now,
        },
      });

      // Créer une notification dans le CRM
      await prisma.notification.create({
        data: {
          title: "Facture Proforma signée (Bon pour accord) ✍️",
          message: `${signerName} a validé et signé la proforma ${proforma.proformaNumber} (« Bon pour accord »).`,
          type: NotificationType.SIGNATURE,
          link: `/proformas/${proforma.id}`,
        },
      });

      // Tracer l'activité si client
      if (proforma.clientId) {
        await logActivity({
          clientId: proforma.clientId,
          action: "PROFORMA_SIGNEE",
          details: `Proforma ${proforma.proformaNumber} validée et signée par ${signerName} (IP: ${ipAddress})`,
          entityType: "Proforma",
          entityId: proforma.id,
        });
      }

      return NextResponse.json({
        success: true,
        type: "PROFORMA",
        hash,
        signedAt: now.toISOString(),
      });
    }

    return NextResponse.json(
      { error: "Lien de signature introuvable ou document inexistant" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Erreur enregistrement signature:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la signature" },
      { status: 500 }
    );
  }
}
