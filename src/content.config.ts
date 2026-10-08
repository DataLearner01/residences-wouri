// Schémas des fichiers de contenu. Une erreur de saisie dans un fichier JSON
// ou Markdown est signalée au moment du build, avec le nom du champ fautif.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const bilingue = z.object({ fr: z.string(), en: z.string() });
const paragraphes = z.object({ fr: z.array(z.string()), en: z.array(z.string()) });
const mois = z.string().regex(/^\d{4}-\d{2}$/, 'Format attendu : AAAA-MM');

const programmes = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/programmes' }),
  schema: z.object({
    nom: z.string(),
    ordre: z.number(),
    aLaUne: z.boolean().default(false),
    quartier: z.string(),
    statut: z.enum(['commercialisation', 'construction', 'livre']),
    anneeLivraison: z.number().optional(),
    types: z.array(z.enum(['appartement', 'villa', 'terrain'])).min(1),
    typologie: bilingue,
    accroche: bilingue,
    description: paragraphes,
    livraison: bilingue,
    // Nom d'un fichier de src/assets/photos.
    image: z.string(),
    galerie: z.array(z.object({ fichier: z.string(), alt: bilingue })).min(1),
    // `icone` : nom d'une icône Lucide (https://lucide.dev/icons).
    atouts: z.array(z.object({ icone: z.string(), fr: z.string(), en: z.string() })),
    localisation: z.object({
      texte: bilingue,
      mapsQuery: z.string(),
      lat: z.number(),
      lng: z.number(),
      proximites: z.array(bilingue),
    }),
    paiement: paragraphes,
    // Nom d'un fichier de public/brochures.
    brochure: z.string(),
    chantier: z
      .object({
        avancement: z.number().min(0).max(100),
        miseAJour: mois,
        etapes: z.array(
          z.object({
            cle: z.enum(['fondations', 'grosOeuvre', 'finitions', 'livraison']),
            statut: z.enum(['fait', 'enCours', 'aVenir']),
            date: mois,
          }),
        ),
        photos: z.array(z.object({ fichier: z.string(), mois, legende: bilingue })),
      })
      .optional(),
    // Plan de masse : « etages » (une colonne par bâtiment, une ligne par étage)
    // ou « lots » (grille de lots, `colonnes` lots par rangée).
    plan: z.object({
      type: z.enum(['etages', 'lots']),
      colonnes: z.number().optional(),
      taille: z.enum(['normal', 'grand']).optional(),
      voie: bilingue.optional(),
      groupes: z.array(z.object({ cle: z.string(), fr: z.string(), en: z.string() })).min(1),
    }),
    unites: z.array(
      z.object({
        ref: z.string(),
        type: z.enum(['studio', 'f2', 'f3', 'f4', 'villa4', 'villa5', 'terrain']),
        surface: z.number(),
        niveau: bilingue,
        groupe: z.string(),
        rang: z.number().optional(),
        prix: z.number(),
        statut: z.enum(['disponible', 'reserve', 'vendu']),
      }),
    ),
  }),
});

// Un dossier par langue. `cle` relie un article à sa traduction.
const actualites = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/actualites' }),
  schema: z.object({
    cle: z.string(),
    titre: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

export const collections = { programmes, actualites };
