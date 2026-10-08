// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// URL publique du site : à définir avec la variable SITE_URL au déploiement.
const site = process.env.SITE_URL ?? 'https://residences-wouri.example';

export default defineConfig({
  site,
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
