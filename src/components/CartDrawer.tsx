import React, { useState } from 'react';
import {
  CartItem,
  CheckoutFormInput,
  calculateCartTotals,
  validateCheckoutForm,
  buildZaloOrderMessage,
  formatVND,
  STORE_PHONE,
  STORE_PHONE_DISPLAY
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
  const [step, setStep] = useState<'cart' | 'checkout' | 'receipt'>('cart');
  const [form, setForm] = useState<CheckoutFormInput>({
    fullName: '',
    phone: '',
    address: '',
    deliverySlot: 'Giao nhanh trong ngày / Gửi thùng xốp giữ lạnh',
    paymentMethod: 'cod',
    note: ''
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    address?: string;
  }>({});
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    items: CartItem[];
    total: number;
    customer: CheckoutFormInput;
    createdAt: string;
  } | null>(null);
  const [copiedZalo, setCopiedZalo] = useState(false);

  const totals = calculateCartTotals(cart);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      if (step === 'receipt') {
        setStep('cart');
      }
    }, 250);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const orderId = `YH-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrder({
      orderId,
      items: [...cart],
      total: totals.grandTotal,
      customer: { ...form },
      createdAt: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    });
    setStep('receipt');
    onClearCart();
    onShowToast(`Đặt hàng thành công mã đơn #${orderId}!`);
  };

  const handleCopyZaloOrder = () => {
    const itemsToFormat =
      step === 'receipt' && confirmedOrder ? confirmedOrder.items : cart;
    const msg = buildZaloOrderMessage(itemsToFormat, form);
    navigator.clipboard?.writeText(msg);
    setCopiedZalo(true);
    onShowToast('Đã sao chép nội dung đơn hàng để gửi qua Zalo!');
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
              {step === 'cart' && (
                <>
                  Giỏ Hàng Hải Sản (<span id="cartDrawerCount">{totals.totalItems}</span>)
                </>
              )}
              {step === 'checkout' && 'Xác Nhận Thông Tin Nhận Hàng'}
              {step === 'receipt' && 'Đặt Hàng Thành Công'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Đóng giỏ hàng"
            className="w-8 h-8 rounded-full hover:bg-light-outline-variant flex items-center justify-center text-light-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {step !== 'receipt' && (
          <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 text-body-sm text-emerald-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-fresh-green text-[20px]">
                local_shipping
              </span>
              {totals.isFreeShipping ? (
                <span>
                  Đơn hàng của bạn đủ điều kiện <strong>Miễn phí vận chuyển</strong>!
                </span>
              ) : (
                <span>
                  Mua thêm{' '}
                  <strong className="text-accent tabular-nums">
                    {formatVND(totals.amountToFreeShipping)}
                  </strong>{' '}
                  để được <strong>Miễn phí vận chuyển</strong>!
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-emerald-200/70 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-fresh-green transition-all duration-300"
                style={{ width: `${totals.freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Cart Items View */}
        {step === 'cart' && (
          <>
            <div
              id="cartItemList"
              className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-light-outline-variant"
            >
              {cart.length === 0 ? (
                <div className="py-12 text-center text-light-on-surface/50">
                  <span className="material-symbols-outlined text-[48px] text-light-outline">
                    shopping_bag
                  </span>
                  <p className="mt-2 font-body text-body-md">
                    Giỏ hàng của bạn đang trống
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 px-4 py-2 rounded bg-light-primary text-white text-label-sm font-label cursor-pointer"
                  >
                    Xem sản phẩm
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
                      <p className="font-body text-body-sm text-light-on-surface/60 tabular-nums">
                        {formatVND(item.price)} {item.unit}
                      </p>
                      <span className="font-headline text-label-md font-bold text-accent tabular-nums">
                        {formatVND(item.price * item.qty)}
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
            </div>

            {/* Drawer Footer with Total & Checkout */}
            <div className="p-4 sm:p-5 border-t border-light-outline-variant bg-light-surface-container space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-body-sm text-light-on-surface/70">
                  <span>Tạm tính tiền hàng:</span>
                  <span
                    id="cartSubtotal"
                    className="font-headline text-label-md font-semibold text-light-primary tabular-nums"
                  >
                    {formatVND(totals.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm text-light-on-surface/70">
                  <span>Phí đóng thùng &amp; vận chuyển:</span>
                  <span className="text-fresh-green font-semibold">
                    {totals.shippingFee === 0
                      ? 'Miễn phí (Freeship)'
                      : formatVND(totals.shippingFee)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-light-outline-variant">
                  <span className="font-headline text-title-md font-bold text-light-primary">
                    Tổng thanh toán:
                  </span>
                  <span
                    id="cartGrandTotal"
                    className="font-headline text-headline-md font-extrabold text-accent tabular-nums"
                  >
                    {formatVND(totals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Actions: Hotline, Zalo, and Online Payment */}
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 rounded-DEFAULT bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-label text-label-md font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    credit_card
                  </span>
                  <span>Đặt Hàng Ngay (COD / Chuyển khoản)</span>
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
                  <button
                    type="button"
                    onClick={handleCopyZaloOrder}
                    className="py-2.5 px-2 rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-label-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chat
                    </span>
                    <span>{copiedZalo ? 'Đã chép đơn Zalo!' : 'Gửi giỏ qua Zalo'}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Express Checkout Form */}
        {step === 'checkout' && (
          <form
            onSubmit={handleCheckoutSubmit}
            className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3.5">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="inline-flex items-center gap-1 text-body-sm text-ocean-blue font-semibold hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_back
                </span>
                <span>Quay lại chỉnh sửa giỏ hàng ({totals.totalItems} món)</span>
              </button>

              <div>
                <label
                  htmlFor="checkoutFullName"
                  className="block font-label text-label-sm font-bold text-light-primary mb-1"
                >
                  Họ và tên người nhận *
                </label>
                <input
                  id="checkoutFullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    if (errors.fullName)
                      setErrors({ ...errors, fullName: undefined });
                  }}
                  placeholder="Ví dụ: Anh Minh / Chị Lan"
                  className="w-full px-3 py-2 rounded border border-light-outline text-body-md focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
                {errors.fullName && (
                  <p role="alert" className="text-xs text-red-600 font-semibold mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkoutPhone"
                  className="block font-label text-label-sm font-bold text-light-primary mb-1"
                >
                  Số điện thoại nhận hàng (Có Zalo) *
                </label>
                <input
                  id="checkoutPhone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="Nhập 10 số điện thoại (VD: 0356136859)"
                  className="w-full px-3 py-2 rounded border border-light-outline text-body-md focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
                {errors.phone && (
                  <p role="alert" className="text-xs text-red-600 font-semibold mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkoutAddress"
                  className="block font-label text-label-sm font-bold text-light-primary mb-1"
                >
                  Địa chỉ giao hàng chi tiết *
                </label>
                <input
                  id="checkoutAddress"
                  type="text"
                  value={form.address}
                  onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    if (errors.address)
                      setErrors({ ...errors, address: undefined });
                  }}
                  placeholder="Số nhà, thôn/xóm, Xã/Phường, Tỉnh/Thành..."
                  className="w-full px-3 py-2 rounded border border-light-outline text-body-md focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
                {errors.address && (
                  <p role="alert" className="text-xs text-red-600 font-semibold mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkoutSlot"
                  className="block font-label text-label-sm font-bold text-light-primary mb-1"
                >
                  Hình thức nhận hải sản:
                </label>
                <select
                  id="checkoutSlot"
                  value={form.deliverySlot}
                  onChange={(e) =>
                    setForm({ ...form, deliverySlot: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded border border-light-outline bg-white text-body-sm font-label"
                >
                  <option value="Giao nhanh trong ngày / Gửi thùng xốp giữ lạnh">
                    🚀 Giao nhanh tận nơi / Đóng thùng xốp giữ lạnh
                  </option>
                  <option value="Giao khung giờ sáng - trưa (08:00 - 12:00)">
                    🕚 Giao khung giờ sáng - trưa (08:00 - 12:00)
                  </option>
                  <option value="Giao khung giờ chiều (14:00 - 18:30)">
                    🕔 Giao khung giờ chiều (14:00 - 18:30)
                  </option>
                </select>
              </div>

              <div>
                <span className="block font-label text-label-sm font-bold text-light-primary mb-1.5">
                  Phương thức thanh toán:
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded border border-light-outline-variant bg-light-surface-container cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() =>
                        setForm({ ...form, paymentMethod: 'cod' })
                      }
                    />
                    <div className="text-body-sm">
                      <span className="font-bold text-light-primary block">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      <span className="text-xs text-light-on-surface/65">
                        Kiểm tra hải sản tươi ngon đúng quy cách mới thanh toán
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5 p-2.5 rounded border border-light-outline-variant bg-light-surface-container cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={form.paymentMethod === 'vietqr'}
                      onChange={() =>
                        setForm({ ...form, paymentMethod: 'vietqr' })
                      }
                    />
                    <div className="text-body-sm">
                      <span className="font-bold text-light-primary block">
                        Chuyển khoản nhanh VietQR 24/7
                      </span>
                      <span className="text-xs text-light-on-surface/65">
                        Quét mã QR ngân hàng sau khi nhân viên báo cân thực tế
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-light-outline-variant space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="font-headline text-title-sm font-bold text-light-primary">
                  Tổng thanh toán ({totals.totalItems} món):
                </span>
                <span className="font-headline text-headline-md font-extrabold text-accent tabular-nums">
                  {formatVND(totals.grandTotal)}
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-DEFAULT bg-accent hover:bg-accent-hover text-white font-label text-label-md font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  task_alt
                </span>
                <span>Hoàn Tất Đặt Hải Sản Ngay</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmed Order Receipt */}
        {step === 'receipt' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1.5">
              <div className="w-12 h-12 rounded-full bg-fresh-green text-white mx-auto flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-[28px]">
                  check
                </span>
              </div>
              <span className="inline-block text-xs font-label font-bold text-fresh-green uppercase">
                Đơn hàng đã ghi nhận lúc {confirmedOrder.createdAt}
              </span>
              <h3 className="font-headline text-title-lg font-bold text-light-primary">
                Mã đơn: #{confirmedOrder.orderId}
              </h3>
              <p className="font-body text-body-sm text-emerald-900">
                Hotline/Zalo <strong>{STORE_PHONE_DISPLAY}</strong> sẽ gọi xác nhận số cân thực tế tại vựa và gửi video qua Zalo cho{' '}
                <strong>{confirmedOrder.customer.fullName}</strong> trong ít phút!
              </p>
            </div>

            <div className="p-4 rounded-md bg-light-surface-container border border-light-outline-variant space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span className="text-light-on-surface/60">Người nhận:</span>
                <span className="font-semibold text-light-primary">
                  {confirmedOrder.customer.fullName} ({confirmedOrder.customer.phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface/60">Địa chỉ:</span>
                <span className="font-semibold text-light-primary text-right max-w-[220px]">
                  {confirmedOrder.customer.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-light-on-surface/60">Giao hàng:</span>
                <span className="font-semibold text-fresh-green">
                  {confirmedOrder.customer.deliverySlot}
                </span>
              </div>
              <div className="pt-2 border-t border-light-outline-variant space-y-1">
                {confirmedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span>
                      {item.name} x{item.qty}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatVND(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-light-outline-variant flex justify-between items-baseline">
                <span className="font-bold text-light-primary">Tổng cộng:</span>
                <span className="font-headline text-title-md font-extrabold text-accent tabular-nums">
                  {formatVND(confirmedOrder.total)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCopyZaloOrder}
                className="w-full py-2.5 rounded-DEFAULT bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-label-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  content_copy
                </span>
                <span>Sao chép mã đơn gửi qua Zalo ({STORE_PHONE_DISPLAY})</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-DEFAULT bg-light-primary text-white font-label text-label-sm font-bold cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
