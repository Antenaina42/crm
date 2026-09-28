import { prisma } from "@/lib/prisma";
import { Download, BarChart3, Users, CreditCard, DollarSign, FileSpreadsheet } from "lucide-react";
import { formatAriary } from "@/lib/formatters";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (user && user.role === "COMMERCIAL") {
    redirect("/");
  }

  const [clientsCount, prospectsCount, invoicesCount, paymentsCount, expensesCount] = await Promise.all([
    prisma.client.count(),
    prisma.prospect.count(),
    prisma.invoice.count(),
    prisma.payment.count(),
    prisma.expense.count(),
  ]);

  const exports = [
    {
      title: "Export Portefeuille Clients",
      desc: "Base clients complète avec contacts, NIF, STAT, téléphones et adresses.",
      type: "clients",
      count: clientsCount,
      icon: Users,
    },
    {
      title: "Export Pipeline Prospects",
      desc: "Historique des opportunités, sources, besoins et budgets estimés.",
      type: "prospects",
      count: prospectsCount,
      icon: BarChart3,
    },
    {
      title: "Export Journal des Factures",
      desc: "Liste détaillée des factures émises, dates, montants et soldes restants.",
      type: "invoices",
      count: invoicesCount,
      icon: CreditCard,
    },
    {
      title: "Export Rapprochement des Encaissements",
      desc: "Toutes les transactions perçues (MVola, Orange Money, virements).",
      type: "payments",
      count: paymentsCount,
      icon: DollarSign,
    },
    {
      title: "Export Grand Livre des Dépenses",
      desc: "Charges d'infrastructure, licences logicielles et achats serveurs.",
      type: "financial",
      count: expensesCount,
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Rapports & Exports de Données
        </h1>
        <p className="text-sm text-slate-500">
          Téléchargement instantané des données de gestion sous format standard CSV compatible Excel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exports.map((exp, idx) => {
          const Icon = exp.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-800">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {exp.count} enregistrement(s)
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{exp.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.desc}</p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <a
                  href={`/api/export?type=${exp.type}`}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger CSV Excel
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
