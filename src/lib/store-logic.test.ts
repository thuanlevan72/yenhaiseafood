import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCTS,
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
  parseAndValidateProductsJson
} from './store-logic';

test('catalog loads all 7 uploaded seafood products from JSON with SEO attributes and hasDiscount: false by default', () => {
  assert.equal(PRODUCTS.length, 7);
  const fresh = PRODUCTS.filter((p) => p.category === 'fresh');
  const frozen = PRODUCTS.filter((p) => p.category === 'frozen');
  const dried = PRODUCTS.filter((p) => p.category === 'dried');
  assert.equal(fresh.length, 4);
  assert.equal(frozen.length, 2);
  assert.equal(dried.length, 1);

  for (const product of PRODUCTS) {
    assert.ok(product.image.startsWith('/assets/aistudio/'));
    assert.equal(product.hasDiscount, false);
    assert.ok(product.seoTitle && product.seoTitle.length > 10);
    assert.ok(product.seoAlt && product.seoAlt.length > 10);
  }
});

test('parseAndValidateProductsJson validates JSON and respects hasDiscount flag', () => {
  const validJson = JSON.stringify([
    {
      id: 10,
      name: 'Mực Ống Câu Tươi',
      category: 'fresh',
      price: 320000,
      hasDiscount: true,
      originalPrice: 360000,
      unit: '/ kg',
      image: '/assets/aistudio/1794885567341_2584028512014311615_2584028512014311615_5156174eb2025c8d42ebf3d33900b3cf_ebfdf389.jpg'
    }
  ]);
  const res = parseAndValidateProductsJson(validJson);
  assert.equal(res.valid, true);
  assert.equal(res.products?.length, 1);
  assert.equal(res.products?.[0].name, 'Mực Ống Câu Tươi');
  assert.equal(res.products?.[0].hasDiscount, true);
  assert.equal(res.products?.[0].originalPrice, 360000);

  const invalidRes = parseAndValidateProductsJson('{"not": "an array"}');
  assert.equal(invalidRes.valid, false);
  assert.ok(invalidRes.error);
});

test('store contact constants match Hoằng Tiến Thanh Hóa, 0356136859, and Facebook URL', () => {
  assert.equal(STORE_PHONE, '0356136859');
  assert.equal(STORE_FACEBOOK_URL, 'https://web.facebook.com/hai.yen.tran.314077');
  assert.equal(STORE_ADDRESS, 'Xã Hoằng Tiến, Tỉnh Thanh Hóa');
});

test('filterAndSortProducts filters by category, search query, and sorts by price', () => {
  const freshOnly = filterAndSortProducts(PRODUCTS, {
    category: 'fresh',
    searchQuery: '',
    sortBy: 'featured'
  });
  assert.equal(freshOnly.length, 4);

  const searchBeBe = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    searchQuery: 'bề bề',
    sortBy: 'featured'
  });
  assert.equal(searchBeBe.length, 3);

  const sortedAsc = filterAndSortProducts(PRODUCTS, {
    category: 'all',
    searchQuery: '',
    sortBy: 'price-asc'
  });
  assert.equal(sortedAsc[0].price, 165000);
  assert.equal(sortedAsc[sortedAsc.length - 1].price, 350000);
});

test('cart calculations handle initial cart, quantity updates, and free shipping threshold', () => {
  const initialTotals = calculateCartTotals(INITIAL_CART);
  assert.equal(initialTotals.totalItems, 3);
  assert.equal(initialTotals.subtotal, 950000);
  assert.equal(initialTotals.isFreeShipping, false);
  assert.equal(initialTotals.shippingFee, 35000);

  const updated = updateCartItemQty(INITIAL_CART, 1, 1);
  const afterIncrement = calculateCartTotals(updated);
  assert.equal(afterIncrement.totalItems, 4);
  assert.equal(afterIncrement.subtotal, 1300000);
  assert.equal(afterIncrement.isFreeShipping, true);

  const added = addCartItem(INITIAL_CART, {
    productId: 5,
    name: 'Cá Khô Rút Xương Phơi Nắng Tự Nhiên',
    price: 240000,
    img: PRODUCTS[4].image
  });
  assert.equal(added.length, 4);
});

test('phone and checkout validation enforce required fields', () => {
  assert.equal(validateVietnamesePhone('0356.136.859'), true);
  assert.equal(validateVietnamesePhone('0356136859'), true);
  assert.equal(validateVietnamesePhone('123'), false);

  const invalidResult = validateCheckoutForm({
    fullName: '',
    phone: '123',
    address: '',
    deliverySlot: 'Giao nhanh',
    paymentMethod: 'cod'
  });
  assert.equal(invalidResult.valid, false);

  const validResult = validateCheckoutForm({
    fullName: 'Trần Hải Yến',
    phone: '0356136859',
    address: 'Xã Hoằng Tiến, Tỉnh Thanh Hóa',
    deliverySlot: 'Giao nhanh',
    paymentMethod: 'cod'
  });
  assert.equal(validResult.valid, true);
});

test('buildZaloOrderMessage produces formatted summary', () => {
  const msg = buildZaloOrderMessage(INITIAL_CART, {
    fullName: 'Anh Minh',
    phone: '0356136859',
    address: 'Xã Hoằng Tiến, Tỉnh Thanh Hóa'
  });
  assert.ok(msg.includes('Bề Bề'));
  assert.ok(msg.includes('0356.136.859'));
});

test('SSR renderAppHtml and buildStoreJsonLd generate complete semantic HTML and Schema.org @graph without client JS', async () => {
  const { renderAppHtml, buildStoreJsonLd } = await import('../entry-server');
  const html = renderAppHtml(PRODUCTS);
  for (const product of PRODUCTS) {
    assert.ok(
      html.includes(product.name),
      `SSR HTML should include product name: ${product.name}`
    );
  }
  assert.ok(html.includes('https://schema.org/Product'));
  assert.ok(html.includes('https://schema.org/FAQPage'));
  assert.ok(html.includes('Xã Hoằng Tiến, Tỉnh Thanh Hóa'));
  assert.ok(html.includes('0356.136.859'));
  assert.ok(!html.includes('Mẫu Tiểu Sử (Bio) Facebook'));

  const jsonLd = buildStoreJsonLd(PRODUCTS);
  const parsedSchema = JSON.parse(jsonLd);
  assert.ok(Array.isArray(parsedSchema['@graph']));
  const storeNode = parsedSchema['@graph'].find((n: { '@type': string }) => n['@type'] === 'Store');
  assert.ok(storeNode);
  assert.equal(storeNode.hasOfferCatalog.itemListElement.length, 7);
  assert.equal(storeNode.address.addressRegion, 'Thanh Hóa');
});
