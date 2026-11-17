import React from 'react';
import {
  Product,
  ProductCategory,
  CartItem,
  calculateCartTotals,
  formatVND,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_ZALO_URL,
  STORE_FACEBOOK_URL,
  STORE_ADDRESS
} from '../lib/store-logic';
import { ResilientImage } from './ResilientImage';

interface MobileBioStoreViewProps {
  products: Product[];
  cart: CartItem[];
  selectedCategory: ProductCategory;
  searchQuery: string;
  onSelectCategory: (cat: ProductCategory) => void;
  onSearchChange: (q: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  onOpenProductDetail: (product: Product) => void;
  onSwitchToDesktopView?: () => void;
}

export const MobileBioStoreView: React.FC<MobileBioStoreViewProps> = ({
  products,
  cart,
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
  onAddToCart,
  onOpenCart,
  onOpenProductDetail,
  onSwitchToDesktopView
}) => {
  const totals = calculateCartTotals(cart);

  return (
    <div className="bg-light-surface-container font-body text-light-on-surface antialiased min-h-screen pb-24 max-w-md mx-auto shadow-2xl border-x border-light-outline-variant relative">
      {/* Top bar to return to Full Storefront View when previewing on desktop */}
      {onSwitchToDesktopView && (
        <div className="bg-light-primary/95 text-white px-3 py-2 flex items-center justify-between text-xs border-b border-white/15">
          <span className="font-label flex items-center gap-1 text-sky-200">
            <span className="material-symbols-outlined text-[15px]">
              smartphone
            </span>
            Giao diện Bio Link &amp; Cửa Hàng Di Động
          </span>
          <button
            type="button"
            onClick={onSwitchToDesktopView}
            className="px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white font-label text-[11px] font-semibold cursor-pointer"
          >
            Xem bản Website Đầy Đủ →
          </button>
        </div>
      )}

      {/* Mobile Bio Top Profile Header */}
      <header className="bg-gradient-to-b from-light-primary via-[#0E355C] to-light-primary text-white pt-8 pb-6 px-4 rounded-b-2xl shadow-md relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[180px]">sailing</span>
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Profile Avatar / Brand Badge */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white p-1 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-light-primary text-white flex items-center justify-center font-extrabold text-2xl">
                <span className="material-symbols-outlined text-[36px]">
                  sailing
                </span>
              </div>
            </div>
            <span
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-fresh-green border-2 border-white flex items-center justify-center text-white"
              title="Vựa đang mở cửa"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <h1 className="font-headline text-headline-lg-mobile font-bold tracking-tight text-white">
              HẢI SẢN YẾN HẢI
            </h1>
            <span
              className="material-symbols-outlined text-ocean-blue text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>

          <p className="font-label text-label-sm text-sky-200 uppercase tracking-wider font-semibold mt-0.5">
            {STORE_ADDRESS} • Sỉ &amp; Lẻ Toàn Quốc
          </p>

          {/* Store Introduction */}
          <div className="mt-3 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 max-w-sm text-center">
            <p className="font-body text-body-sm text-white/90 leading-snug">
              Chuyên sỉ &amp; lẻ hải sản biển Hoằng Tiến - Thanh Hóa: Mực ống tươi, Cá thu phấn khoanh giữa, Bạch tuộc, Bề bề bóc nõn full trứng &amp; Cá khô rút xương. Bao ăn 1 đổi 1!
            </p>
          </div>

          {/* Quick Trust Indicators */}
          <div className="flex items-center justify-center gap-3 mt-3 text-[11px] font-label text-white/80">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-fresh-green"></span>{' '}
              Tươi từ ghe biển
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Bao ăn
              1 đổi 1
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300"></span>{' '}
              {STORE_PHONE_DISPLAY}
            </span>
          </div>

          {/* Multi-Channel Fast Contact Bar */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4">
            <a
              href={`tel:${STORE_PHONE}`}
              title={`Gọi Hotline Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
              className="py-2.5 px-1 rounded-lg bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-label-sm font-semibold flex flex-col items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              <span className="mt-0.5">Gọi {STORE_PHONE_DISPLAY}</span>
            </a>

            <a
              href={STORE_ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              title={`Nhắn Zalo Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
              className="py-2.5 px-1 rounded-lg bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-label-sm font-semibold flex flex-col items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span className="mt-0.5">Chat Zalo</span>
            </a>

            <a
              href={STORE_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook Hải Sản Yến Hải"
              className="py-2.5 px-1 rounded-lg bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label text-label-sm font-semibold flex flex-col items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-[20px]">
                thumb_up
              </span>
              <span className="mt-0.5">Facebook</span>
            </a>
          </div>
        </div>
      </header>

      {/* Sticky Mobile Category & Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-3 py-2.5 border-b border-light-outline-variant shadow-sm flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            id="mobileSearch"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bề bề, mực ống, cá thu, bạch tuộc..."
            aria-label="Tìm kiếm hải sản trên di động"
            className="w-full pl-8 pr-3 py-1.5 text-body-sm rounded-full border border-light-outline-variant bg-light-surface-container focus:bg-white focus:outline-none focus:ring-1 focus:ring-light-primary"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-light-on-surface/40 text-[16px]">
            search
          </span>
        </div>

        {/* Mobile Cart Trigger with Floating Count */}
        <button
          type="button"
          onClick={onOpenCart}
          aria-label="Mở giỏ hàng di động"
          className="relative p-2 rounded-full bg-light-surface-container hover:bg-light-primary-container text-light-primary flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">
            shopping_bag
          </span>
          <span
            id="mobileCartCount"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white font-bold text-[10px] flex items-center justify-center shadow tabular-nums"
          >
            {totals.totalItems}
          </span>
        </button>
      </div>

      {/* 3 Pillar Category Quick Filter Tabs */}
      <div className="px-3 py-3 overflow-x-auto flex gap-2 no-scrollbar">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`mobile-cat-btn px-3 py-1.5 rounded-full font-label text-label-sm whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-light-primary text-white shadow-sm'
              : 'bg-white text-light-on-surface border border-light-outline-variant'
          }`}
        >
          Tất cả (7)
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory('fresh')}
          className={`mobile-cat-btn px-3 py-1.5 rounded-full font-label text-label-sm whitespace-nowrap cursor-pointer ${
            selectedCategory === 'fresh'
              ? 'bg-light-primary text-white shadow-sm'
              : 'bg-white text-light-on-surface border border-light-outline-variant'
          }`}
        >
          🦐 Tươi Sống
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory('frozen')}
          className={`mobile-cat-btn px-3 py-1.5 rounded-full font-label text-label-sm whitespace-nowrap cursor-pointer ${
            selectedCategory === 'frozen'
              ? 'bg-light-primary text-white shadow-sm'
              : 'bg-white text-light-on-surface border border-light-outline-variant'
          }`}
        >
          ❄️ Đông Lạnh
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory('dried')}
          className={`mobile-cat-btn px-3 py-1.5 rounded-full font-label text-label-sm whitespace-nowrap cursor-pointer ${
            selectedCategory === 'dried'
              ? 'bg-light-primary text-white shadow-sm'
              : 'bg-white text-light-on-surface border border-light-outline-variant'
          }`}
        >
          🦑 Đồ Khô Biếu
        </button>
      </div>

      {/* Mobile Product Feed (Card Stream) */}
      <div id="mobileProductFeed" className="px-3 space-y-3">
        {products.map((product) => {
          const badgeBg =
            product.category === 'fresh'
              ? 'bg-fresh-green'
              : product.category === 'frozen'
              ? 'bg-sky-600'
              : 'bg-amber-600';
          const showDiscount =
            Boolean(product.hasDiscount) &&
            Boolean(product.originalPrice) &&
            (product.originalPrice ?? 0) > product.price;

          return (
            <article
              key={product.id}
              data-cat={product.category}
              itemScope
              itemType="https://schema.org/Product"
              className="mob-card bg-white rounded-lg border border-light-outline-variant p-3 shadow-sm flex gap-3"
            >
              <button
                type="button"
                onClick={() => onOpenProductDetail(product)}
                title={product.seoTitle || product.name}
                className="relative w-28 h-28 rounded-md bg-light-surface-container flex-shrink-0 overflow-hidden cursor-pointer text-left"
              >
                <ResilientImage
                  src={product.image}
                  alt={product.seoAlt || product.mobileName}
                  title={product.seoTitle || product.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded ${badgeBg} text-white font-label text-[10px] font-bold`}
                >
                  {product.mobileBadge}
                </span>
              </button>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <span
                    className={`text-[10px] font-label ${product.mobileKickerColor} font-semibold`}
                  >
                    {product.mobileKicker}
                  </span>
                  <h3
                    itemProp="name"
                    className="font-title text-title-sm font-bold text-light-primary truncate"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenProductDetail(product)}
                      className="hover:text-accent text-left truncate w-full cursor-pointer"
                    >
                      {product.mobileName}
                    </button>
                  </h3>
                  <p className="font-body text-[11px] text-light-on-surface/60 line-clamp-1">
                    {product.mobileDescription}
                  </p>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <span className="font-headline text-title-md font-bold text-accent tabular-nums">
                      {formatVND(product.price)}
                    </span>
                    {showDiscount && product.originalPrice && (
                      <span className="text-[10px] text-light-on-surface/40 line-through ml-1 tabular-nums">
                        {formatVND(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-[10px] text-light-on-surface/50 ml-0.5">
                      {product.mobileUnit}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product);
                      onOpenCart();
                    }}
                    className="px-3 py-1.5 rounded bg-accent hover:bg-accent-hover text-white font-label text-label-sm font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add_shopping_cart
                    </span>
                    <span>Mua</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Persistent Mobile Bottom Checkout Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-white border-t border-light-outline-variant px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Xem giỏ hàng dưới cùng"
            className="relative p-2.5 rounded-full bg-light-primary-container text-light-primary flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">
              shopping_bag
            </span>
            <span
              id="bottomCartCount"
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white font-bold text-[10px] flex items-center justify-center tabular-nums"
            >
              {totals.totalItems}
            </span>
          </button>
          <div>
            <span className="block text-[11px] text-light-on-surface/60 font-body">
              Tổng tạm tính:
            </span>
            <span
              id="bottomCartTotal"
              className="font-headline text-label-lg font-bold text-accent tabular-nums"
            >
              {formatVND(totals.grandTotal)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${STORE_PHONE}`}
            className="p-2.5 rounded-DEFAULT bg-fresh-green text-white flex items-center justify-center shadow"
            title={`Gọi hotline ${STORE_PHONE_DISPLAY}`}
          >
            <span className="material-symbols-outlined text-[20px]">call</span>
          </a>
          <button
            type="button"
            onClick={onOpenCart}
            className="py-2.5 px-4 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-sm font-bold shadow flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              shopping_cart_checkout
            </span>
            <span>Thanh Toán</span>
          </button>
        </div>
      </div>
    </div>
  );
};
