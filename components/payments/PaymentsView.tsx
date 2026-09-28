"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  CreditCard,
  DollarSign,
  TrendingUp,
  Smartphone,
  Building,
  CheckCircle2,
  Calendar,
  X,
  Trash2,
} from "lucide-react";
import { formatAriary, formatDate } from "@/lib/formatters";

interface PaymentsViewProps {
  initialPayments: any[];
  invoices: any[];
}

export function PaymentsView({ initialPayments, invoices }: PaymentsViewProps) {
  const [payments, setPayments] = useState<any[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeletePayment = async (id: string, paymentNumber: string) => {
    if (!confirm(`Annuler et supprimer le paiement "${paymentNumber}" ? Les montants restants de la facture seront réajustés.`)) return;
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPayments(payments.filter((p) => p.id !== id));
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Form State
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id || "");
  const [amount, setAmount] = useState<number>(invoices[0]?.remainingAmount || 1000000);
  const [method, setMethod] = useState("MVOLA");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  const handleInvoiceChange = (id: string) => {
    setInvoiceId(id);
    const selectedInv = invoices.find((i) => i.id === id);
    if (selectedInv) {
      setAmount(selectedInv.remainingAmount || selectedInv.total);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedInv = invoices.find((i) => i.id === invoiceId);
    if (!selectedInv) return;

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          clientId: selectedInv.clientId,
          amount: Number(amount),
          method,
          reference,
          notes,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setPayments([created, ...payments]);
        setModalOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      `${p.paymentNumber} ${p.reference || ""} ${p.client?.company || p.client?.name} ${p.invoice?.invoiceNumber}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesMethod = methodFilter === "ALL" || p.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Journal des Encaissements
          </h1>
          <p className="text-sm text-slate-500">
            Suivi des paiements Mobile Money (MVola, Orange), virements bancaires et espèces
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Enregistrer un Paiement
        </button>
      </div>

      {/* Mini KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Encaissé</span>
            <p className="text-xl font-bold text-slate-900">{formatAriary(totalCollected)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-50 text-brand-800">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Transactions Validées</span>
            <p className="text-xl font-bold text-slate-900">{payments.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Canal Favori</span>
            <p className="text-xl font-bold text-slate-900">MVola / Mobile</p>
          </div>
        </div>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par référence, client, facture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
        >
          <option value="ALL">Toutes les méthodes</option>
          <option value="MVOLA">MVola</option>
          <option value="ORANGE_MONEY">Orange Money</option>
          <option value="AIRTEL_MONEY">Airtel Money</option>
          <option value="VIREMENT_BANCAIRE">Virement Bancaire</option>
          <option value="ESPECES">Espèces</option>
        </select>
      </div>

      {/* Table des Paiements */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">N° Paiement</th>
                <th className="p-4">Client</th>
                <th className="p-4">Facture Rattachée</th>
                <th className="p-4">Date</th>
                <th className="p-4">Méthode</th>
                <th className="p-4">Référence</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{p.paymentNumber}</td>
                  <td className="p-4 font-semibold text-slate-800">
                    {p.client?.company || p.client?.name}
                  </td>
                  <td className="p-4 text-brand-800 font-semibold">
                    {p.invoice?.invoiceNumber || "-"}
                  </td>
                  <td className="p-4 text-slate-600">{formatDate(p.date)}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      {p.method.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{p.reference || "-"}</td>
                  <td className="p-4 text-right font-extrabold text-sm text-emerald-700">
                    +{formatAriary(p.amount)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeletePayment(p.id, p.paymentNumber)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Supprimer l'encaissement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouveau Paiement */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Enregistrer un Encaissement
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Facture concernée *</label>
                <select
                  required
                  value={invoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} — {inv.client?.company || inv.client?.name} (Reste: {formatAriary(inv.remainingAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Montant perçu (Ar) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mode de règlement *</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="MVOLA">MVola</option>
                    <option value="ORANGE_MONEY">Orange Money</option>
                    <option value="AIRTEL_MONEY">Airtel Money</option>
                    <option value="VIREMENT_BANCAIRE">Virement Bancaire</option>
                    <option value="ESPECES">Espèces</option>
                    <option value="CHEQUE">Chèque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Référence transaction (TXN / N° Chèque / Réf Virement)</label>
                <input
                  type="text"
                  placeholder="Ex: MVOLA-2026-99213"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes internes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
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
                  Valider l'encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
