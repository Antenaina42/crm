"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  FileCheck,
  Send,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  X,
  Copy,
  Clock,
  Edit2,
} from "lucide-react";
import { formatAriary, formatDate, formatDateTime } from "@/lib/formatters";
import { buildWhatsAppUrl, generateContractMessage } from "@/lib/whatsapp";

interface ContractsListViewProps {
  initialContracts: any[];
  clients: any[];
  templates: any[];
}

export function ContractsListView({
  initialContracts,
  clients,
  templates,
}: ContractsListViewProps) {
  const [contracts, setContracts] = useState<any[]>(initialContracts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any | null>(null);

  // Form State
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [templateId, setTemplateId] = useState(templates[0]?.id || "");
  const [title, setTitle] = useState("Contrat de Création de Site Internet");
  const [totalAmount, setTotalAmount] = useState(2700000);
  const [depositAmount, setDepositAmount] = useState(1350000);
  const [status, setStatus] = useState("EN_ATTENTE_SIGNATURE");

  const openNewModal = () => {
    setEditingContract(null);
    setClientId(clients[0]?.id || "");
    setTemplateId(templates[0]?.id || "");
    setTitle("Contrat de Création de Site Internet");
    setTotalAmount(2700000);
    setDepositAmount(1350000);
    setStatus("EN_ATTENTE_SIGNATURE");
    setModalOpen(true);
  };

  const openEditModal = (ctr: any) => {
    setEditingContract(ctr);
    setClientId(ctr.clientId || clients[0]?.id || "");
    setTemplateId(ctr.templateId || templates[0]?.id || "");
    setTitle(ctr.title || "");
    setTotalAmount(ctr.totalAmount || 0);
    setDepositAmount(ctr.depositAmount || 0);
    setStatus(ctr.status || "EN_ATTENTE_SIGNATURE");
    setModalOpen(true);
  };

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContract) {
        const res = await fetch(`/api/contracts/${editingContract.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            totalAmount: Number(totalAmount),
            depositAmount: Number(depositAmount),
            status,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setContracts(contracts.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
          setModalOpen(false);
        }
      } else {
        const res = await fetch("/api/contracts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            templateId,
            title,
            totalAmount,
            depositAmount,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setContracts([created, ...contracts]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContract = async (id: string, title: string) => {
    if (!confirm(`Confirmer la suppression du contrat "${title}" ?`)) return;
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContracts(contracts.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copySignLink = (token: string) => {
    const origin = window.location.origin;
    const url = `${origin}/sign/${token}`;
    navigator.clipboard.writeText(url);
    alert(`Lien de signature copié dans le presse-papier :\n${url}`);
  };

  const filtered = contracts.filter((ctr) =>
    `${ctr.contractNumber} ${ctr.title} ${ctr.client?.company || ctr.client?.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Contrats & Signature Électronique
          </h1>
          <p className="text-sm text-slate-500">
            Génération automatique de contrats juridiques et signatures en ligne horodatées
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Générer un Contrat
        </button>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro de contrat, titre, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Grille des Contrats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ctr) => {
          const clientPhone = ctr.client?.whatsapp || ctr.client?.phone?.replace(/[^0-9]/g, "");
          const origin = typeof window !== "undefined" ? window.location.origin : "https://m-itlevelup.com";
          const signUrl = `${origin}/sign/${ctr.signToken}`;
          const waUrl = buildWhatsAppUrl(
            clientPhone || "261345403898",
            generateContractMessage({
              clientName: ctr.client?.name || "Client",
              projectName: ctr.title,
              signLink: signUrl,
            })
          );

          return (
            <div
              key={ctr.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-800">
                      {ctr.contractNumber}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 leading-snug mt-0.5">
                      {ctr.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        ctr.status === "SIGNE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ctr.status === "SIGNE" ? "✓ Signé" : "En attente"}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-700 mb-3">
                  {ctr.client?.company || ctr.client?.name}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 mb-4">
                  <div className="flex justify-between text-slate-500">
                    <span>Montant total :</span>
                    <span className="font-bold text-slate-900">{formatAriary(ctr.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Acompte convenu :</span>
                    <span className="font-semibold text-brand-800">{formatAriary(ctr.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Reste livraison :</span>
                    <span className="font-semibold text-amber-700">{formatAriary(ctr.remainderAmount)}</span>
                  </div>
                </div>

                {ctr.status === "SIGNE" && (
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 space-y-0.5 mb-3">
                    <p className="font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Signé par : {ctr.signerName}
                    </p>
                    <p className="text-[10px] text-emerald-600">
                      {formatDateTime(ctr.signedAt)} • IP : {ctr.signerIp}
                    </p>
                    <p className="font-mono text-[9px] truncate text-slate-500">
                      Hash : {ctr.signatureHash?.substring(0, 20)}...
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <a
                    href={`/sign/${ctr.signToken}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Lien Signature</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="Envoyer le lien par WhatsApp"
                  >
                    <Send className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => copySignLink(ctr.signToken)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Copier le lien"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openEditModal(ctr)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteContract(ctr.id, ctr.title)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nouveau / Modifier Contrat */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingContract ? `Modifier : ${editingContract.title}` : "Générer un Contrat Automatique"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContract} className="space-y-4">
              {!editingContract && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Client *</label>
                    <select
                      required
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company || c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Modèle de Contrat *</label>
                    <select
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre du contrat *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              {editingContract && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="EN_ATTENTE_SIGNATURE">En attente de signature</option>
                    <option value="SIGNE">Signé</option>
                    <option value="EXPIRE">Expiré</option>
                    <option value="ANNULE">Annulé</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Montant global (Ar) *</label>
                  <input
                    type="number"
                    required
                    value={totalAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTotalAmount(val);
                      setDepositAmount(val * 0.5);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Acompte (Ar) *</label>
                  <input
                    type="number"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
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
                  {editingContract ? "Enregistrer Modifications" : "Générer et Obtenir Lien"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
