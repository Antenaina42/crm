"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  FileText,
  Send,
  CheckCircle2,
  Trash2,
  Layers,
  Building,
  CreditCard,
  DollarSign,
  Calendar,
  X,
  Sparkles,
  Edit2,
} from "lucide-react";
import { formatAriary, formatCurrency, getCurrencySymbol, formatDate } from "@/lib/formatters";
import { buildWhatsAppUrl, generateOfferMessage } from "@/lib/whatsapp";

interface OffersViewProps {
  initialOffers: any[];
  catalog: any[];
  clients: any[];
  prospects: any[];
}

export function OffersView({
  initialOffers,
  catalog,
  clients,
  prospects,
}: OffersViewProps) {
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>(initialOffers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [catalogList, setCatalogList] = useState<any[]>(catalog);

  // Currency states
  const [offerCurrency, setOfferCurrency] = useState("Ar");
  const [packCurrency, setPackCurrency] = useState("Ar");

  // Catalog Form State
  const [packModalOpen, setPackModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<any | null>(null);
  const [packName, setPackName] = useState("");
  const [packCategory, setPackCategory] = useState("Développement Web");
  const [packPrice, setPackPrice] = useState(2500000);
  const [packDuration, setPackDuration] = useState("2 à 4 semaines");
  const [packDesc, setPackDesc] = useState("");
  const [packActive, setPackActive] = useState(true);

  // Offer Edit State
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [editOfferTitle, setEditOfferTitle] = useState("");
  const [editOfferNotes, setEditOfferNotes] = useState("");
  const [editOfferStatus, setEditOfferStatus] = useState("ENVOYEE");

  // Form State
  const [targetType, setTargetType] = useState<"client" | "prospect">("client");
  const [targetId, setTargetId] = useState(clients[0]?.id || "");
  const [title, setTitle] = useState("Proposition Commerciale Digitale");
  const [depositPercent, setDepositPercent] = useState(50);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<any[]>([
    {
      description: "Conception et développement application web moderne avec dashboard",
      quantity: 1,
      unitPrice: 2700000,
    },
  ]);

  const selectCatalogItem = (catItem: any) => {
    setItems([
      ...items,
      {
        description: `${catItem.name}\n${catItem.description || ""}`,
        quantity: 1,
        unitPrice: catItem.basePrice,
      },
    ]);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, it) => sum + Number(it.unitPrice || 0) * Number(it.quantity || 1),
    0
  );
  const total = Math.max(0, subtotal - Number(discount || 0));
  const depositAmount = (total * depositPercent) / 100;
  const remainderAmount = total - depositAmount;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        title,
        depositPercent,
        discount: Number(discount),
        currency: offerCurrency,
        items,
      };
      if (targetType === "client") payload.clientId = targetId;
      else payload.prospectId = targetId;

      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setOffers([created, ...offers]);
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptOffer = async (id: string, titleStr: string) => {
    if (
      !confirm(
        `Accepter l'offre « ${titleStr} » ?\nCeci déclenchera automatiquement la création du projet, du contrat et de la facture d'acompte.`
      )
    )
      return;

    try {
      const res = await fetch(`/api/offers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });
      if (res.ok) {
        alert("🎉 Offre acceptée avec succès ! Le projet, le contrat et la facture ont été générés.");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette offre ?")) return;
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOffers(offers.filter((o) => o.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreatePack = () => {
    setEditingPack(null);
    setPackName("");
    setPackCategory("Développement Web");
    setPackPrice(2500000);
    setPackCurrency("Ar");
    setPackDuration("2 à 4 semaines");
    setPackDesc("");
    setPackActive(true);
    setPackModalOpen(true);
  };

  const openEditPack = (pack: any) => {
    setEditingPack(pack);
    setPackName(pack.name);
    setPackCategory(pack.category);
    setPackPrice(pack.basePrice);
    setPackCurrency(pack.currency || "Ar");
    setPackDuration(pack.duration || "");
    setPackDesc(pack.description || "");
    setPackActive(pack.active ?? true);
    setPackModalOpen(true);
  };

  const handleSavePack = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: packName,
        category: packCategory,
        basePrice: Number(packPrice),
        currency: packCurrency,
        duration: packDuration,
        description: packDesc,
        active: packActive,
      };

      if (editingPack) {
        const res = await fetch(`/api/catalog/${editingPack.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setCatalogList(catalogList.map((c) => (c.id === updated.id ? updated : c)));
          setPackModalOpen(false);
        }
      } else {
        const res = await fetch("/api/catalog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setCatalogList([...catalogList, created]);
          setPackModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePack = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement le pack "${name}" du catalogue ?`)) return;
    try {
      const res = await fetch(`/api/catalog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCatalogList(catalogList.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditOffer = (offer: any) => {
    setEditingOffer(offer);
    setEditOfferTitle(offer.title);
    setEditOfferNotes(offer.notes || "");
    setEditOfferStatus(offer.status);
  };

  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    try {
      const res = await fetch(`/api/offers/${editingOffer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editOfferTitle,
          notes: editOfferNotes,
          status: editOfferStatus,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOffers(offers.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)));
        setEditingOffer(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = offers.filter((o) => {
    const recipient = o.client?.company || o.client?.name || `${o.prospect?.firstName || ""} ${o.prospect?.lastName || ""}`;
    return `${o.offerNumber} ${o.title} ${recipient}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Offres & Catalogue Commercial
          </h1>
          <p className="text-sm text-slate-500">
            Devis réutilisables, propositions personnalisées et génération d'offres en 1 clic
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCatalogModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold text-sm shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-brand-800" />
            Catalogue ({catalog.length})
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Créer une Offre
          </button>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une offre par numéro, titre, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Grille des Offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((offer) => {
          const recipientName = offer.client?.company || offer.client?.name || `${offer.prospect?.firstName || ""} ${offer.prospect?.lastName || ""}`;
          const recipientPhone = offer.client?.phone || offer.prospect?.phone || "261345403898";
          const waUrl = buildWhatsAppUrl(
            recipientPhone,
            generateOfferMessage({
              clientName: recipientName,
              projectName: offer.title,
              totalAmount: formatCurrency(offer.total, offer.currency || "Ar"),
              depositAmount: formatCurrency(offer.depositAmount, offer.currency || "Ar"),
            })
          );

          return (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-brand-800">
                      {offer.offerNumber}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 leading-snug mt-0.5">
                      {offer.title}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      offer.status === "ACCEPTEE"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{recipientName}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs mb-4">
                  <div className="flex justify-between text-slate-500">
                    <span>Sous-total HT :</span>
                    <span>{formatCurrency(offer.subtotal, offer.currency || "Ar")}</span>
                  </div>
                  {offer.discount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Remise accordée :</span>
                      <span>-{formatCurrency(offer.discount, offer.currency || "Ar")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                    <span>Total Net :</span>
                    <span>{formatCurrency(offer.total, offer.currency || "Ar")}</span>
                  </div>
                  <div className="flex justify-between text-brand-800 font-semibold text-[11px] pt-0.5">
                    <span>Acompte ({offer.depositPercent}%) :</span>
                    <span>{formatCurrency(offer.depositAmount, offer.currency || "Ar")}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>

                  {offer.status !== "ACCEPTEE" ? (
                    <button
                      onClick={() => handleAcceptOffer(offer.id, offer.title)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accepter
                    </button>
                  ) : (
                    <span className="flex-1 text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                      ✓ Validée
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => openEditOffer(offer)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-800 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Modifier l'offre</span>
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Création Offre */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Nouvelle Offre Commerciale
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type de destinataire</label>
                  <select
                    value={targetType}
                    onChange={(e) => {
                      setTargetType(e.target.value as any);
                      setTargetId(e.target.value === "client" ? clients[0]?.id : prospects[0]?.id);
                    }}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="client">Client existant</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destinataire *</label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {targetType === "client"
                      ? clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.company || c.name} ({c.phone})
                          </option>
                        ))
                      : prospects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.firstName} {p.lastName} {p.company ? `(${p.company})` : ""}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Devise</label>
                  <select
                    value={offerCurrency}
                    onChange={(e) => setOfferCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  >
                    <option value="Ar">🇲🇬 Ariary malgache (Ar) — Par défaut</option>
                    <option value="EUR">🇪🇺 Euro (€)</option>
                    <option value="USD">🇺🇸 Dollar américain ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de la proposition *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              {/* Raccourci depuis le catalogue */}
              <div className="p-3 bg-brand-50/70 border border-brand-100 rounded-xl">
                <span className="text-xs font-bold text-brand-900 block mb-2">
                  Ajouter un pack depuis le catalogue :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {catalog.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => selectCatalogItem(cat)}
                      className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-brand-800 hover:text-white text-slate-700 rounded-lg border border-slate-200 shadow-2xs transition-colors"
                    >
                      + {cat.name} ({formatCurrency(cat.basePrice, cat.currency || "Ar")})
                    </button>
                  ))}
                </div>
              </div>

              {/* Lignes de prestations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Prestations de l'offre</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-semibold text-brand-800 hover:underline"
                  >
                    + Ajouter une ligne personnalisée
                  </button>
                </div>

                {items.map((it, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Ligne #{idx + 1}</span>
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} className="text-slate-400 hover:text-rose-600">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={it.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Description de la prestation..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Quantité</label>
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                          Prix unitaire ({getCurrencySymbol(offerCurrency)})
                        </label>
                        <input
                          type="number"
                          value={it.unitPrice}
                          onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux & Remise */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Acompte demandé (%)</label>
                  <input
                    type="number"
                    value={depositPercent}
                    onChange={(e) => setDepositPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Remise commerciale ({getCurrencySymbol(offerCurrency)})
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-100/80 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Sous-total :</span>
                  <span>{formatCurrency(subtotal, offerCurrency)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>TVA non applicable – entreprise non assujettie à la TVA (0%) :</span>
                  <span>{formatCurrency(0, offerCurrency)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t border-slate-200 pt-1">
                  <span>Total Net :</span>
                  <span>{formatCurrency(total, offerCurrency)}</span>
                </div>
                <div className="flex justify-between font-bold text-brand-800">
                  <span>Acompte ({depositPercent}%) :</span>
                  <span>{formatCurrency(depositAmount, offerCurrency)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-700">
                  <span>Reste à payer :</span>
                  <span>{formatCurrency(remainderAmount, offerCurrency)}</span>
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
                  Créer la Proposition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Catalogue d'Offres avec CRUD Complet */}
      {catalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Catalogue des Packs M-It LevelUp</h3>
                <p className="text-xs text-slate-500">Gérez vos offres préformatées (tarifs, durées, modules)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openCreatePack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-semibold text-xs shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nouveau Pack
                </button>
                <button onClick={() => setCatalogModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {catalogList.map((cat) => (
                <div key={cat.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            cat.active !== false
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-200 text-slate-600 border border-slate-300"
                          }`}
                        >
                          {cat.active !== false ? "Actif" : "Désactivé"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{cat.description || "Aucune description"}</p>
                      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-3">
                        <span>Catégorie : <strong className="text-slate-600">{cat.category}</strong></span>
                        <span>•</span>
                        <span>Délai : <strong className="text-slate-600">{cat.duration || "Variable"}</strong></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                      <span className="font-extrabold text-brand-800 text-sm">
                        {formatCurrency(cat.basePrice, cat.currency || "Ar")}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditPack(cat)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-brand-800 hover:bg-slate-50 shadow-2xs"
                        >
                          <Edit2 className="w-3 h-3" />
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePack(cat.id, cat.name)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-2xs"
                          title="Supprimer ce pack"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {catalogList.length === 0 && (
                <p className="text-center py-8 text-xs text-slate-400">Aucun pack configuré dans le catalogue.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer / Modifier Pack Catalogue */}
      {packModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                {editingPack ? `Modifier Pack : ${editingPack.name}` : "Nouveau Pack au Catalogue"}
              </h3>
              <button onClick={() => setPackModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePack} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom du pack *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Pack Vitrine Premium, Pack E-Commerce..."
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={packCategory}
                    onChange={(e) => setPackCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Développement Web">Développement Web</option>
                    <option value="Application Métier">Application Métier</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Infogérance & Cloud">Infogérance & Cloud</option>
                    <option value="SEO & Marketing">SEO & Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarif de base ({getCurrencySymbol(packCurrency)}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={packPrice}
                    onChange={(e) => setPackPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Devise</label>
                  <select
                    value={packCurrency}
                    onChange={(e) => setPackCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  >
                    <option value="Ar">🇲🇬 Ariary malgache (Ar) — Par défaut</option>
                    <option value="EUR">🇪🇺 Euro (€)</option>
                    <option value="USD">🇺🇸 Dollar américain ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Délai estimé</label>
                <input
                  type="text"
                  placeholder="ex: 2 à 4 semaines"
                  value={packDuration}
                  onChange={(e) => setPackDuration(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Inclusions</label>
                <textarea
                  rows={3}
                  placeholder="Description détaillée des fonctionnalités incluses..."
                  value={packDesc}
                  onChange={(e) => setPackDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="packActive"
                  checked={packActive}
                  onChange={(e) => setPackActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-800 focus:ring-brand-500"
                />
                <label htmlFor="packActive" className="text-xs font-medium text-slate-700">
                  Pack disponible et actif pour création d'offres
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPackModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 shadow-sm"
                >
                  {editingPack ? "Enregistrer les modifications" : "Ajouter au catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier Offre */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Modifier l'offre {editingOffer.offerNumber}
              </h3>
              <button onClick={() => setEditingOffer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOffer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de la proposition *</label>
                <input
                  type="text"
                  required
                  value={editOfferTitle}
                  onChange={(e) => setEditOfferTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Statut</label>
                <select
                  value={editOfferStatus}
                  onChange={(e) => setEditOfferStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="BROUILLON">Brouillon</option>
                  <option value="ENVOYEE">Envoyée</option>
                  <option value="ACCEPTEE">Acceptée</option>
                  <option value="REFUSEE">Refusée</option>
                  <option value="EXPIREE">Expirée</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes internes / Conditions</label>
                <textarea
                  rows={3}
                  value={editOfferNotes}
                  onChange={(e) => setEditOfferNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900 shadow-sm"
                >
                  Mettre à jour l'offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
