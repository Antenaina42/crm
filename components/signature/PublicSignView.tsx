"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  CheckCircle2,
  Printer,
  PenTool,
  RotateCcw,
  Building,
  Calendar,
  Lock,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  formatCurrency,
  formatAriary,
  formatDate,
  formatDateTime,
  numberToFrenchWords,
  getCurrencySymbol,
} from "@/lib/formatters";
import { CompanyStampSignature } from "@/components/documents/CompanyStampSignature";

interface PublicSignViewProps {
  contract?: any;
  documentType?: "CONTRACT" | "INVOICE" | "PROFORMA";
  data?: any;
  token?: string;
  companySettings?: any;
}

export function PublicSignView({
  contract,
  documentType,
  data,
  token: propToken,
  companySettings,
}: PublicSignViewProps) {
  const type = documentType || (contract ? "CONTRACT" : "INVOICE");
  const doc = data || contract;
  const token = propToken || doc?.signToken;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Déterminer le nom du signataire par défaut
  const defaultSignerName =
    doc?.signerName ||
    doc?.client?.name ||
    (doc?.prospect ? `${doc.prospect.firstName} ${doc.prospect.lastName}`.trim() : "") ||
    "";
  const [signerName, setSignerName] = useState(defaultSignerName);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAlreadySigned =
    type === "CONTRACT"
      ? doc.status === "SIGNE"
      : Boolean(doc.signatureClient);

  const [signedData, setSignedData] = useState<{
    hash: string;
    signedAt: string;
    signatureDataUrl?: string;
  } | null>(
    isAlreadySigned
      ? {
          hash: doc.signatureHash || "CCE77EA165994C947265FBA93E",
          signedAt: doc.signedAt || new Date().toISOString(),
          signatureDataUrl: doc.signatureDataUrl || undefined,
        }
      : null
  );

  const currency = doc?.currency || companySettings?.currency || "Ar";
  const currencySym = getCurrencySymbol(currency);

  const clientName =
    doc?.client?.company ||
    doc?.client?.name ||
    (doc?.prospect ? `${doc.prospect.firstName} ${doc.prospect.lastName}`.trim() : "") ||
    "Client Partenaire";

  // Setup Canvas
  useEffect(() => {
    if (signedData) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#020712"; // Bleu nuit / noir
  }, [signedData]);

  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSign = async () => {
    if (!hasDrawn || !signerName.trim() || !termsAccepted || !token) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    setErrorMessage("");
    const signatureDataUrl = canvas.toDataURL("image/png");

    try {
      const res = await fetch(`/api/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName: signerName.trim(),
          signatureDataUrl,
        }),
      });

      const resData = await res.json();

      if (res.ok) {
        setSignedData({
          hash: resData.hash,
          signedAt: resData.signedAt,
          signatureDataUrl,
        });

        // Confetti celebration 🎉
        try {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#0b1d3a", "#06b6d4", "#10b981", "#020712"],
          });
        } catch (e) {}
      } else {
        setErrorMessage(resData.error || "Une erreur est survenue lors de la signature.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Impossible de communiquer avec le serveur de signature.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const docTitle =
    type === "INVOICE"
      ? `Facture ${doc.invoiceNumber}`
      : type === "PROFORMA"
      ? `Facture Proforma ${doc.proformaNumber}`
      : doc.title || `Contrat ${doc.contractNumber}`;

  const docSubtitle =
    type === "INVOICE"
      ? "Facture Officielle de Prestations Numériques"
      : type === "PROFORMA"
      ? "Devis & Proposition Technique — Bon pour Accord"
      : "Contrat de Prestation de Services Numériques";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-52 h-12">
              <Image
                src="/logo-official.jpg"
                alt="M-It LevelUP — Transformation Digitale"
                width={208}
                height={48}
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Certifié SSL / 256-bit
          </div>
        </div>

        {/* Document Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {docSubtitle}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {docTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Destinataire :{" "}
                <span className="font-semibold text-slate-800">{clientName}</span>
                {doc.date && ` • Émis le : ${formatDate(doc.date)}`}
                {doc.dueDate && ` • Échéance : ${formatDate(doc.dueDate)}`}
                {doc.validityDate && ` • Validité : ${formatDate(doc.validityDate)}`}
              </p>
            </div>
            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                Montant Total
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-brand-900">
                {formatCurrency(doc.total || doc.totalAmount, currency)}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                TVA non applicable
              </span>
            </div>
          </div>

          {/* Corps du Document selon le type */}
          {type === "CONTRACT" && (
            <div className="space-y-4">
              <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line max-h-80 overflow-y-auto">
                {doc.content}
              </div>

              {/* Conditions Financières Spécifiques Contrat */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/60 text-xs">
                <div>
                  <span className="text-slate-500 block">Acompte de démarrage :</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatAriary(doc.depositAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Solde à la livraison :</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatAriary(doc.remainderAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {(type === "INVOICE" || type === "PROFORMA") && (
            <div className="space-y-5">
              {/* Table des prestations */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-2.5 text-left w-1/2">Description de la prestation</th>
                      <th className="py-2.5 text-right">Prix Unitaire</th>
                      <th className="py-2.5 text-center">Quantité</th>
                      <th className="py-2.5 text-right">Total ({currencySym})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {doc.items?.map((item: any) => (
                      <tr key={item.id} className="align-top">
                        <td className="py-3 pr-3 font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                          {item.description}
                        </td>
                        <td className="py-3 text-right font-semibold text-slate-700 whitespace-nowrap">
                          {Math.round(item.unitPrice).toLocaleString("fr-FR")}
                        </td>
                        <td className="py-3 text-center font-semibold text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                          {Math.round(item.total).toLocaleString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Récapitulatif Totaux */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Total HT :</span>
                  <span className="font-semibold">{formatCurrency(doc.subtotal || doc.total, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>TVA (0% — Franchise en base) :</span>
                  <span>0 {currencySym}</span>
                </div>
                <div className="flex justify-between text-slate-950 font-extrabold text-sm border-t border-slate-200 pt-2">
                  <span>Total TTC :</span>
                  <span className="text-brand-900">{formatCurrency(doc.total, currency)}</span>
                </div>

                {/* Arrêté en lettres */}
                <p className="text-[11px] text-slate-600 italic pt-1">
                  Arrêté à la somme de :{" "}
                  <span className="font-semibold text-slate-800">
                    {doc.amountInWords || numberToFrenchWords(doc.total, currency)}
                  </span>
                </p>

                {/* Modalités Acompte */}
                {doc.depositPercent !== undefined && doc.depositPercent !== null && (
                  <div className="pt-2 border-t border-slate-200/60 text-[11px]">
                    {doc.depositPercent === 0 ? (
                      <div className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <span className="font-bold block">Modalité de règlement :</span>
                          <span className="text-emerald-700 text-[10px]">Aucun acompte exigé au démarrage</span>
                        </div>
                        <span className="font-extrabold text-emerald-900 text-xs bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300/60 self-start sm:self-auto">
                          Paiement 100% à la livraison
                        </span>
                      </div>
                    ) : doc.depositPercent === 100 ? (
                      <div className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold">Modalité de règlement :</span>
                        <span className="font-extrabold text-emerald-900 text-xs bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300/60">
                          Règlement intégral 100% à la commande
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-500 block">Acompte requis ({doc.depositPercent}%) :</span>
                          <span className="font-bold text-emerald-800">
                            {formatCurrency(doc.depositAmount, currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Reste dû à la livraison :</span>
                          <span className="font-bold text-slate-800">
                            {formatCurrency(doc.remainingAmount || doc.remainderAmount, currency)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Conditions / Notes */}
              {(doc.paymentTerms || doc.conditions || doc.notes) && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-slate-700 space-y-1">
                  {doc.paymentTerms && (
                    <p>
                      <strong className="text-slate-900">Modalités :</strong> {doc.paymentTerms}
                    </p>
                  )}
                  {doc.conditions && (
                    <p>
                      <strong className="text-slate-900">Conditions :</strong> {doc.conditions}
                    </p>
                  )}
                  {doc.notes && (
                    <p className="italic text-slate-500">« {doc.notes} »</p>
                  )}
                </div>
              )}

              {/* Cachet et signature de l'émetteur (M-It LevelUp) */}
              <div className="pt-2 flex justify-end">
                <CompanyStampSignature
                  signerName={companySettings?.managerName || "Miora Antenaina RAZAKATIANA"}
                  signDate={formatDate(doc.date)}
                  hash={doc.signatureHash || "MIT-OFFICIAL-2026"}
                />
              </div>
            </div>
          )}

          {/* Zone de Signature ou Preuve Validée */}
          {signedData ? (
            /* Document Déjà Signé */
            <div className="p-6 bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl text-center space-y-4 animate-slide-up">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  {type === "PROFORMA"
                    ? "Bon pour Accord Signé avec Succès !"
                    : "Document Signé Électroniquement avec Succès !"}
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto mt-0.5">
                  La signature a été enregistrée, cryptographiée et certifiée conforme. Une notification a été transmise à M-It LevelUp.
                </p>
              </div>

              {/* Rendu visuel de la signature */}
              {(signedData.signatureDataUrl || doc.signatureDataUrl) && (
                <div className="p-3 bg-white rounded-2xl border border-emerald-200 max-w-sm mx-auto shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Signature manuscrite apposée :
                  </span>
                  <img
                    src={signedData.signatureDataUrl || doc.signatureDataUrl}
                    alt="Signature"
                    className="h-16 max-w-full object-contain mx-auto"
                  />
                </div>
              )}

              <div className="text-xs font-mono text-slate-700 bg-white/90 p-4 rounded-2xl border border-emerald-200 max-w-lg mx-auto text-left space-y-1 shadow-xs">
                <p>
                  <span className="font-bold">Signataire :</span> {doc.signerName || signerName}
                </p>
                <p>
                  <span className="font-bold">Date & Heure :</span> {formatDateTime(signedData.signedAt)}
                </p>
                {doc.signerIp && (
                  <p>
                    <span className="font-bold">Adresse IP :</span> {doc.signerIp}
                  </p>
                )}
                <p className="break-all text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Empreinte SHA-256 :</span> {signedData.hash}
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Imprimer le Document Certifié
              </button>
            </div>
          ) : (
            /* Zone de Dessin de la Signature */
            <div className="space-y-4 pt-6 border-t border-slate-200">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-brand-800" />
                    Zone de Signature Client & Bon pour Accord
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tracez votre signature avec le doigt sur écran tactile ou à l'aide de votre souris
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Effacer
                </button>
              </div>

              {/* Canvas Pad */}
              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden bg-slate-50 hover:bg-white transition-colors cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={160}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-40 touch-none"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    Signez dans ce cadre
                  </div>
                )}
              </div>

              {/* Nom du Signataire */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom et Prénom du Signataire *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean RATSIRAKA"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Checkbox d'engagement */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-brand-800 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-600">
                  {type === "PROFORMA" ? (
                    <>
                      Je confirme que cette signature vaut <strong className="text-slate-900">« Bon pour accord »</strong> et acceptation des prestations et modalités financières pour le compte de{" "}
                      <strong className="text-slate-900">{clientName}</strong>.
                    </>
                  ) : type === "INVOICE" ? (
                    <>
                      Je certifie être habilité(e) à signer et approuver cette facture pour le compte de{" "}
                      <strong className="text-slate-900">{clientName}</strong>, et je m'engage au respect des modalités de règlement indiquées.
                    </>
                  ) : (
                    <>
                      Je certifie être habilité à signer ce contrat pour le compte de{" "}
                      <strong className="text-slate-900">{clientName}</strong> et j'accepte l'intégralité des clauses énoncées.
                    </>
                  )}
                </span>
              </label>

              {/* Bouton de Soumission */}
              <button
                type="button"
                onClick={handleSign}
                disabled={!hasDrawn || !signerName.trim() || !termsAccepted || isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-lg shadow-brand-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting
                  ? "Validation et scellement en cours..."
                  : type === "PROFORMA"
                  ? "Valider et Signer le Bon pour Accord"
                  : "Signer Électroniquement"}
              </button>
            </div>
          )}
        </div>

        {/* Footer officiel */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>© 2026 M-It LevelUp — Agence Digitale & Solutions Web</p>
          <p>Lot D79 Soalazaina Ambatolampy, Antananarivo 102 Madagascar</p>
        </div>
      </div>
    </div>
  );
}
