import { site } from '../config/site';
import { fill, frTypo, locales, useT, type Lang } from '../i18n';

// Espace insécable, et espace fine insécable (celle que produit Intl en français).
const NBSP = String.fromCharCode(0xa0);
const NNBSP = String.fromCharCode(0x202f);
const nbsp = (s: string) => s.replaceAll(NNBSP, NBSP).replaceAll(' ', NBSP);

/** 38000000 → « 38 000 000 FCFA » (fr) ou « 38,000,000 FCFA » (en). */
export function fcfa(amount: number, lang: Lang) {
  return nbsp(`${new Intl.NumberFormat(locales[lang], { maximumFractionDigits: 0 }).format(amount)} FCFA`);
}

/** Équivalent indicatif en euros, arrondi à la centaine. */
export function eur(amount: number, lang: Lang) {
  const value = Math.round(amount / site.eurRate / 100) * 100;
  return nbsp(
    new Intl.NumberFormat(locales[lang], { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value),
  );
}

/** 65 → « 65 % » (fr) ou « 65% » (en). */
export const pct = (n: number, lang: Lang) => (lang === 'fr' ? `${n}${NBSP}%` : `${n}%`);

/** Citation avec les guillemets de la langue. */
export const quote = (text: string, lang: Lang) =>
  lang === 'fr' ? `«${NBSP}${frTypo(text)}${NBSP}»` : `“${text}”`;

export function area(m2: number, lang: Lang) {
  return nbsp(`${new Intl.NumberFormat(locales[lang]).format(m2)} m²`);
}

/** « 2026-09 » → « septembre 2026 » / « September 2026 ». */
export function month(ym: string, lang: Lang) {
  return new Intl.DateTimeFormat(locales[lang], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${ym}-01T00:00:00Z`),
  );
}

export function fullDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(locales[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

/** Horaires lisibles, calculés depuis src/config/site.ts. */
export function hoursLines(lang: Lang) {
  const t = useT(lang);
  const time = (hm: string) => {
    const [h, m] = hm.split(':').map(Number);
    const mm = String(m).padStart(2, '0');
    if (lang === 'fr') return m ? `${h} h ${mm}` : `${h} h`;
    const h12 = h % 12 || 12;
    return `${m ? `${h12}:${mm}` : h12} ${h >= 12 ? 'pm' : 'am'}`;
  };
  const lines = site.hours.map((slot) => {
    const first = t.days[slot.days[0]];
    const last = t.days[slot.days[slot.days.length - 1]];
    return {
      label: slot.days.length > 1 ? fill(t.hours.range, { first, last }) : fill(t.hours.single, { day: first }),
      time: nbsp(`${time(slot.opens)} – ${time(slot.closes)}`),
    };
  });
  return [...lines, { label: t.hours.closed, time: '' }];
}

export function addressLine() {
  const a = site.address;
  return `${a.street}, ${a.district}, ${a.city}`;
}

export const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/** Lien WhatsApp avec message pré-rempli. Le numéro par défaut vient de la configuration. */
export const waLink = (message: string, number: string = site.whatsapp.number) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
