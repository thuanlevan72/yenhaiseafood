import React, { useState, useEffect } from 'react';
import {
  validateVietnamesePhone,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_ZALO_URL,
  STORE_FACEBOOK_URL
} from '../lib/store-logic';

interface OrderConsultModalProps {
  isOpen: boolean;
  topic: string;
  onClose: () => void;
  onCallbackSuccess?: (phone: string, topic: string) => void;
}

export const OrderConsultModal: React.FC<OrderConsultModalProps> = ({
  isOpen,
  topic,
  onClose,
  onCallbackSuccess
}) => {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateVietnamesePhone(phone)) {
      setError('Vui lòng nhập số điện thoại hợp lệ (10 số) để Yến Hải gọi lại!');
      return;
    }
    setError('');
    setSubmitted(true);
    if (onCallbackSuccess) {
      onCallbackSuccess(phone, topic);
    }
    setTimeout(() => {
      setSubmitted(false);
      setPhone('');
      setCustomerName('');
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalProductName"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rounded-t-2xl sm:rounded-lg bg-white border border-light-outline-variant shadow-2xl max-w-lg w-full max-h-[92dvh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-6 bg-white">
          <div className="flex items-start justify-between gap-2 pb-3.5 sm:pb-4 border-b border-light-outline-variant">
            <div className="min-w-0">
              <h3
                id="modalProductName"
                className="font-headline text-title-md sm:text-title-lg font-bold text-light-primary"
              >
                Tư Vấn &amp; Đặt Hàng: {topic}
              </h3>
              <p className="font-body text-xs sm:text-body-sm text-light-on-surface/65 mt-0.5">
                Vựa Hải Sản Yến Hải (Hoằng Tiến, Hoằng Hóa, Thanh Hóa) — Bao tươi ngon 1 đổi 1
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng hộp thoại tư vấn"
              className="w-9 h-9 rounded-full hover:bg-light-outline-variant flex items-center justify-center text-light-primary cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="py-4 sm:py-5 space-y-3">
            {/* Option 1: Hotline Direct Call */}
            <div className="p-3 sm:p-3.5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-fresh-green text-white flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]">call</span>
                </div>
                <div className="min-w-0">
                  <p className="font-label text-xs sm:text-label-md font-bold text-emerald-950 truncate">
                    Gọi Trực Tiếp Hotline 24/7
                  </p>
                  <p className="font-headline text-title-sm sm:text-title-md font-bold text-emerald-700 tabular-nums">
                    {STORE_PHONE_DISPLAY}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${STORE_PHONE}`}
                title={`Gọi ngay Hotline Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
                className="min-h-[40px] px-3 sm:px-4 py-2 bg-fresh-green hover:bg-fresh-green/90 text-white font-label text-xs sm:text-label-sm font-bold rounded shadow-sm flex items-center whitespace-nowrap shrink-0"
              >
                Gọi Ngay
              </a>
            </div>

            {/* Option 2: Zalo Order */}
            <div className="p-3 sm:p-3.5 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ocean-blue text-white flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]">chat</span>
                </div>
                <div className="min-w-0">
                  <p className="font-label text-xs sm:text-label-md font-bold text-sky-950 truncate">
                    Chat Zalo ({STORE_PHONE_DISPLAY})
                  </p>
                  <p className="font-body text-xs sm:text-body-sm text-sky-700 line-clamp-2">
                    Xem video quay trực tiếp khay hải sản tại vựa Hoằng Tiến
                  </p>
                </div>
              </div>
              <a
                href={STORE_ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                title={`Nhắn Zalo Hải Sản Yến Hải ${STORE_PHONE_DISPLAY}`}
                className="min-h-[40px] px-3 sm:px-4 py-2 bg-ocean-blue hover:bg-ocean-blue/90 text-white font-label text-xs sm:text-label-sm font-bold rounded shadow-sm flex items-center whitespace-nowrap shrink-0"
              >
                Mở Zalo
              </a>
            </div>

            {/* Option 3: Facebook Direct */}
            <div className="p-3 sm:p-3.5 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[20px] sm:text-[22px]">
                    thumb_up
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-label text-xs sm:text-label-md font-bold text-indigo-950 truncate">
                    Facebook Hải Sản Yến Hải
                  </p>
                  <p className="font-body text-xs sm:text-body-sm text-indigo-700 line-clamp-2">
                    Cập nhật mẻ hải sản ghe mới về hàng ngày
                  </p>
                </div>
              </div>
              <a
                href={STORE_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Truy cập trang Facebook Hải Sản Yến Hải"
                className="min-h-[40px] px-3 sm:px-4 py-2 bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-label text-xs sm:text-label-sm font-bold rounded shadow-sm flex items-center whitespace-nowrap shrink-0"
              >
                Facebook
              </a>
            </div>

            {/* Option 4: Quick Form for Callback Request */}
            <form
              onSubmit={handleSubmit}
              className="p-4 rounded-md bg-light-surface-container border border-light-outline-variant space-y-3"
            >
              <label
                htmlFor="quickPhoneInput"
                className="block font-label text-label-sm font-bold text-light-primary"
              >
                Hoặc để lại số điện thoại để Yến Hải gọi lại ngay (trong 30 giây):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Tên của bạn (Không bắt buộc)"
                  aria-label="Tên của bạn"
                  className="px-3 py-2 text-body-sm rounded border border-light-outline bg-white focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
                <input
                  type="tel"
                  id="quickPhoneInput"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Nhập số điện thoại của bạn..."
                  aria-label="Số điện thoại nhận tư vấn"
                  className="px-3 py-2 text-body-sm rounded border border-light-outline bg-white focus:outline-none focus:ring-2 focus:ring-light-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-accent hover:bg-accent-hover text-white font-label text-label-sm font-bold rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  support_agent
                </span>
                <span>Gửi Yêu Cầu Gọi Lại Ngay</span>
              </button>

              {error && (
                <p
                  role="alert"
                  className="text-xs text-red-600 font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">error</span>
                  <span>{error}</span>
                </p>
              )}

              {submitted && (
                <p
                  id="callbackSuccess"
                  role="status"
                  className="text-xs text-fresh-green font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    check_circle
                  </span>
                  <span>
                    Đã gửi! Nhân viên Yến Hải ({STORE_PHONE_DISPLAY}) sẽ gọi lại cho bạn ngay.
                  </span>
                </p>
              )}
            </form>
          </div>

          <div className="pt-3 border-t border-light-outline-variant flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-light-outline text-light-on-surface font-label text-label-sm hover:bg-light-surface-container cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
