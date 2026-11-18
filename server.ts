import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { renderAppHtml, buildPageJsonLd } from './src/entry-server';
import {
  PRODUCTS,
  Product,
  parseAndValidateProductsJson
} from './src/lib/store-logic';
import {
  buildPageSeoMeta,
  injectSeoAndSsrIntoHtml,
  buildSitemapXml
} from './src/lib/seo-meta';

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

  // SEO: Dynamic Multi-Page XML Sitemap (/ + every /san-pham/<slug> with Google Image Sitemap extension)
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (
      process.env.APP_URL || `${req.protocol}://${req.get('host')}`
    ).replace(/\/$/, '');
    const products = loadProductsFromDisk();
    const xml = buildSitemapXml(products, baseUrl);
    res.set('Content-Type', 'application/xml; charset=utf-8').send(xml);
  });

  // Brand Favicon fallback for legacy /favicon.ico requests
  app.get('/favicon.ico', (_req, res) => {
    res.type('image/svg+xml').sendFile(path.resolve(__dirname, 'public/favicon.svg'));
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
        const pathname =
          (req.originalUrl || req.url || '/').split('?')[0].split('#')[0] || '/';
        const baseUrl = (
          process.env.APP_URL || `${req.protocol}://${req.get('host')}`
        ).replace(/\/$/, '');

        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );
        template = await vite.transformIndexHtml(req.originalUrl, template);

        const products = loadProductsFromDisk();
        const meta = buildPageSeoMeta(products, pathname);
        const appHtml = renderAppHtml(products, pathname);
        const jsonLd = buildPageJsonLd(products, pathname, baseUrl);
        const html = injectSeoAndSsrIntoHtml({
          template,
          meta,
          baseUrl,
          jsonLd,
          appHtml,
          products,
          pathname
        });

        const statusCode = meta.robots.startsWith('noindex') ? 404 : 200;
        res
          .status(statusCode)
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

    app.use('*', (req, res) => {
      const pathname =
        (req.originalUrl || req.url || '/').split('?')[0].split('#')[0] || '/';
      const baseUrl = (
        process.env.APP_URL || `${req.protocol}://${req.get('host')}`
      ).replace(/\/$/, '');

      const indexPath = path.resolve(distPath, 'index.html');
      const template = fs.readFileSync(indexPath, 'utf-8');
      const products = loadProductsFromDisk();
      const meta = buildPageSeoMeta(products, pathname);
      const appHtml = renderAppHtml(products, pathname);
      const jsonLd = buildPageJsonLd(products, pathname, baseUrl);
      const html = injectSeoAndSsrIntoHtml({
        template,
        meta,
        baseUrl,
        jsonLd,
        appHtml,
        products,
        pathname
      });

      const statusCode = meta.robots.startsWith('noindex') ? 404 : 200;
      res
        .status(statusCode)
        .set({ 'Content-Type': 'text/html; charset=utf-8' })
        .end(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SSR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
