"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Printer,
  Send,
  ArrowLeft,
  Download,
  Receipt,
  FileCheck2,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatAriary, formatCurrency, getCurrencySymbol, formatDate, formatDateTime } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CompanyStampSignature } from "./CompanyStampSignature";

interface ProformaPrintViewProps {
  proforma: any;
  companySettings?: any;
}

export function ProformaPrintView({ proforma, companySettings }: ProformaPrintViewProps) {
  const router = useRouter();
  const [isConverting, setIsConverting] = useState(false);
  const [copiedSignLink, setCopiedSignLink] = useState(false);

  const currency = proforma.currency || companySettings?.currency || "Ar";
  const currencySym = getCurrencySymbol(currency);

  const signToken = proforma.signToken;
  const copySignLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://crm.m-itlevelup.com";
    const url = `${origin}/sign/${signToken}`;
    navigator.clipboard.writeText(url);
    setCopiedSignLink(true);
    setTimeout(() => setCopiedSignLink(false), 2500);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = "";
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const recipientName =
    proforma.client?.company ||
    proforma.client?.name ||
    `${proforma.prospect?.firstName || ""} ${proforma.prospect?.lastName || ""}`.trim() ||
    "Client Partenaire";

  const recipientPhone =
    proforma.client?.whatsapp ||
    proforma.client?.phone?.replace(/[^0-9]/g, "") ||
    proforma.prospect?.whatsapp ||
    proforma.prospect?.phone?.replace(/[^0-9]/g, "") ||
    "261345403898";

  const depositInfo =
    proforma.depositPercent === 0
      ? "Paiement 100% à la livraison (aucun acompte requis)"
      : proforma.depositPercent === 100
      ? `Règlement intégral : ${formatCurrency(proforma.total, currency)}`
      : `Acompte ${proforma.depositPercent ?? 50}% au démarrage : ${formatCurrency(proforma.depositAmount, currency)}`;

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://crm.m-itlevelup.com";
  const signUrl = `${originUrl}/sign/${signToken}`;
  const waMsg = `Bonjour ${recipientName},\n\nVeuillez trouver ci-joint votre devis / Facture Proforma officielle *${proforma.proformaNumber}* émise par M-It LevelUp pour un montant total de *${formatCurrency(proforma.total, currency)}* (${depositInfo}).\n\n✍️ *Valider et signer votre Bon pour Accord en ligne* :\n${signUrl}\n\nNous restons disponibles pour le lancement de votre projet.\n\nCordialement,\n*M-It LevelUp*`;

  const waUrl = buildWhatsAppUrl(recipientPhone, waMsg);

  const handleConvertToInvoice = async () => {
    if (!proforma.clientId) {
      alert("Pour convertir cette proforma en facture officielle, elle doit être rattachée à un client.");
      return;
    }
    const confirmMsg = proforma.depositPercent === 0
      ? `Convertir la proforma ${proforma.proformaNumber} en facture officielle (Paiement 100% livraison) ?`
      : `Convertir la proforma ${proforma.proformaNumber} en facture d'acompte officielle (${proforma.depositPercent ?? 50}%) ?`;
    if (!confirm(confirmMsg)) return;

    setIsConverting(true);
    try {
      const isZeroDeposit = proforma.depositPercent === 0;
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: proforma.clientId,
          type: isZeroDeposit ? "STANDARD" : proforma.depositPercent === 100 ? "SOLDE" : "ACOMPTE_50",
          depositPercent: proforma.depositPercent !== undefined && proforma.depositPercent !== null ? proforma.depositPercent : 50,
          items: proforma.items.map((it: any) => ({
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
          discount: proforma.discount,
          currency: proforma.currency || "Ar",
          paymentTerms: isZeroDeposit
            ? `Paiement 100% à la livraison suite acceptation proforma ${proforma.proformaNumber}`
            : `Acompte ${proforma.depositPercent ?? 50}% suite acceptation proforma ${proforma.proformaNumber}`,
          notes: `Généré automatiquement depuis la facture proforma ${proforma.proformaNumber}`,
        }),
      });

      if (res.ok) {
        const inv = await res.json();
        alert(`Facture officielle ${inv.invoiceNumber} générée avec succès !`);
        router.push(`/invoices/${inv.id}`);
      } else {
        alert("Erreur lors de la conversion en facture.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Non imprimable) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/proformas"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">
                {proforma.proformaNumber}
              </h2>
              {/* Statut Proforma */}
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {proforma.status}
              </span>
              {/* Statut Signature Client */}
              {proforma.signatureClient ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Bon pour accord signé par {proforma.signerName || "Client"} {proforma.signedAt ? `(${formatDate(proforma.signedAt)})` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  En attente de signature client
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {recipientName} • Validité jusqu'au :{" "}
              <span className="font-bold text-slate-700">
                {formatDate(proforma.validityDate)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Bouton Télécharger / Imprimer PDF A4 */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Imprimer ou enregistrer en PDF via votre navigateur"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Imprimer / PDF</span>
          </button>

          {/* Bouton Copier Lien Signature */}
          <button
            onClick={copySignLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Copier le lien direct de signature du bon pour accord"
          >
            {copiedSignLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Lien Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Lien Signature</span>
              </>
            )}
          </button>

          {/* Aperçu Vue Client */}
          <a
            href={`/sign/${signToken}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
            title="Ouvrir la page de signature que voit le client"
          >
            <ExternalLink className="w-4 h-4 text-brand-800" />
            <span>Vue Client</span>
          </a>

          {/* Envoi WhatsApp avec lien de signature inclus */}
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
            title="Envoyer la proforma et le lien de signature par WhatsApp"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp (avec lien)</span>
          </a>

          {/* Conversion en Facture */}
          <button
            onClick={handleConvertToInvoice}
            disabled={isConverting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>{isConverting ? "Conversion..." : "Convertir en Facture"}</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT PROFORMA OFFICIEL M-IT LEVELUP */}
      <div className="print-container bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-4xl mx-auto p-6 sm:p-10 text-slate-900">
        {/* Header : Logo & Émetteur à gauche | Titre & Destinataire à droite */}
        <div className="flex justify-between items-start pb-4 gap-6">
          {/* Bloc Gauche : Logo, Date, Émetteur */}
          <div className="space-y-3 flex-1">
            {/* Logo M-It */}
            <div className="flex items-center gap-3">
              <div className="relative w-28 h-12 shrink-0">
                <Image
                  src="/logo-mit.png"
                  alt="M-It Logo"
                  width={112}
                  height={48}
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="border-l-2 border-slate-950 pl-3">
                <span className="text-base font-black tracking-tight text-slate-950 block leading-tight">
                  M-It LevelUp
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Digital Solutions
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="text-xs font-bold tracking-wide text-slate-900 space-y-0.5">
              <p>DATE : {formatDate(proforma.date)}</p>
              <p className="text-[11px] font-semibold text-slate-500">
                DATE D'EXPIRATION : {formatDate(proforma.validityDate)} (30 jours)
              </p>
            </div>

            {/* Émetteur */}
            <div className="text-[11px] space-y-0.5 text-slate-800">
              <p className="font-extrabold text-xs uppercase tracking-tight text-slate-950">
                ÉMETTEUR :
              </p>
              <p className="font-bold text-slate-950">
                {companySettings?.managerName || "Miora Antenaina RAZAKATIANA"}
              </p>
              <p>NIF : {companySettings?.nif || "5019189714"}</p>
              <p>STAT : {companySettings?.stat || "62011 11 2025 0 03126"}</p>
              <p>Email : {companySettings?.email || "razakatiana.antenaina@yahoo.com"}</p>
              <p>Téléphone : {companySettings?.phone || "+261 34 54 038 98"}</p>
              <p>Web Site : {companySettings?.website || "https://m-itlevelup.com/"}</p>
            </div>
          </div>

          {/* Bloc Droit : Titre du document & Destinataire */}
          <div className="text-right space-y-4 max-w-sm shrink-0">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 font-sans">
                Facture Proforma
              </h1>
              <p className="text-xs font-bold text-slate-700 mt-1">
                N° : {proforma.proformaNumber}
              </p>
            </div>

            <div className="text-[11px] space-y-0.5 pt-1">
              <p className="font-extrabold uppercase tracking-tight text-slate-950">
                DESTINATAIRE :
              </p>
              <p className="font-extrabold text-sm text-slate-950">
                {recipientName}
              </p>
              {(proforma.client?.address || proforma.prospect?.address) && (
                <p className="text-slate-600">
                  {proforma.client?.address || proforma.prospect?.address}
                </p>
              )}
              {(proforma.client?.phone || proforma.prospect?.phone) && (
                <p className="text-slate-600">
                  {proforma.client?.phone || proforma.prospect?.phone}
                </p>
              )}
              {(proforma.client?.email || proforma.prospect?.email) && (
                <p className="text-slate-600">
                  {proforma.client?.email || proforma.prospect?.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <hr className="border-t-2 border-slate-900 my-3" />

        {/* Table des Prestations */}
        <div className="my-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-slate-950 text-slate-950 font-bold">
                <th className="py-2.5 px-2 text-left font-extrabold w-1/2">Description :</th>
                <th className="py-2.5 px-2 text-right font-extrabold">Prix Unitaire ( {currencySym} ) :</th>
                <th className="py-2.5 px-2 text-center font-extrabold">Quantité :</th>
                <th className="py-2.5 px-2 text-right font-extrabold">Total :</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {proforma.items?.map((item: any) => (
                <tr key={item.id} className="align-top avoid-break">
                  <td className="py-3 px-2 pr-4 text-slate-800 leading-relaxed whitespace-pre-line font-medium text-xs">
                    {item.description}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-slate-800 whitespace-nowrap text-xs">
                    {Math.round(item.unitPrice).toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3 px-2 text-center font-semibold text-slate-800 text-xs">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-950 whitespace-nowrap text-xs">
                    {Math.round(item.total).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totaux & Mentions Légales */}
        <div className="pt-4 border-t-2 border-slate-900 space-y-3 avoid-break">
          <div className="flex flex-col items-end space-y-1.5 text-xs">
            <div className="flex justify-between w-72 text-slate-800 font-bold">
              <span>TOTAL HT :</span>
              <span>{formatCurrency(proforma.subtotal, currency)}</span>
            </div>
            {Number(proforma.discount || 0) > 0 && (
              <div className="flex justify-between w-72 text-emerald-700 font-bold text-[11px]">
                <span>Remise commerciale :</span>
                <span>-{formatCurrency(proforma.discount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between w-full sm:w-[380px] text-[11px] text-slate-700 font-semibold text-right">
              <span>TVA non applicable – entreprise non assujettie à la TVA :</span>
              <span className="whitespace-nowrap ml-2">{formatCurrency(0, currency)}</span>
            </div>
            <div className="flex justify-between w-72 text-sm font-black text-slate-950 border-t-2 border-slate-950 pt-1.5">
              <span>TOTAL TTC :</span>
              <span>{formatCurrency(proforma.total, currency)}</span>
            </div>
          </div>

          {/* Conditions de règlement */}
          <div className="pt-2.5 text-xs font-medium text-slate-800 space-y-1">
            <p className="font-bold text-slate-950 text-xs">Modalités de règlement :</p>
            {proforma.depositPercent === 0 ? (
              <p className="text-slate-700 text-[11px]">
                • <span className="font-bold text-slate-950">Paiement 100% à la livraison</span> (Aucun acompte exigé au démarrage).
              </p>
            ) : proforma.depositPercent === 100 ? (
              <p className="text-slate-700 text-[11px]">
                • <span className="font-bold text-slate-950">Règlement intégral (100%) à la commande</span> :{" "}
                <span className="font-bold text-slate-950">{formatCurrency(proforma.total, currency)}</span>
              </p>
            ) : (
              <>
                <p className="text-slate-700 text-[11px]">
                  • Acompte de {proforma.depositPercent ?? 50}% à la commande :{" "}
                  <span className="font-bold text-slate-950">
                    {formatCurrency(proforma.depositAmount, currency)}
                  </span>
                </p>
                <p className="text-slate-700 text-[11px]">
                  • Reste à la livraison et mise en production :{" "}
                  <span className="font-bold text-slate-950">
                    {formatCurrency(proforma.remainderAmount, currency)}
                  </span>
                </p>
              </>
            )}
            {proforma.conditions && (
              <p className="text-slate-500 italic text-[11px] pt-0.5">{proforma.conditions}</p>
            )}
          </div>
        </div>

        {/* Cadre réservé à M-It LevelUp pour phrases personnalisées */}
        {proforma.notes && (
          <div className="mt-4 p-3 rounded-xl border border-slate-300 bg-slate-50/80 text-xs avoid-break">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-950">
                Cadre réservé à M-It LevelUp :
              </span>
            </div>
            <p className="text-slate-800 leading-relaxed italic whitespace-pre-line font-medium pl-2.5 border-l-2 border-slate-950 text-[11px]">
              {proforma.notes}
            </p>
          </div>
        )}

        {/* Signatures officielles */}
        <div className="mt-4 pt-1 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs avoid-break">
          {/* Visa Client */}
          <div className="w-64 text-left">
            <p className="font-extrabold text-slate-950 mb-2 text-xs">
              {recipientName}
            </p>
            {proforma.signatureClient && proforma.signatureDataUrl ? (
              <div className="p-2 border border-emerald-300 rounded-xl bg-emerald-50/40">
                <img
                  src={proforma.signatureDataUrl}
                  alt="Signature Client"
                  className="h-12 max-w-full object-contain mx-auto"
                />
                <div className="text-[10px] text-emerald-800 font-bold mt-1">
                  ✓ Bon pour accord signé par {proforma.signerName || "Client"}
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  Le {formatDateTime(proforma.signedAt)} • IP : {proforma.signerIp || "127.0.0.1"}
                </div>
                <div className="text-[8px] text-slate-400 font-mono truncate">
                  Hash : {proforma.signatureHash?.substring(0, 20)}...
                </div>
              </div>
            ) : (
              <>
                <div className="h-11 border-b-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 italic">
                  Bon pour accord &amp; Signature Client
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                  Date &amp; mention manuscrite « Bon pour accord »
                </p>
                {!proforma.signatureClient && (
                  <div className="no-print mt-1.5">
                    <button
                      type="button"
                      onClick={copySignLink}
                      className="text-[10px] text-brand-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copier le lien pour faire signer le client
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Signature M-It LevelUp */}
          <div className="text-right">
            <CompanyStampSignature
              signerName={companySettings?.managerName || "Miora Antenaina RAZAKATIANA"}
              signDate={formatDate(proforma.date)}
              hash={`PROFORMA-${proforma.proformaNumber}`}
            />
          </div>
        </div>

        {/* Footer officiel agence */}
        <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[10px] text-slate-600 font-medium space-y-0.5 avoid-break">
          <p className="font-bold text-slate-900">
            Agence de développement de site / application web
          </p>
          <p>{companySettings?.address || "Lot : Andoharanofotsy"}</p>
          <p>
            {companySettings?.city ? `${companySettings.city} ` : "Antananarivo 102 "}
            {companySettings?.country || "Madagascar"}
          </p>
        </div>
      </div>
    </div>
  );
}
