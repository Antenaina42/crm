"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Briefcase,
  Key,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building,
  Send,
  AlertTriangle,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  active: boolean;
  createdAt: string;
  _count?: {
    prospects: number;
    projects: number;
    tasks: number;
  };
}

export function UsersManagementView() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "COMMERCIAL",
    phone: "",
    active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "COMMERCIAL",
      phone: "",
      active: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
      active: user.active,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Une erreur est survenue");
      } else {
        setIsModalOpen(false);
        await loadUsers();
      }
    } catch (err) {
      setFormError("Impossible de communiquer avec le serveur");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (user: UserItem) => {
    if (!confirm(`Confirmez-vous la suppression du compte de ${user.name} ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erreur lors de la suppression");
      } else {
        await loadUsers();
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  const handleToggleActive = async (user: UserItem) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      });
      if (res.ok) {
        await loadUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const countCommercials = users.filter((u) => u.role === "COMMERCIAL").length;
  const countAdmins = users.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;
  const countActive = users.filter((u) => u.active).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-brand-50 text-brand-800">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Gestion des Utilisateurs &amp; Équipe
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Contrôle des accès, profils commerciaux dédiés et droits d'administration de M-It LevelUp
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-900/10 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Équipe</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{users.length}</p>
          <span className="text-[10px] text-slate-400">Comptes enregistrés</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/40 to-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-900">Profils Commerciaux</span>
            <span className="p-1 rounded-md bg-cyan-100 text-cyan-700">
              <Briefcase className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-cyan-900 mt-1">{countCommercials}</p>
          <span className="text-[10px] text-cyan-600 font-medium">Prospects, Offres &amp; Proformas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Administrateurs</span>
            <span className="p-1 rounded-md bg-slate-100 text-slate-700">
              <Shield className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{countAdmins}</p>
          <span className="text-[10px] text-slate-400">Accès intégral</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Comptes Actifs</span>
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <UserCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">{countActive}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Autorisés à se connecter</span>
        </div>
      </div>

      {/* Explication du Rôle Commercial */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 rounded-2xl text-white shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Rôle Spécifique : Profil Commercial M-It LevelUp
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Les utilisateurs ayant le rôle <strong>Commercial</strong> ont un accès ciblé exclusivement au cycle de vente :{" "}
              <strong>Prospects</strong>, <strong>Clients</strong>, <strong>Offres commerciales</strong>, et{" "}
              <strong>Factures Proforma avec envoi WhatsApp</strong>. Les données financières confidentielles (factures officielles, encaissements, budget, hébergements) leur sont masquées.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 font-bold text-xs transition-all shadow-xs shrink-0"
        >
          Créer un Commercial
        </button>
      </div>

      {/* Filtres & Recherche */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { label: "Tous les rôles", value: "ALL" },
            { label: "Commerciaux", value: "COMMERCIAL" },
            { label: "Administrateurs", value: "ADMIN" },
            { label: "Super Admins", value: "SUPER_ADMIN" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterRole(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterRole === tab.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table des Utilisateurs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Utilisateur</th>
                <th className="py-3 px-4">Rôle &amp; Périmètre d'Accès</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-center">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Chargement des membres de l'équipe...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                            user.role === "COMMERCIAL"
                              ? "bg-cyan-100 text-cyan-800"
                              : user.role === "SUPER_ADMIN"
                              ? "bg-slate-900 text-white"
                              : "bg-brand-100 text-brand-800"
                          }`}
                        >
                          {user.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {user.role === "COMMERCIAL" ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                            <Briefcase className="w-3 h-3" />
                            Commercial
                          </span>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Prospects • Clients • Offres • Proformas &amp; WhatsApp
                          </p>
                        </div>
                      ) : user.role === "SUPER_ADMIN" ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 text-white">
                            <Shield className="w-3 h-3 text-cyan-400" />
                            Super Admin (Fondateur)
                          </span>
                          <p className="text-[10px] text-slate-500">Accès illimité et direction</p>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
                            <Shield className="w-3 h-3" />
                            Administrateur
                          </span>
                          <p className="text-[10px] text-slate-500">Accès général complet</p>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {user.phone ? (
                        <span className="text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {user.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Non renseigné</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(user)}
                        title={user.active ? "Désactiver ce compte" : "Activer ce compte"}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          user.active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {user.active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Actif
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Inactif
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {user.email !== "admin@m-itlevelup.com" && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Créer / Modifier Utilisateur */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-brand-50 text-brand-800">
                  {editingUser ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingUser ? "Modifier l'Utilisateur" : "Ajouter un Collaborateur"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingUser
                      ? `Modification du profil de ${editingUser.name}`
                      : "Créer un accès sécurisé pour un membre de l'équipe"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sarah Ramanantsoa"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@m-itlevelup.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+261 34 XX XXX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Rôle */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rôle &amp; Permissions *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      formData.role === "COMMERCIAL"
                        ? "border-cyan-500 bg-cyan-50/50 shadow-xs ring-1 ring-cyan-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-950">
                        <Briefcase className="w-4 h-4 text-cyan-600" />
                        <span>Commercial</span>
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="COMMERCIAL"
                        checked={formData.role === "COMMERCIAL"}
                        onChange={() => setFormData({ ...formData, role: "COMMERCIAL" })}
                        className="text-cyan-600 focus:ring-cyan-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Accès ciblé : Prospects, Clients, Offres, Proformas et envoi WhatsApp.
                    </p>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      formData.role === "ADMIN"
                        ? "border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-brand-950">
                        <Shield className="w-4 h-4 text-brand-700" />
                        <span>Administrateur</span>
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="ADMIN"
                        checked={formData.role === "ADMIN"}
                        onChange={() => setFormData({ ...formData, role: "ADMIN" })}
                        className="text-brand-800 focus:ring-brand-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Accès intégral : Factures, compta, projets, paramètres, utilisateurs.
                    </p>
                  </label>
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {editingUser ? "Modifier le mot de passe (laisser vide pour conserver)" : "Mot de passe *"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingUser}
                    placeholder={editingUser ? "•••••••• (inchangé)" : "Minimum 6 caractères"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Statut du compte */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-brand-800 focus:ring-brand-500"
                />
                <label htmlFor="activeCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Compte actif (autorisé à se connecter)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {formLoading
                    ? "Enregistrement..."
                    : editingUser
                    ? "Mettre à jour"
                    : "Créer l'utilisateur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
