import React from 'react';
import {
  Product,
  ProductCategory,
  CartItem,
  REAL_VIDEOS,
  calculateCartTotals,
  formatProductPrice,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_ZALO_URL,
  STORE_FACEBOOK_URL,
  STORE_ADDRESS,
  STORE_LANDMARK,
  STORE_MAP_EMBED_URL,
  getProductRoutePath
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
    <div className="bg-light-surface-container font-body text-light-on-surface antialiased min-h-screen pb-24 max-w-md w-full mx-auto shadow-2xl border-x border-light-outline-variant relative overflow-x-clip">
      {/* Top bar to return to Full Storefront View when previewing on desktop */}
      {onSwitchToDesktopView && (
        <div className="bg-light-primary/95 text-white px-3 py-2 flex items-center justify-between gap-2 text-xs border-b border-white/15">
          <span className="font-label flex items-center gap-1 text-sky-200 truncate">
            <span className="material-symbols-outlined text-[15px] shrink-0">
              smartphone
            </span>
            <span className="truncate">Bio Link &amp; Di Động</span>
          </span>
          <button
            type="button"
            onClick={onSwitchToDesktopView}
            className="px-2.5 py-1.5 rounded bg-white/15 hover:bg-white/25 text-white font-label text-[11px] font-semibold cursor-pointer shrink-0 whitespace-nowrap"
          >
            Website Đầy Đủ →
          </button>
        </div>
      )}

      {/* Mobile Bio Top Profile Header */}
      <header className="bg-gradient-to-b from-light-primary via-[#0E355C] to-light-primary text-white pt-6 pb-5 px-3.5 rounded-b-2xl shadow-md relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[180px]">sailing</span>
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Profile Avatar / Brand Badge */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full border-4 border-white/25 bg-[#0A2540] shadow-lg overflow-hidden flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Logo Hải Sản Yến Hải"
                width={80}
                height={80}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-[1.16]"
              />
            </div>
            <span
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-fresh-green border-2 border-white flex items-center justify-center text-white"
              title="Vựa đang mở cửa"
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
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

          <p className="font-label text-[11px] text-sky-200 uppercase tracking-wide font-semibold mt-1 leading-snug max-w-xs">
            {STORE_ADDRESS} • Sỉ &amp; Lẻ Toàn Quốc
          </p>

          {/* Store Introduction */}
          <div className="mt-3 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 w-full max-w-sm text-center">
            <p className="font-body text-body-sm text-white/90 leading-snug">
              Chuyên sỉ &amp; lẻ hải sản biển Hoằng Tiến - Thanh Hóa: Mực ống tươi, Cá thu phấn khoanh giữa, Bạch tuộc, Tôm biển tươi, Nõn tôm hấp, Bề bề bóc nõn full trứng &amp; Cá khô rút xương. Bao ăn 1 đổi 1!
            </p>
          </div>

          {/* Quick Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-3 text-[11px] font-label text-white/85">
            <span className="whitespace-nowrap">Tươi từ ghe biển</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">Bao ăn 1 đổi 1</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums whitespace-nowrap">{STORE_PHONE_DISPLAY}</span>
          </div>

          {/* Multi-Channel Fast Contact Bar */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4">
            <a
              href={`tel:${STORE_PHONE}`}
              title={`Gọi Hotline Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
              className="min-h-[48px] py-2 px-1 rounded-lg bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-[11px] font-semibold flex flex-col items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-[19px]">call</span>
              <span className="mt-0.5 tabular-nums">{STORE_PHONE_DISPLAY}</span>
            </a>

            <a
              href={STORE_ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              title={`Nhắn Zalo Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
              className="min-h-[48px] py-2 px-1 rounded-lg bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-[11px] font-semibold flex flex-col items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-[19px]">chat</span>
              <span className="mt-0.5">Chat Zalo</span>
            </a>

            <a
              href={STORE_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook Hải Sản Yến Hải"
              className="min-h-[48px] py-2 px-1 rounded-lg bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label text-[11px] font-semibold flex flex-col items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-[19px]">
                thumb_up
              </span>
              <span className="mt-0.5">Facebook</span>
            </a>
          </div>
        </div>
      </header>

      {/* Sticky Mobile Category & Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-3 py-2.5 border-b border-light-outline-variant shadow-sm flex items-center gap-2">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById('mobileProductFeed')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 relative"
        >
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            id="mobileSearch"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              onSearchChange(val);
              if (val.trim() && selectedCategory !== 'all') {
                onSelectCategory('all');
              }
            }}
            placeholder="Tìm bề bề, nõn tôm, mực ống..."
            aria-label="Tìm kiếm hải sản trên di động"
            className="w-full pl-8 pr-8 py-1.5 text-body-sm rounded-full border border-light-outline-variant bg-light-surface-container focus:bg-white focus:outline-none focus:ring-1 focus:ring-light-primary"
          />
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-light-on-surface/40 text-[16px] pointer-events-none">
            search
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Xóa từ khóa tìm kiếm"
              className="absolute right-2 top-1.5 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-light-primary flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">close</span>
            </button>
          )}
        </form>

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
          Tất cả (9)
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
        {products.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-outline-variant p-6 text-center space-y-3">
            <span className="material-symbols-outlined text-[40px] text-light-outline">
              search_off
            </span>
            <div>
              <p className="font-title text-title-sm font-bold text-light-primary">
                Không tìm thấy món phù hợp với &quot;{searchQuery}&quot;
              </p>
              <p className="font-body text-xs text-light-on-surface/65 mt-1">
                Thử gõ không dấu (vd: muc ong, be be, non tom) hoặc xem tất cả hải sản.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onSelectCategory('all');
              }}
              className="px-4 py-2 rounded-DEFAULT bg-light-primary text-white font-label text-xs font-bold cursor-pointer"
            >
              Xem tất cả hải sản
            </button>
          </div>
        ) : (
          products.map((product) => {
          const badgeBg =
            product.category === 'fresh'
              ? 'bg-fresh-green'
              : product.category === 'frozen'
              ? 'bg-sky-600'
              : 'bg-amber-600';

          return (
            <article
              key={product.id}
              data-cat={product.category}
              itemScope
              itemType="https://schema.org/Product"
              className="mob-card bg-white rounded-lg border border-light-outline-variant p-3 shadow-sm flex gap-3"
            >
              <a
                href={getProductRoutePath(product)}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenProductDetail(product);
                }}
                title={product.seoTitle || product.name}
                className="relative w-28 h-28 rounded-md bg-light-surface-container flex-shrink-0 overflow-hidden cursor-pointer text-left block"
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
                {product.videoUrl && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white font-label text-[9px] font-bold">
                    ▶ Video
                  </span>
                )}
              </a>
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
                    <a
                      href={getProductRoutePath(product)}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenProductDetail(product);
                      }}
                      className="hover:text-accent text-left truncate block w-full"
                    >
                      {product.mobileName}
                    </a>
                  </h3>
                  <p className="font-body text-[11px] text-light-on-surface/60 line-clamp-1">
                    {product.mobileDescription}
                  </p>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <span className="font-headline text-title-sm font-bold text-accent">
                      {formatProductPrice(product)}
                    </span>
                    <span className="text-[10px] text-light-on-surface/50 ml-1">
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
                    <span>Đặt</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })
        )}
      </div>

      {/* Real Videos Strip on Mobile Bio */}
      <section className="px-3 mt-6 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-title-md font-bold text-light-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-accent text-[20px]">
              smart_display
            </span>
            <span>Video Quay Trực Tiếp Tại Vựa ({REAL_VIDEOS.length})</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {REAL_VIDEOS.map((vid) => (
            <div
              key={vid.id}
              className="bg-white rounded-lg border border-light-outline-variant overflow-hidden shadow-xs flex flex-col"
            >
              <div className="relative aspect-[9/12] bg-slate-950">
                <video
                  src={vid.videoUrl}
                  poster={vid.thumbnailUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-accent text-white font-label text-[10px] font-bold pointer-events-none">
                  {vid.badge}
                </span>
              </div>
              <div className="p-2">
                <h3 className="font-title text-xs font-bold text-light-primary line-clamp-2">
                  {vid.title}
                </h3>
                <span className="block text-[11px] font-bold text-accent mt-1">
                  Giá: Liên hệ
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Bio Embedded Google Map Section */}
      <section className="px-3 mt-6 space-y-2.5">
        <div className="bg-white rounded-lg border border-light-outline-variant overflow-hidden shadow-xs">
          <div className="p-3 border-b border-light-outline-variant">
            <span className="text-[10px] font-label font-bold uppercase tracking-wider text-fresh-green flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                location_on
              </span>
              Bản đồ vị trí vựa Hải Sản Yến Hải
            </span>
            <h2 className="font-headline text-title-sm font-bold text-light-primary mt-0.5">
              {STORE_LANDMARK}
            </h2>
            <p className="font-body text-xs text-light-on-surface/75 mt-0.5">
              Địa chỉ: <strong>{STORE_ADDRESS}</strong>
            </p>
          </div>
          <div className="w-full h-64 bg-slate-100">
            <iframe
              src={STORE_MAP_EMBED_URL}
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Bản đồ vị trí Trường Tiểu học Hoằng Trường - Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa"
              className="w-full h-full block"
            />
          </div>
        </div>
      </section>

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
              Báo giá ({totals.totalItems} món):
            </span>
            <span
              id="bottomCartTotal"
              className="font-headline text-label-lg font-bold text-accent"
            >
              Giá: Liên hệ
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
            <span>Nhận Báo Giá</span>
          </button>
        </div>
      </div>
    </div>
  );
};
