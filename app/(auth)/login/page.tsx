"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@m-itlevelup.com");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Identifiants invalides");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Impossible de joindre le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50/30 to-indigo-50/20 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Logo M-It LevelUp */}
        <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-900/10">
          <Image
            src="/logo-official.jpg"
            alt="M-It LevelUp"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            CRM M-It <span className="text-brand-800">LevelUp</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Plateforme interne de gestion commerciale, facturation et contrats
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@m-itlevelup.com"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-800 focus:ring-brand-500"
                />
                <span className="text-slate-600 font-medium">Se souvenir de moi</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Pour réinitialiser votre mot de passe, contactez l'administrateur système.")}
                className="text-brand-800 font-semibold hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-md shadow-brand-200 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Connexion..." : "Se connecter"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Démo credentials hints & quick switch */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-700">Comptes de test rapide (1-clic) :</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@m-itlevelup.com");
                  setPassword("admin123");
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  email === "admin@m-itlevelup.com"
                    ? "bg-brand-50 border-brand-300 ring-1 ring-brand-300"
                    : "bg-slate-50 border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900">Admin</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-brand-100 text-brand-800">
                    Complet
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">admin@m-itlevelup.com</p>
                <p className="text-[10px] text-slate-400 font-mono">admin123</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail("sarah.commercial@m-itlevelup.com");
                  setPassword("admin123");
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  email === "sarah.commercial@m-itlevelup.com"
                    ? "bg-amber-50 border-amber-300 ring-1 ring-amber-300"
                    : "bg-slate-50 border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-900">Commercial</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800">
                    Restreint
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">sarah.commercial@...</p>
                <p className="text-[10px] text-slate-400 font-mono">admin123</p>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 M-It LevelUp • Lot D79 Soalazaina Ambatolampy, Antananarivo
        </p>
      </div>
    </div>
  );
}
