import React, { useState, useEffect } from 'react';
import { Product, formatVND } from '../lib/store-logic';
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

  useEffect(() => {
    if (product) {
      setSelectedSizeIdx(0);
      setSelectedPrep(product.prepOptions[0] || 'Giao tiêu chuẩn');
      setQty(1);
    }
  }, [product]);

  if (!product) return null;

  const sizeObj = product.sizeOptions[selectedSizeIdx] || {
    label: 'Tiêu chuẩn',
    priceMultiplier: 1
  };
  const unitPrice = Math.round((product.price * sizeObj.priceMultiplier) / 5000) * 5000;
  const fullPrepNote = `${sizeObj.label} • ${selectedPrep}`;
  const showDiscount =
    Boolean(product.hasDiscount) &&
    Boolean(product.originalPrice) &&
    (product.originalPrice ?? 0) > product.price;

  const handleAdd = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: unitPrice,
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
      price: unitPrice,
      img: product.image,
      unit: product.unit,
      prepNote: fullPrepNote,
      qty
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickViewTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg border border-light-outline-variant shadow-2xl max-w-2xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Image Column */}
        <div className="md:col-span-5 relative bg-light-surface-container min-h-[220px] md:min-h-full">
          <ResilientImage
            src={product.image}
            alt={product.seoAlt || product.name}
            title={product.seoTitle || product.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-fresh-green text-white font-label text-label-sm shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {product.badgeLeft}
          </span>
          <div className="absolute bottom-3 left-3 right-3 bg-light-primary/90 backdrop-blur-xs text-white p-2.5 rounded-md text-xs">
            <div className="font-semibold flex items-center gap-1 text-fresh-green">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>{product.stockStatus}</span>
            </div>
            <p className="text-white/80 mt-0.5 text-[11px]">
              Bao ăn bao tươi 1 đổi 1 tận nơi
            </p>
          </div>
        </div>

        {/* Right Purchase Configuration Column */}
        <div className="md:col-span-7 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-body-sm text-light-on-surface/60">
                  {product.subtitle} · ★ {product.rating.toFixed(1)} ({product.reviewsCount} đánh giá)
                </span>
                <h3
                  id="quickViewTitle"
                  className="font-headline text-title-lg font-bold text-light-primary mt-0.5"
                >
                  {product.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng chi tiết sản phẩm"
                className="w-8 h-8 rounded-full hover:bg-light-surface-container-high flex items-center justify-center text-light-primary cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-body text-body-sm text-light-on-surface/75 mt-2">
              {product.description}
            </p>

            {/* Price display */}
            <div className="mt-3 p-3 rounded-md bg-light-surface-container border border-light-outline-variant flex items-baseline justify-between">
              <div>
                <span className="font-headline text-headline-md font-extrabold text-accent tabular-nums">
                  {formatVND(unitPrice)}
                </span>
                <span className="text-body-sm text-light-on-surface/60 ml-1">
                  {product.unit}
                </span>
                {showDiscount && product.originalPrice && (
                  <span className="text-body-sm text-light-on-surface/40 line-through ml-2 tabular-nums">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs font-label text-fresh-green font-semibold">
                ✓ Sơ chế miễn phí
              </span>
            </div>

            {/* Size selector */}
            <div className="mt-3.5">
              <label className="block font-label text-label-sm text-light-primary font-bold mb-1.5">
                1. Chọn kích cỡ / quy cách:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.sizeOptions.map((opt, idx) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setSelectedSizeIdx(idx)}
                    className={`py-2 px-2.5 rounded border text-left font-label text-label-sm transition-colors cursor-pointer ${
                      selectedSizeIdx === idx
                        ? 'border-light-primary bg-light-primary-container text-light-primary font-bold'
                        : 'border-light-outline-variant bg-white text-light-on-surface hover:bg-light-surface-container'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preparation option selector */}
            <div className="mt-3.5">
              <label className="block font-label text-label-sm text-light-primary font-bold mb-1.5">
                2. Yêu cầu sơ chế / đóng gói miễn phí:
              </label>
              <div className="space-y-1.5">
                {product.prepOptions.map((prep) => (
                  <button
                    key={prep}
                    type="button"
                    onClick={() => setSelectedPrep(prep)}
                    className={`w-full py-1.5 px-3 rounded border text-left font-body text-body-sm flex items-center justify-between transition-colors cursor-pointer ${
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

          {/* Quantity & Actions */}
          <div className="mt-5 pt-3.5 border-t border-light-outline-variant">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label text-label-sm text-light-on-surface/70">
                Số lượng đặt ({product.unit.replace('/', '').trim()}):
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
                <span className="px-3 font-headline text-label-md font-bold text-light-primary tabular-nums">
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

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleAdd}
                className="py-2.5 px-3 rounded-DEFAULT bg-light-primary-container text-light-primary hover:bg-light-primary hover:text-white font-label text-label-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add_shopping_cart
                </span>
                <span>Thêm giỏ</span>
              </button>
              <button
                type="button"
                onClick={handleBuy}
                className="py-2.5 px-3 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-md transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Mua ngay ({formatVND(unitPrice * qty)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
