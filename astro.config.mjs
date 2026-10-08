// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// URL publique du site : à définir avec la variable SITE_URL au déploiement.
const site = process.env.SITE_URL ?? process.env.URL ?? process.env.CF_PAGES_URL ?? 'https://residences-wouri.example';
// (URL est fournie par Netlify, CF_PAGES_URL par Cloudflare Pages : l'adresse publique est détectée toute seule.)

// Sous-dossier d'où le site est servi. Vide (racine) par défaut ; sur GitHub Pages,
// le workflow de déploiement le règle sur le nom du dépôt, p. ex. /residences-wouri
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: {
    // Le CSS est petit : on l'intègre aux pages pour éviter une requête bloquante.
    inlineStylesheets: 'always',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
