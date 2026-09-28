import { prisma } from "@/lib/prisma";
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Building } from "lucide-react";
import { formatDate } from "@/lib/formatters";

export const revalidate = 0;

export default async function CalendarPage() {
  const [invoices, domains, hostings, projects, tasks] = await Promise.all([
    prisma.invoice.findMany({
      where: { status: { not: "PAYEE" } },
      include: { client: true },
      take: 10,
    }),
    prisma.domain.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
      take: 10,
    }),
    prisma.hosting.findMany({
      orderBy: { expirationDate: "asc" },
      include: { client: true },
      take: 10,
    }),
    prisma.project.findMany({
      where: { status: { not: "TERMINE" } },
      include: { client: true },
      take: 10,
    }),
    prisma.task.findMany({
      where: { status: { not: "TERMINE" } },
      include: { project: true, assignee: true },
      take: 10,
    }),
  ]);

  const events = [
    ...invoices.map((i) => ({
      title: `Échéance Facture ${i.invoiceNumber}`,
      client: i.client.company || i.client.name,
      date: i.dueDate,
      type: "FACTURE",
      badge: "Facture",
      color: "border-l-4 border-amber-500 bg-amber-50/70 text-amber-900",
    })),
    ...domains.map((d) => ({
      title: `Expiration Domaine ${d.domainName}`,
      client: d.client.company || d.client.name,
      date: d.expirationDate,
      type: "DOMAINE",
      badge: "Domaine",
      color: "border-l-4 border-cyan-500 bg-cyan-50/70 text-cyan-900",
    })),
    ...projects
      .filter((p) => p.targetDeliveryDate)
      .map((p) => ({
        title: `Livraison Prévue : ${p.title}`,
        client: p.client.company || p.client.name,
        date: p.targetDeliveryDate!,
        type: "PROJET",
        badge: "Projet",
        color: "border-l-4 border-brand-800 bg-brand-50/70 text-brand-950",
      })),
    ...tasks
      .filter((t) => t.dueDate)
      .map((t) => ({
        title: `Tâche : ${t.title}`,
        client: t.project?.title || "Projet",
        date: t.dueDate!,
        type: "TACHE",
        badge: "Tâche",
        color: "border-l-4 border-emerald-500 bg-emerald-50/70 text-emerald-950",
      })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Calendrier Centralisé des Échéances
        </h1>
        <p className="text-sm text-slate-500">
          Vue chronologique des livraisons, renouvellements de domaines, tâches et factures
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-brand-800" />
          Événements & Échéances à Venir ({events.length})
        </h3>

        <div className="space-y-3">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${ev.color}`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white shadow-2xs">
                    {ev.badge}
                  </span>
                  <h4 className="font-bold text-sm">{ev.title}</h4>
                </div>
                <p className="text-xs opacity-80 flex items-center gap-1.5 pt-1">
                  <Building className="w-3.5 h-3.5" /> {ev.client}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs font-bold block">
                  {formatDate(ev.date)}
                </span>
                <span className="text-[11px] opacity-75">
                  {new Date(ev.date).toLocaleDateString("fr-FR", { weekday: "long" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
