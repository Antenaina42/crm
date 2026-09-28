"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unpaidCount, setUnpaidCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const notifRes = await fetch("/api/notifications");
        if (notifRes.ok) {
          const data = await notifRes.json();
          setUnreadNotifications(data.unreadCount ?? 0);
        }
        const invRes = await fetch("/api/invoices");
        if (invRes.ok) {
          const invoices = await invRes.json();
          const unpaid = invoices.filter(
            (i: any) => i.status !== "PAYEE" && i.status !== "ANNULEE"
          ).length;
          setUnpaidCount(unpaid);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex print:bg-white print:block">
      {/* Sidebar Navigation */}
      <div className="no-print">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 md:pl-64 print:pl-0 print:m-0 flex flex-col min-w-0">
        <div className="no-print">
          <Header
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            currentUser={{
              name: "Miora Antenaina RAZAKATIANA",
              email: "admin@m-itlevelup.com",
              role: "Super Admin",
            }}
            unreadCount={unreadNotifications}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
