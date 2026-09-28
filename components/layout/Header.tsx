"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Plus,
  Bell,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Users,
  CreditCard,
  Rocket,
  CheckSquare,
  FileCheck,
  AlertTriangle,
  Globe,
  CheckCheck,
  ArrowRight,
  X,
} from "lucide-react";
import { GlobalSearchModal } from "../search/GlobalSearchModal";
import { formatDateTime } from "@/lib/formatters";

interface HeaderProps {
  onToggleMobileMenu: () => void;
  currentUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
  unreadCount?: number;
}

export function Header({
  onToggleMobileMenu,
  currentUser,
  unreadCount = 4,
}: HeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(unreadCount);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnread(data.unreadCount ?? 0);
        }
      } catch (e) {
        console.error("Erreur chargement notifications:", e);
      }
    }
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setUnread(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotifClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notif.id }),
        });
        setUnread((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (e) {
        console.error(e);
      }
    }
    setNotifOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "SIGNATURE":
        return <FileCheck className="w-4 h-4 text-indigo-600" />;
      case "PAIEMENT":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "RETARD":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "EXPIRATION":
        return <Globe className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-brand-800" />;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 no-print print:hidden">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 border border-slate-200/60 transition-colors text-sm text-left shadow-sm"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">Recherche globale...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCreateMenuOpen(!createMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-medium text-xs sm:text-sm shadow-sm transition-all shadow-brand-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Créer</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {createMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-fade-in"
                onClick={() => setCreateMenuOpen(false)}
              >
                <button
                  onClick={() => router.push("/prospects?new=true")}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-800"
                >
                  <Users className="w-4 h-4 text-blue-500" />
                  Nouveau prospect
                </button>
                <button
                  onClick={() => router.push("/offers?new=true")}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-800"
                >
                  <FileCheck className="w-4 h-4 text-indigo-500" />
                  Nouvelle offre
                </button>
                <button
                  onClick={() => router.push("/proformas?new=true")}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-800"
                >
                  <CreditCard className="w-4 h-4 text-cyan-500" />
                  Nouvelle proforma
                </button>
                {currentUser?.role !== "COMMERCIAL" && (
                  <>
                    <button
                      onClick={() => router.push("/invoices?new=true")}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-800"
                    >
                      <CreditCard className="w-4 h-4 text-amber-500" />
                      Nouvelle facture
                    </button>
                    <button
                      onClick={() => router.push("/projects?new=true")}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-800"
                    >
                      <Rocket className="w-4 h-4 text-purple-500" />
                      Nouveau projet
                    </button>
                    <button
                      onClick={() => router.push("/tasks?new=true")}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-800"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                      Nouvelle tâche
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Centre de notifications"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-black bg-rose-600 text-white rounded-full ring-2 ring-white shadow-xs animate-pulse">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-fade-in">
                {/* Header Dropdown */}
                <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                    {unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-100">
                        {unread} non lue{unread > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {unread > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-brand-800 hover:text-brand-900 inline-flex items-center gap-1 hover:underline"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Tout marquer lu
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100/80">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Aucune notification pour le moment.
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className={`p-3 sm:px-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                          !notif.isRead ? "bg-brand-50/20" : ""
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-slate-100 mt-0.5 shrink-0">
                          {getNotifIcon(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-brand-800 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {formatDateTime(notif.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Dropdown */}
                <div className="pt-2 px-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      router.push("/notifications");
                    }}
                    className="w-full py-1.5 text-center text-xs font-bold text-brand-800 hover:text-brand-900 inline-flex items-center justify-center gap-1 group"
                  >
                    <span>Ouvrir le centre de notifications</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-800 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {currentUser?.name
                  ? currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "MI"}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.name || "Miora RAZAKATIANA"}
                </div>
                <div className="text-[10px] text-brand-700 font-medium">
                  {currentUser?.role === "COMMERCIAL"
                    ? "Commercial"
                    : currentUser?.role === "ADMIN"
                    ? "Administrateur"
                    : currentUser?.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : currentUser?.role || "Utilisateur"}
                </div>
              </div>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-40 animate-fade-in"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {currentUser?.name || "Miora Antenaina RAZAKATIANA"}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {currentUser?.email || "admin@m-itlevelup.com"}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-full bg-brand-50 text-brand-800">
                    {currentUser?.role === "COMMERCIAL"
                      ? "Espace Commercial"
                      : currentUser?.role === "ADMIN"
                      ? "Administrateur"
                      : "Super Admin"}
                  </span>
                </div>
                {currentUser?.role !== "COMMERCIAL" && (
                  <button
                    onClick={() => router.push("/settings")}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Paramètres du compte
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
