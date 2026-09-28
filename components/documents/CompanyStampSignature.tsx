"use client";

import Image from "next/image";
import React from "react";

interface CompanyStampSignatureProps {
  signerName?: string;
  signDate?: string;
  hash?: string;
  className?: string;
}

export function CompanyStampSignature({
  signerName = "Miora Antenaina RAZAKATIANA",
  signDate,
  hash = "CCE77EA165994C947265FBA93E",
  className = "",
}: CompanyStampSignatureProps) {
  return (
    <div className={`relative inline-block text-left select-none ${className}`}>
      {/* Official Container with Midnight Blue to Black Border */}
      <div className="relative p-3 sm:p-4 print:p-2.5 rounded-xl border-l-4 border-b-2 border-slate-950 bg-gradient-to-br from-slate-900/[0.04] via-slate-900/[0.02] to-transparent shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-[10px] print:text-[9px] font-bold text-slate-800 uppercase tracking-tight">
            - Signé électroniquement pour l'agence par :
          </span>
          <span className="text-[9px] print:text-[8px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-cyan-400 font-bold">
            CERTIFIÉ CONFORME
          </span>
        </div>

        {/* Vector Official Stamp & Executive Handwritten Signature */}
        <div className="relative w-[280px] h-[130px] sm:w-[320px] sm:h-[145px] print:w-[240px] print:h-[105px] my-1 print:my-0.5">
          <Image
            src="/signature-mit-levelup.svg"
            alt="Cachet d'entreprise et Signature Officielle M-It LevelUp"
            width={320}
            height={145}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Footer info in midnight blue / slate */}
        <div className="pt-2 print:pt-1 border-t border-slate-200/80 flex items-center justify-between text-[10px] print:text-[9px] text-slate-600">
          <span className="font-mono text-[9px] print:text-[8px] text-slate-500">
            Horodatage : {signDate || "Scellement numérique"}
          </span>
          <span className="font-bold text-slate-900">M-It LevelUp Madagascar</span>
        </div>
      </div>

      <div className="text-right mt-2 print:mt-1">
        <p className="font-extrabold text-slate-950 text-xs print:text-[11px] tracking-tight">
          {signerName}
        </p>
        <p className="text-[10px] print:text-[9px] text-slate-600 font-medium">
          Gérant &amp; Fondateur — M-It LevelUp
        </p>
      </div>
    </div>
  );
}
