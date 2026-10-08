import fr from './fr';
import en from './en';
import { site } from '../config/site';

export const langs = ['fr', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'fr';

export type Dict = typeof fr;

/** Typographie française : espace insécable avant : ; ? ! % » et après «. */
const NBSP = String.fromCharCode(0xa0);
export const frTypo = (text: string) => text.replace(/ ([:;?!%»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);
export const typo = (text: string, lang: Lang) => (lang === 'fr' ? frTypo(text) : text);

/** Applique une transformation à tous les textes d'un objet (les fonctions sont conservées). */
function mapStrings<T>(value: T, fn: (text: string) => string): T {
  if (typeof value === 'string') return fn(value) as T;
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, mapStrings(v, fn)])) as T;
  }
  return value;
}

// Insère le nom de l'entreprise partout où les textes contiennent {marque}.
const brand = (text: string) => text.replaceAll('{marque}', site.name);
const dicts: Record<Lang, Dict> = {
  fr: mapStrings(fr, (text) => frTypo(brand(text))),
  en: mapStrings(en, brand),
};

/** Dans un fichier de données, soigne la typographie de tous les textes rangés sous une clé « fr ». */
export function frenchData<T>(value: T, inFrench = false): T {
  if (typeof value === 'string') return (inFrench ? frTypo(value) : value) as T;
  if (Array.isArray(value)) return value.map((v) => frenchData(v, inFrench)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, frenchData(v, inFrench || k === 'fr')]),
    ) as T;
  }
  return value;
}

/** Dictionnaire de la langue demandée. */
export const useT = (lang: Lang): Dict => dicts[lang];

/** Texte bilingue stocké dans les fichiers de données : { fr, en }. */
export type Bilingual = { fr: string; en: string };
export const tr = (value: Bilingual, lang: Lang) => typo(value[lang], lang);

/** Remplace les {variables} d'une phrase. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

// Adresse de chaque page, dans chaque langue.
export const routes = {
  home: { fr: '', en: '' },
  programmes: { fr: 'programmes', en: 'developments' },
  avancement: { fr: 'avancement', en: 'progress' },
  realisations: { fr: 'realisations', en: 'completed' },
  about: { fr: 'a-propos', en: 'about' },
  news: { fr: 'actualites', en: 'news' },
  contact: { fr: 'contact', en: 'contact' },
  legal: { fr: 'mentions-legales', en: 'legal-notice' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
} as const;
export type RouteKey = keyof typeof routes;

/** Dossier d'où le site est servi ('' à la racine, '/residences-wouri' sur GitHub Pages). */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Ajoute ce dossier à un chemin absolu depuis la racine du site : withBase('/favicon.svg'). */
export const withBase = (path: string) => base + path;

/** Chemin d'une page : href('en', 'programmes', 'domaine-du-littoral'). */
export function href(lang: Lang, key: RouteKey, slug?: string) {
  return base + '/' + [lang, routes[key][lang], slug].filter(Boolean).join('/') + '/';
}

export const locales: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' };
export const ogLocales: Record<Lang, string> = { fr: 'fr_FR', en: 'en_GB' };
