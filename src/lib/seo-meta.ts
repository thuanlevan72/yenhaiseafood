import {
  Product,
  PRODUCTS,
  STORE_ADDRESS,
  STORE_PHONE_DISPLAY,
  HERO_BG_IMAGE,
  extractSlugFromPathname,
  findProductBySlug,
  getProductRoutePath,
  getProductSlug
} from './store-logic';

export interface PageSeoMeta {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  ogType: 'website' | 'product';
  ogImage: string;
  ogImageAlt: string;
  robots: string;
}

export function buildPageSeoMeta(
  products: Product[] = PRODUCTS,
  pathname = '/'
): PageSeoMeta {
  const slug = extractSlugFromPathname(pathname);

  if (slug !== null) {
    const product = findProductBySlug(products, slug);
    if (product) {
      const catLabel =
        product.category === 'fresh'
          ? 'Hải Sản Tươi Sống'
          : product.category === 'frozen'
          ? 'Hải Sản Đông Lạnh VIP'
          : 'Hải Sản Khô Phơi Nắng';

      const seoTitle =
        product.seoTitle ||
        `${product.name} — Giá: Liên hệ | Hải Sản Yến Hải Hoằng Tiến Thanh Hóa`;

      const seoDesc = `${product.name} (${product.subtitle}) tại Vựa Hải Sản Yến Hải (${STORE_ADDRESS}). ${product.description} Bao ăn 1 đổi 1, Giá: Liên hệ Hotline/Zalo ${STORE_PHONE_DISPLAY}.`;

      return {
        title: seoTitle,
        description: seoDesc.slice(0, 300),
        keywords: `${product.name}, ${product.mobileName}, ${catLabel}, Hải Sản Yến Hải, ${STORE_ADDRESS}, ${
          product.bestDishes ? product.bestDishes.join(', ') : ''
        }`,
        canonicalPath: getProductRoutePath(product),
        ogType: 'product',
        ogImage: product.image,
        ogImageAlt: product.seoAlt || product.name,
        robots:
          'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }

    return {
      title: 'Không tìm thấy sản phẩm — Hải Sản Yến Hải Hoằng Tiến Thanh Hóa',
      description: `Sản phẩm không tồn tại hoặc đã cập nhật mới tại Vựa Hải Sản Yến Hải (${STORE_ADDRESS}). Hotline/Zalo ${STORE_PHONE_DISPLAY}.`,
      keywords: 'Hải Sản Yến Hải, Hoằng Tiến, Hoằng Hóa, Thanh Hóa',
      canonicalPath: '/',
      ogType: 'website',
      ogImage: HERO_BG_IMAGE,
      ogImageAlt: 'Vựa Hải Sản Yến Hải Xã Hoằng Tiến Tỉnh Thanh Hóa',
      robots: 'noindex, follow'
    };
  }

  return {
    title:
      'Hải Sản Yến Hải — Vựa Hải Sản Tươi Sống, Đông Lạnh & Đồ Khô Hoằng Tiến Thanh Hóa',
    description: `Hải Sản Yến Hải (Gần Trường Tiểu học xã Hoằng Trường — ${STORE_ADDRESS}) chuyên sỉ & lẻ Mực Ống Biển Tươi, Cá Thu Phấn Cắt Khoanh Giữa, Bạch Tuộc Tươi, Tôm Biển Tươi, Nõn Tôm Hấp Bóc Sẵn, Bề Bề (Tôm Tít) Bóc Nõn Full Trứng và Cá Khô Rút Xương 1 Nắng. Bao ăn 1 đổi 1, Giá: Liên hệ Hotline/Zalo: ${STORE_PHONE_DISPLAY}.`,
    keywords:
      'Hải Sản Yến Hải, hải sản Hoằng Tiến Hoằng Hóa Thanh Hóa, Thôn Trường Phúc Xã Hoằng Tiến, Trường Tiểu học Hoằng Trường, hải sản Hải Tiến, bề bề bóc nõn full trứng, nõn tôm biển bóc sẵn, tôm biển tươi, mực ống biển tươi, cá thu phấn cắt khoanh giữa, bạch tuộc biển tươi, cá khô rút xương 1 nắng',
    canonicalPath: '/',
    ogType: 'website',
    ogImage: HERO_BG_IMAGE,
    ogImageAlt:
      'Hải Sản Yến Hải Xã Hoằng Tiến Tỉnh Thanh Hóa - Mực Ống Biển Tươi, Bề Bề Bóc Nõn Full Trứng, Nõn Tôm Biển, Cá Thu Phấn Khoanh Giữa',
    robots:
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  };
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function injectSeoAndSsrIntoHtml(options: {
  template: string;
  meta: PageSeoMeta;
  baseUrl: string;
  jsonLd: string;
  appHtml: string;
  products: Product[];
  pathname: string;
}): string {
  const { template, meta, jsonLd, appHtml, products, pathname } = options;
  const cleanBase = options.baseUrl.replace(/\/$/, '');
  const fullCanonicalUrl = cleanBase
    ? `${cleanBase}${meta.canonicalPath}`
    : meta.canonicalPath;
  const fullOgImage = cleanBase
    ? `${cleanBase}${meta.ogImage}`
    : meta.ogImage;

  const initialDataScript = `<script>window.__INITIAL_PATH__ = ${JSON.stringify(
    pathname || '/'
  ).replace(/</g, '\\u003c')};window.__INITIAL_PRODUCTS__ = ${JSON.stringify(
    products
  ).replace(/</g, '\\u003c')};</script>`;

  let html = template;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtmlAttr(meta.title)}</title>`
  );
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeHtmlAttr(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="keywords"[\s\S]*?\/>/,
    `<meta name="keywords" content="${escapeHtmlAttr(meta.keywords)}" />`
  );
  html = html.replace(
    /<meta\s+name="robots"[\s\S]*?\/>/,
    `<meta name="robots" content="${escapeHtmlAttr(meta.robots)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"[\s\S]*?\/>/,
    `<meta property="og:type" content="${escapeHtmlAttr(meta.ogType)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${escapeHtmlAttr(fullCanonicalUrl)}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${escapeHtmlAttr(fullCanonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${escapeHtmlAttr(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeHtmlAttr(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"[\s\S]*?\/>/,
    `<meta property="og:image" content="${escapeHtmlAttr(fullOgImage)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image:alt"[\s\S]*?\/>/,
    `<meta property="og:image:alt" content="${escapeHtmlAttr(meta.ogImageAlt)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/>/,
    `<meta name="twitter:title" content="${escapeHtmlAttr(meta.title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/,
    `<meta name="twitter:description" content="${escapeHtmlAttr(meta.description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"[\s\S]*?\/>/,
    `<meta name="twitter:image" content="${escapeHtmlAttr(fullOgImage)}" />`
  );
  html = html.replace(
    /<script id="schema-jsonld" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="schema-jsonld" type="application/ld+json">${jsonLd}</script>`
  );
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<!--ssr-end-->/,
    `<div id="root">${appHtml}</div><!--ssr-end-->${initialDataScript}`
  );

  return html;
}

export function buildSitemapXml(
  products: Product[] = PRODUCTS,
  appUrl = 'https://yenhaiseafood.vercel.app'
): string {
  const baseUrl = appUrl.replace(/\/$/, '');

  const homeImages = products
    .map(
      (p) => `
    <image:image>
      <image:loc>${escapeXml(`${baseUrl}${p.image}`)}</image:loc>
      <image:title>${escapeXml(p.seoTitle || p.name)}</image:title>
      <image:caption>${escapeXml(p.seoAlt || p.description)}</image:caption>
    </image:image>`
    )
    .join('');

  const productUrls = products
    .map((p) => {
      const url = `${baseUrl}/san-pham/${getProductSlug(p)}`;
      return `
  <url>
    <loc>${escapeXml(url)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${escapeXml(`${baseUrl}${p.image}`)}</image:loc>
      <image:title>${escapeXml(p.seoTitle || p.name)}</image:title>
      <image:caption>${escapeXml(p.seoAlt || p.description)}</image:caption>
    </image:image>
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(`${baseUrl}/`)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>${homeImages}
  </url>${productUrls}
</urlset>`;
}
