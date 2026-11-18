import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderAppHtml, buildPageJsonLd } from '../src/entry-server';
import { PRODUCTS, getProductRoutePath } from '../src/lib/store-logic';
import {
  buildPageSeoMeta,
  injectSeoAndSsrIntoHtml,
  buildSitemapXml
} from '../src/lib/seo-meta';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

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

  // 1. Prerender Root Homepage (/)
  const homeMeta = buildPageSeoMeta(PRODUCTS, '/');
  const homeHtml = injectSeoAndSsrIntoHtml({
    template,
    meta: homeMeta,
    baseUrl,
    jsonLd: buildPageJsonLd(PRODUCTS, '/', baseUrl),
    appHtml: renderAppHtml(PRODUCTS, '/'),
    products: PRODUCTS,
    pathname: '/'
  });
  fs.writeFileSync(indexPath, homeHtml, 'utf-8');

  // 2. Prerender Dedicated Real-DOM Static HTML Page for Every Product (/san-pham/<slug>/index.html)
  for (const product of PRODUCTS) {
    const routePath = getProductRoutePath(product);
    const productMeta = buildPageSeoMeta(PRODUCTS, routePath);
    const productJsonLd = buildPageJsonLd(PRODUCTS, routePath, baseUrl);
    const productAppHtml = renderAppHtml(PRODUCTS, routePath);
    const renderedProductHtml = injectSeoAndSsrIntoHtml({
      template,
      meta: productMeta,
      baseUrl,
      jsonLd: productJsonLd,
      appHtml: productAppHtml,
      products: PRODUCTS,
      pathname: routePath
    });

    const outDir = path.resolve(distDir, routePath.replace(/^\//, ''));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.resolve(outDir, 'index.html'),
      renderedProductHtml,
      'utf-8'
    );
  }

  // 3. Generate static dist/robots.txt for Vercel / static hosting
  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${baseUrl}/sitemap.xml`
  ].join('\n');
  fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robotsTxt, 'utf-8');

  // 4. Generate static dist/sitemap.xml containing / AND every /san-pham/<slug>
  const sitemapXml = buildSitemapXml(PRODUCTS, baseUrl);
  fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  console.log(
    `✓ Prerendered static Real-DOM HTML for / + ${PRODUCTS.length} product detail pages (/san-pham/<slug>/index.html), Schema.org JSON-LD, robots.txt, and sitemap.xml into dist/`
  );
}

prerenderDist();
