import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCTS,
  REAL_VIDEOS,
  INITIAL_CART,
  STORE_PHONE,
  STORE_FACEBOOK_URL,
  STORE_ADDRESS,
  filterAndSortProducts,
  addCartItem,
  updateCartItemQty,
  calculateCartTotals,
  validateVietnamesePhone,
  validateCheckoutForm,
  buildZaloOrderMessage,
  parseAndValidateProductsJson,
  formatProductPrice,
  formatVND
} from './store-logic';

test('catalog loads all 9 seafood products and 6 real videos with detailed fields, showPrice: false, and empty INITIAL_CART', () => {
  assert.equal(INITIAL_CART.length, 0);
  assert.equal(PRODUCTS.length, 9);
  assert.equal(REAL_VIDEOS.length, 6);

  const fresh = PRODUCTS.filter((p) => p.category === 'fresh');
  const frozen = PRODUCTS.filter((p) => p.category === 'frozen');
  const dried = PRODUCTS.filter((p) => p.category === 'dried');
  assert.equal(fresh.length, 5);
  assert.equal(frozen.length, 3);
  assert.equal(dried.length, 1);

  for (const product of PRODUCTS) {
    assert.ok(product.image.startsWith('/assets/aistudio/'));
    assert.equal(product.showPrice, false);
    assert.equal(formatProductPrice(product), 'Giá: Liên hệ');
    assert.equal(product.hasDiscount, false);
    assert.ok(product.seoTitle && product.seoTitle.length > 10);
    assert.ok(product.seoAlt && product.seoAlt.length > 10);
    assert.ok(product.origin && product.origin.length > 5);
    assert.ok(product.storageGuide && product.storageGuide.length > 5);
    assert.ok(Array.isArray(product.highlights) && product.highlights.length >= 3);
    assert.ok(Array.isArray(product.bestDishes) && product.bestDishes.length >= 3);
  }

  for (const video of REAL_VIDEOS) {
    assert.ok(video.videoUrl.startsWith('/assets/aistudio/'));
    assert.ok(video.videoUrl.endsWith('.mp4'));
    assert.ok(video.thumbnailUrl.startsWith('/assets/aistudio/'));
  }
});

test('formatVND and formatProductPrice hide numeric prices unless explicitly enabled', () => {
  assert.equal(formatVND(320000), 'Giá: Liên hệ');
  assert.equal(formatVND(0), 'Giá: Liên hệ');
  assert.equal(formatVND(320000, true), '320.000₫');
  assert.equal(
    formatProductPrice({ price: 320000, showPrice: false, priceText: 'Giá: Liên hệ' }),
    'Giá: Liên hệ'
  );
  assert.equal(
    formatProductPrice({ price: 320000, showPrice: true }),
    '320.000₫'
  );
});

test('parseAndValidateProductsJson validates JSON and defaults to Giá: Liên hệ', () => {
  const validJson = JSON.stringify([
    {
      id: 10,
      name: 'Nõn Tôm Biển Hấp Bóc Sẵn',
      category: 'frozen',
      price: 0,
      showPrice: false,
      unit: '/ khay 500g',
      image: '/assets/aistudio/1794900489014_2584028512014311615_2584028512014311615_f4ccd4933618ac51465c6c744cd40ce6_4d0f4111.jpg',
      videoUrl: '/assets/aistudio/1794900489030_2584028512014311615_2584028512014311615_e49d681d.mp4'
    }
  ]);
  const res = parseAndValidateProductsJson(validJson);
  assert.equal(res.valid, true);
  assert.equal(res.products?.length, 1);
  assert.equal(res.products?.[0].name, 'Nõn Tôm Biển Hấp Bóc Sẵn');
  assert.equal(res.products?.[0].showPrice, false);
  assert.equal(res.products?.[0].priceText, 'Giá: Liên hệ');
  assert.ok(res.products?.[0].videoUrl?.endsWith('.mp4'));

  const invalidRes = parseAndValidateProductsJson('{"not": "an array"}');
  assert.equal(invalidRes.valid, false);
  assert.ok(invalidRes.error);
});

test('store contact constants match Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa, 0356136859, Facebook URL, and Google Maps embed URL', async () => {
  const { STORE_MAP_EMBED_URL, STORE_LANDMARK } = await import('./store-logic');
  assert.equal(STORE_PHONE, '0356136859');
  assert.equal(STORE_FACEBOOK_URL, 'https://web.facebook.com/hai.yen.tran.314077');
  assert.equal(
    STORE_ADDRESS,
    'Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa'
  );
  assert.ok(STORE_LANDMARK.includes('Trường Tiểu học xã Hoằng Trường'));
  assert.ok(
    STORE_MAP_EMBED_URL.startsWith('https://www.google.com/maps/embed?pb=')
  );
});

test('filterAndSortProducts filters by category and accent-insensitive Vietnamese search query', async () => {
  const { normalizeVietnameseText, getSearchSuggestions } = await import('./store-logic');
  assert.equal(normalizeVietnameseText('Đồ Khô Bề Bề'), 'do kho be be');

  const freshOnly = filterAndSortProducts(PRODUCTS, {
    category: 'fresh',
    searchQuery: '',
    sortBy: 'featured'
  });
  assert.equal(freshOnly.length, 5);

  const searchDish = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    searchQuery: 'bánh đa cua',
    sortBy: 'featured'
  });
  assert.ok(searchDish.length >= 1);

  const accentlessSquid = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    searchQuery: 'muc ong',
    sortBy: 'featured'
  });
  assert.ok(accentlessSquid.some((p) => p.id === 1));

  const accentlessBebe = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    searchQuery: 'be be',
    sortBy: 'featured'
  });
  assert.equal(accentlessBebe.length, 3);
  assert.ok(accentlessBebe.every((p) => p.name.toLowerCase().includes('bề bề')));

  const accentlessMantis = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    searchQuery: 'be be trung',
    sortBy: 'featured'
  });
  assert.ok(accentlessMantis.some((p) => p.id === 4));

  const accentlessDried = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    searchQuery: 'do kho',
    sortBy: 'featured'
  });
  assert.ok(accentlessDried.some((p) => p.category === 'dried'));

  const suggestions = getSearchSuggestions(PRODUCTS, 'non tom');
  assert.ok(suggestions.length >= 1);
  assert.ok(suggestions[0].name.toLowerCase().includes('nõn tôm'));
});

test('cart calculations start empty and handle adding and updating items', () => {
  const initialTotals = calculateCartTotals(INITIAL_CART);
  assert.equal(initialTotals.totalItems, 0);

  const added = addCartItem(INITIAL_CART, {
    productId: 4,
    name: PRODUCTS[3].name,
    price: 0,
    img: PRODUCTS[3].image,
    unit: PRODUCTS[3].unit
  });
  assert.equal(added.length, 1);
  assert.equal(calculateCartTotals(added).totalItems, 1);

  const updated = updateCartItemQty(added, added[0].id, 2);
  assert.equal(calculateCartTotals(updated).totalItems, 3);
});

test('phone and checkout validation enforce required fields', () => {
  assert.equal(validateVietnamesePhone('0356.136.859'), true);
  assert.equal(validateVietnamesePhone('0356136859'), true);
  assert.equal(validateVietnamesePhone('123'), false);

  const validResult = validateCheckoutForm({
    fullName: 'Trần Hải Yến',
    phone: '0356136859',
    address: 'Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa',
    deliverySlot: 'Giao nhanh',
    paymentMethod: 'cod'
  });
  assert.equal(validResult.valid, true);
});

test('buildZaloOrderMessage produces formatted summary with Giá: Liên hệ', () => {
  const sampleCart = addCartItem(INITIAL_CART, {
    productId: 4,
    name: PRODUCTS[3].name,
    price: 0,
    img: PRODUCTS[3].image,
    unit: PRODUCTS[3].unit
  });
  const msg = buildZaloOrderMessage(sampleCart, {
    fullName: 'Anh Minh',
    phone: '0356136859',
    address: 'Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa'
  });
  assert.ok(msg.includes('Bề Bề'));
  assert.ok(msg.includes('Giá: Liên hệ'));
  assert.ok(msg.includes('0356.136.859'));
});

test('SSR renderAppHtml and buildStoreJsonLd generate complete semantic HTML with empty cart (0), videos, Google Maps iframe, and Giá: Liên hệ', async () => {
  const { renderAppHtml, buildStoreJsonLd } = await import('../entry-server');
  const html = renderAppHtml(PRODUCTS);
  for (const product of PRODUCTS) {
    assert.ok(
      html.includes(product.name),
      `SSR HTML should include product name: ${product.name}`
    );
  }
  for (const vid of REAL_VIDEOS) {
    assert.ok(
      html.includes(vid.videoUrl),
      `SSR HTML should include video URL: ${vid.videoUrl}`
    );
  }
  assert.ok(html.includes('Giỏ hàng của bạn đang trống'));
  assert.ok(html.includes('Giá: Liên hệ'));
  assert.ok(html.includes('https://schema.org/Product'));
  assert.ok(html.includes('https://schema.org/VideoObject'));
  assert.ok(html.includes('https://schema.org/FAQPage'));
  assert.ok(
    html.includes('Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa')
  );
  assert.ok(html.includes('Trường Tiểu học xã Hoằng Trường'));
  assert.ok(html.includes('https://www.google.com/maps/embed?pb='));
  assert.ok(html.includes('0356.136.859'));

  const jsonLd = buildStoreJsonLd(PRODUCTS);
  const parsedSchema = JSON.parse(jsonLd);
  assert.ok(Array.isArray(parsedSchema['@graph']));
  const storeNode = parsedSchema['@graph'].find((n: { '@type': string }) => n['@type'] === 'Store');
  assert.ok(storeNode);
  assert.equal(storeNode.hasOfferCatalog.itemListElement.length, 9);
  assert.equal(storeNode.priceRange, 'Giá: Liên hệ');
  assert.equal(storeNode.address.streetAddress, 'Thôn Trường Phúc, Xã Hoằng Tiến');
  assert.equal(storeNode.address.addressLocality, 'Huyện Hoằng Hóa');
});

test('Product detail route (/san-pham/<slug>) renders full Real-DOM HTML, unique SEO meta, JSON-LD, and sitemap entries', async () => {
  const {
    extractSlugFromPathname,
    findProductBySlug,
    getProductRoutePath
  } = await import('./store-logic');
  const { buildPageSeoMeta, buildSitemapXml, injectSeoAndSsrIntoHtml } =
    await import('./seo-meta');
  const { renderAppHtml, buildPageJsonLd } = await import('../entry-server');

  const bebe = findProductBySlug(PRODUCTS, 'be-be-tom-tit-boc-non-full-trung');
  assert.ok(bebe);
  const routePath = getProductRoutePath(bebe);
  assert.equal(routePath, '/san-pham/be-be-tom-tit-boc-non-full-trung');
  assert.equal(
    extractSlugFromPathname(`${routePath}/?utm=fb`),
    'be-be-tom-tit-boc-non-full-trung'
  );
  assert.equal(extractSlugFromPathname('/'), null);

  const meta = buildPageSeoMeta(PRODUCTS, routePath);
  assert.equal(meta.ogType, 'product');
  assert.equal(meta.canonicalPath, routePath);
  assert.ok(meta.title.includes('Bề Bề'));
  assert.ok(meta.robots.includes('index'));

  const notFoundMeta = buildPageSeoMeta(PRODUCTS, '/san-pham/khong-ton-tai-123');
  assert.ok(notFoundMeta.robots.includes('noindex'));

  const detailHtml = renderAppHtml(PRODUCTS, routePath);
  assert.ok(detailHtml.includes('<h1'));
  assert.ok(detailHtml.includes(bebe.name));
  assert.ok(detailHtml.includes(bebe.sku!));
  assert.ok(detailHtml.includes('Điểm Nổi Bật'));
  assert.ok(detailHtml.includes('href="/san-pham/'));
  assert.ok(detailHtml.includes('Giá: Liên hệ'));

  const jsonLdStr = buildPageJsonLd(
    PRODUCTS,
    routePath,
    'https://yenhaiseafood.vercel.app'
  );
  const jsonLd = JSON.parse(jsonLdStr);
  const productSchema = jsonLd['@graph'].find(
    (n: { '@type': string }) => n['@type'] === 'Product'
  );
  const breadcrumbSchema = jsonLd['@graph'].find(
    (n: { '@type': string }) => n['@type'] === 'BreadcrumbList'
  );
  assert.ok(productSchema);
  assert.equal(productSchema.name, bebe.name);
  assert.ok(productSchema.subjectOf?.contentUrl?.endsWith('.mp4'));
  assert.ok(breadcrumbSchema);
  assert.equal(breadcrumbSchema.itemListElement.length, 3);

  const injected = injectSeoAndSsrIntoHtml({
    template:
      '<html><head><title>x</title><meta name="description" content="x" /><meta name="keywords" content="x" /><meta name="robots" content="x" /><meta property="og:type" content="website" /><meta property="og:url" content="/" /><link rel="canonical" href="/" /><meta property="og:title" content="x" /><meta property="og:description" content="x" /><meta property="og:image" content="x" /><meta property="og:image:alt" content="x" /><meta name="twitter:title" content="x" /><meta name="twitter:description" content="x" /><meta name="twitter:image" content="x" /><script id="schema-jsonld" type="application/ld+json"></script></head><body><div id="root"></div><!--ssr-end--></body></html>',
    meta,
    baseUrl: 'https://yenhaiseafood.vercel.app',
    jsonLd: jsonLdStr,
    appHtml: detailHtml,
    products: PRODUCTS,
    pathname: routePath
  });
  assert.ok(
    injected.includes(
      '<link rel="canonical" href="https://yenhaiseafood.vercel.app/san-pham/be-be-tom-tit-boc-non-full-trung" />'
    )
  );
  assert.ok(injected.includes('window.__INITIAL_PATH__ = "/san-pham/be-be-tom-tit-boc-non-full-trung"'));

  const sitemap = buildSitemapXml(PRODUCTS, 'https://yenhaiseafood.vercel.app');
  for (const p of PRODUCTS) {
    assert.ok(sitemap.includes(`https://yenhaiseafood.vercel.app/san-pham/${p.slug}`));
  }
});

