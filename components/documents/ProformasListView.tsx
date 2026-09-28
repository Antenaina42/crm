"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Receipt,
  Send,
  Printer,
  CheckCircle2,
  Trash2,
  X,
  CreditCard,
  Building,
  Eye,
  Edit2,
  Download,
} from "lucide-react";
import { formatAriary, formatCurrency, getCurrencySymbol, formatDate } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface ProformasListViewProps {
  initialProformas: any[];
  clients: any[];
  prospects: any[];
}

export function ProformasListView({
  initialProformas,
  clients,
  prospects,
}: ProformasListViewProps) {
  const router = useRouter();
  const [proformas, setProformas] = useState<any[]>(initialProformas);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProforma, setEditingProforma] = useState<any | null>(null);

  // Form State
  const [targetType, setTargetType] = useState<"client" | "prospect">("client");
  const [targetId, setTargetId] = useState(clients[0]?.id || "");
  const [currency, setCurrency] = useState("Ar");
  const [depositPercent, setDepositPercent] = useState(50);
  const [discount, setDiscount] = useState(0);
  const [conditions, setConditions] = useState(
    "Facture Proforma valable 30 jours. TVA non applicable – entreprise non assujettie à la TVA. Acompte de 50% au lancement des développements."
  );
  const [notes, setNotes] = useState(
    "M-It LevelUp vous remercie pour votre confiance. Prestation garantie avec support et accompagnement technique dédié."
  );
  const [items, setItems] = useState<any[]>([
    {
      description: "Conception plateforme web sur-mesure & tableau de bord M-It LevelUp",
      quantity: 1,
      unitPrice: 2400000,
    },
    {
      description: "Configuration domaine & hébergement cloud infogéré annuel",
      quantity: 1,
      unitPrice: 600000,
    },
  ]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.unitPrice || 0) * Number(it.quantity || 1),
    0
  );
  const total = Math.max(0, subtotal - Number(discount || 0));
  const depositAmount = (total * depositPercent) / 100;
  const remainderAmount = total - depositAmount;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        depositPercent,
        discount: Number(discount),
        conditions,
        notes,
        currency,
        items,
      };
      if (targetType === "client") payload.clientId = targetId;
      else payload.prospectId = targetId;

      const res = await fetch("/api/proformas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setProformas([created, ...proformas]);
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (pro: any) => {
    setEditingProforma(pro);
    setCurrency(pro.currency || "Ar");
    setDepositPercent(pro.depositPercent || 50);
    setDiscount(pro.discount || 0);
    setConditions(pro.conditions || "");
    setNotes(pro.notes || "");
    setItems(
      pro.items && pro.items.length > 0
        ? pro.items.map((it: any) => ({
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          }))
        : [{ description: "Prestation M-It LevelUp", quantity: 1, unitPrice: pro.total }]
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProforma) return;
    try {
      const res = await fetch(`/api/proformas/${editingProforma.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositPercent,
          discount: Number(discount),
          conditions,
          notes,
          currency,
          items,
          status: editingProforma.status,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProformas(proformas.map((p) => (p.id === updated.id ? updated : p)));
        setEditingProforma(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`Supprimer définitivement la proforma ${num} ? Cette action est irréversible.`))
      return;
    try {
      const res = await fetch(`/api/proformas/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProformas(proformas.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = proformas.filter((pro) => {
    const recipient =
      pro.client?.company ||
      pro.client?.name ||
      `${pro.prospect?.firstName || ""} ${pro.prospect?.lastName || ""}`;
    return `${pro.proformaNumber} ${recipient}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Factures Proforma
          </h1>
          <p className="text-sm text-slate-500">
            Générateur de devis proforma avec numérotation automatique PRO-2026-XXXX et export PDF
          </p>
        </div>

        <button
          onClick={() => {
            setItems([
              {
                description: "Conception plateforme web sur-mesure & tableau de bord M-It LevelUp",
                quantity: 1,
                unitPrice: 2400000,
              },
              {
                description: "Configuration domaine & hébergement cloud infogéré annuel",
                quantity: 1,
                unitPrice: 600000,
              },
            ]);
            setDiscount(0);
            setDepositPercent(50);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Créer une Proforma
        </button>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une proforma par numéro ou destinataire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table des Proformas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">N° Proforma</th>
                <th className="p-4">Destinataire</th>
                <th className="p-4">Date</th>
                <th className="p-4">Validité</th>
                <th className="p-4 text-right">Total TTC</th>
                <th className="p-4 text-right">Acompte</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions (Visualiser / CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-sm">
                    Aucune proforma trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((pro) => {
                  const recipientName =
                    pro.client?.company ||
                    pro.client?.name ||
                    `${pro.prospect?.firstName || ""} ${pro.prospect?.lastName || ""}`.trim() ||
                    "Client";
                  const phone = pro.client?.phone || pro.prospect?.phone || "261345403898";
                  const waUrl = buildWhatsAppUrl(
                    phone,
                    `Bonjour ${recipientName}, veuillez trouver ci-joint votre facture proforma ${pro.proformaNumber} d'un montant de ${formatCurrency(pro.total, pro.currency || "Ar")} (Acompte 50% : ${formatCurrency(pro.depositAmount, pro.currency || "Ar")}).`
                  );

                  return (
                    <tr key={pro.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <Link
                          href={`/proformas/${pro.id}`}
                          className="hover:text-brand-800 transition-colors flex items-center gap-1.5"
                        >
                          <span>{pro.proformaNumber}</span>
                        </Link>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{recipientName}</td>
                      <td className="p-4 text-slate-600">{formatDate(pro.date)}</td>
                      <td className="p-4 text-slate-600">{formatDate(pro.validityDate)}</td>
                      <td className="p-4 text-right font-bold text-slate-900">
                        {formatCurrency(pro.total, pro.currency || "Ar")}
                      </td>
                      <td className="p-4 text-right font-bold text-brand-800">
                        {formatCurrency(pro.depositAmount, pro.currency || "Ar")}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {pro.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Bouton Visualiser le PDF et Télécharger */}
                        <Link
                          href={`/proformas/${pro.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
                          title="Visualiser et Télécharger le PDF A4"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Voir PDF</span>
                        </Link>

                        {/* Bouton WhatsApp */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Envoyer via WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>

                        {/* Bouton Modifier */}
                        <button
                          onClick={() => openEdit(pro)}
                          className="inline-flex items-center p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          title="Modifier la proforma"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Bouton Supprimer */}
                        <button
                          onClick={() => handleDelete(pro.id, pro.proformaNumber)}
                          className="inline-flex items-center p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Supprimer la proforma"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création Proforma */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Générer une Facture Proforma
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cible</label>
                  <select
                    value={targetType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setTargetType(val);
                      if (val === "client") setTargetId(clients[0]?.id || "");
                      else setTargetId(prospects[0]?.id || "");
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="client">Client existant</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destinataire *</label>
                  <select
                    required
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {targetType === "client"
                      ? clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.company || c.name} ({c.email})
                          </option>
                        ))
                      : prospects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.firstName} {p.lastName} {p.company ? `(${p.company})` : ""}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Devise</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  >
                    <option value="Ar">🇲🇬 Ariary malgache (Ar) — Par défaut</option>
                    <option value="EUR">🇪🇺 Euro (€)</option>
                    <option value="USD">🇺🇸 Dollar américain ($)</option>
                  </select>
                </div>
              </div>

              {/* Lignes d'articles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Prestations de la Proforma</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-semibold text-brand-800 hover:text-brand-900"
                  >
                    + Ajouter une ligne
                  </button>
                </div>

                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <input
                      type="text"
                      placeholder="Description du service..."
                      required
                      value={it.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Qté"
                      min="1"
                      required
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                      className="w-16 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none text-center"
                    />
                    <input
                      type="number"
                      placeholder={`Prix Unit. (${getCurrencySymbol(currency)})`}
                      min="0"
                      step={currency === "Ar" ? "50000" : "10"}
                      required
                      value={it.unitPrice}
                      onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                      className="w-28 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none text-right"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Réglages Financiers */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Remise globale ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Acompte à l'engagement (%)</label>
                  <select
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value={50}>50 % (Standard M-It LevelUp)</option>
                    <option value={30}>30 %</option>
                    <option value={100}>100 % (Règlement intégral)</option>
                  </select>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Conditions de validité</label>
                <textarea
                  rows={2}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
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
                  placeholder="Écrivez ici vos phrases personnalisées pour cette facture proforma (garantie, conditions spécifiques, remerciements...)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Récapitulatif */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Sous-total HT :</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-slate-200">
                  <span>Total TTC :</span>
                  <span>{formatCurrency(total, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-800">
                  <span>Acompte ({depositPercent}%) :</span>
                  <span>{formatCurrency(depositAmount, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-700">
                  <span>Reste à la livraison :</span>
                  <span>{formatCurrency(remainderAmount, currency)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 shadow-md"
                >
                  Créer et Prévisualiser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modification Proforma */}
      {editingProforma && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Modifier la Proforma {editingProforma.proformaNumber}
              </h3>
              <button onClick={() => setEditingProforma(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="overflow-y-auto p-6 space-y-4">
              {/* Lignes d'articles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Prestations de la Proforma</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-semibold text-brand-800 hover:text-brand-900"
                  >
                    + Ajouter une ligne
                  </button>
                </div>

                {items.map((it, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <input
                      type="text"
                      placeholder="Description du service..."
                      required
                      value={it.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Qté"
                      min="1"
                      required
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                      className="w-16 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none text-center"
                    />
                    <input
                      type="number"
                      placeholder={`Prix Unit. (${getCurrencySymbol(currency)})`}
                      min="0"
                      step={currency === "Ar" ? "50000" : "10"}
                      required
                      value={it.unitPrice}
                      onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                      className="w-28 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none text-right"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Réglages Financiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Remise ({getCurrencySymbol(currency)})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Acompte (%)</label>
                  <select
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value={50}>50 % (Standard)</option>
                    <option value={30}>30 %</option>
                    <option value={100}>100 % (Intégral)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Devise</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  >
                    <option value="Ar">🇲🇬 Ariary malgache (Ar) — Par défaut</option>
                    <option value="EUR">🇪🇺 Euro (€)</option>
                    <option value="USD">🇺🇸 Dollar américain ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Conditions</label>
                <textarea
                  rows={2}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
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
                  placeholder="Écrivez ici vos phrases personnalisées pour cette facture proforma (garantie, conditions spécifiques, remerciements...)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Récapitulatif */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Nouveau Total TTC :</span>
                  <span className="font-bold text-slate-900">{formatCurrency(total, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-800">
                  <span>Acompte ({depositPercent}%) :</span>
                  <span>{formatCurrency(depositAmount, currency)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProforma(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 shadow-md"
                >
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
