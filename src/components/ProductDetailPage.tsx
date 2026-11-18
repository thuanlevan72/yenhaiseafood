import React, { useState, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  CUSTOMER_REVIEWS,
  SEO_FAQS,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_ZALO_URL,
  STORE_FACEBOOK_URL,
  STORE_ADDRESS,
  STORE_LANDMARK,
  formatProductPrice,
  getProductRoutePath
} from '../lib/store-logic';
import { ResilientImage } from './ResilientImage';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onNavigateHome: (category?: ProductCategory, hash?: string) => void;
  onNavigateProduct: (product: Product) => void;
  onAddToCart: (item: {
    productId: number;
    name: string;
    price: number;
    img: string;
    unit: string;
    prepNote: string;
    qty: number;
  }) => void;
  onBuyNow: (item: {
    productId: number;
    name: string;
    price: number;
    img: string;
    unit: string;
    prepNote: string;
    qty: number;
  }) => void;
  onOpenConsultModal: (topic: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onNavigateHome,
  onNavigateProduct,
  onAddToCart,
  onBuyNow,
  onOpenConsultModal
}) => {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [selectedPrep, setSelectedPrep] = useState(
    product.prepOptions[0] || 'Đóng khay bảo quản lạnh tiêu chuẩn'
  );
  const [qty, setQty] = useState(1);
  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('image');

  useEffect(() => {
    setSelectedSizeIdx(0);
    setSelectedPrep(
      product.prepOptions[0] || 'Đóng khay bảo quản lạnh tiêu chuẩn'
    );
    setQty(1);
    setMediaTab('image');
  }, [product.id]);

  const categoryLabel =
    product.category === 'fresh'
      ? 'Hải Sản Tươi Trong Ngày'
      : product.category === 'frozen'
      ? 'Bề Bề, Nõn Tôm & Đông VIP'
      : 'Hải Sản Khô Phơi Nắng';

  const sizeObj = product.sizeOptions[selectedSizeIdx] || {
    label: 'Quy cách tiêu chuẩn',
    priceMultiplier: 1
  };
  const fullPrepNote = `${sizeObj.label} • ${selectedPrep}`;
  const priceDisplay = formatProductPrice(product);

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aSame = a.category === product.category ? 0 : 1;
      const bSame = b.category === product.category ? 0 : 1;
      if (aSame !== bSame) return aSame - bSame;
      return a.featuredOrder - b.featuredOrder;
    })
    .slice(0, 4);

  const handleAdd = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      img: product.image,
      unit: product.unit,
      prepNote: fullPrepNote,
      qty
    });
  };

  const handleBuy = () => {
    onBuyNow({
      productId: product.id,
      name: product.name,
      price: product.price,
      img: product.image,
      unit: product.unit,
      prepNote: fullPrepNote,
      qty
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-5 sm:py-8 w-full flex-1">
      {/* Top Semantic Breadcrumb + Back Link */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5">
        <nav
          aria-label="Breadcrumb"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="text-xs sm:text-body-sm text-light-on-surface/70 flex flex-wrap items-center gap-1.5 min-w-0"
        >
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center"
          >
            <a
              itemProp="item"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome('all');
              }}
              className="hover:text-light-primary font-semibold transition-colors"
            >
              <span itemProp="name">Trang chủ Yến Hải</span>
            </a>
            <meta itemProp="position" content="1" />
          </span>
          <span aria-hidden="true">/</span>
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center"
          >
            <a
              itemProp="item"
              href="/#catalog"
              onClick={(e) => {
                e.preventDefault();
                onNavigateHome(product.category, 'catalog');
              }}
              className="hover:text-light-primary font-semibold text-ocean-blue transition-colors"
            >
              <span itemProp="name">{categoryLabel}</span>
            </a>
            <meta itemProp="position" content="2" />
          </span>
          <span aria-hidden="true">/</span>
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center min-w-0"
          >
            <span
              itemProp="name"
              className="text-light-primary font-bold truncate max-w-[220px] sm:max-w-md"
            >
              {product.name}
            </span>
            <meta itemProp="position" content="3" />
          </span>
        </nav>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome('all', 'catalog');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-DEFAULT bg-white hover:bg-light-primary-container border border-light-outline-variant text-light-primary font-label text-xs font-bold transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Xem tất cả hải sản</span>
        </a>
      </div>

      {/* Main Product Detail Card */}
      <article
        itemScope
        itemType="https://schema.org/Product"
        className="bg-white rounded-xl border border-light-outline-variant shadow-sm overflow-hidden"
      >
        <meta itemProp="sku" content={product.sku || `YH-SP-0${product.id}`} />
        <meta itemProp="category" content={categoryLabel} />
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content="Hải Sản Yến Hải" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left 5 Columns: Product Real Image & Real Video Stage + 4-Item Spec Sheet */}
          <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
            <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-light-outline-variant aspect-[4/3] sm:aspect-square">
              {product.videoUrl && mediaTab === 'video' ? (
                <video
                  key={product.videoUrl}
                  src={product.videoUrl}
                  poster={product.image}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <ResilientImage
                  src={product.image}
                  alt={product.seoAlt || product.name}
                  title={product.seoTitle || product.name}
                  itemProp="image"
                  width={800}
                  height={800}
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              )}

              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-fresh-green text-white font-label text-xs font-bold shadow flex items-center gap-1 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {product.badgeLeft}
              </span>

              <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-white/95 text-accent font-label text-xs font-bold shadow pointer-events-none">
                {product.badgeRight}
              </span>
            </div>

            {/* Keep image metadata visible in DOM even if switched */}
            {product.videoUrl && (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMediaTab('image')}
                  className={`py-2.5 px-3 rounded-DEFAULT font-label text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-all ${
                    mediaTab === 'image'
                      ? 'bg-light-primary text-white border-light-primary shadow-xs'
                      : 'bg-light-surface-container text-light-primary border-light-outline-variant hover:bg-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    photo_camera
                  </span>
                  <span>Ảnh Chụp Thực Tế</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaTab('video')}
                  className={`py-2.5 px-3 rounded-DEFAULT font-label text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-all ${
                    mediaTab === 'video'
                      ? 'bg-accent text-white border-accent shadow-xs'
                      : 'bg-light-surface-container text-light-primary border-light-outline-variant hover:bg-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    smart_display
                  </span>
                  <span>Video Quay Tại Vựa</span>
                </button>
              </div>
            )}

            {/* Structured Product Spec Table (<dl> rendered in Real DOM) */}
            <dl className="bg-light-surface-container rounded-lg p-3.5 sm:p-4 border border-light-outline-variant space-y-2.5 text-xs sm:text-body-sm">
              <div className="flex items-start justify-between gap-3 pb-2 border-b border-light-outline-variant/70">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-light-primary">
                    qr_code_2
                  </span>
                  <span>Mã sản phẩm:</span>
                </dt>
                <dd className="font-mono font-bold text-light-primary text-right">
                  {product.sku || `YH-SP-0${product.id}`}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-3 pb-2 border-b border-light-outline-variant/70">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-ocean-blue">
                    location_on
                  </span>
                  <span>Nguồn gốc:</span>
                </dt>
                <dd className="font-semibold text-light-primary text-right">
                  {product.origin || `Vùng biển ${STORE_ADDRESS}`}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-3 pb-2 border-b border-light-outline-variant/70">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-fresh-green">
                    inventory_2
                  </span>
                  <span>Tình trạng:</span>
                </dt>
                <dd className="font-semibold text-emerald-700 text-right">
                  {product.stockStatus}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-3 pb-2 border-b border-light-outline-variant/70">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-sky-600">
                    ac_unit
                  </span>
                  <span>Bảo quản:</span>
                </dt>
                <dd className="font-medium text-light-on-surface text-right">
                  {product.storageGuide || 'Cấp đông sâu hoặc giữ đá lạnh tiêu chuẩn'}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-3">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1.5 shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-accent">
                    verified_user
                  </span>
                  <span>Cam kết:</span>
                </dt>
                <dd className="font-bold text-accent text-right">
                  Bao ăn 1 đổi 1 tận nơi
                </dd>
              </div>
            </dl>
          </div>

          {/* Right 7 Columns: H1 Title, Price: Liên hệ, Options, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5 min-w-0">
            <div className="space-y-4">
              {/* Subtitle + Verified Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-body-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 font-label font-semibold text-ocean-blue">
                  <span>{product.subtitle}</span>
                </span>
                <span
                  itemProp="aggregateRating"
                  itemScope
                  itemType="https://schema.org/AggregateRating"
                  className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200"
                >
                  <span>★</span>
                  <span itemProp="ratingValue">{product.rating.toFixed(1)}</span>
                  <span className="text-light-on-surface/65 font-normal">
                    (<span itemProp="reviewCount">{product.reviewsCount}</span> đánh giá)
                  </span>
                </span>
              </div>

              {/* Dedicated H1 for Product SEO */}
              <h1
                itemProp="name"
                className="font-headline text-2xl sm:text-3xl lg:text-[32px] text-light-primary font-extrabold leading-snug text-balance"
              >
                {product.name}
              </h1>

              {/* Price: Liên hệ & Direct Call/Zalo Box */}
              <div
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
                className="p-4 rounded-xl bg-rose-50/75 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
              >
                <meta itemProp="priceCurrency" content="VND" />
                <meta itemProp="price" content="0" />
                <link itemProp="availability" href="https://schema.org/InStock" />
                <link
                  itemProp="itemCondition"
                  href="https://schema.org/NewCondition"
                />
                <div className="min-w-0">
                  <span className="block text-[11px] font-label uppercase font-bold text-light-on-surface/60">
                    Báo giá gốc tại vựa theo ngày ({product.unit.replace('/', '').trim()}):
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-headline text-2xl sm:text-3xl font-extrabold text-accent">
                      {priceDisplay}
                    </span>
                    <span className="text-xs sm:text-body-sm text-light-on-surface/65">
                      {product.unit}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-emerald-800 font-medium mt-1">
                    ✓ Gửi ảnh &amp; video khay hàng thật qua Zalo trước khi đóng thùng
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${STORE_PHONE}`}
                    title={`Gọi trực tiếp nhận báo giá ${product.name}`}
                    className="min-h-[44px] px-3.5 py-2 rounded-DEFAULT bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[17px]">call</span>
                    <span className="tabular-nums">{STORE_PHONE_DISPLAY}</span>
                  </a>
                  <a
                    href={STORE_ZALO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Nhắn Zalo nhận báo giá ${product.name}`}
                    className="min-h-[44px] px-3.5 py-2 rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[17px]">chat</span>
                    <span>Zalo Báo Giá</span>
                  </a>
                </div>
              </div>

              {/* Concise Lead Description */}
              <p
                itemProp="description"
                className="font-body text-body-md sm:text-base text-light-on-surface/85 leading-relaxed"
              >
                {product.description}
              </p>

              {/* Packaging Size Selector */}
              <div>
                <span className="block font-label text-xs sm:text-label-sm text-light-primary font-bold mb-2">
                  1. Chọn quy cách đóng gói:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.sizeOptions.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`py-2.5 px-3.5 rounded-md border text-left font-label text-xs sm:text-body-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        selectedSizeIdx === idx
                          ? 'border-light-primary bg-light-primary-container text-light-primary font-bold'
                          : 'border-light-outline-variant bg-white text-light-on-surface hover:bg-light-surface-container'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedSizeIdx === idx && (
                        <span className="material-symbols-outlined text-[16px] text-light-primary shrink-0">
                          check_circle
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preparation Selector */}
              <div>
                <span className="block font-label text-xs sm:text-label-sm text-light-primary font-bold mb-2">
                  2. Yêu cầu sơ chế &amp; đóng thùng giữ nhiệt miễn phí:
                </span>
                <div className="space-y-1.5">
                  {product.prepOptions.map((prep) => (
                    <button
                      key={prep}
                      type="button"
                      onClick={() => setSelectedPrep(prep)}
                      className={`w-full py-2 px-3.5 rounded-md border text-left font-body text-xs sm:text-body-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        selectedPrep === prep
                          ? 'border-fresh-green bg-emerald-50/70 text-emerald-950 font-semibold'
                          : 'border-light-outline-variant bg-white text-light-on-surface hover:bg-light-surface-container'
                      }`}
                    >
                      <span>{prep}</span>
                      {selectedPrep === prep && (
                        <span className="material-symbols-outlined text-fresh-green text-[16px] shrink-0">
                          check_circle
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Quantity & Primary CTAs */}
            <div className="pt-4 border-t border-light-outline-variant space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-label text-xs sm:text-body-sm font-semibold text-light-on-surface/80">
                  Số lượng cần báo giá ({product.unit.replace('/', '').trim()}):
                </span>
                <div className="flex items-center border border-light-outline rounded-md bg-light-surface-container">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Giảm số lượng"
                    className="px-3.5 py-1.5 font-bold text-light-primary hover:bg-light-outline-variant cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 font-headline text-title-sm font-bold text-light-primary tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Tăng số lượng"
                    className="px-3.5 py-1.5 font-bold text-light-primary hover:bg-light-outline-variant cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="min-h-[46px] py-2.5 px-3.5 rounded-DEFAULT bg-light-primary-container text-light-primary hover:bg-light-primary hover:text-white font-label text-xs sm:text-label-md font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_shopping_cart
                  </span>
                  <span>Lưu vào giỏ hàng</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuy}
                  className="min-h-[46px] py-2.5 px-3.5 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-xs sm:text-label-md font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    shopping_cart_checkout
                  </span>
                  <span>Yêu cầu đặt hàng</span>
                </button>
                <a
                  href={STORE_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[46px] py-2.5 px-3.5 rounded-DEFAULT bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label text-xs sm:text-label-md font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_up
                  </span>
                  <span>Nhắn Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Rich Semantic Content Sections Below Fold (100% Real HTML DOM for Googlebot) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Detailed Highlights, Culinary Suggestions & Embedded Video */}
        <section className="lg:col-span-8 space-y-6 min-w-0">
          <div className="bg-white rounded-xl border border-light-outline-variant p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="font-headline text-title-lg sm:text-headline-md text-light-primary font-bold">
              Điểm Nổi Bật &amp; Gợi Ý Chế Biến {product.name}
            </h2>

            {product.highlights && product.highlights.length > 0 && (
              <ul className="space-y-2.5">
                {product.highlights.map((pt) => (
                  <li
                    key={pt}
                    className="flex items-start gap-2.5 text-body-md text-light-primary font-medium"
                  >
                    <span className="material-symbols-outlined text-fresh-green text-[20px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}

            {product.bestDishes && product.bestDishes.length > 0 && (
              <div className="pt-3 border-t border-light-outline-variant">
                <h3 className="font-title text-title-sm font-bold text-light-primary mb-2.5">
                  Món ngon chế biến hợp nhất từ {product.mobileName || product.name}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.bestDishes.map((dish) => (
                    <span
                      key={dish}
                      className="px-3 py-1.5 rounded-lg bg-light-surface-container border border-light-outline-variant text-xs sm:text-body-sm font-label text-light-primary font-semibold"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-sky-50/70 border border-sky-200 text-body-sm text-light-on-surface/85 leading-relaxed">
              <strong className="text-light-primary block mb-1">
                Hướng dẫn bảo quản &amp; rã đông giữ trọn vị ngọt:
              </strong>
              <span>
                {product.storageGuide ||
                  'Bảo quản ngăn đá -18°C, khi dùng chỉ cần rã đông tự nhiên 10–15 phút ở nhiệt độ phòng hoặc ngâm bọc kín vào nước mát trước khi chế biến.'}
              </span>
            </div>
          </div>

          {product.videoUrl && (
            <div className="bg-white rounded-xl border border-light-outline-variant p-5 sm:p-6 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-headline text-title-lg text-light-primary font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">
                    smart_display
                  </span>
                  <span>Video Quay Thực Tế {product.mobileName || product.name} Tại Vựa</span>
                </h2>
                <span className="text-xs font-label text-fresh-green font-bold">
                  100% hàng thật tại Yến Hải
                </span>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-slate-950 aspect-video border border-light-outline-variant">
                <video
                  src={product.videoUrl}
                  poster={product.image}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Customer Reviews Preview for Product Authority */}
          <div className="bg-white rounded-xl border border-light-outline-variant p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="font-headline text-title-lg text-light-primary font-bold">
              Phản Hồi Khách Hàng Đã Mua Tại Vựa Yến Hải
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CUSTOMER_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-lg bg-light-surface-container border border-light-outline-variant space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-label text-sm font-bold text-light-primary">
                      {rev.author}{' '}
                      <span className="font-normal text-xs text-light-on-surface/60">
                        ({rev.location})
                      </span>
                    </span>
                    <span className="text-gold-star text-xs font-bold">★★★★★</span>
                  </div>
                  <p className="text-xs font-label text-ocean-blue font-semibold">
                    {rev.productBought}
                  </p>
                  <p className="text-body-sm text-light-on-surface/80 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right 4 Cols: Store Trust, Shipping & Quick FAQ */}
        <aside className="lg:col-span-4 space-y-6 min-w-0">
          <div className="bg-gradient-to-br from-light-primary via-[#0E355C] to-light-primary text-white rounded-xl p-5 shadow-md space-y-4">
            <div>
              <span className="text-[11px] font-label uppercase tracking-wider text-emerald-300 font-bold">
                Vựa Hải Sản Gốc Biển Hoằng Tiến
              </span>
              <h2 className="font-headline text-title-lg font-bold mt-1">
                Cam Kết Tại Hải Sản Yến Hải
              </h2>
            </div>

            <ul className="space-y-2.5 text-body-sm text-white/90">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[18px] shrink-0 mt-0.5">
                  verified
                </span>
                <span>Bao ăn, bao tươi 1 đổi 1 tận nơi nếu không chuẩn như video quay tại vựa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sky-300 text-[18px] shrink-0 mt-0.5">
                  local_shipping
                </span>
                <span>Đóng thùng xốp ủ đá lạnh hút chân không gửi xe đi Hà Nội và các tỉnh trong ngày.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-300 text-[18px] shrink-0 mt-0.5">
                  location_on
                </span>
                <span>{STORE_LANDMARK}</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-white/15 space-y-2">
              <button
                type="button"
                onClick={() => onOpenConsultModal(`Báo giá ${product.name}`)}
                className="w-full py-2.5 px-4 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  support_agent
                </span>
                <span>Nhận Báo Giá &amp; Đặt Nhanh</span>
              </button>
              <a
                href={`tel:${STORE_PHONE}`}
                className="w-full py-2.5 px-4 rounded-DEFAULT bg-white/15 hover:bg-white/25 text-white font-label text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span className="tabular-nums">Gọi ngay: {STORE_PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-light-outline-variant p-5 shadow-xs space-y-3">
            <h2 className="font-headline text-title-md font-bold text-light-primary">
              Hỏi Đáp Nhanh Khi Đặt Hàng
            </h2>
            <div className="space-y-3">
              {SEO_FAQS.slice(0, 3).map((faq) => (
                <div
                  key={faq.question}
                  className="pb-3 last:pb-0 border-b last:border-b-0 border-light-outline-variant"
                >
                  <h3 className="font-title text-xs sm:text-body-sm font-bold text-light-primary">
                    {faq.question}
                  </h3>
                  <p className="font-body text-xs text-light-on-surface/75 mt-1 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Internal-Linking Related Products Grid (Crawlable <a href="/san-pham/...">) */}
      <section className="mt-10 pt-8 border-t border-light-outline-variant">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-headline text-headline-md text-light-primary font-bold">
              Hải Sản Tươi Ngon Khác Tại Vựa Yến Hải
            </h2>
            <p className="font-body text-body-sm text-light-on-surface/70">
              Tham khảo thêm các mặt hàng bán chạy để đóng chung thùng giữ lạnh tiện lợi.
            </p>
          </div>
          <a
            href="/#catalog"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome('all', 'catalog');
            }}
            className="text-accent font-label text-sm font-bold hover:underline"
          >
            Xem toàn bộ danh mục →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {relatedProducts.map((rel) => {
            const relPath = getProductRoutePath(rel);
            return (
              <article
                key={rel.id}
                className="bg-white rounded-md border border-light-outline-variant overflow-hidden hover:shadow-md transition-all flex flex-col group"
              >
                <a
                  href={relPath}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateProduct(rel);
                  }}
                  title={rel.seoTitle || rel.name}
                  className="block relative h-44 bg-light-surface-container overflow-hidden"
                >
                  <ResilientImage
                    src={rel.image}
                    alt={rel.seoAlt || rel.name}
                    title={rel.seoTitle || rel.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-fresh-green text-white font-label text-[10px] font-bold">
                    {rel.badgeLeft}
                  </span>
                </a>
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-title text-sm font-bold text-light-primary line-clamp-2 group-hover:text-accent transition-colors">
                      <a
                        href={relPath}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigateProduct(rel);
                        }}
                      >
                        {rel.name}
                      </a>
                    </h3>
                    <p className="text-xs text-light-on-surface/65 mt-0.5 line-clamp-1">
                      {rel.subtitle}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-light-outline-variant flex items-center justify-between">
                    <span className="font-headline text-sm font-bold text-accent">
                      {formatProductPrice(rel)}
                    </span>
                    <a
                      href={relPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateProduct(rel);
                      }}
                      className="text-xs font-label font-bold text-ocean-blue hover:underline"
                    >
                      Xem chi tiết →
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};
