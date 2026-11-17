import React, { useState } from 'react';
import {
  CartItem,
  calculateCartTotals,
  buildZaloOrderMessage,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_ZALO_URL,
  STORE_FACEBOOK_URL,
  STORE_ADDRESS
} from '../lib/store-logic';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: number, delta: number) => void;
  onClearCart: () => void;
  onShowToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQty,
  onClearCart,
  onShowToast
}) => {
  const [showDevelopingNotice, setShowDevelopingNotice] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);

  const totals = calculateCartTotals(cart);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setShowDevelopingNotice(false);
    }, 250);
  };

  const handleCopyZaloOrder = () => {
    const msg = buildZaloOrderMessage(cart);
    navigator.clipboard?.writeText(msg);
    setCopiedZalo(true);
    onShowToast('Đã sao chép danh sách hải sản để gửi qua Zalo!');
    setTimeout(() => setCopiedZalo(false), 2500);
  };

  return (
    <div
      id="cartDrawerBackdrop"
      className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="cartDrawerPanel"
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng Hải Sản Yến Hải"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-light-outline-variant flex items-center justify-between bg-light-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-light-primary text-[24px]">
              shopping_bag
            </span>
            <h2 className="font-title text-title-md font-bold text-light-primary">
              Giỏ Hàng Hải Sản (<span id="cartDrawerCount">{totals.totalItems}</span>)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setShowDevelopingNotice(false);
                  onShowToast('Đã làm trống giỏ hàng.');
                }}
                className="text-xs font-label text-light-on-surface/60 hover:text-accent underline cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng giỏ hàng"
              className="w-8 h-8 rounded-full hover:bg-light-outline-variant flex items-center justify-center text-light-primary cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Direct Fishery Guarantee Banner */}
        <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 text-body-sm text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-fresh-green text-[20px]">
              verified
            </span>
            <span>
              Vựa biển <strong>{STORE_ADDRESS}</strong> • Báo giá gốc tận bến qua Hotline/Zalo <strong>{STORE_PHONE_DISPLAY}</strong>
            </span>
          </div>
        </div>

        {/* Cart Items List */}
        <div
          id="cartItemList"
          className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-light-outline-variant"
        >
          {cart.length === 0 ? (
            <div className="py-14 text-center text-light-on-surface/60 space-y-3">
              <div className="w-16 h-16 rounded-full bg-light-surface-container mx-auto flex items-center justify-center text-light-outline">
                <span className="material-symbols-outlined text-[36px]">
                  shopping_bag
                </span>
              </div>
              <div>
                <p className="font-headline text-title-sm font-bold text-light-primary">
                  Giỏ hàng của bạn đang trống
                </p>
                <p className="mt-1 font-body text-body-sm text-light-on-surface/60 max-w-xs mx-auto">
                  Hãy chọn các mặt hàng hải sản tươi ngon tại vựa hoặc gọi trực tiếp Hotline/Zalo{' '}
                  <strong>{STORE_PHONE_DISPLAY}</strong> để được tư vấn nhanh nhất.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 px-5 py-2.5 rounded-DEFAULT bg-light-primary text-white text-label-sm font-label font-bold cursor-pointer"
              >
                Chọn hải sản ngay
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center gap-3">
                <div className="w-16 h-16 rounded-md bg-light-surface-container flex-shrink-0 overflow-hidden border border-light-outline-variant">
                  <ResilientImage
                    src={item.img}
                    alt={item.name}
                    title={`${item.name} - Hải Sản Yến Hải`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-title text-title-sm font-semibold text-light-primary truncate">
                    {item.name}
                  </h4>
                  {item.prepNote && (
                    <p className="text-[11px] text-emerald-700 font-medium truncate">
                      ✓ {item.prepNote}
                    </p>
                  )}
                  <p className="font-body text-body-sm text-light-on-surface/60">
                    Đơn vị: {item.unit.replace('/', '').trim()}
                  </p>
                  <span className="font-headline text-label-md font-bold text-accent">
                    Giá: Liên hệ
                  </span>
                </div>
                <div className="flex items-center border border-light-outline-variant rounded-md bg-light-surface-container">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, -1)}
                    aria-label={`Giảm số lượng ${item.name}`}
                    className="px-2.5 py-1 text-body-sm hover:bg-light-outline-variant cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-2.5 text-label-sm font-bold text-light-primary tabular-nums">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, 1)}
                    aria-label={`Tăng số lượng ${item.name}`}
                    className="px-2.5 py-1 text-body-sm hover:bg-light-outline-variant cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Notice when user clicks "Yêu cầu đặt hàng" */}
          {showDevelopingNotice && (
            <div
              role="alert"
              className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 space-y-2.5"
            >
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[22px] shrink-0">
                  construction
                </span>
                <div>
                  <h3 className="font-headline text-title-sm font-bold text-amber-950">
                    Tính năng đặt hàng trực tuyến trên giỏ hàng hiện chưa phát triển
                  </h3>
                  <p className="font-body text-xs text-amber-900 mt-1 leading-relaxed">
                    Hiện tại chức năng thanh toán &amp; gửi đơn tự động qua giỏ hàng đang được phát triển. Quý khách vui lòng liên hệ trực tiếp qua <strong>Hotline/Zalo {STORE_PHONE_DISPLAY}</strong> hoặc <strong>Facebook Hải Sản Yến Hải</strong> để vựa gửi video khay hàng thực tế và báo giá ngay lập tức!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 sm:p-5 border-t border-light-outline-variant bg-light-surface-container space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-body-sm text-light-on-surface/70">
              <span>Số lượng món đã chọn:</span>
              <span
                id="cartSubtotal"
                className="font-headline text-label-md font-semibold text-light-primary tabular-nums"
              >
                {totals.totalItems} phần
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-2 border-t border-light-outline-variant">
              <span className="font-headline text-title-md font-bold text-light-primary">
                Báo giá đơn hàng:
              </span>
              <span
                id="cartGrandTotal"
                className="font-headline text-headline-md font-extrabold text-accent"
              >
                Giá: Liên hệ
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setShowDevelopingNotice(true);
                onShowToast(
                  'Tính năng đặt hàng qua giỏ hàng hiện chưa phát triển. Vui lòng gọi hoặc nhắn Zalo 0356.136.859!'
                );
              }}
              className="w-full py-3 rounded-DEFAULT bg-slate-200 hover:bg-slate-300 text-light-primary font-label text-label-md font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-amber-600 text-[20px]">
                construction
              </span>
              <span>Yêu Cầu Đặt Hàng (Chưa phát triển)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${STORE_PHONE}`}
                className="py-2.5 px-2 rounded-DEFAULT bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  call
                </span>
                <span>Gọi {STORE_PHONE_DISPLAY}</span>
              </a>
              <a
                href={STORE_ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (cart.length > 0) handleCopyZaloOrder();
                }}
                className="py-2.5 px-2 rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chat
                </span>
                <span>{copiedZalo ? 'Đã chép giỏ Zalo!' : 'Chat Zalo Báo Giá'}</span>
              </a>
            </div>

            <a
              href={STORE_FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-DEFAULT bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                thumb_up
              </span>
              <span>Nhắn tin qua Facebook Hải Sản Yến Hải</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
