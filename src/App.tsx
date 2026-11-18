/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  PRODUCTS,
  INITIAL_CART,
  COMBO_PACKAGES,
  REAL_VIDEOS,
  HERO_BG_IMAGE,
  SEO_FAQS,
  CUSTOMER_REVIEWS,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_ZALO_URL,
  STORE_FACEBOOK_URL,
  STORE_ADDRESS,
  STORE_LANDMARK,
  STORE_MAP_EMBED_URL,
  STORE_GOOGLE_MAPS_DIRECT_URL,
  Product,
  ProductCategory,
  SortOption,
  CartItem,
  filterAndSortProducts,
  getSearchSuggestions,
  addCartItem,
  updateCartItemQty,
  calculateCartTotals,
  formatProductPrice,
  getProductRoutePath,
  extractSlugFromPathname,
  findProductBySlug
} from './lib/store-logic';
import { buildPageSeoMeta } from './lib/seo-meta';
import { ResilientImage } from './components/ResilientImage';
import { CartDrawer } from './components/CartDrawer';
import { OrderConsultModal } from './components/OrderConsultModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { MobileBioStoreView } from './components/MobileBioStoreView';

const QUICK_SEARCH_KEYWORDS = [
  'Mực ống',
  'Bề bề nõn',
  'Nõn tôm',
  'Cá thu',
  'Bạch tuộc',
  'Cá khô'
];

export interface AppProps {
  initialProducts?: Product[];
  initialPath?: string;
}

export default function App({
  initialProducts = PRODUCTS,
  initialPath = '/'
}: AppProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [currentPath, setCurrentPath] = useState<string>(initialPath || '/');
  const [viewMode, setViewMode] = useState<'storefront' | 'mobile-bio'>('storefront');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [consultModalTopic, setConsultModalTopic] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const activeSlug = useMemo(
    () => extractSlugFromPathname(currentPath),
    [currentPath]
  );
  const isProductRoute = activeSlug !== null;
  const activeProduct = useMemo(
    () => findProductBySlug(products, activeSlug),
    [products, activeSlug]
  );

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        category: selectedCategory,
        searchQuery,
        sortBy
      }),
    [products, selectedCategory, searchQuery, sortBy]
  );

  const allQueryMatches = useMemo(
    () =>
      filterAndSortProducts(products, {
        category: 'all',
        searchQuery,
        sortBy
      }),
    [products, searchQuery, sortBy]
  );

  const searchSuggestions = useMemo(
    () => getSearchSuggestions(products, searchQuery, 6),
    [products, searchQuery]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => mobileSearchInputRef.current?.focus(), 40);
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const meta = buildPageSeoMeta(products, currentPath);
    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', meta.description);
    }
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl && typeof window !== 'undefined') {
      canonicalEl.setAttribute(
        'href',
        `${window.location.origin}${meta.canonicalPath}`
      );
    }
  }, [products, currentPath]);

  const totals = useMemo(() => calculateCartTotals(cart), [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleAddProductToCart = (product: Product) => {
    setCart((prev) =>
      addCartItem(prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        img: product.image,
        unit: product.unit,
        prepNote: product.prepOptions[0]
      })
    );
    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleDirectBuyProduct = (product: Product) => {
    setCart((prev) =>
      addCartItem(prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        img: product.image,
        unit: product.unit,
        prepNote: product.prepOptions[0]
      })
    );
    setIsCartOpen(true);
  };

  const handleAddCustomItem = (item: {
    productId: number;
    name: string;
    price: number;
    img: string;
    unit: string;
    prepNote: string;
    qty: number;
  }) => {
    setCart((prev) => addCartItem(prev, item));
    showToast(`Đã thêm ${item.qty}x "${item.name}" (${item.prepNote}) vào giỏ!`);
  };

  const handleBuyCustomItem = (item: {
    productId: number;
    name: string;
    price: number;
    img: string;
    unit: string;
    prepNote: string;
    qty: number;
  }) => {
    setCart((prev) => addCartItem(prev, item));
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id: number, delta: number) => {
    setCart((prev) => updateCartItemQty(prev, id, delta));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateHome = (category?: ProductCategory, hash?: string) => {
    if (category !== undefined) {
      setSelectedCategory(category);
    }
    setViewMode('storefront');
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setCurrentPath('/');
    if (typeof window !== 'undefined') {
      const targetUrl = hash ? `/#${hash}` : '/';
      if (window.location.pathname !== '/' || window.location.hash !== (hash ? `#${hash}` : '')) {
        window.history.pushState({}, '', targetUrl);
      }
      if (hash) {
        setTimeout(() => scrollToSection(hash), 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const navigateToProduct = (product: Product) => {
    const targetPath = getProductRoutePath(product);
    setViewMode('storefront');
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setCurrentPath(targetPath);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        window.history.pushState({}, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && selectedCategory !== 'all') {
      setSelectedCategory('all');
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCategory('all');
    }
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    if (isProductRoute) {
      navigateHome(undefined, 'catalog');
    } else {
      scrollToSection('catalog');
    }
  };

  const handlePickSuggestion = (product: Product) => {
    navigateToProduct(product);
  };

  const handleSelectQuickKeyword = (keyword: string) => {
    setSearchQuery(keyword);
    setSelectedCategory('all');
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    if (isProductRoute) {
      navigateHome('all', 'catalog');
    } else {
      scrollToSection('catalog');
    }
  };

  // Top 3 items for Hero Quick Snapshot
  const heroSpotlightProducts = useMemo(() => {
    const picked = [
      products.find((p) => p.id === 4) || products[0],
      products.find((p) => p.id === 5) || products[1],
      products.find((p) => p.id === 1) || products[2]
    ].filter(Boolean) as Product[];
    return picked.slice(0, 3);
  }, [products]);

  if (viewMode === 'mobile-bio') {
    return (
      <div className="min-h-screen bg-slate-900 py-0 sm:py-6">
        <MobileBioStoreView
          products={filteredProducts}
          cart={cart}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSelectCategory={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onAddToCart={handleAddProductToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenProductDetail={(p) => navigateToProduct(p)}
          onSwitchToDesktopView={() => setViewMode('storefront')}
        />
        <CartDrawer
          isOpen={isCartOpen}
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={handleUpdateCartQty}
          onClearCart={() => setCart([])}
          onShowToast={showToast}
        />
      </div>
    );
  }

  return (
    <div
      id="top"
      className="bg-light-surface-container font-body text-light-on-surface antialiased min-h-screen flex flex-col overflow-x-clip"
    >
      {/* Top Announcement Bar */}
      <div className="bg-light-primary text-white text-xs sm:text-body-sm py-2 px-3 sm:px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 font-label text-[11px] sm:text-label-sm text-emerald-300 leading-snug">
              <span className="material-symbols-outlined text-[14px] text-emerald-400 shrink-0">
                location_on
              </span>
              <span className="sm:hidden">Vựa biển Hoằng Tiến, Hoằng Hóa, Thanh Hóa • Ghe về sáng sớm</span>
              <span className="hidden sm:inline">Vựa biển {STORE_ADDRESS} • Ghe về sáng sớm</span>
            </span>
            <span className="hidden lg:inline text-white/75 text-xs">
              · Đóng thùng xốp giữ lạnh giao tận nơi &amp; gửi xe toàn quốc
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 text-white/90 text-[11px] sm:text-label-sm font-label shrink-0">
            <span className="hidden md:flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-accent">
                verified
              </span>{' '}
              Bao ăn 1 đổi 1
            </span>
            <a
              href={STORE_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Trang Facebook chính thức Hải Sản Yến Hải"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1877F2]/35 hover:bg-[#1877F2]/55 border border-sky-400/30 text-sky-100 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[14px]">
                thumb_up
              </span>
              <span>Facebook Yến Hải</span>
            </a>
            <button
              type="button"
              onClick={() => setViewMode('mobile-bio')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-sky-100 transition-colors cursor-pointer whitespace-nowrap"
              title="Chuyển sang giao diện Bio & Cửa hàng Di động"
            >
              <span className="material-symbols-outlined text-[14px]">
                smartphone
              </span>
              <span>Xem bản Bio Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Store Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-light-outline-variant shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-6">
          {/* Brand Logo / Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 md:flex-initial">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-light-primary to-[#184878] text-white flex items-center justify-center shadow-md shrink-0">
              <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
                sailing
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateHome('all');
                }}
                title="Hải Sản Yến Hải — Vựa Hải Sản Tươi Sống, Đông Lạnh & Đồ Khô Xã Hoằng Tiến, Tỉnh Thanh Hóa"
                className="font-headline text-title-md sm:text-headline-md text-light-primary font-extrabold tracking-tight leading-none flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>YẾN HẢI</span>
                <span className="text-accent text-[10px] sm:text-body-sm font-semibold uppercase tracking-wider bg-rose-50 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                  SEAFOOD
                </span>
              </a>
              <p className="font-body text-[11px] sm:text-body-sm text-light-on-surface/65 mt-0.5 truncate max-w-full md:max-w-[230px] lg:max-w-[280px] xl:max-w-[340px]">
                {STORE_ADDRESS} • Tươi Sống • Đông Lạnh • Đồ Khô
              </p>
            </div>
          </div>

          {/* Live Search Bar (Desktop with Autocomplete Dropdown & Enter/Submit) */}
          <div
            ref={searchContainerRef}
            className="flex-1 min-w-[240px] lg:min-w-[300px] max-w-xl hidden md:block relative"
          >
            <form role="search" onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                id="searchInput"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Tìm mực ống, bề bề, nõn tôm, cá thu..."
                aria-label="Tìm kiếm hải sản tại Vựa Hải Sản Yến Hải"
                aria-expanded={isSearchFocused}
                aria-controls="searchSuggestionsDropdown"
                autoComplete="off"
                className="w-full pl-10 pr-28 py-2.5 rounded-DEFAULT border border-light-outline-variant bg-light-surface-container-high focus:bg-white focus:outline-none focus:ring-2 focus:ring-light-primary text-body-md transition-all"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-light-on-surface/45 text-[20px] pointer-events-none">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(true);
                  }}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-[84px] top-2.5 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-light-primary flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-light-primary hover:bg-light-primary/90 text-white rounded font-label text-label-sm transition-colors cursor-pointer"
              >
                Tìm kiếm
              </button>
            </form>

            {/* Instant Search Autocomplete Dropdown */}
            {isSearchFocused && (
              <div
                id="searchSuggestionsDropdown"
                className="absolute left-0 top-full mt-1.5 w-full min-w-[400px] lg:min-w-[440px] bg-white rounded-lg border border-light-outline-variant shadow-2xl z-50 overflow-hidden"
              >
                {searchQuery.trim() === '' ? (
                  <div className="p-3.5 space-y-2.5">
                    <p className="text-[11px] font-label uppercase tracking-wider text-light-on-surface/60 font-semibold">
                      Từ khóa hải sản được tìm nhiều
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_SEARCH_KEYWORDS.map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => handleSelectQuickKeyword(kw)}
                          className="px-2.5 py-1 rounded-full bg-light-surface-container hover:bg-light-primary hover:text-white text-light-primary text-xs font-label font-medium transition-colors cursor-pointer"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchSuggestions.length === 0 ? (
                  <div className="p-4 text-center space-y-2">
                    <p className="font-body text-sm text-light-on-surface/75">
                      Không tìm thấy sản phẩm khớp với <strong>&quot;{searchQuery}&quot;</strong>
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                      {QUICK_SEARCH_KEYWORDS.slice(0, 4).map((kw) => (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => handleSelectQuickKeyword(kw)}
                          className="px-2.5 py-1 rounded-full bg-light-surface-container hover:bg-light-primary hover:text-white text-light-primary text-xs font-label cursor-pointer"
                        >
                          Thử: {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="px-3.5 py-2 bg-light-surface-container border-b border-light-outline-variant flex items-center justify-between text-xs">
                      <span className="font-label font-semibold text-light-primary">
                        Gợi ý phù hợp ({allQueryMatches.length} món)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSearchSubmit()}
                        className="text-accent font-label font-bold hover:underline cursor-pointer"
                      >
                        Xem tất cả trong danh mục →
                      </button>
                    </div>
                    <ul className="divide-y divide-light-outline-variant max-h-80 overflow-y-auto">
                      {searchSuggestions.map((item) => {
                        const itemUrl = getProductRoutePath(item);
                        return (
                          <li key={item.id}>
                            <a
                              href={itemUrl}
                              onClick={(e) => {
                                e.preventDefault();
                                handlePickSuggestion(item);
                              }}
                              className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-sky-50/60 text-left transition-colors cursor-pointer"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                width={44}
                                height={44}
                                className="w-11 h-11 rounded object-cover border border-light-outline-variant shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-title text-sm font-bold text-light-primary block truncate">
                                  {item.name}
                                </span>
                                <span className="font-body text-xs text-light-on-surface/65 block truncate">
                                  {item.subtitle}
                                </span>
                              </div>
                              <span className="font-headline text-xs font-bold text-accent shrink-0 whitespace-nowrap">
                                {formatProductPrice(item)}
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Action Triggers: Mobile Search, Phone hotline, Zalo & Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Compact Mobile Search Toggle Icon */}
            <button
              id="mobileSearchToggleBtn"
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              aria-label="Mở thanh tìm kiếm hải sản"
              aria-expanded={isMobileSearchOpen}
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-DEFAULT border transition-colors shrink-0 cursor-pointer ${
                isMobileSearchOpen || searchQuery
                  ? 'bg-light-primary text-white border-light-primary'
                  : 'bg-light-surface-container hover:bg-light-outline-variant text-light-primary border-light-outline-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMobileSearchOpen ? 'close' : 'search'}
              </span>
            </button>

            {/* Compact Mobile Call Icon */}
            <a
              href={`tel:${STORE_PHONE}`}
              aria-label={`Gọi Hotline ${STORE_PHONE_DISPLAY}`}
              title={`Gọi Hotline tư vấn nhanh: ${STORE_PHONE_DISPLAY}`}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-DEFAULT bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[20px] text-fresh-green">
                call
              </span>
              <span className="hidden sm:inline lg:hidden ml-1.5 font-label text-label-sm font-bold tabular-nums">
                {STORE_PHONE_DISPLAY}
              </span>
            </a>

            {/* Desktop Hotline Call Direct */}
            <a
              href={`tel:${STORE_PHONE}`}
              className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-DEFAULT bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors"
              title={`Gọi Hotline tư vấn nhanh: ${STORE_PHONE_DISPLAY}`}
            >
              <div className="w-8 h-8 rounded-full bg-fresh-green text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[18px]">
                  call
                </span>
              </div>
              <div className="text-left">
                <span className="block text-[11px] font-label text-emerald-700 uppercase font-semibold leading-tight">
                  Hotline / Zalo
                </span>
                <span className="font-headline text-title-sm font-bold text-emerald-950 tabular-nums leading-tight">
                  {STORE_PHONE_DISPLAY}
                </span>
              </div>
            </a>

            {/* Direct Zalo Chat Action */}
            <a
              href={STORE_ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              title={`Nhắn tin Zalo Hải Sản Yến Hải: ${STORE_PHONE_DISPLAY}`}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-DEFAULT bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-label text-label-md transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-ocean-blue text-[20px]">
                chat
              </span>
              <span>Chat Zalo</span>
            </a>

            {/* Cart Button With Badge Trigger */}
            <button
              id="cartOpenBtn"
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Mở giỏ hàng (${totals.totalItems} sản phẩm)`}
              className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-10 sm:h-auto sm:py-2.5 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-sm sm:text-label-md shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[20px]">
                shopping_cart
              </span>
              <span className="hidden sm:inline">Giỏ hàng</span>
              <span
                id="cartCountBadge"
                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-accent font-bold text-label-sm tabular-nums"
              >
                {totals.totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Category Quick Bar (Desktop inside sticky header) */}
        <nav
          aria-label="Danh mục hải sản chính"
          className="hidden md:block border-t border-light-outline-variant bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-1.5 lg:gap-2.5 overflow-x-auto py-2 text-xs lg:text-label-md font-label no-scrollbar">
            <button
              type="button"
              onClick={() =>
                isProductRoute
                  ? navigateHome('all', 'catalog')
                  : setSelectedCategory('all')
              }
              className={`cat-tab px-2.5 lg:px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                !isProductRoute && selectedCategory === 'all'
                  ? 'bg-light-primary text-white'
                  : 'hover:bg-light-surface-container text-light-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                grid_view
              </span>
              <span>Tất cả ({products.length})</span>
            </button>
            <button
              type="button"
              onClick={() =>
                isProductRoute
                  ? navigateHome('fresh', 'catalog')
                  : setSelectedCategory('fresh')
              }
              className={`cat-tab px-2.5 lg:px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                !isProductRoute && selectedCategory === 'fresh'
                  ? 'bg-light-primary text-white'
                  : 'hover:bg-light-surface-container text-light-on-surface'
              }`}
            >
              <span className="text-base">🦐</span>
              <span>Tươi Trong Ngày</span>
            </button>
            <button
              type="button"
              onClick={() =>
                isProductRoute
                  ? navigateHome('frozen', 'catalog')
                  : setSelectedCategory('frozen')
              }
              className={`cat-tab px-2.5 lg:px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                !isProductRoute && selectedCategory === 'frozen'
                  ? 'bg-light-primary text-white'
                  : 'hover:bg-light-surface-container text-light-on-surface'
              }`}
            >
              <span className="text-base">❄️</span>
              <span>Bề Bề, Nõn Tôm &amp; Đông VIP</span>
            </button>
            <button
              type="button"
              onClick={() =>
                isProductRoute
                  ? navigateHome('dried', 'catalog')
                  : setSelectedCategory('dried')
              }
              className={`cat-tab px-2.5 lg:px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                !isProductRoute && selectedCategory === 'dried'
                  ? 'bg-light-primary text-white'
                  : 'hover:bg-light-surface-container text-light-on-surface'
              }`}
            >
              <span className="text-base">🦑</span>
              <span>Hải Sản Khô</span>
            </button>
            <a
              href="/#videoSection"
              onClick={(e) => {
                if (isProductRoute) {
                  e.preventDefault();
                  navigateHome(undefined, 'videoSection');
                }
              }}
              className="cat-tab px-2.5 lg:px-3 py-1.5 rounded-full hover:bg-rose-50 flex items-center gap-1.5 whitespace-nowrap text-accent font-semibold"
            >
              <span className="material-symbols-outlined text-[17px]">
                smart_display
              </span>
              <span>Video Tại Vựa ({REAL_VIDEOS.length})</span>
            </a>
            <a
              href="/#mapSection"
              onClick={(e) => {
                if (isProductRoute) {
                  e.preventDefault();
                  navigateHome(undefined, 'mapSection');
                }
              }}
              className="cat-tab px-2.5 lg:px-3 py-1.5 rounded-full hover:bg-emerald-50 flex items-center gap-1.5 whitespace-nowrap text-emerald-800 font-semibold"
            >
              <span className="material-symbols-outlined text-[17px]">
                location_on
              </span>
              <span>Bản Đồ Vị Trí</span>
            </a>
            <a
              href="/#faqSection"
              onClick={(e) => {
                if (isProductRoute) {
                  e.preventDefault();
                  navigateHome(undefined, 'faqSection');
                }
              }}
              className="cat-tab px-2.5 lg:px-3 py-1.5 rounded-full hover:bg-light-surface-container flex items-center gap-1.5 whitespace-nowrap ml-auto text-ocean-blue font-semibold"
            >
              <span className="material-symbols-outlined text-[17px]">
                verified_user
              </span>
              <span>Cam Kết &amp; FAQ</span>
            </a>
          </div>
        </nav>

        {/* Expandable Mobile Header Search Bar & Live Results */}
        {isMobileSearchOpen && (
          <div className="md:hidden border-t border-light-outline-variant bg-white px-3 py-3 space-y-2.5 shadow-lg">
            <form role="search" onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  id="mobileHeaderSearchInput"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Tìm mực ống, bề bề, nõn tôm..."
                  aria-label="Tìm kiếm hải sản trên di động"
                  autoComplete="off"
                  className="w-full pl-9 pr-8 py-2 rounded-DEFAULT border border-light-outline-variant bg-light-surface-container text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-light-on-surface/45 text-[18px] pointer-events-none">
                  search
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="absolute right-2 top-2 w-5 h-5 rounded-full bg-slate-200 text-light-primary flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-DEFAULT bg-light-primary text-white font-label text-xs font-bold shrink-0 cursor-pointer"
              >
                Tìm
              </button>
            </form>

            {searchQuery.trim() === '' ? (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_SEARCH_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleSelectQuickKeyword(kw)}
                    className="px-2.5 py-1 rounded-full bg-light-surface-container text-light-primary text-xs font-label whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            ) : searchSuggestions.length === 0 ? (
              <p className="text-xs text-light-on-surface/70 py-1">
                Không có món nào khớp với &quot;{searchQuery}&quot;. Thử: Mực ống, Bề bề, Cá thu...
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-light-outline-variant border border-light-outline-variant rounded-md">
                {searchSuggestions.map((item) => (
                  <a
                    key={item.id}
                    href={getProductRoutePath(item)}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePickSuggestion(item);
                    }}
                    className="w-full px-2.5 py-2 flex items-center gap-2.5 text-left hover:bg-sky-50 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      width={38}
                      height={38}
                      className="w-9 h-9 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-title text-xs font-bold text-light-primary block truncate">
                        {item.mobileName || item.name}
                      </span>
                      <span className="text-[11px] text-accent font-bold">
                        {formatProductPrice(item)}
                      </span>
                    </div>
                    <span className="text-[11px] font-label text-ocean-blue font-semibold shrink-0">
                      Xem →
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Category Quick Strip (non-sticky so screen stays uncluttered on mobile) */}
      <nav
        aria-label="Danh mục hải sản trên di động"
        className="md:hidden bg-white border-b border-light-outline-variant w-full overflow-hidden"
      >
        <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-label">
          <button
            type="button"
            onClick={() =>
              isProductRoute
                ? navigateHome('all', 'catalog')
                : (setSelectedCategory('all'), scrollToSection('catalog'))
            }
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              !isProductRoute && selectedCategory === 'all'
                ? 'bg-light-primary text-white font-bold'
                : 'bg-light-surface-container text-light-on-surface'
            }`}
          >
            Tất cả ({products.length})
          </button>
          <button
            type="button"
            onClick={() =>
              isProductRoute
                ? navigateHome('fresh', 'catalog')
                : (setSelectedCategory('fresh'), scrollToSection('catalog'))
            }
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              !isProductRoute && selectedCategory === 'fresh'
                ? 'bg-light-primary text-white font-bold'
                : 'bg-light-surface-container text-light-on-surface'
            }`}
          >
            🦐 Tươi Sống
          </button>
          <button
            type="button"
            onClick={() =>
              isProductRoute
                ? navigateHome('frozen', 'catalog')
                : (setSelectedCategory('frozen'), scrollToSection('catalog'))
            }
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              !isProductRoute && selectedCategory === 'frozen'
                ? 'bg-light-primary text-white font-bold'
                : 'bg-light-surface-container text-light-on-surface'
            }`}
          >
            ❄️ Bề Bề &amp; Nõn Tôm
          </button>
          <button
            type="button"
            onClick={() =>
              isProductRoute
                ? navigateHome('dried', 'catalog')
                : (setSelectedCategory('dried'), scrollToSection('catalog'))
            }
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              !isProductRoute && selectedCategory === 'dried'
                ? 'bg-light-primary text-white font-bold'
                : 'bg-light-surface-container text-light-on-surface'
            }`}
          >
            🦑 Đồ Khô
          </button>
          <a
            href="/#videoSection"
            onClick={(e) => {
              if (isProductRoute) {
                e.preventDefault();
                navigateHome(undefined, 'videoSection');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-50 text-accent font-semibold whitespace-nowrap shrink-0"
          >
            ▶ Video ({REAL_VIDEOS.length})
          </a>
          <a
            href="/#mapSection"
            onClick={(e) => {
              if (isProductRoute) {
                e.preventDefault();
                navigateHome(undefined, 'mapSection');
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 font-semibold whitespace-nowrap shrink-0"
          >
            📍 Bản Đồ
          </a>
        </div>
      </nav>

      {isProductRoute ? (
        activeProduct ? (
          <ProductDetailPage
            product={activeProduct}
            allProducts={products}
            onNavigateHome={navigateHome}
            onNavigateProduct={navigateToProduct}
            onAddToCart={handleAddCustomItem}
            onBuyNow={handleBuyCustomItem}
            onOpenConsultModal={(topic) => setConsultModalTopic(topic)}
          />
        ) : (
          <main className="max-w-4xl mx-auto px-4 py-14 text-center flex-1 space-y-4">
            <span className="material-symbols-outlined text-[56px] text-light-outline">
              inventory_2
            </span>
            <h1 className="font-headline text-headline-md sm:text-headline-lg font-bold text-light-primary">
              Không tìm thấy sản phẩm hải sản này
            </h1>
            <p className="font-body text-body-md text-light-on-surface/75 max-w-lg mx-auto">
              Đường dẫn sản phẩm có thể đã thay đổi hoặc mặt hàng đang cập nhật. Vui lòng xem danh mục hải sản mới nhất tại Vựa Yến Hải.
            </p>
            <div>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateHome('all');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-md font-bold shadow"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Quay về trang chủ Hải Sản Yến Hải</span>
              </a>
            </div>
          </main>
        )
      ) : (
        <>
      {/* Hero Section: Seafood Quality Guarantee & Value Prop */}
      <section
        aria-label="Giới thiệu Vựa Hải Sản Yến Hải Hoằng Tiến Thanh Hóa"
        className="relative bg-gradient-to-r from-light-primary via-[#0E355C] to-light-primary text-white py-7 sm:py-12 lg:py-16 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <ResilientImage
            src={HERO_BG_IMAGE}
            alt="Hình ảnh thực tế hải sản tươi sống tại Vựa Hải Sản Yến Hải Xã Hoằng Tiến Tỉnh Thanh Hóa"
            title="Vựa Hải Sản Yến Hải — Xã Hoằng Tiến, Tỉnh Thanh Hóa"
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 min-w-0">
            <div className="inline-flex items-start sm:items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-label text-xs sm:text-label-sm max-w-full">
              <span className="material-symbols-outlined text-[16px] text-accent shrink-0 mt-0.5 sm:mt-0">
                location_on
              </span>
              <span className="leading-snug">
                Vựa gốc biển {STORE_ADDRESS} • Sỉ &amp; lẻ toàn quốc
              </span>
            </div>
            <h1 className="font-headline text-[26px] leading-[34px] sm:text-display-lg text-balance font-extrabold tracking-tight text-white">
              Hải Sản Yến Hải: <br />
              <span className="text-accent underline decoration-white/30">
                Tươi Sống
              </span>{' '}
              • <span className="text-sky-300">Đông Lạnh</span> •{' '}
              <span className="text-amber-300">Đồ Khô</span>
            </h1>
            <p className="font-body text-body-md sm:text-body-lg text-white/90 max-w-2xl text-pretty leading-relaxed">
              Thu mua trực tiếp từ ghe thuyền vùng biển <strong>{STORE_ADDRESS}</strong>: Chuyên Mực Ống Biển Tươi, Cá Thu Phấn Cắt Khoanh Giữa, Bạch Tuộc Tươi, Tôm He / Tôm Bộp Biển, Nõn Tôm Hấp Bóc Sẵn, Bề Bề (Tôm Tít) Bóc Nõn Full Trứng và Cá Khô Rút Xương Phơi Nắng Tự Nhiên. Cam kết bao tươi ngon 1 đổi 1 tận nơi!
            </p>

            {/* Multi-Channel CTA Row */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('catalog')}
                className="w-full sm:w-auto min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  shopping_bag
                </span>
                <span>Xem Hải Sản &amp; Đặt Ngay</span>
              </button>
              <div className="grid grid-cols-2 sm:flex gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('videoSection')}
                  className="min-h-[44px] px-3 sm:px-5 py-2.5 sm:py-3 rounded-DEFAULT bg-white text-light-primary hover:bg-light-surface-container font-label text-xs sm:text-label-lg shadow flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-accent text-[18px] sm:text-[20px] shrink-0">
                    smart_display
                  </span>
                  <span className="truncate">Xem {REAL_VIDEOS.length} Video</span>
                </button>
                <a
                  href={`tel:${STORE_PHONE}`}
                  title={`Gọi trực tiếp Hotline Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
                  className="min-h-[44px] px-3 sm:px-5 py-2.5 sm:py-3 rounded-DEFAULT bg-white/10 hover:bg-white/20 border border-white/30 text-white font-label text-xs sm:text-label-lg backdrop-blur-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-emerald-400 text-[18px] sm:text-[20px] shrink-0">
                    call
                  </span>
                  <span className="tabular-nums truncate">{STORE_PHONE_DISPLAY}</span>
                </a>
              </div>
            </div>

            {/* Guarantee Triad Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <div className="bg-white/10 backdrop-blur-xs p-2.5 sm:p-3 rounded-md border border-white/15">
                <span className="font-label text-label-sm text-emerald-400 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px] shrink-0">
                    check_circle
                  </span>{' '}
                  Bao ăn bao tươi
                </span>
                <p className="font-body text-body-sm text-white/80 mt-0.5 sm:mt-1">
                  1 đổi 1 tận nơi nếu không đúng chất lượng
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2.5 sm:p-3 rounded-md border border-white/15">
                <span className="font-label text-label-sm text-sky-300 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px] shrink-0">
                    ac_unit
                  </span>{' '}
                  Bề bề &amp; Nõn tôm VIP
                </span>
                <p className="font-body text-body-sm text-white/80 mt-0.5 sm:mt-1">
                  Hấp bóc thủ công trong ngày, đóng khay giữ ngọt
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2.5 sm:p-3 rounded-md border border-white/15">
                <span className="font-label text-label-sm text-amber-300 flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px] shrink-0">
                    videocam
                  </span>{' '}
                  Quay video thực tế
                </span>
                <p className="font-body text-body-sm text-white/80 mt-0.5 sm:mt-1">
                  Gửi video khay hàng thực tế &amp; báo giá qua Zalo
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card: Quick Order Snapshot */}
          <div className="lg:col-span-5 min-w-0">
            <div className="bg-white text-light-on-surface p-4 sm:p-6 rounded-lg shadow-2xl border border-white/30 relative">
              <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-light-outline-variant">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-fresh-green shrink-0"></span>
                  <h2 className="font-headline text-title-sm sm:text-title-md font-bold text-light-primary truncate">
                    Mặt Hàng Mới Lên Tại Vựa Hôm Nay
                  </h2>
                </div>
                <span className="text-xs sm:text-body-sm text-light-on-surface/55 font-body shrink-0">
                  Ghe về sáng nay
                </span>
              </div>

              <div className="divide-y divide-light-outline-variant my-3 sm:my-4">
                {heroSpotlightProducts.map((item) => (
                  <a
                    key={item.id}
                    href={getProductRoutePath(item)}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToProduct(item);
                    }}
                    title={item.seoTitle || item.name}
                    className="py-2.5 flex items-center justify-between gap-2.5 sm:gap-3 hover:bg-sky-50/50 rounded px-1 -mx-1 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img
                        src={item.image}
                        alt={item.seoAlt || item.name}
                        title={item.seoTitle || item.name}
                        width={44}
                        height={44}
                        loading="eager"
                        decoding="async"
                        className="w-11 h-11 rounded object-cover border border-light-outline-variant shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-label text-xs sm:text-label-md text-light-primary font-bold block truncate hover:text-accent">
                          {item.name}
                        </span>
                        <span className="block text-[11px] sm:text-body-sm text-light-on-surface/60 truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-headline text-xs sm:text-title-sm font-bold text-accent block whitespace-nowrap">
                        {formatProductPrice(item)}
                      </span>
                      <span className="block text-[11px] sm:text-body-sm text-light-on-surface/50 whitespace-nowrap">
                        {item.mobileUnit || item.unit}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="bg-light-primary-container p-3 sm:p-3.5 rounded-md flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-light-primary text-[18px] shrink-0">
                    call
                  </span>
                  <span className="font-label text-xs sm:text-label-sm text-light-primary font-semibold truncate">
                    Báo giá sỉ &amp; lẻ: {STORE_PHONE_DISPLAY}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('catalog')}
                  className="text-accent font-label text-xs sm:text-label-sm font-bold hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Xem tất cả →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Product Catalog Grid Section */}
      <main
        id="catalog"
        className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full flex-1"
      >
        {/* Semantic SEO Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="mb-5 text-body-sm text-light-on-surface/65 flex flex-wrap items-center gap-1.5"
        >
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center gap-1"
          >
            <a
              itemProp="item"
              href="#top"
              title="Trang chủ Hải Sản Yến Hải"
              className="hover:text-light-primary font-semibold"
            >
              <span itemProp="name">Trang chủ Hải Sản Yến Hải</span>
            </a>
            <meta itemProp="position" content="1" />
          </span>
          <span>/</span>
          <span
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center gap-1"
          >
            <a
              itemProp="item"
              href="#catalog"
              title="Hải Sản Biển Hoằng Tiến - Tỉnh Thanh Hóa"
              className="text-light-primary font-bold"
            >
              <span itemProp="name">
                Hải Sản Biển {STORE_ADDRESS} ({products.length} mặt hàng)
              </span>
            </a>
            <meta itemProp="position" content="2" />
          </span>
        </nav>

        {/* Mobile Search Input (visible on small screens) */}
        <div className="md:hidden mb-5">
          <form role="search" onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                id="catalogMobileSearch"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Tìm bề bề, nõn tôm, mực ống, cá thu..."
                aria-label="Tìm kiếm hải sản trên di động"
                className="w-full pl-9 pr-8 py-2.5 rounded-DEFAULT border border-light-outline-variant bg-white text-body-md focus:outline-none focus:ring-2 focus:ring-light-primary"
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-light-on-surface/45 text-[18px] pointer-events-none">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2.5 top-2.5 w-6 h-6 rounded-full bg-slate-200 text-light-primary flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-DEFAULT bg-light-primary text-white font-label text-xs font-bold shrink-0 cursor-pointer"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Section Title & Sort Select */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-headline text-headline-lg-mobile sm:text-headline-lg text-light-primary font-bold">
              Danh Mục Hải Sản Thực Tế Tại Vựa ({products.length} Món)
            </h2>
            <p className="font-body text-body-md text-light-on-surface/70">
              Hình ảnh &amp; video quay thực tế tại vựa Hải Sản Yến Hải ({STORE_ADDRESS}) — Chọn món nhận báo giá nhanh qua SĐT/Zalo{' '}
              <a
                href={`tel:${STORE_PHONE}`}
                className="font-bold text-light-primary underline"
              >
                {STORE_PHONE_DISPLAY}
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="sortSelect"
              className="text-body-sm text-light-on-surface/60 font-body"
            >
              Sắp xếp:
            </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="py-1.5 px-3 rounded-DEFAULT border border-light-outline-variant bg-white text-body-sm font-label focus:ring-1 focus:ring-light-primary"
            >
              <option value="featured">Nổi bật nhất</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* The 3 Pillar Keyword Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            type="button"
            onClick={() =>
              setSelectedCategory(selectedCategory === 'fresh' ? 'all' : 'fresh')
            }
            className={`p-4 rounded-md text-left transition-all flex items-start gap-3 cursor-pointer border ${
              selectedCategory === 'fresh'
                ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <span className="text-2xl">🦐</span>
            <div>
              <h3 className="font-label text-label-md font-bold text-emerald-950">
                Nhóm Hải Sản Tươi Trong Ngày
              </h3>
              <p className="font-body text-body-sm text-emerald-800 mt-0.5">
                Gồm: <strong>Mực ống biển tươi</strong>,{' '}
                <strong>Cá thu phấn cắt khoanh giữa</strong>,{' '}
                <strong>Bạch tuộc tươi</strong>, <strong>Tôm biển tươi</strong>,{' '}
                <strong>Bề bề nõn mới hấp</strong>.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedCategory(
                selectedCategory === 'frozen' ? 'all' : 'frozen'
              )
            }
            className={`p-4 rounded-md text-left transition-all flex items-start gap-3 cursor-pointer border ${
              selectedCategory === 'frozen'
                ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-500/30'
                : 'bg-sky-50/70 border-sky-200 hover:bg-sky-50'
            }`}
          >
            <span className="text-2xl">❄️</span>
            <div>
              <h3 className="font-label text-label-md font-bold text-sky-950">
                Nhóm Bề Bề Nõn, Nõn Tôm &amp; Cấp Đông Sâu
              </h3>
              <p className="font-body text-body-sm text-sky-800 mt-0.5">
                Gồm: <strong>Bề bề bóc nõn Full Trứng</strong>,{' '}
                <strong>Nõn tôm biển hấp bóc sẵn</strong>,{' '}
                <strong>Bề bề nõn đóng khay VIP 500g</strong>.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedCategory(selectedCategory === 'dried' ? 'all' : 'dried')
            }
            className={`p-4 rounded-md text-left transition-all flex items-start gap-3 cursor-pointer border ${
              selectedCategory === 'dried'
                ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-500/30'
                : 'bg-amber-50/70 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <span className="text-2xl">🦑</span>
            <div>
              <h3 className="font-label text-label-md font-bold text-amber-950">
                Nhóm Hải Sản Khô Phơi Nắng
              </h3>
              <p className="font-body text-body-sm text-amber-800 mt-0.5">
                Gồm: <strong>Cá khô rút xương phơi nắng tự nhiên</strong>,{' '}
                <strong>hút chân không lịch sự</strong>, không chất bảo quản làm quà biếu.
              </p>
            </div>
          </button>
        </div>

        {/* Active Search Feedback Bar */}
        {searchQuery.trim() && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-sky-50 border border-sky-200 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-light-primary">
              <span className="material-symbols-outlined text-ocean-blue text-[20px]">
                manage_search
              </span>
              <span>
                Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm cho từ khóa{' '}
                <strong>&quot;{searchQuery}&quot;</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white border border-sky-300 text-light-primary hover:bg-sky-100 font-label text-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              <span>Xóa tìm kiếm</span>
            </button>
          </div>
        )}

        {/* Empty filter state */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-light-outline-variant p-8 sm:p-12 text-center my-6">
            <span className="material-symbols-outlined text-[48px] text-light-outline">
              search_off
            </span>
            <h3 className="font-headline text-title-lg font-bold text-light-primary mt-2">
              Không tìm thấy mặt hàng phù hợp với &quot;{searchQuery}&quot;
            </h3>
            <p className="font-body text-body-md text-light-on-surface/65 mt-1 max-w-md mx-auto">
              Thử gõ từ khóa khác (có dấu hoặc không dấu như &quot;muc ong&quot;, &quot;be be&quot;, &quot;ca thu&quot;) hoặc chọn nhanh bên dưới.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {QUICK_SEARCH_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleSelectQuickKeyword(kw)}
                  className="px-3 py-1.5 rounded-full bg-light-surface-container hover:bg-light-primary hover:text-white text-light-primary font-label text-xs font-semibold cursor-pointer transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {selectedCategory !== 'all' && allQueryMatches.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="px-5 py-2.5 rounded-DEFAULT bg-accent text-white font-label text-label-md font-bold cursor-pointer"
                >
                  Tìm trong tất cả danh mục ({allQueryMatches.length} món)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 rounded-DEFAULT bg-light-primary text-white font-label text-label-md cursor-pointer"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        ) : (
          /* Product Grid */
          <div
            id="productGrid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, idx) => {
              const leftBadgeBg =
                product.category === 'fresh'
                  ? 'bg-fresh-green'
                  : product.category === 'frozen'
                  ? 'bg-sky-600'
                  : 'bg-amber-600';

              const rightBadgeClasses =
                product.badgeRightStyle === 'coral'
                  ? 'bg-white/95 text-accent'
                  : product.badgeRightStyle === 'emerald'
                  ? 'bg-emerald-50 text-emerald-800'
                  : product.badgeRightStyle === 'sky'
                  ? 'bg-sky-50 text-sky-800'
                  : 'bg-amber-50 text-amber-900';

              return (
                <article
                  key={product.id}
                  id={product.slug || `product-${product.id}`}
                  data-category={product.category}
                  itemScope
                  itemType="https://schema.org/Product"
                  className="product-card bg-white rounded-md border border-light-outline-variant overflow-hidden hover:shadow-lg transition-all duration-150 flex flex-col group"
                >
                  <meta itemProp="sku" content={product.sku || `YH-SP-0${product.id}`} />
                  <div
                    itemProp="brand"
                    itemScope
                    itemType="https://schema.org/Brand"
                  >
                    <meta itemProp="name" content="Hải Sản Yến Hải" />
                  </div>

                  <figure className="relative w-full h-56 overflow-hidden bg-light-surface-container m-0">
                    <a
                      href={getProductRoutePath(product)}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToProduct(product);
                      }}
                      title={product.seoTitle || product.name}
                      className="block w-full h-full"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.seoAlt || product.name}
                        title={product.seoTitle || product.name}
                        itemProp="image"
                        width={600}
                        height={450}
                        loading={idx < 4 ? 'eager' : 'lazy'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </a>
                    <figcaption className="sr-only">
                      {product.seoAlt || `${product.name} - ${formatProductPrice(product)} ${product.unit} tại Hải Sản Yến Hải (${STORE_ADDRESS})`}
                    </figcaption>

                    <span
                      className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full ${leftBadgeBg} text-white font-label text-[11px] font-semibold shadow-xs flex items-center gap-1 max-w-[52%] truncate pointer-events-none`}
                    >
                      {product.badgeLeftIcon ? (
                        <span className="material-symbols-outlined text-[13px] shrink-0">
                          {product.badgeLeftIcon}
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                      )}
                      <span className="truncate">{product.badgeLeft}</span>
                    </span>
                    <span
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded ${rightBadgeClasses} font-label text-[11px] font-bold shadow-xs max-w-[44%] truncate pointer-events-none`}
                    >
                      {product.badgeRight}
                    </span>

                    {product.videoUrl && (
                      <a
                        href={getProductRoutePath(product)}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToProduct(product);
                        }}
                        title={`Xem video quay thực tế ${product.name}`}
                        className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-accent/95 hover:bg-accent text-white font-label text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          play_circle
                        </span>
                        <span>Video thực tế</span>
                      </a>
                    )}

                    <a
                      href={getProductRoutePath(product)}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToProduct(product);
                      }}
                      title={`Xem trang chi tiết và chọn quy cách ${product.name}`}
                      className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded bg-light-primary/85 hover:bg-light-primary text-white font-label text-[11px] flex items-center gap-1 backdrop-blur-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        visibility
                      </span>
                      <span>Chi tiết &amp; Quy cách</span>
                    </a>
                  </figure>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-body-sm text-light-on-surface/60 mb-1">
                        <span className="truncate pr-1">{product.subtitle}</span>
                        <span
                          itemProp="aggregateRating"
                          itemScope
                          itemType="https://schema.org/AggregateRating"
                          className="text-gold-star font-semibold flex items-center gap-0.5 text-xs tabular-nums shrink-0"
                        >
                          <span
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>{' '}
                          <span itemProp="ratingValue">{product.rating.toFixed(1)}</span> (
                          <span itemProp="reviewCount">{product.reviewsCount}</span>)
                        </span>
                      </div>
                      <h3
                        itemProp="name"
                        className="font-title text-title-md text-light-primary font-bold group-hover:text-accent transition-colors"
                      >
                        <a
                          href={getProductRoutePath(product)}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToProduct(product);
                          }}
                          title={product.seoTitle || product.name}
                          className="block text-left hover:text-accent"
                        >
                          {product.name}
                        </a>
                      </h3>
                      <p
                        itemProp="description"
                        className="font-body text-body-sm text-light-on-surface/70 mt-1 line-clamp-2"
                      >
                        {product.description}
                      </p>
                      {product.bestDishes && product.bestDishes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.bestDishes.slice(0, 2).map((dish) => (
                            <span
                              key={dish}
                              className="px-2 py-0.5 rounded bg-light-surface-container text-[11px] font-label text-light-primary/80"
                            >
                              {dish}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                      className="mt-4 pt-3 border-t border-light-outline-variant"
                    >
                      <meta itemProp="priceCurrency" content="VND" />
                      <meta itemProp="price" content="0" />
                      <link
                        itemProp="availability"
                        href="https://schema.org/InStock"
                      />
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-accent font-headline text-title-md font-bold">
                            {formatProductPrice(product)}
                          </span>
                        </div>
                        <span className="text-body-sm text-light-on-surface/50">
                          {product.unit}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddProductToCart(product)}
                          title={`Thêm ${product.name} vào giỏ hàng`}
                          className="w-full py-2 px-2 rounded-DEFAULT bg-light-primary-container text-light-primary font-label text-label-md hover:bg-light-primary hover:text-white transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add_shopping_cart
                          </span>
                          <span>Thêm giỏ</span>
                        </button>
                        <a
                          href={getProductRoutePath(product)}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToProduct(product);
                          }}
                          title={`Xem trang chi tiết ${product.name}`}
                          className="w-full py-2 px-2 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-md transition-colors duration-150 flex items-center justify-center gap-1"
                        >
                          <span>Xem chi tiết</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Custom Consultation & Wholesale Quote Card */}
            <article className="bg-gradient-to-br from-light-primary via-[#0E355C] to-light-primary text-white rounded-md p-6 flex flex-col justify-between shadow-md">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-label text-label-sm inline-block mb-3">
                  Vựa biển {STORE_ADDRESS}
                </span>
                <h3 className="font-headline text-title-lg font-bold text-white mb-2">
                  Cần Hải Sản Gì, Yến Hải Cũng Có!
                </h3>
                <p className="font-body text-body-sm text-white/80 leading-relaxed">
                  Nhận cung cấp sỉ &amp; lẻ Bề bề nõn trứng, Nõn tôm biển, Tôm bộp tươi, Mực ống, Cá thu khoanh, Bạch tuộc, Cá khô cho nhà hàng, quán ăn, gia đình và khách du lịch biển Hải Tiến - Hoằng Tiến với giá tận gốc.
                </p>

                <ul className="mt-4 space-y-2 text-body-sm text-white/90">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                      check_circle
                    </span>
                    <span>Quay video trực tiếp khay hàng gửi qua Zalo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                      check_circle
                    </span>
                    <span>Hỗ trợ làm sạch, đóng khay, hút chân không</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                      check_circle
                    </span>
                    <span>Bao ăn 1 đổi 1 nếu không đúng chất lượng</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 space-y-2">
                <a
                  href={`tel:${STORE_PHONE}`}
                  title={`Gọi Hotline Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
                  className="w-full py-2.5 px-3 rounded-DEFAULT bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-label-md flex items-center justify-center gap-2 shadow"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    call
                  </span>
                  <span>Gọi Hotline: {STORE_PHONE_DISPLAY}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setConsultModalTopic('Báo giá sỉ & lẻ Yến Hải')}
                  className="w-full py-2 px-3 rounded-DEFAULT bg-white/10 hover:bg-white/20 border border-white/30 text-white font-label text-label-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chat
                  </span>
                  <span>Nhắn Zalo / Facebook</span>
                </button>
              </div>
            </article>
          </div>
        )}

        {/* Real Fishery Videos Showcase Section (All 6 Real Videos) */}
        <section
          id="videoSection"
          aria-labelledby="videoShowcaseHeading"
          className="mt-12 pt-8 border-t border-light-outline-variant"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-label font-bold text-accent uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Video thực tế 100% không chỉnh sửa tại vựa
              </span>
              <h2
                id="videoShowcaseHeading"
                className="font-headline text-headline-md text-light-primary font-bold mt-0.5"
              >
                Video Quay Trực Tiếp Hải Sản Tại Vựa Yến Hải ({REAL_VIDEOS.length} Video)
              </h2>
              <p className="font-body text-body-md text-light-on-surface/70 mt-1">
                Xem trực tiếp chất lượng Bề bề bóc nõn full trứng, Nõn tôm biển hấp bóc sẵn và Tôm biển tươi đóng hộp vừa lên tại {STORE_ADDRESS}.
              </p>
            </div>
            <a
              href={STORE_ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-label-sm font-bold flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">
                videocam
              </span>
              <span>Nhận thêm video qua Zalo {STORE_PHONE_DISPLAY}</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REAL_VIDEOS.map((vid) => {
              const linkedProduct =
                products.find((p) => p.id === vid.productId) || products[0];

              return (
                <article
                  key={vid.id}
                  itemScope
                  itemType="https://schema.org/VideoObject"
                  className="bg-white rounded-lg border border-light-outline-variant overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <meta itemProp="name" content={vid.title} />
                  <meta itemProp="description" content={vid.description} />
                  <meta itemProp="thumbnailUrl" content={vid.thumbnailUrl} />
                  <meta itemProp="contentUrl" content={vid.videoUrl} />
                  <meta itemProp="uploadDate" content={vid.uploadDate} />

                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <video
                      src={vid.videoUrl}
                      poster={vid.thumbnailUrl}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-accent text-white font-label text-[11px] font-bold shadow-xs pointer-events-none">
                      {vid.badge}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-title text-title-sm font-bold text-light-primary">
                        {vid.title}
                      </h3>
                      <p className="font-body text-body-sm text-light-on-surface/70 mt-1">
                        {vid.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-light-outline-variant flex items-center justify-between gap-2">
                      <span className="font-headline text-label-lg font-extrabold text-accent">
                        Giá: Liên hệ
                      </span>
                      <a
                        href={getProductRoutePath(linkedProduct)}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToProduct(linkedProduct);
                        }}
                        className="px-3.5 py-1.5 rounded-DEFAULT bg-light-primary hover:bg-light-primary/90 text-white font-label text-label-sm font-semibold"
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

        {/* High-Conversion Combo Packages Strip */}
        <section
          id="comboSection"
          aria-labelledby="comboHeading"
          className="mt-12 pt-8 border-t border-light-outline-variant"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-label font-bold text-accent uppercase tracking-wider">
                Đặt theo mâm tiệc gia đình &amp; thùng quà biếu
              </span>
              <h2
                id="comboHeading"
                className="font-headline text-headline-md text-light-primary font-bold mt-0.5"
              >
                Combo Hải Sản Tuyển Chọn Tại Vựa (Đóng Thùng Giữ Lạnh)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMBO_PACKAGES.map((combo) => (
              <article
                key={combo.id}
                className="bg-white rounded-lg border border-light-outline-variant p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5"
              >
                <figure className="relative w-full sm:w-44 h-44 rounded-md overflow-hidden bg-light-surface-container shrink-0 m-0">
                  <ResilientImage
                    src={combo.image}
                    alt={`${combo.title} - Hải Sản Yến Hải ${STORE_ADDRESS}`}
                    title={`${combo.title} - ${formatProductPrice(combo)}`}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded bg-light-primary/90 text-white font-label text-label-sm font-bold shadow-xs">
                    {combo.saveBadge}
                  </span>
                </figure>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-label text-ocean-blue font-semibold">
                      {combo.tag}
                    </span>
                    <h3 className="font-headline text-title-lg font-bold text-light-primary mt-0.5">
                      {combo.title}
                    </h3>
                    <p className="text-body-sm text-light-on-surface/70 mt-1">
                      {combo.subtitle}
                    </p>
                    <ul className="mt-2.5 space-y-1 text-body-sm text-light-on-surface">
                      {combo.itemsIncluded.map((line) => (
                        <li key={line} className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-fresh-green text-[16px]">
                            check_circle
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-light-outline-variant flex items-center justify-between gap-3">
                    <div>
                      <span className="font-headline text-title-lg font-extrabold text-accent">
                        {formatProductPrice(combo)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCart((prev) =>
                          addCartItem(prev, {
                            productId: 99,
                            name: combo.title,
                            price: combo.price,
                            img: combo.image,
                            unit: '/ combo',
                            prepNote: 'Đóng thùng xốp giữ lạnh tiêu chuẩn'
                          })
                        );
                        setIsCartOpen(true);
                      }}
                      className="px-4 py-2 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-md font-bold shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      Đặt Combo Ngay
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Customer Reviews & FAQ Section for SEO Authority & Conversion */}
        <section
          id="faqSection"
          aria-labelledby="seoReviewFaqHeading"
          className="mt-12 pt-8 border-t border-light-outline-variant grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left 5 cols: Verified Customer Reviews */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-label font-bold text-fresh-green uppercase tracking-wider">
                Khách hàng thực tế phản hồi
              </span>
              <h2
                id="seoReviewFaqHeading"
                className="font-headline text-headline-md text-light-primary font-bold mt-0.5"
              >
                Đánh Giá Về Hải Sản Yến Hải
              </h2>
            </div>

            <div className="space-y-3">
              {CUSTOMER_REVIEWS.map((rev) => (
                <article
                  key={rev.id}
                  itemScope
                  itemType="https://schema.org/Review"
                  className="bg-white p-4 rounded-lg border border-light-outline-variant shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      itemProp="author"
                      itemScope
                      itemType="https://schema.org/Person"
                      className="font-label text-label-md font-bold text-light-primary"
                    >
                      <span itemProp="name">{rev.author}</span>{' '}
                      <span className="font-normal text-xs text-light-on-surface/60">
                        ({rev.location})
                      </span>
                    </div>
                    <div
                      itemProp="reviewRating"
                      itemScope
                      itemType="https://schema.org/Rating"
                      className="text-gold-star flex items-center text-xs font-bold"
                    >
                      ★★★★★
                      <meta
                        itemProp="ratingValue"
                        content={String(rev.rating)}
                      />
                    </div>
                  </div>
                  <p className="text-xs font-label text-ocean-blue font-semibold mb-1">
                    Đã mua: {rev.productBought}
                  </p>
                  <p
                    itemProp="reviewBody"
                    className="font-body text-body-sm text-light-on-surface/80 leading-relaxed"
                  >
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Right 7 cols: Semantic FAQPage Microdata */}
          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="lg:col-span-7 space-y-4"
          >
            <div>
              <span className="text-xs font-label font-bold text-ocean-blue uppercase tracking-wider">
                Giải đáp thắc mắc &amp; Chính sách vận chuyển
              </span>
              <h2 className="font-headline text-headline-md text-light-primary font-bold mt-0.5">
                Câu Hỏi Thường Gặp Khi Đặt Hải Sản
              </h2>
            </div>

            <div className="space-y-3">
              {SEO_FAQS.map((faq) => (
                <div
                  key={faq.question}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                  className="bg-white p-4 rounded-lg border border-light-outline-variant shadow-xs"
                >
                  <h3
                    itemProp="name"
                    className="font-title text-title-sm font-bold text-light-primary flex items-start gap-2"
                  >
                    <span className="material-symbols-outlined text-accent text-[18px] shrink-0 mt-0.5">
                      help
                    </span>
                    <span>{faq.question}</span>
                  </h3>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className="mt-1.5 pl-6 font-body text-body-sm text-light-on-surface/75 leading-relaxed"
                  >
                    <p itemProp="text">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Google Maps Location & Directions Section (#mapSection) */}
        <section
          id="mapSection"
          aria-labelledby="mapSectionHeading"
          itemScope
          itemType="https://schema.org/Place"
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-light-outline-variant"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-label font-bold text-fresh-green uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] shrink-0">
                  location_on
                </span>
                Vị trí thực tế &amp; Chỉ đường đến Vựa Hải Sản Yến Hải
              </span>
              <h2
                id="mapSectionHeading"
                itemProp="name"
                className="font-headline text-[19px] leading-snug sm:text-headline-md text-light-primary font-bold mt-1 text-balance"
              >
                Bản Đồ Vị Trí: Gần Trường Tiểu Học Xã Hoằng Trường — {STORE_ADDRESS}
              </h2>
              <p className="font-body text-body-sm sm:text-body-md text-light-on-surface/75 mt-1.5 leading-relaxed">
                Vựa nằm{' '}
                <strong className="text-light-primary">
                  gần Trường Tiểu học xã Hoằng Trường
                </strong>{' '}
                — <strong className="text-light-primary">{STORE_ADDRESS}</strong>. Quý khách có thể đến tận nơi xem hải sản ghe về hoặc liên hệ Hotline/Zalo{' '}
                <a
                  href={`tel:${STORE_PHONE}`}
                  className="font-bold text-accent underline tabular-nums"
                >
                  {STORE_PHONE_DISPLAY}
                </a>{' '}
                để nhận ship tận nhà.
              </p>
            </div>
            <a
              href={STORE_GOOGLE_MAPS_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-DEFAULT bg-light-primary hover:bg-light-primary/90 text-white font-label text-label-sm font-bold flex items-center justify-center gap-1.5 shadow-xs shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">
                directions
              </span>
              <span>Mở Chỉ Đường Trên Google Maps</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
            {/* Left 5 Cols: Detailed Location & Landmark Card */}
            <div className="lg:col-span-5 bg-white rounded-lg border border-light-outline-variant p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 sm:space-y-5 min-w-0">
              <div className="space-y-3.5 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-label text-xs sm:text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px] text-fresh-green shrink-0">
                    schedule
                  </span>
                  <span>Mở cửa đón khách &amp; đóng hàng: 05:30 – 22:00</span>
                </div>

                <div
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                  className="space-y-3"
                >
                  <div className="p-3 sm:p-3.5 rounded-lg bg-light-surface-container border border-light-outline-variant">
                    <span className="block text-[11px] font-label font-bold uppercase tracking-wider text-ocean-blue">
                      Điểm mốc định vị trên bản đồ
                    </span>
                    <p className="font-headline text-title-sm sm:text-title-md font-bold text-light-primary mt-0.5">
                      Gần Trường Tiểu học xã Hoằng Trường
                    </p>
                    <p className="font-body text-body-sm text-light-on-surface/80 mt-1">
                      <span itemProp="streetAddress">Thôn Trường Phúc, Xã Hoằng Tiến</span>,{' '}
                      <span itemProp="addressLocality">Huyện Hoằng Hóa</span>,{' '}
                      <span itemProp="addressRegion">Tỉnh Thanh Hóa</span>
                    </p>
                  </div>

                  <div className="space-y-2.5 text-body-sm text-light-on-surface/85">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-accent text-[20px] shrink-0 mt-0.5">
                        pin_drop
                      </span>
                      <div>
                        <strong className="text-light-primary block">
                          Địa chỉ chi tiết:
                        </strong>
                        <span>{STORE_ADDRESS}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-fresh-green text-[20px] shrink-0 mt-0.5">
                        call
                      </span>
                      <div>
                        <strong className="text-light-primary block">
                          Hotline / Zalo đón khách &amp; báo giá:
                        </strong>
                        <a
                          href={`tel:${STORE_PHONE}`}
                          className="text-accent font-bold tabular-nums hover:underline"
                        >
                          {STORE_PHONE_DISPLAY}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-ocean-blue text-[20px] shrink-0 mt-0.5">
                        local_shipping
                      </span>
                      <div>
                        <strong className="text-light-primary block">
                          Giao hàng &amp; Gửi xe toàn quốc:
                        </strong>
                        <span>
                          Đóng thùng xốp ủ đá lạnh hút chân không giao nhanh nội tỉnh Thanh Hóa, gửi xe khách đi Hà Nội và các tỉnh lân cận trong ngày.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3.5 sm:pt-4 border-t border-light-outline-variant grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${STORE_PHONE}`}
                  className="min-h-[44px] py-2.5 px-2 sm:px-3 rounded-DEFAULT bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-xs sm:text-label-sm font-bold flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px] shrink-0">
                    call
                  </span>
                  <span className="tabular-nums">{STORE_PHONE_DISPLAY}</span>
                </a>
                <a
                  href={STORE_ZALO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] py-2.5 px-2 sm:px-3 rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-xs sm:text-label-sm font-bold flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px] shrink-0">
                    chat
                  </span>
                  <span>Zalo Vị Trí</span>
                </a>
              </div>
            </div>

            {/* Right 7 Cols: Embedded Google Map Iframe */}
            <div className="lg:col-span-7 bg-white rounded-lg border border-light-outline-variant overflow-hidden shadow-xs flex flex-col min-w-0">
              <div className="px-3 sm:px-4 py-2.5 bg-light-surface-container border-b border-light-outline-variant flex items-center justify-between gap-2 text-xs font-label text-light-primary">
                <span className="flex items-center gap-1.5 font-bold min-w-0">
                  <span className="material-symbols-outlined text-accent text-[16px] shrink-0">
                    map
                  </span>
                  <span className="truncate">
                    Google Maps: {STORE_LANDMARK}
                  </span>
                </span>
                <span className="text-light-on-surface/60 shrink-0 hidden sm:inline">
                  Thôn Trường Phúc, Xã Hoằng Tiến
                </span>
              </div>
              <div className="relative flex-1 w-full h-[300px] sm:h-[420px]">
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
          </div>
        </section>
      </main>
        </>
      )}

      {/* Multi-Channel Sticky Order Bar (Floating Dock) */}
      <aside
        aria-label="Thanh công cụ đặt hàng nhanh"
        className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-30 sm:w-11/12 sm:max-w-2xl bg-light-primary/95 text-white p-1.5 sm:p-3 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md flex items-center justify-between gap-1.5 sm:gap-3"
      >
        <div className="hidden sm:flex items-center gap-3 pl-2 min-w-0">
          <div className="w-9 h-9 rounded-full bg-fresh-green text-white flex items-center justify-center shadow shrink-0">
            <span className="material-symbols-outlined text-[20px]">
              headset_mic
            </span>
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-label text-white/70 truncate max-w-[230px]">
              Vựa biển {STORE_ADDRESS}
            </span>
            <span className="font-headline text-label-lg font-bold text-white tabular-nums">
              Yến Hải: {STORE_PHONE_DISPLAY}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <a
            href={`tel:${STORE_PHONE}`}
            title={`Gọi trực tiếp Hotline Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
            className="min-h-[42px] px-1.5 sm:px-3.5 py-2 rounded-lg sm:rounded-DEFAULT bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-[11px] sm:text-label-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px] shrink-0">
              call
            </span>
            <span className="hidden md:inline tabular-nums">
              {STORE_PHONE_DISPLAY}
            </span>
            <span className="md:hidden">Gọi</span>
          </a>

          <a
            href={STORE_ZALO_URL}
            target="_blank"
            rel="noopener noreferrer"
            title={`Nhắn Zalo Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
            className="min-h-[42px] px-1.5 sm:px-3.5 py-2 rounded-lg sm:rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-[11px] sm:text-label-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px] shrink-0">
              chat
            </span>
            <span>Zalo</span>
          </a>

          <a
            href={STORE_FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook Hải Sản Yến Hải"
            className="min-h-[42px] px-1.5 sm:px-3 py-2 rounded-lg sm:rounded-DEFAULT bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label text-[11px] sm:text-label-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px] shrink-0">
              thumb_up
            </span>
            <span className="sm:hidden">FB</span>
            <span className="hidden sm:inline">Facebook</span>
          </a>

          <button
            type="button"
            onClick={() => setConsultModalTopic('Tư vấn & Báo giá nhanh')}
            className="min-h-[42px] px-1.5 sm:px-3.5 py-2 rounded-lg sm:rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-[11px] sm:text-label-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 shadow cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[18px] shrink-0">
              shopping_cart_checkout
            </span>
            <span className="sm:hidden">Báo giá</span>
            <span className="hidden sm:inline">Báo giá nhanh</span>
          </button>
        </div>
      </aside>

      {/* Slide-Over Shopping Cart Drawer (Right) */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onClearCart={() => setCart([])}
        onShowToast={showToast}
      />

      {/* Direct Consultation & Order Modal */}
      <OrderConsultModal
        isOpen={consultModalTopic !== null}
        topic={consultModalTopic || 'Tư vấn nhanh'}
        onClose={() => setConsultModalTopic(null)}
        onCallbackSuccess={(phone) =>
          showToast(`Đã ghi nhận SĐT ${phone}! Yến Hải (${STORE_PHONE_DISPLAY}) sẽ gọi báo giá ngay.`)
        }
      />

      {/* Checkout Success Toast / Notification */}
      <div
        id="toastNotification"
        role="status"
        aria-live="polite"
        className={`fixed top-4 left-3 right-3 sm:left-auto sm:top-5 sm:right-5 sm:max-w-sm z-50 bg-light-primary text-white px-4 py-3 rounded-lg shadow-xl border border-white/20 flex items-center gap-3 transition-all duration-300 ${
          toastMessage
            ? 'translate-y-0 opacity-100'
            : 'translate-y-[-100px] opacity-0 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-fresh-green text-[24px] shrink-0">
          check_circle
        </span>
        <div className="min-w-0">
          <p id="toastMessage" className="font-label text-xs sm:text-label-md font-bold">
            {toastMessage || 'Đã thêm vào giỏ hàng thành công!'}
          </p>
          <p className="font-body text-[11px] sm:text-body-sm text-white/80">
            Bạn có thể mở giỏ hàng để gửi yêu cầu báo giá ngay.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-light-primary text-white mt-12 sm:mt-16 pt-10 sm:pt-12 pb-24 lg:pb-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-accent text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">sailing</span>
              </div>
              <span className="font-headline text-title-lg font-bold">
                HẢI SẢN YẾN HẢI
              </span>
            </div>
            <p className="font-body text-body-sm text-white/70 leading-relaxed">
              Vựa Hải Sản Yến Hải ({STORE_ADDRESS}) chuyên bán buôn, bán lẻ đa dạng hải sản: Mực ống, Cá thu phấn, Bạch tuộc tươi, Tôm biển tươi, Nõn tôm hấp, Bề bề bóc nõn full trứng và Cá khô một nắng rút xương làm quà biếu.
            </p>
            <p className="font-label text-label-sm text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>{' '}
              Bao ăn, bao tươi 1 đổi 1 tận nơi
            </p>
          </div>

          {/* Pillar Categories */}
          <div className="space-y-3">
            <h3 className="font-headline text-label-lg font-bold text-white uppercase tracking-wider">
              3 Nhóm Sản Phẩm Chính
            </h3>
            <ul className="space-y-2 text-body-sm text-white/80">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('fresh');
                    scrollToSection('catalog');
                  }}
                  className="hover:text-accent transition-colors cursor-pointer text-left"
                >
                  🦐 Hải sản tươi trong ngày (Mực ống, Cá thu, Bạch tuộc, Tôm biển)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('frozen');
                    scrollToSection('catalog');
                  }}
                  className="hover:text-sky-300 transition-colors cursor-pointer text-left"
                >
                  ❄️ Hải sản cấp đông VIP (Bề bề nõn full trứng, Nõn tôm biển)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('dried');
                    scrollToSection('catalog');
                  }}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  🦑 Hải sản khô phơi tự nhiên (Cá khô rút xương 1 nắng)
                </button>
              </li>
              <li>
                <a
                  href={`tel:${STORE_PHONE}`}
                  className="text-accent hover:underline font-semibold"
                >
                  📦 Báo giá sỉ cho nhà hàng &amp; đại lý ({STORE_PHONE_DISPLAY})
                </a>
              </li>
            </ul>
          </div>

          {/* Multi-Channel Contact */}
          <div className="space-y-3">
            <h3 className="font-headline text-label-lg font-bold text-white uppercase tracking-wider">
              Thông Tin Liên Hệ &amp; Địa Chỉ
            </h3>
            <ul className="space-y-2 text-body-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-fresh-green text-[18px]">
                  call
                </span>
                <span>
                  Hotline:{' '}
                  <a
                    href={`tel:${STORE_PHONE}`}
                    className="text-white font-bold tabular-nums hover:underline"
                  >
                    {STORE_PHONE_DISPLAY}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-ocean-blue text-[18px]">
                  chat
                </span>
                <span>
                  Zalo đặt hàng:{' '}
                  <a
                    href={STORE_ZALO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-bold tabular-nums hover:underline"
                  >
                    {STORE_PHONE_DISPLAY}
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-400 text-[18px]">
                  thumb_up
                </span>
                <span>
                  Facebook:{' '}
                  <a
                    href={STORE_FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-300 font-bold hover:underline"
                  >
                    Hải Sản Yến Hải
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-accent text-[18px] mt-0.5">
                  location_on
                </span>
                <span>
                  Địa chỉ:{' '}
                  <a
                    href="#mapSection"
                    className="text-white font-bold hover:underline"
                  >
                    {STORE_ADDRESS}
                  </a>{' '}
                  (Khu vực Trường Tiểu học xã Hoằng Trường — Nhận gửi xe &amp; giao hàng toàn quốc)
                </span>
              </li>
            </ul>
          </div>

          {/* Payment & Assurance */}
          <div className="space-y-3">
            <h3 className="font-headline text-label-lg font-bold text-white uppercase tracking-wider">
              Hình Thức Thanh Toán
            </h3>
            <p className="font-body text-body-sm text-white/70">
              Hỗ trợ nhận hàng kiểm tra mới thanh toán (COD), chuyển khoản ngân hàng, hoặc quét mã VietQR tiện lợi.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded bg-white/10 text-xs font-semibold text-white">
                COD Tận Nơi
              </span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-xs font-semibold text-white">
                Chuyển Khoản
              </span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-xs font-semibold text-white">
                VietQR
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-body-sm text-white/50">
          <p>
            © 2026 Hải Sản Yến Hải — {STORE_ADDRESS}. Hotline/Zalo: {STORE_PHONE_DISPLAY}.
          </p>
          <p className="flex items-center gap-4">
            <span>Chất lượng loại 1</span>
            <span>•</span>
            <span>Bao ăn 1 đổi 1</span>
            <span>•</span>
            <span>Giá: Liên hệ ({STORE_PHONE_DISPLAY})</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
