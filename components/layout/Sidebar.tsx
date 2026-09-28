"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Receipt,
  CreditCard,
  FileCheck,
  Rocket,
  CheckSquare,
  Globe,
  Cloud,
  Wallet,
  Calendar,
  Bell,
  FolderArchive,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  currentUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const allNavItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ALL"] },
  { label: "Prospects", href: "/prospects", icon: Users, roles: ["ALL"] },
  { label: "Clients", href: "/clients", icon: Briefcase, roles: ["ALL"] },
  { label: "Offres", href: "/offers", icon: FileText, roles: ["ALL"] },
  { label: "Proformas", href: "/proformas", icon: Receipt, roles: ["ALL"] },
  { label: "Factures", href: "/invoices", icon: CreditCard, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Paiements", href: "/payments", icon: CreditCard, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Contrats", href: "/contracts", icon: FileCheck, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Projets", href: "/projects", icon: Rocket, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Tâches", href: "/tasks", icon: CheckSquare, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Domaines", href: "/domains", icon: Globe, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Hébergements", href: "/hostings", icon: Cloud, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Budget", href: "/budget", icon: Wallet, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Calendrier", href: "/calendar", icon: Calendar, roles: ["ALL"] },
  { label: "Notifications", href: "/notifications", icon: Bell, roles: ["ALL"] },
  { label: "Documents", href: "/documents", icon: FolderArchive, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Rapports", href: "/reports", icon: BarChart3, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Utilisateurs", href: "/users", icon: Users, roles: ["ADMIN", "SUPER_ADMIN"] },
  { label: "Paramètres", href: "/settings", icon: Settings, roles: ["ADMIN", "SUPER_ADMIN"] },
];

export function Sidebar({
  mobileOpen = false,
  onCloseMobile,
  currentUser,
}: SidebarProps) {
  const pathname = usePathname();

  const isCommercial = currentUser?.role === "COMMERCIAL";

  const navItems = allNavItems.filter((item) => {
    if (isCommercial) {
      return item.roles.includes("ALL");
    }
    return true;
  });

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-slate-900/5 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo-official.jpg"
              alt="M-It LevelUp"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-base tracking-tight">
                M-It <span className="text-brand-800">LevelUp</span>
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              {isCommercial ? "Espace Commercial" : "Digital Agency CRM"}
            </p>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-brand-50 text-brand-800 shadow-sm shadow-brand-100 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? "text-brand-800" : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {isCommercial ? (
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-cyan-50/80 rounded-xl border border-cyan-200/60 text-cyan-900">
            <Briefcase className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <div className="text-[11px] truncate">
              <span className="font-bold">Espace Commercial</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs text-slate-500 truncate">
              <span className="font-semibold text-slate-700">M-It Cloud CRM</span> v1.0
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-30 no-print print:hidden">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex no-print print:hidden">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
