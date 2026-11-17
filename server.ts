import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { renderAppHtml, buildStoreJsonLd } from './src/entry-server';
import {
  PRODUCTS,
  Product,
  parseAndValidateProductsJson
} from './src/lib/store-logic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const PRODUCTS_JSON_PATH = path.resolve(__dirname, 'src/data/products.json');

function loadProductsFromDisk(): Product[] {
  try {
    if (fs.existsSync(PRODUCTS_JSON_PATH)) {
      const raw = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
      const validated = parseAndValidateProductsJson(raw);
      if (validated.valid && validated.products) {
        return validated.products;
      }
    }
  } catch {
    // Fallback to default bundled products
  }
  return PRODUCTS;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // SEO: Dynamic robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl =
      process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const content = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      `Sitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml`
    ].join('\n');
    res.type('text/plain').send(content);
  });

  // SEO: Dynamic XML Sitemap with Google Image Sitemap extension
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (
      process.env.APP_URL || `${req.protocol}://${req.get('host')}`
    ).replace(/\/$/, '');
    const products = loadProductsFromDisk();

    const imageNodes = products
      .map(
        (p) => `
    <image:image>
      <image:loc>${escapeXml(`${baseUrl}${p.image}`)}</image:loc>
      <image:title>${escapeXml(p.seoTitle || p.name)}</image:title>
      <image:caption>${escapeXml(p.seoAlt || p.description)}</image:caption>
    </image:image>`
      )
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(`${baseUrl}/`)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>${imageNodes}
  </url>
</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8').send(xml);
  });

  // API to get current products JSON
  app.get('/api/products', (_req, res) => {
    const products = loadProductsFromDisk();
    res.json({ products });
  });

  // API to update products JSON and persist for SSR
  app.post('/api/products', (req, res) => {
    const rawList = req.body?.products ?? req.body;
    const jsonString =
      typeof rawList === 'string' ? rawList : JSON.stringify(rawList);
    const validation = parseAndValidateProductsJson(jsonString);
    if (!validation.valid || !validation.products) {
      res.status(400).json({ error: validation.error || 'Invalid JSON' });
      return;
    }
    try {
      fs.writeFileSync(
        PRODUCTS_JSON_PATH,
        JSON.stringify(validation.products, null, 2),
        'utf-8'
      );
      res.json({ ok: true, count: validation.products.length });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api/')) {
        next();
        return;
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(url, template);

        const products = loadProductsFromDisk();
        const appHtml = renderAppHtml(products);
        const jsonLd = buildStoreJsonLd(products, process.env.APP_URL || '');
        const initialDataScript = `<script>window.__INITIAL_PRODUCTS__ = ${JSON.stringify(
          products
        ).replace(/</g, '\\u003c')};</script>`;

        const html = template
          .replace(
            /<script id="schema-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/,
            `<script id="schema-jsonld" type="application/ld+json">${jsonLd}</script>`
          )
          .replace(
            /<div id="root">[\s\S]*?<\/div>\s*<!--ssr-end-->/,
            `<div id="root">${appHtml}</div><!--ssr-end-->${initialDataScript}`
          );

        res
          .status(200)
          .set({ 'Content-Type': 'text/html; charset=utf-8' })
          .end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));

    app.use('*', (_req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      const template = fs.readFileSync(indexPath, 'utf-8');
      const products = loadProductsFromDisk();
      const appHtml = renderAppHtml(products);
      const jsonLd = buildStoreJsonLd(products, process.env.APP_URL || '');
      const initialDataScript = `<script>window.__INITIAL_PRODUCTS__ = ${JSON.stringify(
        products
      ).replace(/</g, '\\u003c')};</script>`;

      const html = template
        .replace(
          /<script id="schema-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/,
          `<script id="schema-jsonld" type="application/ld+json">${jsonLd}</script>`
        )
        .replace(
          /<div id="root">[\s\S]*?<\/div>\s*<!--ssr-end-->/,
          `<div id="root">${appHtml}</div><!--ssr-end-->${initialDataScript}`
        );

      res
        .status(200)
        .set({ 'Content-Type': 'text/html; charset=utf-8' })
        .end(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SSR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
