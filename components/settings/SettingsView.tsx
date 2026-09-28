"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Building,
  CreditCard,
  Send,
  Save,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  MapPin,
  Edit3,
  X,
  RotateCcw,
  Sparkles,
  Check,
  MessageSquare,
} from "lucide-react";

interface TemplateItem {
  id: string;
  code: string;
  name: string;
  subject?: string | null;
  content: string;
  type?: string;
}

interface SettingsViewProps {
  initialSettings: any;
  templates: TemplateItem[];
}

const TEMPLATE_VARIABLES: Record<string, { tag: string; label: string }[]> = {
  WHATSAPP_OFFER: [
    { tag: "{{name}}", label: "Nom client" },
    { tag: "{{project}}", label: "Projet" },
    { tag: "{{amount}}", label: "Montant total" },
    { tag: "{{deposit}}", label: "Acompte (50%)" },
    { tag: "{{link}}", label: "Lien de l'offre" },
  ],
  WHATSAPP_INVOICE: [
    { tag: "{{name}}", label: "Nom client" },
    { tag: "{{invoice_number}}", label: "N° Facture" },
    { tag: "{{amount}}", label: "Montant total" },
    { tag: "{{due_amount}}", label: "Reste à payer" },
    { tag: "{{link}}", label: "Lien facture" },
  ],
  WHATSAPP_CONTRACT: [
    { tag: "{{name}}", label: "Nom client" },
    { tag: "{{project}}", label: "Projet" },
    { tag: "{{link}}", label: "Lien signature" },
  ],
  WHATSAPP_RENEWAL: [
    { tag: "{{name}}", label: "Nom client" },
    { tag: "{{domain}}", label: "Domaine / Service" },
    { tag: "{{date}}", label: "Échéance" },
    { tag: "{{amount}}", label: "Montant" },
  ],
  WHATSAPP_REMINDER: [
    { tag: "{{name}}", label: "Nom client" },
    { tag: "{{invoice_number}}", label: "N° Facture" },
    { tag: "{{remainder}}", label: "Reste dû" },
    { tag: "{{date}}", label: "Échéance" },
    { tag: "{{link}}", label: "Lien facture" },
  ],
};

const SAMPLE_VARIABLES: Record<string, Record<string, string>> = {
  WHATSAPP_OFFER: {
    name: "Miora Razafy",
    project: "Refonte Site Web E-Commerce",
    amount: "2 800 000 Ar",
    deposit: "1 400 000 Ar",
    link: "https://crm.m-itlevelup.com/offers/demo",
  },
  WHATSAPP_INVOICE: {
    name: "Société Madagasikara SARL",
    invoice_number: "FAC-2026-0042",
    amount: "1 850 000",
    due_amount: "925 000",
    link: "https://crm.m-itlevelup.com/invoices/fac-demo",
  },
  WHATSAPP_CONTRACT: {
    name: "Jean-Paul Andriamampianina",
    project: "Application Mobile Flutter & Web",
    link: "https://crm.m-itlevelup.com/sign/ctr-demo-token",
  },
  WHATSAPP_RENEWAL: {
    name: "Société Madagasikara SARL",
    domain: "madagasikara-tech.mg",
    date: "15/10/2026",
    amount: "240 000",
  },
  WHATSAPP_REMINDER: {
    name: "Cabinet Dentaire Tsara",
    invoice_number: "FAC-2026-0028",
    remainder: "450 000",
    date: "01/09/2026",
    link: "https://crm.m-itlevelup.com/invoices/demo-reminder",
  },
};

const DEFAULT_TEMPLATES_CONTENT: Record<string, string> = {
  WHATSAPP_OFFER: `Bonjour {{name}},

Nous avons le plaisir de vous transmettre notre proposition commerciale concernant le projet *{{project}}*.

Vous pouvez consulter votre offre détaillée directement sur ce lien :
{{link}}

Nous restons à votre entière disposition pour tout échange ou précision.

Cordialement,
*Miora Antenaina RAZAKATIANA*
*M-It LevelUp* — Agence Digitale
📞 +261 34 54 038 98 | 🌐 https://m-itlevelup.com/`,

  WHATSAPP_INVOICE: `Bonjour {{name}},

Veuillez trouver ci-joint votre facture *{{invoice_number}}* d'un montant de *{{amount}} Ariary*.

Acompte / montant attendu : *{{due_amount}} Ariary*.
Règlement possible par MVola (+261 34 54 038 98) ou virement bancaire.

Lien de consultation sécurisé :
{{link}}

Merci pour votre confiance !
*M-It LevelUp*`,

  WHATSAPP_CONTRACT: `Bonjour {{name}},

Le contrat pour le projet *{{project}}* est prêt pour signature électronique.
Vous pouvez le signer en quelques secondes depuis votre téléphone ou ordinateur ici :
{{link}}

Bien cordialement,
*M-It LevelUp*`,

  WHATSAPP_RENEWAL: `Bonjour {{name}},

Votre hébergement et/ou nom de domaine *{{domain}}* arrive à échéance le *{{date}}*.
Nous vous proposons son renouvellement pour un montant de *{{amount}} Ariary*.

Souhaitez-vous que nous procédions au renouvellement ?
Nous restons à votre écoute.

Bien cordialement,
*M-It LevelUp*`,

  WHATSAPP_REMINDER: `Bonjour {{name}},

Sauf erreur de notre part, la facture *{{invoice_number}}* d'un montant restant de *{{remainder}} Ariary* arrivée à échéance le {{date}} est toujours en attente de règlement.

Pourriez-vous nous confirmer l'état de votre règlement s'il vous plaît ?
Consulter la facture : {{link}}

Merci pour votre collaboration,
*M-It LevelUp*`,
};

export function SettingsView({ initialSettings, templates }: SettingsViewProps) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [saved, setSaved] = useState(false);
  const [templateList, setTemplateList] = useState<TemplateItem[]>(templates || []);

  // Modal d'édition de modèle
  const [editingTemplate, setEditingTemplate] = useState<TemplateItem | null>(null);
  const [editForm, setEditForm] = useState({ name: "", content: "", subject: "" });
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateSuccessMsg, setTemplateSuccessMsg] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          templates: templateList,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (tpl: TemplateItem) => {
    setEditingTemplate(tpl);
    setEditForm({
      name: tpl.name,
      content: tpl.content,
      subject: tpl.subject || "",
    });
    setTemplateSuccessMsg(null);
  };

  const closeEditModal = () => {
    setEditingTemplate(null);
    setTemplateSuccessMsg(null);
  };

  const insertVariable = (tag: string) => {
    if (!textareaRef.current) {
      setEditForm((prev) => ({ ...prev, content: prev.content + " " + tag }));
      return;
    }
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editForm.content;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newContent = before + tag + after;

    setEditForm((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  const handleResetToDefault = () => {
    if (!editingTemplate) return;
    const defaultText = DEFAULT_TEMPLATES_CONTENT[editingTemplate.code];
    if (defaultText) {
      setEditForm((prev) => ({ ...prev, content: defaultText }));
    }
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    setSavingTemplate(true);
    setTemplateSuccessMsg(null);

    try {
      const res = await fetch(`/api/templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          content: editForm.content,
          subject: editForm.subject,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTemplateList((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        setTemplateSuccessMsg("Modèle enregistré avec succès !");
        setTimeout(() => {
          closeEditModal();
        }, 1200);
      } else {
        alert("Erreur lors de l'enregistrement du modèle");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du modèle");
    } finally {
      setSavingTemplate(false);
    }
  };

  // Rendu de l'aperçu du message avec simulation des variables
  const renderPreviewContent = (code: string, rawText: string) => {
    const samples = SAMPLE_VARIABLES[code] || {};
    let rendered = rawText;
    for (const [key, val] of Object.entries(samples)) {
      rendered = rendered.split(`{{${key}}}`).join(val);
    }
    return rendered;
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Paramètres du CRM & Entreprise
        </h1>
        <p className="text-sm text-slate-500">
          Identité officielle M-It LevelUp, mentions légales, préfixes de facturation et WhatsApp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1 : Identité Entreprise */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs ring-1 ring-slate-900/5">
              <Image
                src="/logo-official.jpg"
                alt="M-It Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Informations Officielles de l'Agence
              </h3>
              <p className="text-xs text-slate-400">
                Apparaît sur toutes les factures, contrats et documents officiels
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom Commercial</label>
              <input
                type="text"
                value={settings.companyName || "M-It LevelUp"}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gérant / Fondateur</label>
              <input
                type="text"
                value={settings.managerName || "Miora Antenaina RAZAKATIANA"}
                onChange={(e) => setSettings({ ...settings, managerName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIF</label>
              <input
                type="text"
                value={settings.nif || "5019189714"}
                onChange={(e) => setSettings({ ...settings, nif: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">STAT</label>
              <input
                type="text"
                value={settings.stat || "62011 11 2025 0 03126"}
                onChange={(e) => setSettings({ ...settings, stat: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Officiel</label>
              <input
                type="email"
                value={settings.email || "razakatiana.antenaina@yahoo.com"}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone & WhatsApp</label>
              <input
                type="text"
                value={settings.phone || "+261 34 54 038 98"}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site Internet</label>
              <input
                type="text"
                value={settings.website || "https://m-itlevelup.com/"}
                onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adresse</label>
              <input
                type="text"
                value={settings.address || "Lot : Malaza Andoharanofotsy"}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ville & Pays</label>
              <input
                type="text"
                value={`${settings.city || "Antananarivo 102"}, ${settings.country || "Madagascar"}`}
                disabled
                className="w-full px-3 py-2 text-sm bg-slate-100 text-slate-500 border border-slate-200 rounded-xl outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2 : Facturation & Devise */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-800" />
            Paramètres de Facturation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Devise par défaut de l'agence
              </label>
              <select
                value={settings.currency || "Ar"}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:border-brand-500"
              >
                <option value="Ar">🇲🇬 Ariary malgache (Ar) — Par défaut</option>
                <option value="EUR">🇪🇺 Euro (€)</option>
                <option value="USD">🇺🇸 Dollar américain ($)</option>
              </select>
              <span className="text-[10px] text-slate-400">
                {settings.currency === "EUR"
                  ? "Formaté en euros (ex: 1 950 €)"
                  : settings.currency === "USD"
                  ? "Formaté en dollars (ex: 1 950 $)"
                  : "Formaté sans décimales (ex: 1 950 000 Ar)"}
              </span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Préfixe Factures</label>
              <input
                type="text"
                value={settings.invoicePrefix || "FAC-2026-"}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Préfixe Proformas</label>
              <input
                type="text"
                value={settings.proformaPrefix || "PRO-2026-"}
                onChange={(e) => setSettings({ ...settings, proformaPrefix: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mention Légale TVA (Obligatoire)
            </label>
            <input
              type="text"
              value="TVA non applicable – entreprise non assujettie à la TVA (0 %)"
              disabled
              className="w-full px-3 py-2 text-xs bg-slate-100 text-slate-600 font-medium border border-slate-200 rounded-xl cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Conditions Générales par défaut</label>
            <textarea
              rows={3}
              value={settings.termsAndConditions || ""}
              onChange={(e) => setSettings({ ...settings, termsAndConditions: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>
        </div>

        {/* Section 3 : Modèles de Messages WhatsApp */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              Modèles de Messages WhatsApp Actifs ({templateList.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200/60">
              ✓ Entièrement modifiables & personnalisables
            </span>
          </div>

          <div className="space-y-4">
            {templateList.map((tpl) => {
              const vars = TEMPLATE_VARIABLES[tpl.code] || [];
              return (
                <div
                  key={tpl.id}
                  className="p-4 bg-slate-50 hover:bg-slate-50/80 transition-all rounded-xl border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <h4 className="font-bold text-sm text-slate-900">{tpl.name}</h4>
                      <span className="text-[10px] font-mono font-bold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">
                        {tpl.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditModal(tpl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-brand-50 hover:text-brand-800 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-2xs transition-all active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-800" />
                      Modifier
                    </button>
                  </div>

                  {/* Variables badges */}
                  {vars.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-medium">Variables :</span>
                      {vars.map((v) => (
                        <span
                          key={v.tag}
                          className="text-[10px] font-mono bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded"
                          title={v.label}
                        >
                          {v.tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message content display */}
                  <pre className="text-xs text-slate-700 font-sans whitespace-pre-line bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs leading-relaxed max-h-48 overflow-y-auto">
                    {tpl.content}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton Sauvegarder Paramètres Globaux */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Paramètres enregistrés avec succès !
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Enregistrer les Paramètres
          </button>
        </div>
      </form>

      {/* MODAL DE MODIFICATION DU MODÈLE WHATSAPP */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Modifier le Modèle WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    Code : <span className="font-mono font-bold text-brand-800">{editingTemplate.code}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Nom du modèle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du Modèle
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500 font-medium"
                />
              </div>

              {/* Barre d'outils de variables */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Variables dynamiques disponibles (cliquez pour insérer) :
                  </label>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] font-bold text-slate-500 hover:text-brand-800 flex items-center gap-1 transition-colors"
                    title="Rétablir le modèle de base M-It"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Rétablir texte d'origine
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                  {(TEMPLATE_VARIABLES[editingTemplate.code] || []).map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => insertVariable(v.tag)}
                      className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-slate-700 border border-slate-200 hover:border-brand-500 hover:text-brand-800 hover:bg-brand-50/50 rounded-lg shadow-2xs transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>{v.tag}</span>
                      <span className="text-[10px] text-slate-400 font-sans font-normal">({v.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenu du message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Contenu du Message WhatsApp
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {editForm.content.length} caractères
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={9}
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Écrivez le modèle de message..."
                  className="w-full p-3 text-xs font-sans bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500 leading-relaxed font-normal"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Astuce WhatsApp : Entourez un mot d'astérisques pour le mettre en gras (ex: <code className="font-mono text-slate-600">*Gras*</code>).
                </p>
              </div>

              {/* Aperçu en direct (Simulation WhatsApp) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  Aperçu en direct (Simulation avec données de test) :
                </label>
                <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/60 relative">
                  <div className="max-w-md bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-100 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {renderPreviewContent(editingTemplate.code, editForm.content)}
                    <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-slate-400 font-sans">
                      <span>15:30</span>
                      <span className="text-sky-500 font-bold">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message de succès */}
              {templateSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {templateSuccessMsg}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={savingTemplate}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                disabled={savingTemplate || !editForm.content.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {savingTemplate ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Enregistrer le Modèle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
