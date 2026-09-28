"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  Briefcase,
  CreditCard,
  FileCheck,
  Rocket,
  Globe,
  FolderArchive,
  ArrowRight,
  X,
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Client" | "Prospect" | "Projet" | "Facture" | "Contrat" | "Domaine" | "Document";
  href: string;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Écouteur Ctrl + K et Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Recherche dynamique via API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Erreur recherche:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getIcon = (cat: string) => {
    switch (cat) {
      case "Client":
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case "Prospect":
        return <Users className="w-4 h-4 text-blue-600" />;
      case "Projet":
        return <Rocket className="w-4 h-4 text-purple-600" />;
      case "Facture":
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      case "Contrat":
        return <FileCheck className="w-4 h-4 text-indigo-600" />;
      case "Domaine":
        return <Globe className="w-4 h-4 text-cyan-600" />;
      default:
        return <FolderArchive className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Rechercher un client, prospect, projet, facture, contrat, domaine... (ex: Mpanorina)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">
              Recherche en cours...
            </div>
          ) : query && results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Aucun résultat trouvé pour « <span className="font-semibold">{query}</span> »
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={`${item.category}-${item.id}`}
                  onClick={() => {
                    onClose();
                    router.push(item.href);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-sm transition-colors">
                      {getIcon(item.category)}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-800 group-hover:translate-x-0.5 transition-all ml-2 shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Tapez pour rechercher dans tout le CRM (raccourci : <kbd className="font-semibold text-slate-600">Ctrl + K</kbd>)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
