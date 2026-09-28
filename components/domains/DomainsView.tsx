"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Globe,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building,
  DollarSign,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import { formatAriary, formatDate, daysUntil } from "@/lib/formatters";
import { buildWhatsAppUrl, generateRenewalMessage } from "@/lib/whatsapp";

interface DomainsViewProps {
  initialDomains: any[];
  clients: any[];
}

export function DomainsView({ initialDomains, clients }: DomainsViewProps) {
  const [domains, setDomains] = useState<any[]>(initialDomains);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState<any | null>(null);

  // Form State
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [domainName, setDomainName] = useState("www.client.com");
  const [extension, setExtension] = useState(".com");
  const [registrar, setRegistrar] = useState("Hostinger International");
  const [expirationDate, setExpirationDate] = useState("");
  const [sellingPrice, setSellingPrice] = useState(300000);
  const [status, setStatus] = useState("ACTIF");

  const openNewModal = () => {
    setEditingDomain(null);
    setClientId(clients[0]?.id || "");
    setDomainName("www.");
    setExtension(".com");
    setRegistrar("Hostinger International");
    setExpirationDate("");
    setSellingPrice(300000);
    setStatus("ACTIF");
    setModalOpen(true);
  };

  const openEditModal = (d: any) => {
    setEditingDomain(d);
    setClientId(d.clientId || clients[0]?.id || "");
    setDomainName(d.domainName || "");
    setExtension(d.extension || ".com");
    setRegistrar(d.registrar || "");
    setExpirationDate(d.expirationDate ? d.expirationDate.slice(0, 10) : "");
    setSellingPrice(d.sellingPrice || 300000);
    setStatus(d.status || "ACTIF");
    setModalOpen(true);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDomain) {
        const res = await fetch(`/api/domains/${editingDomain.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domainName,
            extension,
            registrar,
            expirationDate,
            sellingPrice: Number(sellingPrice),
            status,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setDomains(domains.map((d) => (d.id === updated.id ? { ...d, ...updated } : d)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/domains", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            domainName,
            extension,
            registrar,
            expirationDate,
            sellingPrice: Number(sellingPrice),
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setDomains([...domains, created]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDomain = async (id: string, name: string) => {
    if (!confirm(`Confirmer la suppression du domaine "${name}" ?`)) return;
    try {
      const res = await fetch(`/api/domains/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDomains(domains.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = domains.filter((d) =>
    `${d.domainName} ${d.registrar} ${d.client?.company || d.client?.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestion des Noms de Domaine
          </h1>
          <p className="text-sm text-slate-500">
            Surveillance des échéances (90j, 30j, 15j, 7j) et renouvellements clients
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Domaine
        </button>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par domaine, registrar, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table des Domaines */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Domaine</th>
                <th className="p-4">Client</th>
                <th className="p-4">Registrar</th>
                <th className="p-4">Expiration</th>
                <th className="p-4">Délai Restant</th>
                <th className="p-4 text-right">Prix Client</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((dom) => {
                const daysLeft = daysUntil(dom.expirationDate);
                let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                let statusLabel = "🟢 Actif";

                if (daysLeft < 0) {
                  badgeColor = "bg-rose-50 text-rose-700 border-rose-200";
                  statusLabel = "🔴 Expiré";
                } else if (daysLeft <= 30) {
                  badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                  statusLabel = "🟠 Expire bientôt";
                }

                const clientPhone = dom.client?.whatsapp || dom.client?.phone?.replace(/[^0-9]/g, "");
                const waUrl = buildWhatsAppUrl(
                  clientPhone || "261345403898",
                  generateRenewalMessage({
                    clientName: dom.client?.name || "Client",
                    domainName: dom.domainName,
                    expirationDate: formatDate(dom.expirationDate),
                    amount: formatAriary(dom.sellingPrice),
                  })
                );

                return (
                  <tr key={dom.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-brand-800" />
                        {dom.domainName}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {dom.client?.company || dom.client?.name}
                    </td>
                    <td className="p-4 text-slate-600">{dom.registrar}</td>
                    <td className="p-4 text-slate-600">{formatDate(dom.expirationDate)}</td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          daysLeft <= 30 ? "text-amber-600" : "text-slate-600"
                        }`}
                      >
                        {daysLeft < 0
                          ? `Expiré il y a ${Math.abs(daysLeft)} j`
                          : `${daysLeft} jours restants`}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">
                      {formatAriary(dom.sellingPrice)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${badgeColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs"
                          title="Proposer le renouvellement sur WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>Renouveler</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => openEditModal(dom)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-800 hover:bg-slate-100 transition-colors"
                          title="Modifier le domaine"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDomain(dom.id, dom.domainName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Supprimer ce domaine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Créer / Modifier Domaine */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingDomain ? `Modifier : ${editingDomain.domainName}` : "Enregistrer un Nom de Domaine"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDomain} className="space-y-4">
              {!editingDomain ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Client *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut du Domaine</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="ACTIF">Actif</option>
                    <option value="A_RENOUVELER">À renouveler</option>
                    <option value="EXPIRE">Expiré</option>
                    <option value="TRANSFERE">Transféré</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom de domaine *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: www.mpanorinanofy.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registrar</label>
                  <input
                    type="text"
                    value={registrar}
                    onChange={(e) => setRegistrar(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date Expiration *</label>
                  <input
                    type="date"
                    required
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prix facturé au client (Ar/an)</label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
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
                  {editingDomain ? "Enregistrer les modifications" : "Enregistrer le Domaine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
