"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  FileCheck,
  CreditCard,
  AlertTriangle,
  Globe,
  ArrowRight,
  CheckCheck,
  Trash2,
  Filter,
} from "lucide-react";
import { formatDateTime } from "@/lib/formatters";

interface NotificationsViewProps {
  initialNotifications: any[];
}

export function NotificationsView({ initialNotifications }: NotificationsViewProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "SIGNATURE":
        return <FileCheck className="w-5 h-5 text-indigo-600" />;
      case "PAIEMENT":
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case "RETARD":
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case "EXPIRATION":
        return <Globe className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-brand-800" />;
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "READ") return n.isRead;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Centre de Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-200">
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Alertes système, signatures électroniques, paiements et expirations
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
          >
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filtres rapides */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "UNREAD"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Non lues ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("READ")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === "READ"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          Lues ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Liste des Notifications */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Aucune notification dans cette catégorie.
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors group ${
                !notif.isRead ? "bg-brand-50/20" : ""
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 mt-0.5 shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDateTime(notif.createdAt)}
                    </span>
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Supprimer la notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between gap-4">
                  {notif.link ? (
                    <Link
                      href={notif.link}
                      onClick={() => handleToggleRead(notif.id, notif.isRead)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 hover:text-brand-900 group/link"
                    >
                      <span>Accéder au document</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  ) : (
                    <div />
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={() => handleToggleRead(notif.id, notif.isRead)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
