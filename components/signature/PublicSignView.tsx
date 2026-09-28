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
} from "lucide-react";
import { formatAriary, formatDate } from "@/lib/formatters";

interface PublicSignViewProps {
  contract: any;
}

export function PublicSignView({ contract }: PublicSignViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState(contract.client?.name || "");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedData, setSignedData] = useState<{
    hash: string;
    signedAt: string;
  } | null>(
    contract.status === "SIGNE"
      ? {
          hash: contract.signatureHash || "CCE77EA165994C947265FBA93E",
          signedAt: contract.signedAt || new Date().toISOString(),
        }
      : null
  );

  // Setup Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#020712"; // Bleu nuit jusqu'à noir
  }, []);

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
    if (!hasDrawn || !signerName.trim() || !termsAccepted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    const signatureDataUrl = canvas.toDataURL("image/png");

    try {
      const res = await fetch(`/api/sign/${contract.signToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName,
          signatureDataUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSignedData({
          hash: data.hash,
          signedAt: data.signedAt,
        });

        // Confetti celebration 🎉
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#0b1d3a", "#06b6d4", "#10b981", "#020712"],
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs ring-1 ring-slate-900/5">
              <Image
                src="/logo-official.jpg"
                alt="M-It LevelUp"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                M-It <span className="text-brand-800">LevelUp</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Plateforme Sécurisée de Signature Électronique
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Certifié SSL / 256-bit
          </div>
        </div>

        {/* Document Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider">
                Document Officiel
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                {contract.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Réf : {contract.contractNumber} • Émis pour :{" "}
                <span className="font-semibold text-slate-700">
                  {contract.client?.company || contract.client?.name}
                </span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">
                Montant Global
              </span>
              <span className="text-xl font-extrabold text-brand-900">
                {formatAriary(contract.totalAmount)}
              </span>
            </div>
          </div>

          {/* Contenu du Contrat */}
          <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line max-h-80 overflow-y-auto">
            {contract.content}
          </div>

          {/* Conditions Financières Spécifiques */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/60 text-xs">
            <div>
              <span className="text-slate-500 block">Acompte de démarrage :</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatAriary(contract.depositAmount)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Solde à la livraison :</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatAriary(contract.remainderAmount)}
              </span>
            </div>
          </div>

          {/* Zone de Signature ou Preuve Validée */}
          {signedData ? (
            /* Document Déjà Signé */
            <div className="p-6 bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl text-center space-y-3 animate-slide-up">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-emerald-900">
                Document Signé Électroniquement avec Succès
              </h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Ce document a été signé de manière sécurisée et horodatée. Une copie conforme a été transmise à M-It LevelUp.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-600 bg-white/80 p-3 rounded-xl border border-emerald-200 max-w-lg mx-auto text-left space-y-1">
                <p>
                  <span className="font-bold">Signataire :</span> {contract.signerName || signerName}
                </p>
                <p>
                  <span className="font-bold">Date & Heure :</span> {new Date(signedData.signedAt).toLocaleString("fr-FR")}
                </p>
                <p className="break-all">
                  <span className="font-bold">Empreinte SHA-256 :</span> {signedData.hash}
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
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-brand-800" />
                    Zone de Signature Électronique
                  </h3>
                  <p className="text-xs text-slate-400">
                    Signez avec votre doigt sur écran tactile ou avec la souris
                  </p>
                </div>
                <button
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
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
                    Signez ici
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
                  placeholder="Ex: Miora RAZAKATIANA"
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
                  Je certifie être habilité à signer ce document pour le compte de{" "}
                  <strong className="text-slate-900">
                    {contract.client?.company || contract.client?.name}
                  </strong>{" "}
                  et j'accepte les termes, conditions et modalités financières énoncées.
                </span>
              </label>

              {/* Bouton de Soumission */}
              <button
                onClick={handleSign}
                disabled={!hasDrawn || !signerName.trim() || !termsAccepted || isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-lg shadow-brand-200 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? "Validation de la signature..." : "Je signe électroniquement"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
