import { getCollection, type CollectionEntry } from 'astro:content';
import { frenchData, type Lang } from '../i18n';

type ProgrammeData = CollectionEntry<'programmes'>['data'];
export type Unite = ProgrammeData['unites'][number];
export type Programme = ProgrammeData & {
  slug: string;
  total: number;
  disponibles: number;
  reserves: number;
  vendus: number;
  /** Prix le plus bas parmi les unités disponibles (ou parmi toutes si le programme est complet). */
  prixMin: number;
};

export async function getProgrammes(): Promise<Programme[]> {
  const entries = await getCollection('programmes');
  return entries
    .map(({ id, data: raw }) => {
      const data = frenchData(raw);
      const count = (statut: Unite['statut']) => data.unites.filter((u) => u.statut === statut).length;
      const libres = data.unites.filter((u) => u.statut === 'disponible');
      const base = libres.length ? libres : data.unites;
      return {
        ...data,
        slug: id,
        total: data.unites.length,
        disponibles: count('disponible'),
        reserves: count('reserve'),
        vendus: count('vendu'),
        prixMin: Math.min(...base.map((u) => u.prix)),
      };
    })
    .sort((a, b) => a.ordre - b.ordre);
}

export type Article = CollectionEntry<'actualites'> & { lang: Lang; slug: string; minutes: number };

export async function getArticles(lang?: Lang): Promise<Article[]> {
  const entries = await getCollection('actualites');
  return entries
    .map((entry) => {
      const [entryLang, slug] = entry.id.split('/') as [Lang, string];
      const words = (entry.body ?? '').split(/\s+/).filter(Boolean).length;
      return { ...entry, lang: entryLang, slug, minutes: Math.max(1, Math.round(words / 200)) };
    })
    .filter((a) => !lang || a.lang === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
