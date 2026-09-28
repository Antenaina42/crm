import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { onContractSigned } from "@/lib/automations";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const contract = await prisma.contract.findUnique({
      where: { signToken: token },
      include: {
        client: true,
        project: true,
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Lien de signature invalide ou expiré" }, { status: 404 });
    }

    return NextResponse.json(contract);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lecture contrat" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const body = await req.json();
    const contract = await prisma.contract.findUnique({
      where: { signToken: token },
    });

    if (!contract) {
      return NextResponse.json({ error: "Lien de signature introuvable" }, { status: 404 });
    }

    if (contract.status === "SIGNE") {
      return NextResponse.json({ error: "Ce document est déjà signé" }, { status: 400 });
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const signerName = body.signerName || "Client";
    const signatureDataUrl = body.signatureDataUrl;

    // Calcul de l'empreinte cryptographique SHA-256 du document et de la signature
    const hash = crypto
      .createHash("sha256")
      .update(`${contract.content}-${signerName}-${Date.now()}-${ipAddress}`)
      .digest("hex")
      .toUpperCase();

    // Déclencher l'automatisation
    await onContractSigned(contract.id, {
      signerName,
      ipAddress,
      signatureDataUrl,
      signatureHash: hash,
    });

    return NextResponse.json({
      success: true,
      hash,
      signedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur enregistrement signature:", error);
    return NextResponse.json({ error: "Erreur lors de la signature" }, { status: 500 });
  }
}
