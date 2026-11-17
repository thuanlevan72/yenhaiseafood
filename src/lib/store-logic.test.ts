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

test('filterAndSortProducts filters by category and search query including bestDishes', () => {
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
