"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Send,
  Plus,
  ArrowLeft,
  Briefcase,
  Rocket,
  FileText,
  Receipt,
  CreditCard,
  FileCheck,
  Server,
  FolderArchive,
  Clock,
  ExternalLink,
  ShieldCheck,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import { formatAriary, formatCurrency, formatDate, formatDateTime } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ClientDetailViewProps {
  client: any;
}

export function ClientDetailView({ client }: ClientDetailViewProps) {
  const router = useRouter();
  const [clientData, setClientData] = useState<any>(client);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: client.name || "",
    company: client.company || "",
    phone: client.phone || "",
    whatsapp: client.whatsapp || "",
    email: client.email || "",
    address: client.address || "",
    city: client.city || "Antananarivo",
    nif: client.nif || "",
    stat: client.stat || "",
    website: client.website || "",
    status: client.status || "ACTIF",
    notes: client.notes || "",
  });

  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "projects"
    | "offers"
    | "proformas"
    | "invoices"
    | "payments"
    | "contracts"
    | "domains"
    | "documents"
    | "timeline"
  >("overview");

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/clients/${clientData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setClientData({ ...clientData, ...updated });
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async () => {
    if (
      !confirm(
        `Confirmer la suppression définitive du client "${clientData.company || clientData.name}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/clients/${clientData.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/clients");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculs financiers du client
  const totalBilled = clientData.invoices?.reduce((s: number, i: any) => s + i.total, 0) || 0;
  const totalPaid = clientData.payments?.reduce((s: number, p: any) => s + p.amount, 0) || 0;
  const balanceDue = Math.max(0, totalBilled - totalPaid);

  const waPhone = clientData.whatsapp || clientData.phone?.replace(/[^0-9]/g, "");
  const waUrl = buildWhatsAppUrl(
    waPhone || "261345403898",
    `Bonjour ${clientData.name}, l'équipe M-It LevelUp reste à votre disposition.`
  );

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", count: null },
    { id: "projects", label: "Projets", count: client.projects?.length },
    { id: "offers", label: "Offres", count: client.offers?.length },
    { id: "proformas", label: "Proformas", count: client.proformas?.length },
    { id: "invoices", label: "Factures", count: client.invoices?.length },
    { id: "payments", label: "Paiements", count: client.payments?.length },
    { id: "contracts", label: "Contrats", count: client.contracts?.length },
    { id: "domains", label: "Domaines & Hébergement", count: (client.domains?.length || 0) + (client.hostings?.length || 0) },
    { id: "documents", label: "Documents", count: client.documents?.length },
    { id: "timeline", label: "Historique", count: client.activityLogs?.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Back Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/clients"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {client.company || client.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {client.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Fiche client 360° • Créé le {formatDate(client.createdAt)}
          </p>
        </div>
      </div>

      {/* Profil Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Infos Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Contact Référent</p>
                <p className="text-sm font-bold text-slate-900">{client.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Téléphone</p>
                <p className="text-sm font-bold text-slate-900">{client.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Email</p>
                <p className="text-sm font-bold text-slate-900 truncate">{client.email}</p>
              </div>
            </div>

            {client.website && (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Site Web</p>
                  <a
                    href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-brand-800 hover:underline truncate"
                  >
                    {client.website}
                  </a>
                </div>
              </div>
            )}

            {client.nif && (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Fiscalité</p>
                  <p className="text-sm font-bold text-slate-900">
                    NIF : {client.nif} {client.stat ? `• STAT : ${client.stat}` : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Adresse</p>
                <p className="text-sm font-bold text-slate-900">
                  {client.address || "Antananarivo, Madagascar"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-row lg:flex-col gap-2 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
              WhatsApp Direct
            </a>
            <Link
              href={`/offers?clientId=${clientData.id}&new=true`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Créer une Offre
            </Link>
            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-brand-800 text-xs font-semibold shadow-2xs transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Modifier la Fiche
            </button>
            <button
              type="button"
              onClick={handleDeleteClient}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Supprimer Client
            </button>
          </div>
        </div>

        {/* Mini Financial Summary Banner */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Facturé</span>
            <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {formatAriary(totalBilled)}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <span className="text-[11px] text-emerald-700 font-semibold uppercase">Total Encaissé</span>
            <p className="text-base sm:text-lg font-bold text-emerald-800 mt-0.5">
              {formatAriary(totalPaid)}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl">
            <span className="text-[11px] text-amber-700 font-semibold uppercase">Reste Dû</span>
            <p className="text-base sm:text-lg font-bold text-amber-800 mt-0.5">
              {formatAriary(balanceDue)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-brand-800 text-white shadow-sm shadow-brand-200"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1 : VUE D'ENSEMBLE */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Projets récents */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Projets du Client</h3>
              <button
                onClick={() => setActiveTab("projects")}
                className="text-xs text-brand-800 hover:underline font-semibold"
              >
                Tous ({client.projects?.length || 0})
              </button>
            </div>
            <div className="space-y-3">
              {client.projects?.length > 0 ? (
                client.projects.map((pr: any) => (
                  <div
                    key={pr.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{pr.title}</p>
                      <p className="text-[11px] text-slate-400">
                        N° {pr.projectNumber} • Début le {formatDate(pr.startDate)}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
                      {pr.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 p-4 text-center">Aucun projet en cours.</p>
              )}
            </div>
          </div>

          {/* Factures récentes */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Factures du Client</h3>
              <button
                onClick={() => setActiveTab("invoices")}
                className="text-xs text-brand-800 hover:underline font-semibold"
              >
                Toutes ({client.invoices?.length || 0})
              </button>
            </div>
            <div className="space-y-3">
              {client.invoices?.length > 0 ? (
                client.invoices.map((inv: any) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{inv.invoiceNumber}</p>
                      <p className="text-[11px] text-slate-400">
                        Date: {formatDate(inv.date)} • Total: {formatCurrency(inv.total, inv.currency || "Ar")}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700">
                      {inv.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 p-4 text-center">Aucune facture enregistrée.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 : PROJETS */}
      {activeTab === "projects" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Projets Associés</h3>
            <Link
              href={`/projects?clientId=${client.id}&new=true`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-800 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Nouveau Projet
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {client.projects?.map((pr: any) => (
              <div key={pr.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{pr.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{pr.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span>Montant : {formatAriary(pr.totalAmount)}</span>
                    <span>• Acompte : {formatAriary(pr.depositAmount)}</span>
                    <span>• Reste : {formatAriary(pr.remainderAmount)}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  {pr.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5 : FACTURES */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Factures Émises</h3>
            <Link
              href={`/invoices?clientId=${client.id}&new=true`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-800 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Créer Facture
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {client.invoices?.map((inv: any) => (
              <div key={inv.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{inv.invoiceNumber}</span>
                    <span className="text-xs text-slate-400">{inv.baseNumber ? `(Base ${inv.baseNumber})` : ""}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Émise le {formatDate(inv.date)} • Échéance : {formatDate(inv.dueDate)}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    Total : {formatCurrency(inv.total, inv.currency || "Ar")} • Reste dû : {formatCurrency(inv.remainingAmount, inv.currency || "Ar")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    {inv.status}
                  </span>
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-brand-800 transition-colors"
                  >
                    Voir Facture Officielle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7 : CONTRATS */}
      {activeTab === "contracts" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Contrats & Signature Électronique</h3>
            <Link
              href={`/contracts?clientId=${client.id}&new=true`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-800 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Générer Contrat
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {client.contracts?.map((ctr: any) => (
              <div key={ctr.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{ctr.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    N° {ctr.contractNumber} • Montant : {formatAriary(ctr.totalAmount)}
                  </p>
                  {ctr.signedAt && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      ✓ Signé le {formatDateTime(ctr.signedAt)} par {ctr.signerName} (Hash: {ctr.signatureHash?.substring(0, 16)}...)
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    {ctr.status}
                  </span>
                  <a
                    href={`/sign/${ctr.signToken}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                  >
                    <span>Lien Signature Client</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8 : DOMAINES & HÉBERGEMENT */}
      {activeTab === "domains" && (
        <div className="space-y-6 animate-fade-in">
          {/* Domaines */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-4">Noms de Domaine</h3>
            <div className="divide-y divide-slate-100">
              {client.domains?.map((d: any) => (
                <div key={d.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{d.domainName}</p>
                    <p className="text-xs text-slate-400">
                      Registrar : {d.registrar} • Expire le {formatDate(d.expirationDate)}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hébergements */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-4">Hébergements Serveurs</h3>
            <div className="divide-y divide-slate-100">
              {client.hostings?.map((h: any) => (
                <div key={h.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{h.domainName}</p>
                    <p className="text-xs text-slate-400">
                      Fournisseur : {h.provider} ({h.plan}) • Expire le {formatDate(h.expirationDate)}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 10 : TIMELINE / HISTORIQUE */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs animate-fade-in">
          <h3 className="font-bold text-sm text-slate-900 mb-6">Journal d'Événements & Timeline</h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {client.activityLogs?.map((log: any) => (
              <div key={log.id} className="relative group">
                <div className="absolute -left-6 mt-1 w-3 h-3 rounded-full bg-brand-800 ring-4 ring-white" />
                <div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {formatDateTime(log.createdAt)}
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {log.action.replace("_", " ")}
                  </p>
                  {log.details && (
                    <p className="text-xs text-slate-500 mt-0.5 bg-slate-50 p-2.5 rounded-xl">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Modifier Client */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Modifier la Fiche : {clientData.company || clientData.name}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClient} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom du contact *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom Entreprise *</label>
                  <input
                    type="text"
                    required
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut Client</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ACTIF">Actif</option>
                    <option value="INACTIF">Inactif</option>
                    <option value="ARCHIVE">Archivé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIF</label>
                  <input
                    type="text"
                    value={editForm.nif}
                    onChange={(e) => setEditForm({ ...editForm, nif: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">STAT</label>
                  <input
                    type="text"
                    value={editForm.stat}
                    onChange={(e) => setEditForm({ ...editForm, stat: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Site Web</label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes internes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-sm font-semibold shadow-md active:scale-95 transition-all"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
