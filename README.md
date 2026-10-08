# Résidences Wouri

Site de démonstration pour un promoteur immobilier fictif à Douala.
Bilingue (français / anglais), statique, léger, avec WhatsApp au centre.

> **Site de démonstration. Toutes les données sont fictives** : entreprise, programmes, prix,
> personnes, témoignages, numéros de téléphone, RCCM et NIU.

Construit avec [Astro](https://astro.build) et [Tailwind CSS](https://tailwindcss.com).
Pas de base de données, pas de compte, pas de paiement : tout le contenu vit dans des fichiers.

## Démarrer

Il faut Node.js 22.12 ou plus récent.

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:4321/fr/`.

| Commande               | Effet                                                           |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Serveur de développement                                        |
| `npm run build`        | Génère le site dans `dist/`                                     |
| `npm run preview`      | Sert le contenu de `dist/` en local, comme en production        |
| `npm run check`        | Vérifie les types et les fichiers `.astro`                      |
| `npm run placeholders` | Régénère les illustrations d'attente `photo-a-remplacer-*.jpg`  |
| `npm run brochures`    | Régénère les brochures PDF depuis les données des programmes    |

## Adapter le site à un vrai client

Cinq endroits à modifier, dans cet ordre.

1. **Identité et coordonnées** : `src/config/site.ts`.
   Nom, numéro WhatsApp (une seule variable, `whatsapp.number`), adresse, horaires, mentions légales,
   chiffres de l'accueil. Le nom est repris partout grâce au repère `{marque}` des fichiers de traduction.
2. **Couleurs et police** : le bloc `@theme` en haut de `src/styles/global.css`.
   Le site est volontairement en noir, blanc et gris : la seule couleur vive est le vert des boutons WhatsApp.
3. **Photos** : `src/assets/photos/`. Remplacez chaque `photo-a-remplacer-*.jpg` par une vraie photo
   du même nom (format paysage 3:2, 1 800 px de large suffisent). Les versions AVIF et WebP et les
   `srcset` sont produits au build. Vous pouvez aussi changer les noms de fichiers dans les données.
   Cas particulier, le visuel d'accueil : `photo-a-remplacer-accueil-immeuble.webp` est un immeuble
   **détouré** (fond transparent), posé sur un ciel dessiné en CSS entre deux plans de nuages.
   Remplacez-le par une photo détourée de votre immeuble, en WebP ou PNG, d'environ 1 800 px de large.
4. **Données** : `src/content/`.
   - `programmes/*.json` : un fichier par programme (textes FR/EN, atouts, unités, plan de masse, chantier).
     Ajouter un fichier crée la fiche, la carte dans la liste et le choix dans le formulaire.
   - `actualites/fr/*.md` et `actualites/en/*.md` : les articles. Le champ `cle` relie un article à sa traduction.
   - `realisations.json`, `equipe.json`, `partenaires.json`.
5. **Textes de l'interface** : `src/i18n/fr.ts` et `src/i18n/en.ts`.
   Dans un titre, le passage entre `[crochets]` est composé en gris : `'[Nos] programmes'`.

Les adresses des pages dans chaque langue se règlent dans la table `routes` de `src/i18n/index.ts`.

### Statuts et couleurs

| Champ                  | Valeurs possibles                                |
| ---------------------- | ------------------------------------------------ |
| `statut` (programme)   | `commercialisation`, `construction`, `livre`     |
| `types` (programme)    | `appartement`, `villa`, `terrain`                |
| `statut` (unité)       | `disponible`, `reserve`, `vendu`                 |
| `plan.type`            | `etages` (bâtiments) ou `lots` (terrains, villas) |

Le tableau des unités, le plan de masse et les cartes lisent les mêmes champs.
Passer une unité de `disponible` à `vendu` met donc tout à jour d'un coup.
Une erreur de saisie est signalée au build, avec le nom du champ (schémas dans `src/content.config.ts`).

## WhatsApp

Tous les liens ont la forme `https://wa.me/<numéro>?text=<message>`.
Le numéro vient de `src/config/site.ts`, les messages pré-remplis de la section `wa.msg` des fichiers
de traduction : un message par page, par programme et par unité.

## Formulaire de contact

Le formulaire envoie ses données à un service de formulaires, sans serveur à gérer.

1. Créez un formulaire sur [Formspree](https://formspree.io) et indiquez-y l'adresse e-mail de réception.
2. Copiez `.env.example` en `.env` et collez l'URL du formulaire dans `PUBLIC_FORM_ENDPOINT`
   (ou déclarez cette variable chez votre hébergeur).

Tant que la variable est vide, le site est en **mode démonstration** : le formulaire affiche sa
confirmation, mais n'envoie rien, et le dit clairement. Le bouton « Envoyer par WhatsApp » fonctionne
dans tous les cas.

## Mise en ligne

Le site est un dossier de fichiers statiques. Réglages communs à Cloudflare Pages, Netlify et Vercel :

- commande de build : `npm run build`
- dossier publié : `dist`
- variables d'environnement : `SITE_URL` (adresse publique, sert au sitemap et aux balises `hreflang`)
  et `PUBLIC_FORM_ENDPOINT`

`public/_redirects`, `public/_headers` et `vercel.json` gèrent la redirection de `/` vers `/fr/`
et la mise en cache longue des fichiers de `_astro/`.
Sans dépôt Git, le dossier `dist/` peut aussi être déposé tel quel chez l'hébergeur.

## Performance

Mesures Lighthouse sur mobile, build de production servi en local, sans compression :

| Page                | Performance | Accessibilité | Bonnes pratiques | SEO | Poids total |
| ------------------- | ----------- | ------------- | ---------------- | --- | ----------- |
| Accueil             | 92          | 100           | 100              | 100 | 129 Ko      |
| Liste des programmes | 99         | 100           | 100              | 100 | 95 Ko       |
| Fiche programme     | 89          | 100           | 100              | 100 | 96 Ko       |
| À propos            | 93          | 100           | 100              | 100 | 59 Ko       |
| Contact             | 97          | 100           | 100              | 100 | 42 Ko       |

La note de performance varie de quelques points d'une mesure à l'autre, selon la charge de la machine.

Ce qui tient ces chiffres :

- images en AVIF et WebP avec `srcset`, chargées à la demande ; l'immeuble de l'accueil pèse de 9 à 23 Ko,
  chaque plan de nuages moins de 5 Ko ;
- une seule police auto-hébergée (Host Grotesk, sous-ensemble latin), 20 Ko ;
- aucun fichier JavaScript externe : quelques scripts courts, intégrés aux pages ;
- carte de localisation dessinée en SVG, sans carte interactive ;
- galerie à balayage tactile en CSS (`scroll-snap`), sans bibliothèque ;
- une seule animation à l'ouverture de l'accueil, et des effets au survol décrits ci-dessous.

## Effets au survol

Ils vivent dans `src/scripts/pointeur.ts` et ne s'activent qu'avec une souris. Sur écran tactile, ou si
l'utilisateur a demandé moins d'animations, la page reste statique et tout le contenu reste lisible.

| Effet                                   | Où                                   | Réglage                         |
| --------------------------------------- | ------------------------------------ | ------------------------------- |
| Profondeur : ciel, immeuble, nuages     | Accueil                              | `--course` de chaque `.plan`    |
| Lueur qui révèle l'arcade en filigrane  | Bandeaux sombres (`.bande-nuit`)     | `.bande-nuit::after`            |
| Pilule « Voir » qui suit le curseur     | Photo des cartes de programme        | `.curseur` dans `ProgrammeCard` |
| Volets qui s'ouvrent                    | « Pourquoi nous choisir » (accueil)  | `.volet` dans `Home.astro`      |
| Boutons légèrement aimantés             | Boutons marqués `data-aimant`        | `pointeur.ts`                   |

Pour ajouter l'effet à un autre bloc, posez `data-pointeur` dessus : il reçoit les variables CSS
`--mx`, `--my` (position du curseur en pixels) et `--dx`, `--dy` (de -1 à 1 depuis le centre).

Avec de vraies photos, le poids des images augmentera : gardez un œil sur la page d'accueil
(objectif : moins de 1 Mo, visuel principal sous 150 Ko sur mobile).

## Organisation du projet

```
src/
  config/site.ts        Identité, WhatsApp, coordonnées
  i18n/                 Traductions et adresses des pages
  content/              Programmes, articles, équipe, réalisations
  assets/photos/        Photos (illustrations d'attente par défaut)
  assets/fonts/         Police auto-hébergée
  scripts/pointeur.ts   Effets liés au mouvement de la souris
  components/           En-tête, pied de page, cartes, tableau, plan de masse, carte, galerie
  views/                Une vue par page
  pages/[lang]/[...path].astro   Route unique : génère toutes les pages dans les deux langues
  styles/global.css     Palette, typographie, composants
scripts/                Générateurs d'illustrations et de brochures
public/                 Brochures PDF, favicon, redirections
```

## Illustrations d'attente

Les images de `src/assets/photos/` sont des illustrations originales dessinées par
`scripts/generate-placeholders.mjs`. Elles portent une étiquette « PHOTO À REMPLACER », que l'on peut
retirer en passant `LABEL` à `false` en haut du script. Elles ne sont là que pour montrer la mise en page :
le site prend toute sa valeur avec de vraies photos de Douala.
