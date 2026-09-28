"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  CreditCard,
  Printer,
  Send,
  Eye,
  Trash2,
  X,
  FileText,
  DollarSign,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { formatAriary, formatCurrency, getCurrencySymbol, formatDate } from "@/lib/formatters";
import { buildWhatsAppUrl, generateInvoiceMessage } from "@/lib/whatsapp";

interface InvoicesListViewProps {
  initialInvoices: any[];
  clients: any[];
}

export function InvoicesListView({ initialInvoices, clients }: InvoicesListViewProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [baseNumber, setBaseNumber] = useState(`MPN${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [currency, setCurrency] = useState("Ar");
  const [depositPercent, setDepositPercent] = useState<number>(50);
  const [notes, setNotes] = useState(
    "M-It LevelUp vous remercie pour votre confiance. Prestation avec garantie et accompagnement technique dédié."
  );
  const [items, setItems] = useState<any[]>([
    {
      description: "Conception site internet interface Moderne et cinematique (Fonctionnalité, design, SEO), responsive (Desktop, Mobile et Tablette)",
      quantity: 1,
      unitPrice: 1350000,
    },
    {
      description: "Hébergement Cloud haute vitesse de l'application - Offre annuelle",
      quantity: 1,
      unitPrice: 300000,
    },
    {
      description: "Nom de domaine international (.com) - Offre annuelle",
      quantity: 1,
      unitPrice: 300000,
    },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.unitPrice || 0) * Number(it.quantity || 1),
    0
  );
  const total = subtotal; // TVA 0%
  const depositAmount = (total * depositPercent) / 100;
  const remainderAmount = total - depositAmount;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          baseNumber,
          depositPercent,
          currency,
          notes,
          items,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setInvoices([created, ...invoices]);
        setModalOpen(false);
        router.push(`/invoices/${created.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices(invoices.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      `${inv.invoiceNumber} ${inv.baseNumber || ""} ${inv.client?.company || inv.client?.name}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Facturation & Acomptes
          </h1>
          <p className="text-sm text-slate-500">
            Émission des factures officielles M-It LevelUp, acomptes 50% et suivi des paiements
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Facture
        </button>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par N° facture, N° de base, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PAYEE">Payée</option>
            <option value="PARTIELLEMENT_PAYEE">Partiellement payée</option>
            <option value="ENVOYEE">Envoyée</option>
            <option value="EN_RETARD">En retard</option>
          </select>
        </div>
      </div>

      {/* Table des Factures */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">N° Facture</th>
                <th className="p-4">Client</th>
                <th className="p-4">Date Émission</th>
                <th className="p-4">Échéance</th>
                <th className="p-4 text-right">Total HT & TTC</th>
                <th className="p-4 text-right">Reste Dû</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => {
                const clientPhone = inv.client?.whatsapp || inv.client?.phone?.replace(/[^0-9]/g, "");
                const waUrl = buildWhatsAppUrl(
                  clientPhone || "261345403898",
                  generateInvoiceMessage({
                    clientName: inv.client?.name || "Client",
                    invoiceNumber: inv.invoiceNumber,
                    totalAmount: formatCurrency(inv.total, inv.currency || "Ar"),
                    dueAmount: formatCurrency(inv.remainingAmount || inv.total, inv.currency || "Ar"),
                  })
                );

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{inv.invoiceNumber}</div>
                      {inv.baseNumber && (
                        <div className="text-[11px] text-slate-400">Base N°: {inv.baseNumber}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">
                        {inv.client?.company || inv.client?.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{inv.client?.phone}</div>
                    </td>
                    <td className="p-4 text-slate-600">{formatDate(inv.date)}</td>
                    <td className="p-4 text-slate-600">{formatDate(inv.dueDate)}</td>
                    <td className="p-4 text-right font-bold text-slate-900">
                      {formatCurrency(inv.total, inv.currency || "Ar")}
                    </td>
                    <td className="p-4 text-right font-bold text-amber-700">
                      {formatCurrency(inv.remainingAmount, inv.currency || "Ar")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          inv.status === "PAYEE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : inv.status === "PARTIELLEMENT_PAYEE"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : inv.status === "EN_RETARD"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {inv.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        title="Envoyer WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-brand-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Voir</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création de Facture */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Créer une Facture Officielle M-It LevelUp
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client *</label>
                  <select
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base N° (Interne / Réf client)</label>
                  <input
                    type="text"
                    value={baseNumber}
                    onChange={(e) => setBaseNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Devise de facturation</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white outline-none"
                  >
                    <option value="Ar">🇲🇬 Ariary malgache (Ar) — Par défaut</option>
                    <option value="EUR">🇪🇺 Euro (€)</option>
                    <option value="USD">🇺🇸 Dollar américain ($)</option>
                  </select>
                </div>
              </div>

              {/* Choix de l'Acompte */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Modalité d'Acompte</label>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[100, 50, 30].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDepositPercent(pct)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        depositPercent === pct
                          ? "bg-brand-800 text-white border-brand-800 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {pct}% {pct === 100 ? "(Solde complet)" : "(Acompte)"}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Autre %"
                      value={depositPercent}
                      onChange={(e) => setDepositPercent(Number(e.target.value))}
                      className="w-full text-xs font-bold bg-transparent outline-none text-center"
                    />
                    <span className="text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              {/* Lignes de Prestations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Prestations Incluses</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-semibold text-brand-800 hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Ligne #{idx + 1}</span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Description détaillée de la prestation..."
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Quantité</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Prix Unitaire ({getCurrencySymbol(currency)})
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Récapitulatif & Mentions Légales */}
              <div className="p-4 bg-slate-100/70 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Total HT :</span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>TVA non applicable – entreprise non assujettie à la TVA (0%) :</span>
                  <span>{formatCurrency(0, currency)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-200 pt-1">
                  <span>Total TTC :</span>
                  <span>{formatCurrency(total, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-800 pt-1">
                  <span>Acompte ({depositPercent}%) :</span>
                  <span>{formatCurrency(depositAmount, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-700">
                  <span>Reste à payer :</span>
                  <span>{formatCurrency(remainderAmount, currency)}</span>
                </div>
              </div>

              {/* Champ réservé à M-It LevelUp */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Cadre réservé à M-It LevelUp (Phrases / mentions personnalisées)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Écrivez ici vos phrases personnalisées pour cette facture (garantie, conditions spécifiques, remerciements...)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-sm font-semibold shadow-md active:scale-95 transition-all"
                >
                  Générer la Facture Officielle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
