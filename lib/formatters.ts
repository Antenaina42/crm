/**
 * Utilitaires de formatage monétaire, textuel et temporel pour M-It LevelUp CRM
 */

export type CurrencyCode = "Ar" | "EUR" | "USD" | "€" | "$" | string;

export function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return "Ar";
  if (currency === "EUR" || currency === "€") return "€";
  if (currency === "USD" || currency === "$") return "$";
  return "Ar";
}

export function getCurrencyLabel(currency?: string | null): string {
  if (currency === "EUR" || currency === "€") return "Euro (€)";
  if (currency === "USD" || currency === "$") return "Dollar américain ($)";
  return "Ariary malgache (Ar)";
}

export function formatCurrency(
  amount: number | null | undefined,
  currency: CurrencyCode = "Ar"
): string {
  const sym = getCurrencySymbol(currency);
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0 ${sym}`;
  }

  const isDecimal = amount % 1 !== 0;
  const numStr = isDecimal
    ? amount.toFixed(2).replace(".", ",")
    : Math.round(amount).toString();
  const formatted = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `${formatted} ${sym}`;
}

export function formatAriary(amount: number | null | undefined): string {
  return formatCurrency(amount, "Ar");
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} à ${hours}:${mins}`;
}

export function daysUntil(date: Date | string): number {
  const target = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Convertit un nombre entier en toutes lettres en français (jusqu'aux milliards)
 * Exemple: 1950000 -> "un million neuf cent cinquante mille Ariary"
 */
export function numberToFrenchWords(amount: number, currency: CurrencyCode = "Ar"): string {
  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

  function convertGroup(n: number): string {
    let res = "";
    const h = Math.floor(n / 100);
    const rest = n % 100;

    if (h > 0) {
      if (h === 1) {
        res += "cent";
      } else {
        res += units[h] + " cent" + (rest === 0 ? "s" : "");
      }
      if (rest > 0) res += " ";
    }

    if (rest > 0) {
      if (rest < 10) {
        res += units[rest];
      } else if (rest < 20) {
        res += teens[rest - 10];
      } else {
        const t = Math.floor(rest / 10);
        const u = rest % 10;
        if (t === 7) {
          res += "soixante-" + teens[u];
        } else if (t === 9) {
          res += "quatre-vingt-" + teens[u];
        } else {
          res += tens[t];
          if (u === 1 && t !== 8) {
            res += " et un";
          } else if (u > 0) {
            res += "-" + units[u];
          } else if (t === 8 && u === 0) {
            res += "s";
          }
        }
      }
    }
    return res.trim();
  }

  const rounded = Math.floor(Math.abs(amount));
  const sym = getCurrencySymbol(currency);
  let zeroText = "zéro Ariary";
  if (sym === "€") zeroText = "zéro euro";
  if (sym === "$") zeroText = "zéro dollar";

  if (rounded === 0) return zeroText;

  const billions = Math.floor(rounded / 1000000000);
  const millions = Math.floor((rounded % 1000000000) / 1000000);
  const thousands = Math.floor((rounded % 1000000) / 1000);
  const remainder = rounded % 1000;

  const parts: string[] = [];

  if (billions > 0) {
    parts.push(convertGroup(billions) + (billions > 1 ? " milliards" : " milliard"));
  }
  if (millions > 0) {
    parts.push(convertGroup(millions) + (millions > 1 ? " millions" : " million"));
  }
  if (thousands > 0) {
    if (thousands === 1) {
      parts.push("mille");
    } else {
      parts.push(convertGroup(thousands) + " mille");
    }
  }
  if (remainder > 0) {
    parts.push(convertGroup(remainder));
  }

  let suffix = " Ariary";
  if (sym === "€") {
    suffix = rounded > 1 ? " euros" : " euro";
  } else if (sym === "$") {
    suffix = rounded > 1 ? " dollars" : " dollar";
  }

  const text = parts.join(" ") + suffix;
  return text.charAt(0).toLowerCase() + text.slice(1);
}
