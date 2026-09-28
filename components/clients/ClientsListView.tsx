"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Briefcase,
  Building,
  Phone,
  Send,
  Globe,
  Rocket,
  CreditCard,
  ChevronRight,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function ClientsListView({ initialClients }: { initialClients: any[] }) {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>(initialClients);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "+261 34 ",
    whatsapp: "",
    email: "",
    address: "",
    city: "Antananarivo",
    nif: "",
    stat: "",
    website: "",
    notes: "",
  });

  const openNewModal = () => {
    setEditingClient(null);
    setFormData({
      name: "",
      company: "",
      phone: "+261 34 ",
      whatsapp: "",
      email: "",
      address: "",
      city: "Antananarivo",
      nif: "",
      stat: "",
      website: "",
      notes: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingClient(c);
    setFormData({
      name: c.name || "",
      company: c.company || "",
      phone: c.phone || "",
      whatsapp: c.whatsapp || "",
      email: c.email || "",
      address: c.address || "",
      city: c.city || "Antananarivo",
      nif: c.nif || "",
      stat: c.stat || "",
      website: c.website || "",
      notes: c.notes || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        const res = await fetch(`/api/clients/${editingClient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setClients(clients.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setClients([created, ...clients]);
          setModalOpen(false);
          router.push(`/clients/${created.id}`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Confirmer la suppression du client "${name}" ainsi que ses données associées ?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients(clients.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = clients.filter((c) =>
    `${c.name} ${c.company} ${c.email || ""} ${c.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Portefeuille Clients
          </h1>
          <p className="text-sm text-slate-500">
            Fiches 360° : projets, facturation, contrats, hébergements et historique
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouveau Client
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un client (nom, entreprise, email, téléphone)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Grille de fiches clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map((client) => {
          const activeProjects = client.projects?.filter((p: any) => p.status !== "TERMINE").length || 0;
          const unpaidInvoices = client.invoices?.filter((inv: any) => inv.status !== "PAYEE").length || 0;
          const domainsCount = client.domains?.length || 0;
          const waPhone = client.whatsapp || client.phone.replace(/[^0-9]/g, "");
          const waUrl = buildWhatsAppUrl(
            waPhone,
            `Bonjour ${client.name}, nous restons à votre disposition pour le suivi de votre projet digital avec M-It LevelUp.`
          );

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-800 transition-colors">
                      {client.company || client.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Contact : {client.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(client)}
                      className="p-1 rounded-lg text-slate-400 hover:text-brand-800 hover:bg-slate-100 transition-colors"
                      title="Modifier les informations"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(client.id, client.company || client.name)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Supprimer ce client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
                      {client.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 my-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{client.phone}</span>
                  </div>
                  {client.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <a
                        href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-700 hover:underline truncate"
                      >
                        {client.website}
                      </a>
                    </div>
                  )}
                  {client.nif && (
                    <div className="text-[11px] text-slate-400">
                      NIF : {client.nif} {client.stat ? `• STAT : ${client.stat}` : ""}
                    </div>
                  )}
                </div>

                {/* Badges d'état du compte */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                    <Rocket className="w-3 h-3" /> {activeProjects} projet(s)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-cyan-50 text-cyan-700">
                    <Globe className="w-3 h-3" /> {domainsCount} domaine(s)
                  </span>
                  {unpaidInvoices > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700">
                      <CreditCard className="w-3 h-3" /> {unpaidInvoices} impayé(s)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                      <CreditCard className="w-3 h-3" /> À jour
                    </span>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </a>
                <Link
                  href={`/clients/${client.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Ouvrir Fiche 360°</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nouveau Client */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingClient ? `Modifier : ${editingClient.company || editingClient.name}` : "Ajouter un Nouveau Client"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom du contact *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom Entreprise *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIF</label>
                  <input
                    type="text"
                    value={formData.nif}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                    placeholder="Ex: 5019189714"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">STAT</label>
                  <input
                    type="text"
                    value={formData.stat}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                    placeholder="Ex: 62011 11 2025 0 03126"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Site internet</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  {editingClient ? "Enregistrer les modifications" : "Créer et ouvrir fiche"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
