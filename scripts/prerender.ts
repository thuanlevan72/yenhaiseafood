import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderAppHtml, buildStoreJsonLd } from '../src/entry-server';
import { PRODUCTS } from '../src/lib/store-logic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function prerenderDist() {
  const indexPath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html not found, skipping prerender.');
    return;
  }

  const baseUrl = (process.env.APP_URL || 'https://yenhaiseafood.vercel.app').replace(
    /\/$/,
    ''
  );
  const template = fs.readFileSync(indexPath, 'utf-8');
  const appHtml = renderAppHtml(PRODUCTS);
  const jsonLd = buildStoreJsonLd(PRODUCTS, baseUrl);
  const initialDataScript = `<script>window.__INITIAL_PRODUCTS__ = ${JSON.stringify(
    PRODUCTS
  ).replace(/</g, '\\u003c')};</script>`;

  const renderedHtml = template
    .replace(
      /<script id="schema-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="schema-jsonld" type="application/ld+json">${jsonLd}</script>`
    )
    .replace(
      /<div id="root">[\s\S]*?<\/div>\s*<!--ssr-end-->/,
      `<div id="root">${appHtml}</div><!--ssr-end-->${initialDataScript}`
    );

  fs.writeFileSync(indexPath, renderedHtml, 'utf-8');

  // Generate static dist/robots.txt for Vercel / static hosting
  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${baseUrl}/sitemap.xml`
  ].join('\n');
  fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robotsTxt, 'utf-8');

  // Generate static dist/sitemap.xml with Google Image Sitemap entries
  const imageNodes = PRODUCTS.map(
    (p) => `
    <image:image>
      <image:loc>${escapeXml(`${baseUrl}${p.image}`)}</image:loc>
      <image:title>${escapeXml(p.seoTitle || p.name)}</image:title>
      <image:caption>${escapeXml(p.seoAlt || p.description)}</image:caption>
    </image:image>`
  ).join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(`${baseUrl}/`)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>${imageNodes}
  </url>
</urlset>`;
  fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  console.log(
    `✓ Prerendered SSR HTML, Schema.org JSON-LD, robots.txt, and sitemap.xml into dist/ (${PRODUCTS.length} products)`
  );
}

prerenderDist();
