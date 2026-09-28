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
} from "lucide-react";
import { formatAriary, formatCurrency, getCurrencySymbol, formatDate } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CompanyStampSignature } from "./CompanyStampSignature";

interface ProformaPrintViewProps {
  proforma: any;
  companySettings?: any;
}

export function ProformaPrintView({ proforma, companySettings }: ProformaPrintViewProps) {
  const router = useRouter();
  const [isConverting, setIsConverting] = useState(false);

  const currency = proforma.currency || companySettings?.currency || "Ar";
  const currencySym = getCurrencySymbol(currency);

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

  const waMsg = `Bonjour ${recipientName},\n\nVeuillez trouver ci-joint votre devis / Facture Proforma officielle ${proforma.proformaNumber} émise par M-It LevelUp pour un montant total de ${formatCurrency(proforma.total, currency)} (Acompte de 50% au lancement : ${formatCurrency(proforma.depositAmount, currency)}).\n\nNous restons disponibles pour le démarrage de votre projet.\n\nCordialement,\nM-It LevelUp`;

  const waUrl = buildWhatsAppUrl(recipientPhone, waMsg);

  const handleConvertToInvoice = async () => {
    if (!proforma.clientId) {
      alert("Pour convertir cette proforma en facture officielle, elle doit être rattachée à un client.");
      return;
    }
    if (!confirm(`Convertir la proforma ${proforma.proformaNumber} en facture d'acompte officielle ?`)) return;

    setIsConverting(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: proforma.clientId,
          type: "ACOMPTE_50",
          items: proforma.items.map((it: any) => ({
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
          discount: proforma.discount,
          currency: proforma.currency || "Ar",
          paymentTerms: `Acompte 50% suite acceptation proforma ${proforma.proformaNumber}`,
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
            <h2 className="text-base font-bold text-slate-900">
              {proforma.proformaNumber}
            </h2>
            <p className="text-xs text-slate-500">
              {recipientName} • Validité jusqu'au :{" "}
              <span className="font-bold text-slate-700">
                {formatDate(proforma.validityDate)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Bouton Télécharger / Imprimer PDF A4 */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Imprimer ou enregistrer en PDF via votre navigateur"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Imprimer / Télécharger PDF</span>
          </button>

          {/* Envoi WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer WhatsApp</span>
          </a>

          {/* Conversion en Facture */}
          <button
            onClick={handleConvertToInvoice}
            disabled={isConverting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
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
            <p className="text-slate-700 text-[11px]">
              • Acompte de {proforma.depositPercent || 50}% à la commande :{" "}
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
          <div className="w-56 text-left">
            <p className="font-extrabold text-slate-950 mb-4 text-xs">
              {recipientName}
            </p>
            <div className="h-11 border-b-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 italic">
              Bon pour accord &amp; Signature Client
            </div>
            <p className="text-[9px] text-slate-400 mt-1">
              Date &amp; mention manuscrite « Bon pour accord »
            </p>
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
