"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Cloud,
  Send,
  Building,
  DollarSign,
  TrendingUp,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import { formatAriary, formatDate, daysUntil } from "@/lib/formatters";
import { buildWhatsAppUrl, generateRenewalMessage } from "@/lib/whatsapp";

interface HostingsViewProps {
  initialHostings: any[];
  clients: any[];
}

export function HostingsView({ initialHostings, clients }: HostingsViewProps) {
  const [hostings, setHostings] = useState<any[]>(initialHostings);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHosting, setEditingHosting] = useState<any | null>(null);

  // Form State
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [domainName, setDomainName] = useState("www.client.com");
  const [provider, setProvider] = useState("Hostinger Cloud");
  const [plan, setPlan] = useState("Cloud Startup NVMe");
  const [expirationDate, setExpirationDate] = useState("");
  const [costPrice, setCostPrice] = useState(120000);
  const [sellingPrice, setSellingPrice] = useState(300000);
  const [status, setStatus] = useState("ACTIF");

  const openNewModal = () => {
    setEditingHosting(null);
    setClientId(clients[0]?.id || "");
    setDomainName("www.");
    setProvider("Hostinger Cloud");
    setPlan("Cloud Startup NVMe");
    setExpirationDate("");
    setCostPrice(120000);
    setSellingPrice(300000);
    setStatus("ACTIF");
    setModalOpen(true);
  };

  const openEditModal = (h: any) => {
    setEditingHosting(h);
    setClientId(h.clientId || clients[0]?.id || "");
    setDomainName(h.domainName || "");
    setProvider(h.provider || "");
    setPlan(h.plan || "");
    setExpirationDate(h.expirationDate ? h.expirationDate.slice(0, 10) : "");
    setCostPrice(h.costPrice || 0);
    setSellingPrice(h.sellingPrice || 0);
    setStatus(h.status || "ACTIF");
    setModalOpen(true);
  };

  const handleSaveHosting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHosting) {
        const res = await fetch(`/api/hostings/${editingHosting.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domainName,
            provider,
            plan,
            expirationDate,
            costPrice: Number(costPrice),
            sellingPrice: Number(sellingPrice),
            status,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setHostings(hostings.map((h) => (h.id === updated.id ? { ...h, ...updated } : h)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/hostings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            domainName,
            provider,
            plan,
            expirationDate,
            costPrice: Number(costPrice),
            sellingPrice: Number(sellingPrice),
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setHostings([...hostings, created]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHosting = async (id: string, name: string) => {
    if (!confirm(`Confirmer la suppression de l'hébergement pour "${name}" ?`)) return;
    try {
      const res = await fetch(`/api/hostings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHostings(hostings.filter((h) => h.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalMargin = hostings.reduce((sum, h) => sum + (h.margin || 0), 0);

  const filtered = hostings.filter((h) =>
    `${h.domainName} ${h.provider} ${h.plan} ${h.client?.company || h.client?.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestion des Hébergements Cloud
          </h1>
          <p className="text-sm text-slate-500">
            Suivi des serveurs infogérés, marges récurrentes et renouvellements annuels
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Hébergement
        </button>
      </div>

      {/* KPI Marge Récurrente */}
      <div className="bg-gradient-to-r from-[#020712] via-[#0b1d3a] to-[#061226] p-6 rounded-2xl text-white shadow-md flex items-center justify-between border border-slate-800/50">
        <div>
          <span className="text-xs font-semibold text-cyan-300 uppercase">
            Marge Brute Annuelle Récurrente
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold mt-1">
            {formatAriary(totalMargin)}
          </p>
          <p className="text-xs text-slate-300 mt-0.5">
            Bénéfice net généré par le parc de {hostings.length} hébergement(s) infogéré(s)
          </p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
          <Cloud className="w-8 h-8 text-cyan-300" />
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par domaine, fournisseur, formule, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table des Hébergements */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Domaine Rattaché</th>
                <th className="p-4">Client</th>
                <th className="p-4">Fournisseur & Formule</th>
                <th className="p-4">Expiration</th>
                <th className="p-4 text-right">Coût / Prix Client</th>
                <th className="p-4 text-right">Marge Nette</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((h) => {
                const daysLeft = daysUntil(h.expirationDate);
                const clientPhone = h.client?.whatsapp || h.client?.phone?.replace(/[^0-9]/g, "");
                const waUrl = buildWhatsAppUrl(
                  clientPhone || "261345403898",
                  generateRenewalMessage({
                    clientName: h.client?.name || "Client",
                    domainName: h.domainName,
                    expirationDate: formatDate(h.expirationDate),
                    amount: formatAriary(h.sellingPrice),
                  })
                );

                return (
                  <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5 text-cyan-600" />
                        {h.domainName}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {h.client?.company || h.client?.name}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-900">{h.provider}</span>
                      <p className="text-[11px] text-slate-400">{h.plan}</p>
                    </td>
                    <td className="p-4 text-slate-600">{formatDate(h.expirationDate)}</td>
                    <td className="p-4 text-right text-slate-600">
                      <div>{formatAriary(h.sellingPrice)}</div>
                      <div className="text-[10px] text-slate-400">Coût: {formatAriary(h.costPrice)}</div>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-700">
                      +{formatAriary(h.margin || (h.sellingPrice - h.costPrice))}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                          daysLeft <= 30
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {daysLeft <= 30 ? "Expire bientôt" : "Actif"}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs"
                          title="Envoyer WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>Renouveler</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => openEditModal(h)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-800 hover:bg-slate-100 transition-colors"
                          title="Modifier l'hébergement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHosting(h.id, h.domainName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Supprimer cet hébergement"
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

      {/* Modal Créer / Modifier Hébergement */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingHosting ? `Modifier : ${editingHosting.domainName}` : "Enregistrer un Hébergement Serveur"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHosting} className="space-y-4">
              {!editingHosting ? (
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="ACTIF">Actif</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="RESILIE">Résilié</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Domaine rattaché *</label>
                <input
                  type="text"
                  required
                  placeholder="www.domaine.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hébergeur</label>
                  <input
                    type="text"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Formule / Pack</label>
                  <input
                    type="text"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Coût d'achat (Ar)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prix Client (Ar)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiration *</label>
                  <input
                    type="date"
                    required
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
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
                  {editingHosting ? "Enregistrer les modifications" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
