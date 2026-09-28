import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "clients";

  try {
    let csv = "";
    let filename = `${type}_m-it-levelup.csv`;

    if (type === "clients") {
      const clients = await prisma.client.findMany();
      csv = "ID,Nom,Entreprise,Telephone,Email,Ville,NIF,STAT,Statut,Date\n";
      clients.forEach((c) => {
        csv += `"${c.id}","${c.name}","${c.company}","${c.phone}","${c.email}","${c.city || ""}","${c.nif || ""}","${c.stat || ""}","${c.status}","${c.createdAt.toISOString()}"\n`;
      });
    } else if (type === "prospects") {
      const prospects = await prisma.prospect.findMany();
      csv = "ID,Prenom,Nom,Entreprise,Telephone,Email,Besoin,Budget,Statut,Source\n";
      prospects.forEach((p) => {
        csv += `"${p.id}","${p.firstName}","${p.lastName}","${p.company || ""}","${p.phone}","${p.email || ""}","${p.needType || ""}","${p.estimatedBudget || 0}","${p.status}","${p.source || ""}"\n`;
      });
    } else if (type === "invoices") {
      const invoices = await prisma.invoice.findMany({ include: { client: true } });
      csv = "Numero,Base_No,Client,Date,Echeance,Total,Reste_Du,Statut\n";
      invoices.forEach((i) => {
        csv += `"${i.invoiceNumber}","${i.baseNumber || ""}","${i.client.company || i.client.name}","${i.date.toISOString()}","${i.dueDate.toISOString()}","${i.total}","${i.remainingAmount}","${i.status}"\n`;
      });
    } else if (type === "payments") {
      const payments = await prisma.payment.findMany({ include: { client: true, invoice: true } });
      csv = "Numero,Client,Facture,Date,Montant,Methode,Reference\n";
      payments.forEach((p) => {
        csv += `"${p.paymentNumber}","${p.client.company || p.client.name}","${p.invoice?.invoiceNumber || ""}","${p.date.toISOString()}","${p.amount}","${p.method}","${p.reference || ""}"\n`;
      });
    } else if (type === "financial") {
      const expenses = await prisma.expense.findMany();
      csv = "ID,Fournisseur,Categorie,Date,Montant,Description\n";
      expenses.forEach((e) => {
        csv += `"${e.id}","${e.supplier}","${e.category}","${e.date.toISOString()}","${e.amount}","${e.description}"\n`;
      });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur génération export" }, { status: 500 });
  }
}
