"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  FileText,
  Receipt,
  FileCheck,
  CreditCard,
  TrendingUp,
  DollarSign,
  Clock,
  Rocket,
  CheckCircle2,
  Globe,
  Cloud,
  AlertTriangle,
  ArrowUpRight,
  Send,
  Plus,
  Calendar,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatAriary, formatCurrency } from "@/lib/formatters";

const WELCOME_MESSAGES = [
  "Bonjour Miora 👋 Prêt à transformer une nouvelle idée en projet ?",
  "Chaque nouveau prospect est une nouvelle opportunité. 🚀",
  "Construisons quelque chose d'exceptionnel aujourd'hui.",
  "Votre prochain grand projet commence peut-être avec un simple prospect.",
  "Une bonne journée pour signer un nouveau projet. 💼",
  "L'excellence digitale est notre signature. Bienvenue sur M-It LevelUp !",
];

interface DashboardData {
  counts: {
    prospects: number;
    interestedClients: number;
    sentOffers: number;
    sentProformas: number;
    signedContracts: number;
    unpaidInvoices: number;
    totalTurnover: number;
    collectedTurnover: number;
    remainingTurnover: number;
    activeProjects: number;
    completedProjects: number;
    expiringDomains: number;
    expiringHostings: number;
  };
  monthlyRevenue: { month: string; ca: number; encaisse: number }[];
  collectionsBreakdown: { name: string; value: number; color: string }[];
  pipelineData: { stage: string; count: number }[];
  projectsByStatus: { name: string; value: number; color: string }[];
  todayTasks: {
    type: "DANGER" | "WARNING" | "SUCCESS" | "INFO";
    title: string;
    subtitle: string;
    actionLabel: string;
    href: string;
  }[];
  recentInvoices: any[];
  recentProspects: any[];
}

export function DashboardView({ data }: { data: DashboardData }) {
  const [welcomeMessage, setWelcomeMessage] = useState(WELCOME_MESSAGES[0]);

  useEffect(() => {
    // Choisir aléatoirement un message à chaque session
    const randomIdx = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    setWelcomeMessage(WELCOME_MESSAGES[randomIdx]);
  }, []);

  const kpis = [
    {
      label: "Prospects",
      value: data.counts.prospects,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/prospects",
    },
    {
      label: "Clients Intéressés",
      value: data.counts.interestedClients,
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/prospects?status=INTERESSE",
    },
    {
      label: "Offres Envoyées",
      value: data.counts.sentOffers,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/offers",
    },
    {
      label: "Proformas Envoyées",
      value: data.counts.sentProformas,
      icon: Receipt,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/proformas",
    },
    {
      label: "Contrats Signés",
      value: data.counts.signedContracts,
      icon: FileCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/contracts",
    },
    {
      label: "Factures Impayées",
      value: data.counts.unpaidInvoices,
      icon: CreditCard,
      color: "text-rose-600",
      bg: "bg-rose-50",
      href: "/invoices?status=UNPAID",
      badge: data.counts.unpaidInvoices > 0 ? "À relancer" : undefined,
    },
    {
      label: "Chiffre d'Affaires",
      value: formatAriary(data.counts.totalTurnover),
      icon: DollarSign,
      color: "text-brand-800",
      bg: "bg-brand-50",
      href: "/budget",
      isCurrency: true,
    },
    {
      label: "CA Encaissé",
      value: formatAriary(data.counts.collectedTurnover),
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/payments",
      isCurrency: true,
    },
    {
      label: "Reste à Encaisser",
      value: formatAriary(data.counts.remainingTurnover),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/invoices",
      isCurrency: true,
    },
    {
      label: "Projets en cours",
      value: data.counts.activeProjects,
      icon: Rocket,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      href: "/projects",
    },
    {
      label: "Projets terminés",
      value: data.counts.completedProjects,
      icon: CheckCircle2,
      color: "text-teal-600",
      bg: "bg-teal-50",
      href: "/projects?status=TERMINE",
    },
    {
      label: "Domaines expirant",
      value: data.counts.expiringDomains,
      icon: Globe,
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: "/domains",
    },
    {
      label: "Hébergements expirant",
      value: data.counts.expiringHostings,
      icon: Cloud,
      color: "text-sky-600",
      bg: "bg-sky-50",
      href: "/hostings",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020712] via-[#0b1d3a] to-[#051124] p-6 sm:p-8 text-white shadow-xl shadow-slate-950/20 border border-slate-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-cyan-300 mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            CRM Commercial & Opérations Digitales
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2">
            {welcomeMessage}
          </h1>
          <p className="text-sm text-slate-300/90 font-medium leading-relaxed">
            Suivi en temps réel de votre cycle commercial : prospects, contrats, factures officielles M-It LevelUp et hébergements clients.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              href="/prospects?new=true"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-900 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nouveau Prospect
            </Link>
            <Link
              href="/invoices?new=true"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700/80 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm border border-brand-500/30 transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Créer Facture
            </Link>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              Planning
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Section "À faire aujourd'hui" */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="font-bold text-slate-900 text-base">
              À faire aujourd'hui
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Actions recommandées
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.todayTasks.map((task, idx) => {
            const colors = {
              DANGER: "bg-rose-50 border-rose-100 text-rose-800 hover:border-rose-200",
              WARNING: "bg-amber-50 border-amber-100 text-amber-800 hover:border-amber-200",
              SUCCESS: "bg-emerald-50 border-emerald-100 text-emerald-800 hover:border-emerald-200",
              INFO: "bg-blue-50 border-blue-100 text-blue-800 hover:border-blue-200",
            };
            const dotColors = {
              DANGER: "bg-rose-500",
              WARNING: "bg-amber-500",
              SUCCESS: "bg-emerald-500",
              INFO: "bg-blue-500",
            };

            return (
              <Link
                key={idx}
                href={task.href}
                className={`flex items-start justify-between p-3.5 rounded-xl border transition-all hover:shadow-xs group ${colors[task.type]}`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[task.type]}`} />
                  <div className="min-w-0 truncate">
                    <p className="text-xs font-bold truncate">{task.title}</p>
                    <p className="text-[11px] opacity-80 truncate">{task.subtitle}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold underline underline-offset-2 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                  {task.actionLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. 13 KPIs Grille */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900 text-base">
            Indicateurs de Performance (KPI)
          </h2>
          <span className="text-xs text-slate-400 font-medium">Temps réel</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={idx}
                href={kpi.href}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-brand-200 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500 line-clamp-1">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-xl ${kpi.bg}`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </div>
                <div>
                  <div
                    className={`font-bold tracking-tight text-slate-900 ${
                      kpi.isCurrency ? "text-base sm:text-lg" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {kpi.value}
                  </div>
                  {kpi.badge && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                      {kpi.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Graphiques Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique 1 : Chiffre d'Affaires Mensuel & Encaissements */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Chiffre d'Affaires Mensuel
              </h3>
              <p className="text-xs text-slate-400">
                Facturation vs Encaissements réels (en Ariary)
              </p>
            </div>
            <span className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-full">
              Année 2026
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenue}>
                <defs>
                  <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0b1d3a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0b1d3a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="encaisseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatAriary(Number(value)), ""]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="ca"
                  name="Facturé"
                  stroke="#0b1d3a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#caGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="encaisse"
                  name="Encaissé"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#encaisseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 2 : Pipeline Commercial */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Pipeline Commercial
              </h3>
              <p className="text-xs text-slate-400">
                Conversion Prospect → Contrat Signé
              </p>
            </div>
            <Link
              href="/prospects"
              className="text-xs font-semibold text-brand-800 hover:text-brand-900 inline-flex items-center gap-1"
            >
              Voir Kanban <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  dataKey="stage"
                  type="category"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar dataKey="count" name="Dossiers" fill="#0b1d3a" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 3 : Répartition des Encaissements */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base mb-1">
            Statut des Encaissements
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Encaissé vs En attente vs En retard
          </p>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.collectionsBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.collectionsBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatAriary(Number(val)), ""]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 4 : Répartition des Projets */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Projets par Statut
              </h3>
              <p className="text-xs text-slate-400">
                Préparation, Développement, Livraison & Maintenance
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-brand-800 hover:text-brand-900 inline-flex items-center gap-1"
            >
              Tous les projets <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.projectsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.projectsByStatus.map((entry, index) => (
                    <Cell key={`proj-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Dernières Factures & Derniers Prospects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Factures Récentes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">
              Factures Récentes
            </h3>
            <Link
              href="/invoices"
              className="text-xs font-semibold text-brand-800 hover:text-brand-900"
            >
              Voir toutes
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        inv.status === "PAYEE"
                          ? "bg-emerald-100 text-emerald-700"
                          : inv.status === "PARTIELLEMENT_PAYEE"
                          ? "bg-blue-100 text-blue-700"
                          : inv.status === "EN_RETARD"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {inv.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {inv.client?.company || inv.client?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {formatCurrency(inv.total, inv.currency || "Ar")}
                  </p>
                  <Link
                    href={`/invoices/${inv.id}`}
                    className="text-xs text-brand-800 hover:underline font-semibold"
                  >
                    Consulter
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prospects Récents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">
              Derniers Prospects
            </h3>
            <Link
              href="/prospects"
              className="text-xs font-semibold text-brand-800 hover:text-brand-900"
            >
              Gérer le pipeline
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentProspects.map((p) => (
              <div
                key={p.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {p.firstName} {p.lastName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {p.company || p.needType || "Projet digital"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    Budget : {formatAriary(p.estimatedBudget)}
                  </p>
                  <a
                    href={`https://wa.me/${p.whatsapp || p.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold mt-1"
                  >
                    <Send className="w-3 h-3" /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
