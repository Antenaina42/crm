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
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Prospects", href: "/prospects", icon: Users },
  { label: "Clients", href: "/clients", icon: Briefcase },
  { label: "Offres", href: "/offers", icon: FileText },
  { label: "Proformas", href: "/proformas", icon: Receipt },
  { label: "Factures", href: "/invoices", icon: CreditCard },
  { label: "Paiements", href: "/payments", icon: CreditCard },
  { label: "Contrats", href: "/contracts", icon: FileCheck },
  { label: "Projets", href: "/projects", icon: Rocket },
  { label: "Tâches", href: "/tasks", icon: CheckSquare },
  { label: "Domaines", href: "/domains", icon: Globe },
  { label: "Hébergements", href: "/hostings", icon: Cloud },
  { label: "Budget", href: "/budget", icon: Wallet },
  { label: "Calendrier", href: "/calendar", icon: Calendar },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Documents", href: "/documents", icon: FolderArchive },
  { label: "Rapports", href: "/reports", icon: BarChart3 },
  { label: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar({
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();

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
              Digital Agency CRM
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
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs text-slate-500 truncate">
            <span className="font-semibold text-slate-700">M-It Cloud CRM</span> v1.0
          </div>
        </div>
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
