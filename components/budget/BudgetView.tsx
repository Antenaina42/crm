"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  Receipt,
  Building,
  Calendar,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatAriary, formatDate } from "@/lib/formatters";

interface BudgetViewProps {
  initialExpenses: any[];
  totalIncome: number;
  totalCollected: number;
  totalRemaining: number;
}

export function BudgetView({
  initialExpenses,
  totalIncome,
  totalCollected,
  totalRemaining,
}: BudgetViewProps) {
  const [expenses, setExpenses] = useState<any[]>(initialExpenses);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

  // Form State
  const [category, setCategory] = useState("LOGICIELS");
  const [amount, setAmount] = useState<number>(150000);
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const openNewModal = () => {
    setEditingExpense(null);
    setCategory("LOGICIELS");
    setAmount(150000);
    setSupplier("");
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
    setModalOpen(true);
  };

  const openEditModal = (exp: any) => {
    setEditingExpense(exp);
    setCategory(exp.category || "LOGICIELS");
    setAmount(exp.amount || 0);
    setSupplier(exp.supplier || "");
    setDescription(exp.description || "");
    setDate(exp.date ? exp.date.slice(0, 10) : "");
    setModalOpen(true);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        const res = await fetch(`/api/expenses/${editingExpense.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            amount: Number(amount),
            supplier,
            description,
            date,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setExpenses(expenses.map((ex) => (ex.id === updated.id ? { ...ex, ...updated } : ex)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            amount: Number(amount),
            supplier,
            description,
            date,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setExpenses([created, ...expenses]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string, name: string) => {
    if (!confirm(`Confirmer la suppression de la dépense "${name}" ?`)) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses(expenses.filter((ex) => ex.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const grossProfit = totalCollected - totalExpense;
  const marginPercent = totalCollected > 0 ? Math.round((grossProfit / totalCollected) * 100) : 75;

  const chartData = [
    { month: "Juin", revenus: 1800000, depenses: 650000 },
    { month: "Juil", revenus: 2400000, depenses: 780000 },
    { month: "Août", revenus: 2800000, depenses: 850000 },
    { month: "Sept", revenus: totalCollected, depenses: totalExpense },
  ];

  const filtered = expenses.filter((e) =>
    `${e.supplier} ${e.description} ${e.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestion Budgétaire & Rentabilité
          </h1>
          <p className="text-sm text-slate-500">
            Tableau financier : revenus, dépenses d'infrastructure, créances et marge brute
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Enregistrer une Dépense
        </button>
      </div>

      {/* 5 Financial KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Chiffre d'Affaires</span>
          <p className="text-lg font-bold text-slate-900 mt-1">{formatAriary(totalIncome)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Total facturé</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase">Total Encaissé</span>
          <p className="text-lg font-bold text-emerald-800 mt-1">{formatAriary(totalCollected)}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Trésorerie perçue</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-700 uppercase">Dépenses Totales</span>
          <p className="text-lg font-bold text-rose-800 mt-1">{formatAriary(totalExpense)}</p>
          <p className="text-[10px] text-rose-600 mt-0.5">Charges agence</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-brand-800 uppercase">Bénéfice Brut</span>
          <p className="text-lg font-bold text-brand-900 mt-1">{formatAriary(grossProfit)}</p>
          <p className="text-[10px] text-brand-700 mt-0.5">Marge : {marginPercent}%</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase">Créances Clients</span>
          <p className="text-lg font-bold text-amber-800 mt-1">{formatAriary(totalRemaining)}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Reste à encaisser</p>
        </div>
      </div>

      {/* Graphique Revenus vs Dépenses */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-1">
          Comparatif Mensuel : Revenus vs Dépenses
        </h3>
        <p className="text-xs text-slate-400 mb-6">Évolution de la rentabilité de l'agence M-It LevelUp</p>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                formatter={(val: any) => [formatAriary(Number(val)), ""]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend iconType="circle" />
              <Bar dataKey="revenus" name="Revenus Encaissés" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="depenses" name="Dépenses d'Exploitation" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une dépense par fournisseur, catégorie, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table des Dépenses */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Fournisseur</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Description</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Montant</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{exp.supplier}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{exp.description}</td>
                  <td className="p-4 text-slate-600">{formatDate(exp.date)}</td>
                  <td className="p-4 text-right font-bold text-rose-700">
                    -{formatAriary(exp.amount)}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(exp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-800 hover:bg-slate-100 transition-colors"
                        title="Modifier la dépense"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id, exp.supplier)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Supprimer la dépense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Créer / Modifier Dépense */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingExpense ? `Modifier : ${editingExpense.supplier}` : "Enregistrer une Dépense d'Agence"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fournisseur / Prestataire *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hostinger, Meta Ads, BNI, Carburant"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="HEBERGEMENT">Hébergement</option>
                    <option value="DOMAINE">Domaine</option>
                    <option value="LOGICIELS">Logiciels / SaaS</option>
                    <option value="PUBLICITE">Publicité</option>
                    <option value="MATERIEL">Matériel</option>
                    <option value="SALAIRES">Salaires</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Montant (Ar) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Motif de la dépense..."
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
                  {editingExpense ? "Enregistrer les modifications" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
