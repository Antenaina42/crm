import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FolderArchive,
  FileText,
  CreditCard,
  FileCheck,
  Receipt,
  Download,
  Eye,
  Building,
} from "lucide-react";
import { formatAriary, formatCurrency, formatDate } from "@/lib/formatters";

export const revalidate = 0;

export default async function DocumentsPage() {
  const [invoices, contracts, offers, proformas] = await Promise.all([
    prisma.invoice.findMany({ include: { client: true }, orderBy: { date: "desc" } }),
    prisma.contract.findMany({ include: { client: true }, orderBy: { createdAt: "desc" } }),
    prisma.offer.findMany({ include: { client: true, prospect: true }, orderBy: { createdAt: "desc" } }),
    prisma.proforma.findMany({ include: { client: true, prospect: true }, orderBy: { date: "desc" } }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Centre Documentaire & GED
        </h1>
        <p className="text-sm text-slate-500">
          Consolidation de tous les documents générés : factures, contrats, offres et devis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factures Officielles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              Factures Émises ({invoices.length})
            </h3>
            <Link href="/invoices" className="text-xs text-brand-800 hover:underline font-semibold">
              Gérer
            </Link>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3 bg-slate-50/70 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{inv.invoiceNumber}</p>
                  <p className="text-[11px] text-slate-500">
                    {inv.client.company || inv.client.name} • {formatCurrency(inv.total, inv.currency || "Ar")}
                  </p>
                </div>
                <Link
                  href={`/invoices/${inv.id}`}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-brand-800"
                  title="Voir et imprimer"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Contrats Signés & En Attente */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              Contrats ({contracts.length})
            </h3>
            <Link href="/contracts" className="text-xs text-brand-800 hover:underline font-semibold">
              Gérer
            </Link>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {contracts.map((ctr) => (
              <div
                key={ctr.id}
                className="p-3 bg-slate-50/70 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{ctr.contractNumber} — {ctr.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {ctr.client.company || ctr.client.name} • Statut: {ctr.status}
                  </p>
                </div>
                <a
                  href={`/sign/${ctr.signToken}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-brand-800"
                  title="Lien du contrat"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Devis Proformas */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-600" />
              Factures Proforma ({proformas.length})
            </h3>
            <Link href="/proformas" className="text-xs text-brand-800 hover:underline font-semibold">
              Gérer
            </Link>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {proformas.map((pro) => (
              <div
                key={pro.id}
                className="p-3 bg-slate-50/70 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{pro.proformaNumber}</p>
                  <p className="text-[11px] text-slate-500">
                    {pro.client?.company || pro.prospect?.company || "Client"} • {formatCurrency(pro.total, pro.currency || "Ar")}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-200 text-slate-700">
                  {pro.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Propositions Commerciales */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Offres Commerciales ({offers.length})
            </h3>
            <Link href="/offers" className="text-xs text-brand-800 hover:underline font-semibold">
              Gérer
            </Link>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {offers.map((off) => (
              <div
                key={off.id}
                className="p-3 bg-slate-50/70 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <p className="font-bold text-xs text-slate-900">{off.offerNumber} — {off.title}</p>
                  <p className="text-[11px] text-slate-500">
                    {off.client?.company || off.prospect?.company || "Client"} • {formatCurrency(off.total, off.currency || "Ar")}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {off.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
