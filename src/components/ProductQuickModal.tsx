import React, { useState, useEffect } from 'react';
import {
  Product,
  formatProductPrice,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_ZALO_URL,
  STORE_FACEBOOK_URL,
  STORE_ADDRESS
} from '../lib/store-logic';
import { ResilientImage } from './ResilientImage';

interface ProductQuickModalProps {
  product: Product | null;
  onClose: () => void;
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
}

export const ProductQuickModal: React.FC<ProductQuickModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [selectedPrep, setSelectedPrep] = useState('');
  const [qty, setQty] = useState(1);
  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('image');

  useEffect(() => {
    if (product) {
      setSelectedSizeIdx(0);
      setSelectedPrep(product.prepOptions[0] || 'Giao tiêu chuẩn');
      setQty(1);
      setMediaTab(product.videoUrl ? 'video' : 'image');
    }
  }, [product]);

  if (!product) return null;

  const sizeObj = product.sizeOptions[selectedSizeIdx] || {
    label: 'Tiêu chuẩn',
    priceMultiplier: 1
  };
  const fullPrepNote = `${sizeObj.label} • ${selectedPrep}`;
  const priceDisplay = formatProductPrice(product);

  const categoryLabel =
    product.category === 'fresh'
      ? 'Hải Sản Tươi Trong Ngày'
      : product.category === 'frozen'
      ? 'Hải Sản Cấp Đông VIP'
      : 'Hải Sản Khô Phơi Nắng';

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
    onClose();
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
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickViewTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <article
        itemScope
        itemType="https://schema.org/Product"
        className="bg-white rounded-xl border border-light-outline-variant shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col"
      >
        <meta itemProp="sku" content={product.sku || `YH-SP-0${product.id}`} />
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <meta itemProp="name" content="Hải Sản Yến Hải" />
        </div>

        {/* Sticky Top Breadcrumb & Close Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-light-outline-variant flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-label text-light-on-surface/70">
            <span className="font-bold text-light-primary">Hải Sản Yến Hải</span>
            <span>/</span>
            <span className="text-ocean-blue font-semibold">{categoryLabel}</span>
            <span>/</span>
            <span className="px-2 py-0.5 rounded bg-light-surface-container text-light-primary font-mono text-[11px]">
              Mã: {product.sku || `YH-0${product.id}`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng trang chi tiết sản phẩm"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-light-surface-container hover:bg-light-outline-variant text-light-primary font-label text-xs font-bold cursor-pointer transition-colors"
          >
            <span>Đóng</span>
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Main 2-Column Product Detail Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 5 Columns: Real Media Gallery & Concise 4-Spec Grid */}
          <div className="lg:col-span-5 flex flex-col gap-4">
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

            {/* Media Switcher (Video vs Real Photo) */}
            {product.videoUrl && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMediaTab('video')}
                  className={`py-2 px-3 rounded-md font-label text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-all ${
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
                <button
                  type="button"
                  onClick={() => setMediaTab('image')}
                  className={`py-2 px-3 rounded-md font-label text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-all ${
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
              </div>
            )}

            {/* Concise 4-Item Specification Table for UX & SEO */}
            <dl className="bg-light-surface-container rounded-lg p-3.5 border border-light-outline-variant space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-light-outline-variant/70">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[15px] text-ocean-blue">
                    location_on
                  </span>
                  <span>Nguồn gốc:</span>
                </dt>
                <dd className="font-semibold text-light-primary text-right">
                  {product.origin || `Vùng biển ${STORE_ADDRESS}`}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2 pb-2 border-b border-light-outline-variant/70">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[15px] text-fresh-green">
                    inventory_2
                  </span>
                  <span>Tình trạng:</span>
                </dt>
                <dd className="font-semibold text-emerald-700 text-right">
                  {product.stockStatus}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2 pb-2 border-b border-light-outline-variant/70">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[15px] text-sky-600">
                    ac_unit
                  </span>
                  <span>Bảo quản:</span>
                </dt>
                <dd className="font-medium text-light-on-surface text-right">
                  {product.storageGuide || 'Cấp đông sâu hoặc giữ đá lạnh tiêu chuẩn'}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2">
                <dt className="font-label text-light-on-surface/65 flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[15px] text-accent">
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

          {/* Right 7 Columns: Concise Details, Highlights, Culinary Tags & Order Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              {/* Subtitle & Rating */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-light-on-surface/70 mb-1">
                  <span className="font-semibold text-ocean-blue">
                    {product.subtitle}
                  </span>
                  <span
                    itemProp="aggregateRating"
                    itemScope
                    itemType="https://schema.org/AggregateRating"
                    className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                  >
                    <span>★</span>
                    <span itemProp="ratingValue">{product.rating.toFixed(1)}</span>
                    <span className="text-light-on-surface/60 font-normal">
                      (<span itemProp="reviewCount">{product.reviewsCount}</span> đánh giá)
                    </span>
                  </span>
                </div>

                <h2
                  id="quickViewTitle"
                  itemProp="name"
                  className="font-headline text-headline-md text-light-primary font-extrabold leading-snug"
                >
                  {product.name}
                </h2>
              </div>

              {/* Price & Direct Contact Banner */}
              <div
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
                className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 flex flex-wrap items-center justify-between gap-3"
              >
                <meta itemProp="priceCurrency" content="VND" />
                <meta itemProp="price" content="0" />
                <link itemProp="availability" href="https://schema.org/InStock" />
                <div>
                  <span className="block text-[11px] font-label uppercase font-bold text-light-on-surface/60">
                    Báo giá gốc tại vựa theo ngày ({product.unit.replace('/', '').trim()}):
                  </span>
                  <span className="font-headline text-headline-md font-extrabold text-accent">
                    {priceDisplay}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${STORE_PHONE}`}
                    title={`Gọi trực tiếp nhận báo giá ${product.name}`}
                    className="px-3 py-2 rounded-DEFAULT bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>Gọi {STORE_PHONE_DISPLAY}</span>
                  </a>
                  <a
                    href={STORE_ZALO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Nhắn Zalo nhận video và báo giá ${product.name}`}
                    className="px-3 py-2 rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Zalo Báo Giá</span>
                  </a>
                </div>
              </div>

              {/* Concise Description & 3 Key Highlights */}
              <div className="space-y-2">
                <p
                  itemProp="description"
                  className="font-body text-body-md text-light-on-surface/85 leading-relaxed"
                >
                  {product.description}
                </p>

                {product.highlights && product.highlights.length > 0 && (
                  <ul className="grid grid-cols-1 gap-1.5 pt-1">
                    {product.highlights.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2 text-body-sm text-light-primary font-medium"
                      >
                        <span className="material-symbols-outlined text-fresh-green text-[18px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Suggested Dishes (SEO & Culinary Guide) */}
              {product.bestDishes && product.bestDishes.length > 0 && (
                <div className="pt-1">
                  <span className="block font-label text-xs font-bold text-light-primary mb-1.5">
                    🍲 Món ngon chế biến hợp nhất:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.bestDishes.map((dish) => (
                      <span
                        key={dish}
                        className="px-2.5 py-1 rounded-full bg-light-surface-container border border-light-outline-variant text-xs font-label text-light-primary font-semibold"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. Packaging / Size Selector */}
              <div className="pt-1">
                <label className="block font-label text-xs text-light-primary font-bold mb-1.5">
                  1. Chọn quy cách đóng gói:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizeOptions.map((opt, idx) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`py-2 px-3 rounded-md border text-left font-label text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        selectedSizeIdx === idx
                          ? 'border-light-primary bg-light-primary-container text-light-primary font-bold'
                          : 'border-light-outline-variant bg-white text-light-on-surface hover:bg-light-surface-container'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedSizeIdx === idx && (
                        <span className="material-symbols-outlined text-[15px] text-light-primary">
                          check_circle
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Free Preparation Selector */}
              <div>
                <label className="block font-label text-xs text-light-primary font-bold mb-1.5">
                  2. Yêu cầu sơ chế &amp; đóng thùng miễn phí:
                </label>
                <div className="space-y-1.5">
                  {product.prepOptions.map((prep) => (
                    <button
                      key={prep}
                      type="button"
                      onClick={() => setSelectedPrep(prep)}
                      className={`w-full py-1.5 px-3 rounded-md border text-left font-body text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        selectedPrep === prep
                          ? 'border-fresh-green bg-emerald-50/70 text-emerald-950 font-semibold'
                          : 'border-light-outline-variant bg-white text-light-on-surface hover:bg-light-surface-container'
                      }`}
                    >
                      <span>{prep}</span>
                      {selectedPrep === prep && (
                        <span className="material-symbols-outlined text-fresh-green text-[16px]">
                          check_circle
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Quantity & Action Bar */}
            <div className="pt-4 border-t border-light-outline-variant space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-xs font-semibold text-light-on-surface/75">
                  Số lượng cần báo giá ({product.unit.replace('/', '').trim()}):
                </span>
                <div className="flex items-center border border-light-outline rounded-md bg-light-surface-container">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Giảm số lượng"
                    className="px-3 py-1 font-bold text-light-primary hover:bg-light-outline-variant cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3.5 font-headline text-label-md font-bold text-light-primary tabular-nums">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Tăng số lượng"
                    className="px-3 py-1 font-bold text-light-primary hover:bg-light-outline-variant cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="py-2.5 px-3 rounded-DEFAULT bg-light-primary-container text-light-primary hover:bg-light-primary hover:text-white font-label text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_shopping_cart
                  </span>
                  <span>Lưu vào giỏ hàng</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuy}
                  className="py-2.5 px-3 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
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
                  className="py-2.5 px-3 rounded-DEFAULT bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
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
    </div>
  );
};
