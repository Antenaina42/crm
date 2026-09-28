"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Phone,
  Send,
  Building,
  Mail,
  Calendar,
  MoreVertical,
  CheckCircle2,
  FileText,
  UserCheck,
  Globe,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { formatAriary, formatDate } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const STATUSES = [
  { key: "NOUVEAU", label: "Nouveau", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { key: "CONTACTE", label: "Contacté", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "INTERESSE", label: "Intéressé", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { key: "OFFRE_A_PREPARER", label: "Offre à préparer", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "OFFRE_ENVOYEE", label: "Offre envoyée", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "RELANCE", label: "Relance", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { key: "NEGOCIATION", label: "Négociation", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { key: "GAGNE", label: "Gagné", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "PERDU", label: "Perdu", color: "bg-gray-100 text-gray-500 border-gray-200" },
];

export function ProspectsView({ initialProspects }: { initialProspects: any[] }) {
  const router = useRouter();
  const [prospects, setProspects] = useState<any[]>(initialProspects);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "Antananarivo",
    sector: "",
    source: "Prospection directe",
    website: "",
    needType: "",
    estimatedBudget: "",
    status: "NOUVEAU",
    notes: "",
  });

  const openNewModal = () => {
    setEditingProspect(null);
    setFormData({
      firstName: "",
      lastName: "",
      company: "",
      phone: "+261 34 ",
      whatsapp: "",
      email: "",
      address: "",
      city: "Antananarivo",
      sector: "Commerce",
      source: "Prospection directe",
      website: "",
      needType: "Création site web / Application",
      estimatedBudget: "1500000",
      status: "NOUVEAU",
      notes: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProspect(p);
    setFormData({
      firstName: p.firstName,
      lastName: p.lastName,
      company: p.company || "",
      phone: p.phone,
      whatsapp: p.whatsapp || "",
      email: p.email || "",
      address: p.address || "",
      city: p.city || "Antananarivo",
      sector: p.sector || "",
      source: p.source || "Prospection",
      website: p.website || "",
      needType: p.needType || "",
      estimatedBudget: p.estimatedBudget ? String(p.estimatedBudget) : "",
      status: p.status,
      notes: p.notes || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProspect) {
        const res = await fetch(`/api/prospects/${editingProspect.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setProspects(prospects.map((p) => (p.id === updated.id ? updated : p)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/prospects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setProspects([created, ...prospects]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/prospects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProspects(
          prospects.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertToClient = async (p: any) => {
    if (!confirm(`Confirmer la conversion du prospect ${p.firstName} ${p.lastName} en client officiel M-It LevelUp ?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/prospects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "convert" }),
      });
      if (res.ok) {
        const data = await res.json();
        setProspects(
          prospects.map((item) =>
            item.id === p.id ? { ...item, status: "GAGNE" } : item
          )
        );
        router.push(`/clients/${data.client.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce prospect ?")) return;
    try {
      const res = await fetch(`/api/prospects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProspects(prospects.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtrage
  const filtered = prospects.filter((p) => {
    const matchesSearch =
      `${p.firstName} ${p.lastName} ${p.company || ""} ${p.needType || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pipeline des Prospects
          </h1>
          <p className="text-sm text-slate-500">
            Suivi des opportunités commerciales et conversion en clients
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "kanban"
                  ? "bg-brand-800 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-brand-800 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tableau</span>
            </button>
          </div>

          <button
            onClick={openNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nouveau Prospect
          </button>
        </div>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, entreprise, besoin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="ALL">Tous les statuts</option>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vue KANBAN */}
      {viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
          {STATUSES.map((status) => {
            const columnProspects = filtered.filter((p) => p.status === status.key);

            return (
              <div
                key={status.key}
                className="w-72 shrink-0 bg-slate-100/70 rounded-2xl p-3 border border-slate-200/60 flex flex-col max-h-[750px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-bold border ${status.color}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {columnProspects.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnProspects.map((p) => {
                    const waPhone = p.whatsapp || p.phone.replace(/[^0-9]/g, "");
                    const waUrl = buildWhatsAppUrl(
                      waPhone,
                      `Bonjour ${p.firstName}, nous faisons suite à votre demande concernant votre projet digital avec l'agence M-It LevelUp.`
                    );

                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group relative"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="font-bold text-sm text-slate-900 leading-tight">
                            {p.firstName} {p.lastName}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {p.company && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-2">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{p.company}</span>
                          </div>
                        )}

                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg">
                          {p.needType || p.notes || "Projet digital M-It LevelUp"}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="font-bold text-slate-800">
                            {p.estimatedBudget ? formatAriary(p.estimatedBudget) : "-"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(p.createdAt)}
                          </span>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                          >
                            <Send className="w-3 h-3" /> WhatsApp
                          </a>
                          <button
                            onClick={() => router.push(`/offers?prospectId=${p.id}&new=true`)}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold transition-colors"
                          >
                            <FileText className="w-3 h-3" /> Offre
                          </button>
                          {p.status !== "GAGNE" && (
                            <button
                              onClick={() => handleConvertToClient(p)}
                              title="Convertir en Client"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </button>
                          )}
                        </div>

                        {/* Change Status Dropdown */}
                        <div className="mt-2">
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                            className="w-full text-[10px] font-semibold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 outline-none cursor-pointer"
                          >
                            {STATUSES.map((s) => (
                              <option key={s.key} value={s.key}>
                                Déplacer vers : {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vue TABLE */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Prospect</th>
                  <th className="p-4">Entreprise</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Besoin</th>
                  <th className="p-4">Budget Estimé</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const statusObj = STATUSES.find((s) => s.key === p.status) || STATUSES[0];
                  const waPhone = p.whatsapp || p.phone.replace(/[^0-9]/g, "");
                  const waUrl = buildWhatsAppUrl(
                    waPhone,
                    `Bonjour ${p.firstName}, nous faisons suite à votre demande avec M-It LevelUp.`
                  );

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {p.firstName} {p.lastName}
                        <div className="text-[11px] font-normal text-slate-400">
                          {p.source || "Prospection"}
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">
                        {p.company || "-"}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-800 font-medium">{p.phone}</div>
                        {p.email && <div className="text-slate-400 text-[11px]">{p.email}</div>}
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">
                        {p.needType || "-"}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {p.estimatedBudget ? formatAriary(p.estimatedBudget) : "-"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold border ${statusObj.color}`}>
                          {statusObj.label}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => router.push(`/offers?prospectId=${p.id}&new=true`)}
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-brand-50 text-brand-800 hover:bg-brand-100 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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
      )}

      {/* Modal Création / Édition Prospect */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingProspect ? "Modifier le Prospect" : "Ajouter un Nouveau Prospect"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entreprise</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Secteur d'activité</label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Prospection directe">Prospection directe</option>
                    <option value="Recommandation client">Recommandation client</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Site web contact">Site web contact</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut initial</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type de besoin</label>
                  <input
                    type="text"
                    value={formData.needType}
                    onChange={(e) => setFormData({ ...formData, needType: e.target.value })}
                    placeholder="Ex: Site vitrine, Application web, E-commerce"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget estimé (Ar)</label>
                  <input
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    placeholder="Ex: 2700000"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes et échanges</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Détails de l'échange, attentes particulières..."
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
                  {editingProspect ? "Enregistrer les modifications" : "Créer le Prospect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
