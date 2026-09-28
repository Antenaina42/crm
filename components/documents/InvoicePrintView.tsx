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
} from "lucide-react";
import { formatAriary, formatCurrency, getCurrencySymbol, numberToFrenchWords, formatDate } from "@/lib/formatters";
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

  const currency = invoice.currency || companySettings?.currency || "Ar";
  const currencySym = getCurrencySymbol(currency);

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
  const waMsg = generateInvoiceMessage({
    clientName: invoice.client?.name || "Client",
    invoiceNumber: invoice.invoiceNumber,
    totalAmount: formatCurrency(invoice.total, currency),
    dueAmount: formatCurrency(invoice.remainingAmount || invoice.total, currency),
  });
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
            <h2 className="text-base font-bold text-slate-900">
              {invoice.invoiceNumber}
            </h2>
            <p className="text-xs text-slate-500">
              {invoice.client?.company || invoice.client?.name} • Statut :{" "}
              <span className="font-bold text-slate-700">{invoice.status}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimer / PDF A4
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            Envoyer WhatsApp
          </a>

          {invoice.status !== "PAYEE" && !isPaid && (
            <button
              onClick={() => setIsRecordingPayment(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              Encaisser Paiement
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Montant perçu (Ar) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white outline-none"
                />
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
            {/* Logo M-It */}
            <div className="flex items-center gap-3">
              <div className="relative w-28 h-12 print:w-24 print:h-9">
                <Image
                  src="/logo-mit.png"
                  alt="M-It Logo"
                  width={112}
                  height={44}
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div className="border-l-2 border-slate-950 pl-3">
                <span className="text-base print:text-sm font-extrabold tracking-tight text-slate-950 block leading-tight">
                  M-It LevelUp
                </span>
                <span className="text-[10px] print:text-[9px] text-slate-500 uppercase font-semibold tracking-wider">
                  Digital Solutions
                </span>
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
          <div className="w-56 print:w-48 text-left">
            <p className="font-extrabold text-slate-950 mb-6 print:mb-2 text-sm print:text-xs">
              {invoice.client?.company || invoice.client?.name}
            </p>
            <div className="h-14 print:h-11 border-b-2 border-dashed border-slate-300 flex items-center justify-center text-[11px] print:text-[10px] text-slate-400 italic">
              {invoice.signatureClient ? "Signé électroniquement" : "Signature Client & Bon pour accord"}
            </div>
            <p className="text-[10px] print:text-[9px] text-slate-400 mt-1">Précédé de la mention « Lu et approuvé »</p>
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
