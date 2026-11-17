"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Printer,
  Send,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatAriary, formatCurrency, getCurrencySymbol, numberToFrenchWords, formatDate, formatDateTime } from "@/lib/formatters";
import { buildWhatsAppUrl, generateInvoiceMessage } from "@/lib/whatsapp";
import { CompanyStampSignature } from "./CompanyStampSignature";

interface InvoicePrintViewProps {
  invoice: any;
  companySettings?: any;
}

export function InvoicePrintView({ invoice, companySettings }: InvoicePrintViewProps) {
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(invoice.remainingAmount || invoice.total);
  const [paymentMethod, setPaymentMethod] = useState("MVOLA");
  const [paymentRef, setPaymentRef] = useState("");
  const [isPaid, setIsPaid] = useState(invoice.status === "PAYEE");

  const [copiedSignLink, setCopiedSignLink] = useState(false);

  const currency = invoice.currency || companySettings?.currency || "Ar";
  const currencySym = getCurrencySymbol(currency);

  const signToken = invoice.signToken;
  const copySignLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://crm.m-itlevelup.com";
    const url = `${origin}/sign/${signToken}`;
    navigator.clipboard.writeText(url);
    setCopiedSignLink(true);
    setTimeout(() => setCopiedSignLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          clientId: invoice.clientId,
          amount: Number(paymentAmount),
          method: paymentMethod,
          reference: paymentRef,
          notes: `Règlement facture ${invoice.invoiceNumber}`,
        }),
      });
      if (res.ok) {
        setIsRecordingPayment(false);
        setIsPaid(true);
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clientPhone = invoice.client?.whatsapp || invoice.client?.phone?.replace(/[^0-9]/g, "");
  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://crm.m-itlevelup.com";
  const signUrl = `${originUrl}/sign/${signToken}`;
  const waMsg = `Bonjour ${invoice.client?.name || "Client"},\n\nVeuillez trouver votre facture officielle *${invoice.invoiceNumber}* émise par M-It LevelUp pour un montant de *${formatCurrency(invoice.total, currency)}* (Montant attendu : *${formatCurrency(invoice.remainingAmount || invoice.total, currency)}*).\n\n✍️ *Signer votre facture directement en ligne (sécurisé)* :\n${signUrl}\n\nRèglements acceptés : MVola (+261 34 54 038 98) ou virement bancaire.\n\nMerci pour votre confiance !\n*M-It LevelUp*`;
  const waUrl = buildWhatsAppUrl(clientPhone || "261345403898", waMsg);

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Non imprimable) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/invoices"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900">
                {invoice.invoiceNumber}
              </h2>
              {/* Statut Paiement */}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  invoice.status === "PAYEE"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : invoice.status === "PARTIELLEMENT_PAYEE"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : invoice.status === "EN_RETARD"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {invoice.status}
              </span>
              {/* Statut Signature Client */}
              {invoice.signatureClient ? (
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Signé par {invoice.signerName || "Client"} {invoice.signedAt ? `(${formatDate(invoice.signedAt)})` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Non signé par le client
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {invoice.client?.company || invoice.client?.name}
              {invoice.date && ` • Émis le ${formatDate(invoice.date)}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer / PDF</span>
          </button>

          {/* Bouton Copier Lien Signature */}
          <button
            onClick={copySignLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Copier le lien direct de signature client"
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
            title="Envoyer la facture et le lien de signature par WhatsApp"
          >
            <Send className="w-4 h-4" />
            <span>WhatsApp (avec lien)</span>
          </a>

          {invoice.status !== "PAYEE" && !isPaid && (
            <button
              onClick={() => setIsRecordingPayment(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Encaisser</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal Enregistrement Paiement */}
      {isRecordingPayment && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Enregistrer un paiement pour {invoice.invoiceNumber}
            </h3>
            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Montant perçu ({currencySym}) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none font-bold text-slate-900 pr-12"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-black text-brand-800">
                    {currencySym}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Méthode de paiement *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                >
                  <option value="MVOLA">MVola</option>
                  <option value="ORANGE_MONEY">Orange Money</option>
                  <option value="AIRTEL_MONEY">Airtel Money</option>
                  <option value="VIREMENT_BANCAIRE">Virement Bancaire (BNI/BMOI/etc.)</option>
                  <option value="ESPECES">Espèces</option>
                  <option value="CHEQUE">Chèque</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Référence de transaction</label>
                <input
                  type="text"
                  placeholder="Ex: TXN-99882231"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsRecordingPayment(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-800 text-white text-xs font-semibold hover:bg-brand-900"
                >
                  Valider l'encaissement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT FACTURE OFFICIEL M-IT LEVELUP (Conforme au document fourni) */}
      <div className="print-container bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-4xl mx-auto p-8 sm:p-12 print:p-0 print:border-none print:shadow-none print:rounded-none text-slate-900">
        {/* Header : Logo & Date à gauche | Facture & Destinataire à droite */}
        <div className="flex justify-between items-start pb-8 print:pb-2">
          {/* Bloc Gauche */}
          <div className="space-y-4 print:space-y-1.5">
            {/* Logo Officiel M-It LevelUP */}
            <div className="mb-2">
              <div className="relative w-64 h-16 print:w-56 print:h-14">
                <Image
                  src="/logo-official.jpg"
                  alt="M-It LevelUP — Transformation Digitale"
                  width={240}
                  height={64}
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>

            {/* Date */}
            <div className="text-sm print:text-xs font-bold tracking-wide">
              DATE : {formatDate(invoice.date)}
            </div>

            {/* Émetteur */}
            <div className="text-xs print:text-[11px] space-y-0.5 text-slate-800">
              <p className="font-extrabold text-sm print:text-xs uppercase tracking-tight">ÉMETTEUR :</p>
              <p className="font-bold text-slate-900">
                {companySettings?.managerName || "Miora Antenaina RAZAKATIANA"}
              </p>
              <p>NIF : {companySettings?.nif || "5019189714"}</p>
              <p>STAT : {companySettings?.stat || "62011 11 2025 0 03126"}</p>
              <p>Email : {companySettings?.email || "razakatiana.antenaina@yahoo.com"}</p>
              <p>Téléphone : {companySettings?.phone || "+261 34 54 038 98"}</p>
              <p>Web Site : {companySettings?.website || "https://m-itlevelup.com/"}</p>
            </div>
          </div>

          {/* Bloc Droit */}
          <div className="text-right space-y-4 print:space-y-1 max-w-xs">
            <div>
              <h1 className="text-4xl print:text-2xl font-extrabold tracking-tight text-slate-950 font-sans">
                Facture
              </h1>
              <p className="text-xs print:text-[11px] font-bold text-slate-700 mt-1 print:mt-0.5">
                Base N° : {invoice.baseNumber || invoice.invoiceNumber}
              </p>
            </div>

            <div className="text-xs print:text-[11px] space-y-0.5 pt-4 print:pt-1">
              <p className="font-extrabold uppercase tracking-tight">DESTINATAIRE :</p>
              <p className="font-extrabold text-base print:text-sm text-slate-900">
                {invoice.client?.company || invoice.client?.name}
              </p>
              {invoice.client?.address && (
                <p className="text-slate-600">{invoice.client?.address}</p>
              )}
              {invoice.client?.phone && (
                <p className="text-slate-600">{invoice.client?.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <hr className="border-t border-slate-900 my-4 print:my-2" />

        {/* Table des Prestations */}
        <div className="my-6 print:my-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-900/40 text-slate-900 font-bold">
                <th className="py-2.5 print:py-1 text-left font-bold w-1/2">Description :</th>
                <th className="py-2.5 print:py-1 text-right font-bold">Prix Unitaire ( {currencySym} ) :</th>
                <th className="py-2.5 print:py-1 text-center font-bold">Quantité :</th>
                <th className="py-2.5 print:py-1 text-right font-bold">Total :</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {invoice.items?.map((item: any) => (
                <tr key={item.id} className="align-top">
                  <td className="py-3 print:py-1.5 pr-4 text-slate-800 leading-relaxed whitespace-pre-line font-medium print:text-[11px]">
                    {item.description}
                  </td>
                  <td className="py-3 print:py-1.5 text-right font-semibold text-slate-800 whitespace-nowrap print:text-[11px]">
                    {Math.round(item.unitPrice).toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3 print:py-1.5 text-center font-semibold text-slate-800 print:text-[11px]">
                    {item.quantity}
                  </td>
                  <td className="py-3 print:py-1.5 text-right font-bold text-slate-900 whitespace-nowrap print:text-[11px]">
                    {Math.round(item.total).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totaux & Mentions Légales */}
        <div className="pt-6 print:pt-2 border-t border-slate-900 space-y-3 print:space-y-1">
          <div className="flex flex-col items-end space-y-1.5 print:space-y-0.5 text-sm print:text-xs">
            <div className="flex justify-between w-72 print:w-64 text-slate-800 font-bold">
              <span>TOTAL HT :</span>
              <span>{formatCurrency(invoice.subtotal, currency)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-96 print:w-80 text-xs print:text-[10px] text-slate-700 font-semibold text-right">
              <span>TVA non applicable – entreprise non assujettie à la TVA :</span>
              <span className="whitespace-nowrap ml-2">{formatCurrency(0, currency)}</span>
            </div>
            <div className="flex justify-between w-72 print:w-64 text-base print:text-sm font-extrabold text-slate-950 border-t border-slate-300 pt-1 print:pt-0.5">
              <span>TOTAL TTC :</span>
              <span>{formatCurrency(invoice.total, currency)}</span>
            </div>
          </div>

          {/* Arrêté la présente facture */}
          <div className="pt-4 print:pt-1 text-xs print:text-[11px] font-semibold text-slate-800">
            <p>
              Arrêté la présente facture à la somme de{" "}
              <span className="font-bold underline">{invoice.amountInWords || numberToFrenchWords(invoice.total, currency)}</span>
            </p>
          </div>

          {/* Acompte / Reste à payer */}
          {invoice.paymentTerms && (
            <div className="text-xs print:text-[11px] font-bold text-slate-900">
              {invoice.paymentTerms}
            </div>
          )}
        </div>

        {/* Cadre réservé à M-It LevelUp pour phrases personnalisées */}
        {invoice.notes && (
          <div className="mt-5 print:mt-2.5 p-3.5 print:p-2.5 rounded-xl border border-slate-900/40 bg-slate-50/70 text-xs print:text-[11px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              <span className="font-extrabold uppercase text-[11px] print:text-[10px] tracking-wider text-slate-950">
                Cadre réservé à M-It LevelUp :
              </span>
            </div>
            <p className="text-slate-800 leading-relaxed italic whitespace-pre-line font-medium pl-3 border-l-2 border-slate-900/50">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Signatures officielles */}
        <div className="mt-8 print:mt-2.5 pt-4 print:pt-1 flex flex-col sm:flex-row justify-between items-end gap-6 print:gap-4 text-xs">
          {/* Signature Client */}
          <div className="w-64 print:w-48 text-left">
            <p className="font-extrabold text-slate-950 mb-2 print:mb-1 text-sm print:text-xs">
              {invoice.client?.company || invoice.client?.name}
            </p>
            {invoice.signatureClient && invoice.signatureDataUrl ? (
              <div className="p-2 border border-emerald-300 rounded-xl bg-emerald-50/40">
                <img
                  src={invoice.signatureDataUrl}
                  alt="Signature Client"
                  className="h-12 max-w-full object-contain mx-auto"
                />
                <div className="text-[10px] print:text-[8px] text-emerald-800 font-bold mt-1">
                  ✓ Signé électroniquement par {invoice.signerName || "Client"}
                </div>
                <div className="text-[9px] print:text-[7px] text-slate-500 font-mono">
                  Le {formatDateTime(invoice.signedAt)} • IP : {invoice.signerIp || "127.0.0.1"}
                </div>
                <div className="text-[8px] print:text-[6px] text-slate-400 font-mono truncate">
                  Hash : {invoice.signatureHash?.substring(0, 20)}...
                </div>
              </div>
            ) : (
              <>
                <div className="h-14 print:h-11 border-b-2 border-dashed border-slate-300 flex items-center justify-center text-[11px] print:text-[10px] text-slate-400 italic">
                  {invoice.signatureClient ? "Signé électroniquement" : "Signature Client & Bon pour accord"}
                </div>
                <p className="text-[10px] print:text-[9px] text-slate-400 mt-1">
                  Précédé de la mention « Lu et approuvé »
                </p>
                {!invoice.signatureClient && (
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

          {/* Signature M-It LevelUp (Cachet officiel d'entreprise et signature du gérant en bleu nuit & noir) */}
          <div className="text-right">
            <CompanyStampSignature
              signerName={companySettings?.managerName || "Miora Antenaina RAZAKATIANA"}
              signDate={formatDate(invoice.date)}
              hash={invoice.signatureHash || "CCE77EA165994C947265FBA93E"}
            />
          </div>
        </div>

        {/* Footer officiel agence */}
        <div className="mt-10 print:mt-2 pt-4 print:pt-1 border-t border-slate-200 text-center text-[11px] print:text-[10px] text-slate-600 font-medium space-y-0.5 print:space-y-0">
          <p className="font-bold text-slate-900">Agence de développement de site / application web</p>
          <p>{companySettings?.address || "Lot : D79 Soalazaina Ambatolampy"}</p>
          <p>
            {companySettings?.city ? `${companySettings.city} ` : "Antananarivo 102 "}
            {companySettings?.country || "Madagascar"}
          </p>
        </div>
      </div>
    </div>
  );
}
