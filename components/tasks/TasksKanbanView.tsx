"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  CheckSquare,
  Clock,
  User,
  AlertCircle,
  MoreVertical,
  X,
  Calendar,
  Building,
  Edit2,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/formatters";

const COLUMNS = [
  { key: "A_FAIRE", label: "À faire", color: "border-slate-300 text-slate-700 bg-slate-100" },
  { key: "EN_COURS", label: "En cours", color: "border-indigo-300 text-indigo-700 bg-indigo-50" },
  { key: "EN_REVUE", label: "En revue", color: "border-amber-300 text-amber-700 bg-amber-50" },
  { key: "TERMINE", label: "Terminé", color: "border-emerald-300 text-emerald-700 bg-emerald-50" },
];

const PRIORITIES = [
  { key: "BASSE", label: "Basse", color: "bg-slate-100 text-slate-600" },
  { key: "NORMALE", label: "Normale", color: "bg-blue-50 text-blue-700" },
  { key: "IMPORTANTE", label: "Importante", color: "bg-amber-50 text-amber-700" },
  { key: "URGENTE", label: "Urgente", color: "bg-rose-50 text-rose-700" },
];

interface TasksKanbanViewProps {
  initialTasks: any[];
  projects: any[];
  team: any[];
}

export function TasksKanbanView({
  initialTasks,
  projects,
  team,
}: TasksKanbanViewProps) {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [assigneeId, setAssigneeId] = useState(team[0]?.id || "");
  const [priority, setPriority] = useState("NORMALE");
  const [dueDate, setDueDate] = useState("");

  const openNewModal = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setProjectId(projects[0]?.id || "");
    setAssigneeId(team[0]?.id || "");
    setPriority("NORMALE");
    setDueDate("");
    setModalOpen(true);
  };

  const openEditModal = (t: any) => {
    setEditingTask(t);
    setTitle(t.title || "");
    setDescription(t.description || "");
    setProjectId(t.projectId || projects[0]?.id || "");
    setAssigneeId(t.assigneeId || team[0]?.id || "");
    setPriority(t.priority || "NORMALE");
    setDueDate(t.dueDate ? t.dueDate.slice(0, 10) : "");
    setModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const res = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingTask.id,
            title,
            description,
            priority,
            assigneeId: assigneeId || null,
            dueDate: dueDate || null,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setTasks(tasks.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            projectId,
            assigneeId,
            priority,
            dueDate,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setTasks([...tasks, created]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string, title: string) => {
    if (!confirm(`Confirmer la suppression de la tâche "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (res.ok) {
        setTasks(
          tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = tasks.filter((t) =>
    `${t.title} ${t.project?.title || ""} ${t.assignee?.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Tableau Kanban des Tâches
          </h1>
          <p className="text-sm text-slate-500">
            Organisation du travail technique, gestion des sprints et priorités
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Tâche
        </button>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une tâche, un projet, un développeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-slate-100/70 rounded-2xl p-3.5 border border-slate-200/70 flex flex-col min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 mb-2 border-b border-slate-200/50">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((t) => {
                  const prioObj =
                    PRIORITIES.find((p) => p.key === t.priority) || PRIORITIES[1];

                  return (
                    <div
                      key={t.id}
                      className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${prioObj.color}`}>
                            {prioObj.label}
                          </span>
                          {t.dueDate && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3" />
                              {formatDate(t.dueDate)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(t)}
                            className="p-1 rounded text-slate-400 hover:text-brand-800 hover:bg-slate-100 transition-colors"
                            title="Modifier la tâche"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(t.id, t.title)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer la tâche"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {t.title}
                      </h4>

                      {t.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {t.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[120px] font-semibold text-slate-700">
                          {t.project?.title || "Projet"}
                        </span>
                        <span className="font-medium text-slate-600">
                          {t.assignee?.name?.split(" ")[0] || "Assigné"}
                        </span>
                      </div>

                      {/* Déplacer statut rapide */}
                      <div className="pt-1">
                        <select
                          value={t.status}
                          onChange={(e) => handleMoveStatus(t.id, e.target.value)}
                          className="w-full text-[10px] font-semibold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 outline-none cursor-pointer"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.key} value={c.key}>
                              → {c.label}
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

      {/* Modal Créer / Modifier Tâche */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingTask ? `Modifier la Tâche` : "Créer une Nouvelle Tâche"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de la Tâche *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Intégration de la passerelle MVola"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Projet rattaché *</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Responsable</label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">Non assigné</option>
                    {team.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priorité</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="BASSE">Basse</option>
                    <option value="NORMALE">Normale</option>
                    <option value="IMPORTANTE">Importante</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date limite</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Détails / Spécifications</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails de la tâche..."
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
                  {editingTask ? "Enregistrer les modifications" : "Créer la Tâche"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
