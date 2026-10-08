import type { APIRoute } from 'astro';

// robots.txt généré au build, pour que l'adresse du sitemap suive SITE_URL.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
