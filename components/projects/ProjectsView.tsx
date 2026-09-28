"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Rocket,
  Calendar,
  Building,
  DollarSign,
  User,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import { formatAriary, formatDate } from "@/lib/formatters";

const PROJECT_STATUSES = [
  { key: "A_DEMARRER", label: "À démarrer", color: "bg-slate-100 text-slate-700" },
  { key: "EN_PREPARATION", label: "En préparation", color: "bg-blue-50 text-blue-700" },
  { key: "EN_DEVELOPPEMENT", label: "En développement", color: "bg-indigo-50 text-indigo-700" },
  { key: "EN_ATTENTE_CLIENT", label: "En attente client", color: "bg-amber-50 text-amber-700" },
  { key: "CORRECTIONS", label: "Corrections", color: "bg-purple-50 text-purple-700" },
  { key: "PRET_A_LIVRER", label: "Prêt à livrer", color: "bg-cyan-50 text-cyan-700" },
  { key: "LIVRE", label: "Livré", color: "bg-emerald-50 text-emerald-700" },
  { key: "MAINTENANCE", label: "Maintenance", color: "bg-teal-50 text-teal-700" },
  { key: "TERMINE", label: "Terminé", color: "bg-gray-100 text-gray-700" },
];

interface ProjectsViewProps {
  initialProjects: any[];
  clients: any[];
  team: any[];
}

export function ProjectsView({
  initialProjects,
  clients,
  team,
}: ProjectsViewProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [type, setType] = useState("Application Web");
  const [status, setStatus] = useState("EN_DEVELOPPEMENT");
  const [managerId, setManagerId] = useState(team[0]?.id || "");
  const [totalAmount, setTotalAmount] = useState(2700000);
  const [targetDeliveryDate, setTargetDeliveryDate] = useState("");
  const [description, setDescription] = useState("");

  const openNewModal = () => {
    setEditingProject(null);
    setTitle("");
    setClientId(clients[0]?.id || "");
    setType("Application Web");
    setStatus("A_DEMARRER");
    setManagerId(team[0]?.id || "");
    setTotalAmount(2700000);
    setTargetDeliveryDate("");
    setDescription("");
    setModalOpen(true);
  };

  const openEditModal = (pr: any) => {
    setEditingProject(pr);
    setTitle(pr.title || "");
    setClientId(pr.clientId || clients[0]?.id || "");
    setType(pr.type || "Application Web");
    setStatus(pr.status || "EN_DEVELOPPEMENT");
    setManagerId(pr.managerId || team[0]?.id || "");
    setTotalAmount(pr.totalAmount || 0);
    setTargetDeliveryDate(pr.targetDeliveryDate ? pr.targetDeliveryDate.slice(0, 10) : "");
    setDescription(pr.description || "");
    setModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            type,
            status,
            totalAmount: Number(totalAmount),
            depositAmount: Number(totalAmount) * 0.5,
            remainderAmount: Number(totalAmount) * 0.5,
            targetDeliveryDate: targetDeliveryDate || null,
            description,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setProjects(projects.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            clientId,
            type,
            managerId,
            totalAmount: Number(totalAmount),
            depositAmount: Number(totalAmount) * 0.5,
            remainderAmount: Number(totalAmount) * 0.5,
            targetDeliveryDate,
            description,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setProjects([created, ...projects]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Confirmer la suppression du projet "${title}" et de toutes ses tâches ?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = projects.filter((pr) => {
    const matchesSearch = `${pr.projectNumber} ${pr.title} ${pr.client?.company || pr.client?.name}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || pr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestion des Projets
          </h1>
          <p className="text-sm text-slate-500">
            Suivi des livraisons, jalons techniques, gestion des sprints et équipes
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouveau Projet
        </button>
      </div>

      {/* Recherche & Filtres */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro de projet, titre, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
        >
          <option value="ALL">Tous les statuts</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grille des Projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pr) => {
          const statusObj =
            PROJECT_STATUSES.find((s) => s.key === pr.status) || PROJECT_STATUSES[0];
          const tasksCount = pr.tasks?.length || 0;
          const completedTasks =
            pr.tasks?.filter((t: any) => t.status === "TERMINE").length || 0;
          const progress = tasksCount > 0 ? Math.round((completedTasks / tasksCount) * 100) : 40;

          return (
            <div
              key={pr.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-800">
                      {pr.projectNumber}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 leading-snug mt-0.5">
                      {pr.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border border-slate-200 ${statusObj.color}`}
                    >
                      {statusObj.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(pr)}
                      className="p-1 rounded-lg text-slate-400 hover:text-brand-800 hover:bg-slate-100 transition-colors"
                      title="Modifier le projet"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(pr.id, pr.title)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Supprimer ce projet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pr.client?.company || pr.client?.name}</span>
                </div>

                {pr.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 bg-slate-50 p-2.5 rounded-xl">
                    {pr.description}
                  </p>
                )}

                {/* Barre de Progression */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                    <span>Avancement</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-800 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Données financières */}
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs space-y-1 mb-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Budget global :</span>
                    <span className="font-bold text-slate-900">{formatAriary(pr.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Acompte perçu :</span>
                    <span className="font-semibold text-emerald-700">{formatAriary(pr.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Reste livraison :</span>
                    <span className="font-semibold text-amber-700">{formatAriary(pr.remainderAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {pr.targetDeliveryDate ? formatDate(pr.targetDeliveryDate) : "En cours"}
                </span>
                <span className="font-semibold text-slate-700">
                  {pr.manager?.name || "Équipe M-It"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Créer / Modifier Projet */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingProject ? `Modifier : ${editingProject.title}` : "Lancer un Nouveau Projet"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre du Projet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Refonte Site E-Commerce Mpanorina Nofy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              {editingProject && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut du Projet</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {!editingProject ? (
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Client</label>
                    <input
                      type="text"
                      disabled
                      value={editingProject.client?.company || editingProject.client?.name || ""}
                      className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type de Projet</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Application Web">Application Web</option>
                    <option value="Site Vitrine">Site Vitrine</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Application Mobile">Application Mobile</option>
                    <option value="Maintenance & SEO">Maintenance & SEO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Total (Ar) *</label>
                  <input
                    type="number"
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date Livraison Prévue</label>
                  <input
                    type="date"
                    value={targetDeliveryDate}
                    onChange={(e) => setTargetDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Objectifs</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Spécifications, fonctionnalités majeures..."
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
                  {editingProject ? "Enregistrer les modifications" : "Créer le Projet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
