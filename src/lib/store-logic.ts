import defaultProductsData from '../data/products.json';

export type ProductCategory = 'all' | 'fresh' | 'frozen' | 'dried';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';

/**
 * Cấu trúc dữ liệu JSON của một sản phẩm hải sản (nạp từ `src/data/products.json`).
 * Mỗi trường dưới đây đều có tác dụng cụ thể đối với Giao diện (UI/UX), Chốt đơn (Sale) và Google SEO:
 */
export interface Product {
  /** Mã định danh duy nhất của sản phẩm (số nguyên: 1, 2, 3...) dùng làm key và định danh giỏ hàng */
  id: number;

  /** Đường dẫn tĩnh chuẩn SEO (VD: "muc-ong-bien-tuoi-cap-dong-size-lon") dùng làm neo #id trong Schema.org Product */
  slug?: string;

  /** Mã quản lý kho hàng SKU (VD: "YH-MUC-ONG-01") bắt buộc trong Google Merchant / Product Structured Data */
  sku?: string;

  /** Tên đầy đủ của sản phẩm hiển thị trên thẻ sản phẩm Desktop và thẻ <h3> chuẩn SEO */
  name: string;

  /** Tên rút gọn hiển thị trên giao diện Mobile Bio để không bị tràn dòng trên màn hình nhỏ */
  mobileName: string;

  /** Thuộc tính `title` của thẻ <img> và thẻ link sản phẩm giúp Google Image Search hiểu rõ ngữ cảnh sản phẩm */
  seoTitle?: string;

  /** Thuộc tính `alt` mô tả chi tiết hình ảnh thực tế của sản phẩm giúp tối ưu SEO Google Hình Ảnh và trình đọc màn hình */
  seoAlt?: string;

  /** Phân nhóm danh mục sản phẩm: 'fresh' (Tươi sống), 'frozen' (Đông lạnh), 'dried' (Đồ khô) */
  category: Exclude<ProductCategory, 'all'>;

  /** Giá tham chiếu nội bộ (VNĐ). Khi `showPrice === false`, toàn bộ giao diện sẽ ẩn số tiền này và hiển thị `priceText` ("Giá: Liên hệ") */
  price: number;

  /**
   * Cờ bật/tắt hiển thị số tiền cụ thể:
   * - `false` (mặc định hiện tại): Ẩn toàn bộ giá tiền bằng số và hiển thị chữ `"Giá: Liên hệ"` trên mọi màn hình.
   * - `true`: Hiển thị giá tiền cụ thể theo trường `price`.
   */
  showPrice?: boolean;

  /** Chuỗi văn bản hiển thị thay thế cho giá tiền khi `showPrice === false` (Mặc định: `"Giá: Liên hệ"`) */
  priceText?: string;

  /**
   * Cờ bật/tắt hiển thị giảm giá:
   * - `true`: Hiển thị giá gốc gạch ngang (`originalPrice`) kèm nhãn tiết kiệm để kích thích chốt sale (chỉ khi `showPrice === true`).
   * - `false` (hoặc bỏ trống): Ẩn hoàn toàn mọi thông tin giảm giá.
   */
  hasDiscount?: boolean;

  /** Giá gốc trước khi giảm (VNĐ). Chỉ hiển thị trên giao diện khi `showPrice === true`, `hasDiscount === true` và `originalPrice > price` */
  originalPrice?: number;

  /** Đơn vị tính hiển thị trên bản Desktop (VD: "/ kg", "/ khay 500g", "/ kg (2 khay 500g)") */
  unit: string;

  /** Đơn vị tính ngắn gọn hiển thị trên bản Mobile (VD: "/ kg", "/ khay") */
  mobileUnit: string;

  /** Đường dẫn ảnh chụp thực tế của sản phẩm (VD: "/assets/aistudio/...") */
  image: string;

  /** Đường dẫn video quay thực tế sản phẩm tại vựa (`.mp4`) để khách xem trực tiếp độ tươi ngon */
  videoUrl?: string;

  /** Nhãn cam kết nổi bật góc trên bên trái ảnh sản phẩm (VD: "Tươi rói trong ngày", "Hấp sơ cấp đông") */
  badgeLeft: string;

  /** Tên icon Material Symbols đi kèm nhãn trái (VD: "ac_unit" cho hàng đông lạnh, "wb_sunny" cho đồ khô) */
  badgeLeftIcon?: string;

  /** Nhãn điểm mạnh bán hàng góc trên bên phải ảnh sản phẩm (VD: "Bao ăn 1 đổi 1", "100% Full trứng") */
  badgeRight: string;

  /** Tông màu của nhãn góc phải: 'coral' (Đỏ cam), 'emerald' (Xanh lá tươi), 'sky' (Xanh biển), 'amber' (Vàng nắng) */
  badgeRightStyle: 'coral' | 'emerald' | 'sky' | 'amber';

  /** Nhãn ngắn hiển thị đè lên góc ảnh trong giao diện Mobile (VD: "Full trứng", "Mực tươi") */
  mobileBadge: string;

  /** Dòng tiêu đề phụ tạo điểm nhấn trên thẻ sản phẩm Mobile (VD: "Thân dày giòn ngọt") */
  mobileKicker: string;

  /** Lớp màu CSS Tailwind cho dòng `mobileKicker` (VD: "text-accent", "text-fresh-green") */
  mobileKickerColor: string;

  /** Dòng thông tin ngắn dưới ảnh sản phẩm (VD: "Ghe biển Hoằng Tiến về sáng sớm • Size 6-8 con/kg") */
  subtitle: string;

  /** Điểm đánh giá sao trung bình (VD: 4.9, 5.0) hiển thị trên thẻ và bơm vào Schema.org AggregateRating */
  rating: number;

  /** Tổng số lượt khách hàng đã đánh giá/mua (VD: 142) tạo hiệu ứng Social Proof và Rich Snippet trên Google */
  reviewsCount: number;

  /** Mô tả chi tiết đặc điểm, nguồn gốc và gợi ý món ngon (hiển thị trên Desktop và thẻ meta `itemProp="description"`) */
  description: string;

  /** Mô tả 1 dòng súc tích dành riêng cho giao diện Mobile */
  mobileDescription: string;

  /** Nguồn gốc đánh bắt / chế biến cụ thể hiển thị trong bảng thông số Trang Chi Tiết Sản Phẩm */
  origin?: string;

  /** Hướng dẫn bảo quản và rã đông chuẩn hiển thị trong Trang Chi Tiết Sản Phẩm */
  storageGuide?: string;

  /** Danh sách 3 điểm nổi bật xúc tích (bullet points) giúp khách nắm bắt nhanh giá trị cốt lõi của sản phẩm */
  highlights?: string[];

  /** Danh sách các món ngon gợi ý chế biến từ sản phẩm giúp tăng tỷ lệ chốt đơn và tối ưu từ khóa SEO ẩm thực */
  bestDishes?: string[];

  /** Danh sách các tùy chọn sơ chế / đóng gói miễn phí để khách chọn trong hộp thoại xem nhanh */
  prepOptions: string[];

  /** Danh sách quy cách đóng gói (500g, 1kg...) và hệ số nhân giá (`priceMultiplier`) tương ứng */
  sizeOptions: { label: string; priceMultiplier: number }[];

  /** Thứ tự ưu tiên hiển thị khi sắp xếp theo chế độ "Nổi bật nhất" (số nhỏ đứng trước) */
  featuredOrder: number;

  /** Trạng thái tồn kho thực tế tại vựa (VD: "Mới về sáng nay tại vựa") */
  stockStatus: string;
}

/**
 * Cấu trúc dữ liệu cho một Video thực tế quay trực tiếp tại Vựa Hải Sản Yến Hải.
 * Tối ưu cho cả trải nghiệm người xem và Schema.org `VideoObject` của Google Video SEO.
 */
export interface StoreVideoItem {
  /** Mã định danh duy nhất của video */
  id: string;
  /** Tiêu đề chuẩn SEO của video */
  title: string;
  /** Mô tả chi tiết nội dung video thực tế tại vựa */
  description: string;
  /** Đường dẫn file video `.mp4` trong thư mục `/assets/aistudio/` */
  videoUrl: string;
  /** Đường dẫn ảnh đại diện (thumbnail/poster) của video */
  thumbnailUrl: string;
  /** Nhãn phân loại ngắn hiển thị trên góc video */
  badge: string;
  /** ID sản phẩm liên kết trực tiếp để khách bấm đặt mua ngay khi đang xem video */
  productId: number;
  /** Ngày đăng tải chuẩn ISO 8601 cho Schema.org VideoObject */
  uploadDate: string;
}

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface CustomerReviewItem {
  id: string;
  author: string;
  location: string;
  productBought: string;
  rating: number;
  datePublished: string;
  comment: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  qty: number;
  img: string;
  unit: string;
  prepNote?: string;
}

export interface ComboPackage {
  /** Mã định danh của gói Combo */
  id: string;
  /** Tên gói Combo hiển thị nổi bật */
  title: string;
  /** Mô tả quyền lợi đi kèm của gói Combo */
  subtitle: string;
  /** Danh sách các sản phẩm thành phần có trong Combo */
  itemsIncluded: string[];
  /** Giá tham chiếu nội bộ của Combo (VNĐ) */
  price: number;
  /** Cờ bật/tắt hiển thị số tiền cụ thể của Combo (`false` sẽ hiện `priceText`: "Giá: Liên hệ") */
  showPrice?: boolean;
  /** Chuỗi hiển thị khi ẩn giá Combo (Mặc định: `"Giá: Liên hệ"`) */
  priceText?: string;
  /** Cờ bật/tắt hiển thị giảm giá cho gói Combo (`true` mới hiện giá gạch ngang và nhãn tiết kiệm) */
  hasDiscount?: boolean;
  /** Giá gốc khi mua lẻ từng món (chỉ hiện khi `showPrice === true` và `hasDiscount === true`) */
  originalPrice?: number;
  /** Nhãn thông báo trên góc ảnh Combo (VD: "Combo Gia Đình", "Combo Quà Biếu") */
  saveBadge: string;
  /** Nhãn phân loại đối tượng phù hợp (VD: "Phù hợp 4-6 người ăn") */
  tag: string;
  /** Đường dẫn ảnh đại diện của gói Combo */
  image: string;
}

export interface CheckoutFormInput {
  fullName: string;
  phone: string;
  address: string;
  deliverySlot: string;
  paymentMethod: 'cod' | 'vietqr' | 'zalo';
  note?: string;
}

export interface CheckoutValidationResult {
  valid: boolean;
  errors: {
    fullName?: string;
    phone?: string;
    address?: string;
  };
}

/** Thông tin liên hệ và địa chỉ chính thức của Vựa Hải Sản Yến Hải */
export const STORE_PHONE = '0356136859';
export const STORE_PHONE_DISPLAY = '0356.136.859';
export const STORE_ZALO_URL = 'https://zalo.me/0356136859';
export const STORE_FACEBOOK_URL =
  'https://web.facebook.com/hai.yen.tran.314077';
export const STORE_ADDRESS =
  'Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa';
export const STORE_ADDRESS_SHORT = 'Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa';
export const STORE_LANDMARK =
  'Gần Trường Tiểu học xã Hoằng Trường (Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa)';
export const STORE_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4462.189218912266!2d105.94396553823036!3d19.872130916226837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31365b42bdaaaaab%3A0x1824cd045891010!2zVHLGsOG7nW5nIFRp4buDdSBo4buNYyBIb-G6sW5nIFRyxrDhu51uZw!5e0!3m2!1svi!2s!4v1794905171675!5m2!1svi!2s';
export const STORE_GOOGLE_MAPS_DIRECT_URL =
  'https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng+Ti%E1%BB%83u+h%E1%BB%8Dc+Ho%E1%BA%B1ng+Tr%C6%B0%E1%BB%9Dng+Th%C3%B4n+Tr%C6%B0%E1%BB%9Dng+Ph%C3%BAc+X%C3%A3+Ho%E1%BA%B1ng+Ti%E1%BA%BFn+Huy%E1%BB%87n+Ho%E1%BA%B1ng+H%C3%B3a+T%E1%BB%89nh+Thanh+H%C3%B3a';

export const HERO_BG_IMAGE =
  '/assets/aistudio/1794885567341_2584028512014311615_2584028512014311615_5156174eb2025c8d42ebf3d33900b3cf_ebfdf389.jpg';

export const PRODUCTS: Product[] = defaultProductsData as Product[];

/**
 * Danh sách 6 video thực tế quay trực tiếp tại Vựa Hải Sản Yến Hải (Xã Hoằng Tiến, Tỉnh Thanh Hóa).
 */
export const REAL_VIDEOS: StoreVideoItem[] = [
  {
    id: 'video-bebe-trung',
    title: 'Cận Cảnh Bề Bề (Tôm Tít) Nõn Full Trứng Bẻ Đôi Đầy Gạch Béo',
    description:
      'Quay trực tiếp tại vựa Yến Hải: Bề bề biển Hoằng Tiến hấp sơ bóc vỏ, bẻ đôi thân đầy ắp trứng vàng béo ngậy.',
    videoUrl:
      '/assets/aistudio/1794885455088_2584028512014311615_2584028512014311615_b939e0bc.mp4',
    thumbnailUrl:
      '/assets/aistudio/1794885523462_2584028512014311615_2584028512014311615_f7216f00e0997a58958456d9ff4edad4_c4763147.jpg',
    badge: '100% Full trứng',
    productId: 4,
    uploadDate: '2026-11-15'
  },
  {
    id: 'video-non-tom-khay',
    title: 'Khay Nõn Tôm Biển Hấp Bóc Sẵn Size Đại Đỏ Au Chắc Thịt',
    description:
      'Nõn tôm biển tự nhiên vừa hấp chín tới và bóc vỏ thủ công trong ngày, con tôm to tròn đỏ au, săn chắc ngọt lịm.',
    videoUrl:
      '/assets/aistudio/1794900489030_2584028512014311615_2584028512014311615_e49d681d.mp4',
    thumbnailUrl:
      '/assets/aistudio/1794900489014_2584028512014311615_2584028512014311615_f4ccd4933618ac51465c6c744cd40ce6_4d0f4111.jpg',
    badge: 'Nõn tôm biển đại',
    productId: 5,
    uploadDate: '2026-11-16'
  },
  {
    id: 'video-tom-bien-tuoi-1',
    title: 'Tôm He / Tôm Bộp Biển Tươi Rói Đầu Gạch Đóng Hộp Trong Suốt',
    description:
      'Tôm biển tự nhiên đánh bắt từ ghe lưới vùng biển Hoằng Tiến - Thanh Hóa, vỏ bóng mỏng, đầu nhiều gạch béo.',
    videoUrl:
      '/assets/aistudio/1794900489005_2584028512014311615_2584028512014311615_399ddce0.mp4',
    thumbnailUrl:
      '/assets/aistudio/1794900489014_2584028512014311615_2584028512014311615_f4ccd4933618ac51465c6c744cd40ce6_4d0f4111.jpg',
    badge: 'Tôm biển ghe ngày',
    productId: 6,
    uploadDate: '2026-11-16'
  },
  {
    id: 'video-bebe-khay-vip',
    title: 'Bề Bề Nõn Đóng Khay VIP Hút Chân Không Sẵn Sàng Giao Xa',
    description:
      'Từng khay bề bề nõn 500g được xếp đều tăm tắp, đóng khay hút chân không sạch sẽ gửi đi các tỉnh.',
    videoUrl:
      '/assets/aistudio/1794885433672_2584028512014311615_2584028512014311615_a7422ec4.mp4',
    thumbnailUrl:
      '/assets/aistudio/1794885720933_2584028512014311615_2584028512014311615_d7945991a89b97933cca6327cbf2bc3a_b301e1d7.jpg',
    badge: 'Đóng khay VIP 500g',
    productId: 9,
    uploadDate: '2026-11-15'
  },
  {
    id: 'video-ro-non-tom-moi-hap',
    title: 'Rổ & Khay Nõn Tôm Biển Vừa Ra Lò Tại Vựa Hải Sản Yến Hải',
    description:
      'Quay thực tế mẻ nõn tôm biển và bề bề vừa hấp chín tới, bóc thủ công sạch chỉ lưng tại xã Hoằng Tiến, Thanh Hóa.',
    videoUrl:
      '/assets/aistudio/1794900489035_2584028512014311615_2584028512014311615_af008604.mp4',
    thumbnailUrl:
      '/assets/aistudio/1794885523423_2584028512014311615_2584028512014311615_d8a2a52804059a0b6f1959de7bae94e5_a0fd1f34.jpg',
    badge: 'Mới hấp trong ngày',
    productId: 8,
    uploadDate: '2026-11-16'
  },
  {
    id: 'video-tom-bien-dong-hop-2',
    title: 'Tôm Biển Tươi Tuyển Chọn Đóng Hộp Giữ Lạnh Giao Tận Nơi',
    description:
      'Tôm biển tươi sống phân size đều đẹp, đóng hộp bảo quản lạnh giao nhanh cho khách gia đình và nhà hàng.',
    videoUrl:
      '/assets/aistudio/1794900489009_2584028512014311615_2584028512014311615_b44f5fb0.mp4',
    thumbnailUrl:
      '/assets/aistudio/1794900489014_2584028512014311615_2584028512014311615_f4ccd4933618ac51465c6c744cd40ce6_4d0f4111.jpg',
    badge: 'Bao tươi 1 đổi 1',
    productId: 6,
    uploadDate: '2026-11-16'
  }
];

/**
 * Giỏ hàng mặc định khởi tạo rỗng hoàn toàn (không nạp sẵn dữ liệu mẫu).
 */
export const INITIAL_CART: CartItem[] = [];

export const COMBO_PACKAGES: ComboPackage[] = [
  {
    id: 'combo-bebe-muc-ca',
    title: 'Combo Gia Đình Hải Sản Tươi Ngọt (4-6 Người)',
    subtitle:
      'Hỗ trợ làm sạch sẵn + Đóng thùng xốp giữ lạnh chuyên dụng giao tận nơi',
    itemsIncluded: [
      '1kg Bề Bề (Tôm Tít) Bóc Nõn Full Trứng (2 khay)',
      '1kg Nõn Tôm Biển Hấp Bóc Sẵn (Size Đại)',
      '1kg Mực Ống Biển Tươi Cấp Đông (Size Lớn)',
      '1kg Cá Thu Phấn Tươi Cắt Khoanh (Khoanh giữa)'
    ],
    price: 0,
    showPrice: false,
    priceText: 'Giá: Liên hệ',
    hasDiscount: false,
    saveBadge: 'Combo Gia Đình',
    tag: 'Được đặt nhiều nhất tuần',
    image: PRODUCTS[3].image
  },
  {
    id: 'combo-gift-dock',
    title: 'Combo Lẩu Nướng & Quà Biếu Hải Sản Biển Hoằng Tiến',
    subtitle:
      'Đóng thùng xốp hút chân không lịch sự đi biếu hoặc gửi xe toàn quốc',
    itemsIncluded: [
      '1kg Tôm He / Tôm Bộp Biển Tươi Đóng Hộp',
      '1kg Bạch Tuộc Biển Tươi Sống Đóng Khay',
      '1kg Bề Bề (Tôm Tít) Nõn Thịt Size Đại Mới Hấp',
      '1kg Cá Khô Rút Xương Phơi Nắng Tự Nhiên'
    ],
    price: 0,
    showPrice: false,
    priceText: 'Giá: Liên hệ',
    hasDiscount: false,
    saveBadge: 'Combo Tiệc & Biếu',
    tag: 'Đặc sản Hoằng Tiến - Thanh Hóa',
    image: PRODUCTS[4].image
  }
];

export const SEO_FAQS: SeoFaqItem[] = [
  {
    question:
      'Vựa Hải Sản Yến Hải ở đâu và đóng gói gửi hàng đi các tỉnh như thế nào?',
    answer:
      'Vựa Hải Sản Yến Hải đặt tại khu vực Trường Tiểu học xã Hoằng Trường — Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa (nơi ghe thuyền cập bến mỗi sáng sớm). Tất cả mặt hàng tươi sống (Mực ống, Cá thu phấn, Bạch tuộc, Tôm biển) và cấp đông (Bề bề bóc nõn full trứng, Nõn tôm biển hấp bóc sẵn, Khay VIP 500g) đều được đóng khay hút chân không, ủ đá lạnh trong thùng xốp chuyên dụng giao tận nơi tại Thanh Hóa và gửi xe/ship nhanh toàn quốc.'
  },
  {
    question:
      'Vì sao giá hải sản trên web để "Giá: Liên hệ" và làm sao để nhận báo giá nhanh nhất?',
    answer:
      'Do hải sản biển tự nhiên tại Xã Hoằng Tiến phụ thuộc vào con nước, mùa vụ và kích cỡ ghe về mỗi sáng sớm, Hải Sản Yến Hải cập nhật giá gốc tận bến theo ngày để đảm bảo quyền lợi tốt nhất cho khách sỉ & lẻ. Quý khách chỉ cần bấm nút Gọi hoặc Nhắn Zalo 0356.136.859, vựa sẽ gửi video thực tế khay hàng vừa lên và báo giá chính xác ngay lập tức.'
  },
  {
    question: 'Chính sách "Bao ăn 1 đổi 1" tại Hải Sản Yến Hải áp dụng ra sao?',
    answer:
      'Cam kết chất lượng loại 1 từ biển Hoằng Tiến: Nếu hải sản khi nhận không tươi ngon, không đúng quy cách hoặc bề bề full trứng, nõn tôm biển không chuẩn như video quay tại vựa, quý khách chỉ cần chụp ảnh/quay video gửi qua Zalo 0356.136.859 hoặc Facebook Hải Sản Yến Hải, vựa sẽ đổi mới 100% hoặc hoàn tiền ngay lập tức.'
  },
  {
    question:
      'Vựa có hỗ trợ làm sạch, sơ chế sẵn và bỏ sỉ cho nhà hàng, khách du lịch không?',
    answer:
      'Có! Yến Hải miễn phí 100% công làm sạch túi mực, cắt khoanh cá thu, bóc nõn tôm/bề bề, đóng khay 500g hút chân không làm quà biếu. Đồng thời vựa chuyên cung cấp sỉ & lẻ số lượng lớn Mực ống, Bề bề nõn, Nõn tôm biển, Tôm bộp tươi, Cá thu khoanh, Bạch tuộc và Cá khô rút xương cho nhà hàng, quán ăn, khách du lịch biển Hải Tiến - Hoằng Tiến với giá gốc tận bến.'
  }
];

export const CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Chị Minh Thư',
    location: 'TP. Thanh Hóa',
    productBought: 'Bề Bề (Tôm Tít) Bóc Nõn Full Trứng & Nõn Tôm Biển',
    rating: 5,
    datePublished: '2026-11-10',
    comment:
      'Khay bề bề nõn full trứng và nõn tôm biển của Yến Hải ở Hoằng Tiến đỉnh thật sự! Con nào cũng to đều, dọc sống lưng đầy gạch vàng béo ngậy. Mình mua về rim me và nấu bún cả nhà khen tấm tắc.'
  },
  {
    id: 'rev-2',
    author: 'Anh Hoàng Nam',
    location: 'Hà Nội',
    productBought: 'Mực Ống Biển Tươi Cấp Đông & Tôm Biển Đóng Hộp',
    rating: 5,
    datePublished: '2026-11-12',
    comment:
      'Đặt thùng hải sản từ vựa Yến Hải Hoằng Tiến gửi xe lên Hà Nội vẫn đông cứng tươi rói. Mực ống size lớn da nhấp nhánh, tôm biển đóng hộp đầu nhiều gạch, hấp gừng hành ngọt lịm.'
  },
  {
    id: 'rev-3',
    author: 'Cô Ngọc Lan',
    location: 'Hoằng Hóa, Thanh Hóa',
    productBought: 'Cá Thu Phấn Tươi Cắt Khoanh & Cá Khô Rút Xương',
    rating: 5,
    datePublished: '2026-11-14',
    comment:
      'Cá thu phấn khoanh giữa đặc thịt, hồng tươi, chiên sốt cà cho các cháu ăn yên tâm vì không có xương dăm. Cá khô rút xương phơi nắng biển Hoằng Tiến thơm dẻo, vị vừa vặn.'
  }
];

export const FREE_SHIPPING_THRESHOLD = 1000000;
export const STANDARD_SHIPPING_FEE = 0;

/**
 * Hàm định dạng hiển thị giá.
 * Theo yêu cầu ẩn toàn bộ giá số trên trang web: Khi `amount <= 0` hoặc mặc định không truyền cờ `showNumeric = true`,
 * hàm trả về `"Giá: Liên hệ"`.
 */
export function formatVND(amount: number, showNumeric = false): string {
  if (!showNumeric || !Number.isFinite(amount) || amount <= 0) {
    return 'Giá: Liên hệ';
  }
  return `${Math.round(amount).toLocaleString('vi-VN')}₫`;
}

/**
 * Hàm lấy chuỗi hiển thị giá chuẩn của sản phẩm hoặc gói Combo.
 * Nếu `showPrice === true` và `price > 0` mới hiển thị số tiền VNĐ, ngược lại luôn trả về `"Giá: Liên hệ"`.
 */
export function formatProductPrice(item?: {
  price?: number;
  showPrice?: boolean;
  priceText?: string;
}): string {
  if (!item) return 'Giá: Liên hệ';
  if (item.showPrice === true && typeof item.price === 'number' && item.price > 0) {
    return formatVND(item.price, true);
  }
  return item.priceText || 'Giá: Liên hệ';
}

export function parseAndValidateProductsJson(jsonText: string): {
  valid: boolean;
  products?: Product[];
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return {
        valid: false,
        error: 'JSON phải là một mảng danh sách sản phẩm ([...]) không rỗng.'
      };
    }

    const normalized: Product[] = [];
    for (let i = 0; i < parsed.length; i++) {
      const raw = parsed[i];
      if (!raw || typeof raw !== 'object') {
        return {
          valid: false,
          error: `Phần tử thứ ${i + 1} không phải là đối tượng sản phẩm hợp lệ.`
        };
      }
      if (!raw.name || typeof raw.name !== 'string') {
        return {
          valid: false,
          error: `Sản phẩm thứ ${i + 1} thiếu trường "name" (Tên sản phẩm).`
        };
      }
      const priceNum = Number(raw.price ?? 0);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        return {
          valid: false,
          error: `Sản phẩm "${raw.name}" có giá "price" không hợp lệ.`
        };
      }
      const category =
        raw.category === 'fresh' ||
        raw.category === 'frozen' ||
        raw.category === 'dried'
          ? raw.category
          : 'fresh';

      normalized.push({
        id: Number(raw.id) || i + 1,
        slug: raw.slug || `san-pham-${i + 1}`,
        sku: raw.sku || `YH-SP-0${i + 1}`,
        name: raw.name,
        mobileName: raw.mobileName || raw.name,
        seoTitle:
          raw.seoTitle ||
          `${raw.name} - Giá Liên Hệ | Hải Sản Yến Hải Hoằng Tiến Thanh Hóa`,
        seoAlt:
          raw.seoAlt ||
          `Hình ảnh thực tế ${raw.name} tươi ngon loại 1 tại Vựa Hải Sản Yến Hải xã Hoằng Tiến tỉnh Thanh Hóa`,
        category,
        price: priceNum,
        showPrice: Boolean(raw.showPrice),
        priceText: raw.priceText || 'Giá: Liên hệ',
        hasDiscount: Boolean(raw.hasDiscount),
        originalPrice: raw.originalPrice ? Number(raw.originalPrice) : undefined,
        unit: raw.unit || '/ kg',
        mobileUnit: raw.mobileUnit || raw.unit || '/ kg',
        image:
          raw.image ||
          '/assets/aistudio/1794885567341_2584028512014311615_2584028512014311615_5156174eb2025c8d42ebf3d33900b3cf_ebfdf389.jpg',
        videoUrl: raw.videoUrl || undefined,
        badgeLeft:
          raw.badgeLeft ||
          (category === 'fresh'
            ? 'Tươi sống trong ngày'
            : category === 'frozen'
            ? 'Cấp đông sâu'
            : 'Phơi tự nhiên đủ nắng'),
        badgeLeftIcon:
          raw.badgeLeftIcon ||
          (category === 'frozen'
            ? 'ac_unit'
            : category === 'dried'
            ? 'wb_sunny'
            : undefined),
        badgeRight: raw.badgeRight || 'Bao ăn 1 đổi 1',
        badgeRightStyle:
          raw.badgeRightStyle === 'coral' ||
          raw.badgeRightStyle === 'emerald' ||
          raw.badgeRightStyle === 'sky' ||
          raw.badgeRightStyle === 'amber'
            ? raw.badgeRightStyle
            : 'coral',
        mobileBadge: raw.mobileBadge || 'Loại 1',
        mobileKicker: raw.mobileKicker || 'Bao tươi ngon',
        mobileKickerColor: raw.mobileKickerColor || 'text-accent',
        subtitle: raw.subtitle || 'Tuyển chọn loại 1 tại vựa Yến Hải',
        rating: Number(raw.rating) || 5.0,
        reviewsCount: Number(raw.reviewsCount) || 88,
        description:
          raw.description ||
          'Hải sản tuyển chọn loại 1 tại vựa Hải Sản Yến Hải xã Hoằng Tiến tỉnh Thanh Hóa, cam kết bao tươi ngon 1 đổi 1.',
        mobileDescription:
          raw.mobileDescription ||
          raw.description ||
          'Hải sản loại 1 bao tươi ngon.',
        origin: raw.origin || `Vùng biển ${STORE_ADDRESS}`,
        storageGuide:
          raw.storageGuide ||
          'Đóng khay bảo quản lạnh tiêu chuẩn, giữ trọn độ tươi ngon.',
        highlights: Array.isArray(raw.highlights) ? raw.highlights : undefined,
        bestDishes: Array.isArray(raw.bestDishes) ? raw.bestDishes : undefined,
        prepOptions:
          Array.isArray(raw.prepOptions) && raw.prepOptions.length > 0
            ? raw.prepOptions
            : ['Đóng khay bảo quản lạnh tiêu chuẩn', 'Sơ chế làm sạch miễn phí'],
        sizeOptions:
          Array.isArray(raw.sizeOptions) && raw.sizeOptions.length > 0
            ? raw.sizeOptions
            : [
                { label: 'Khay 500g', priceMultiplier: 1 },
                { label: 'Phần 1kg tiêu chuẩn', priceMultiplier: 1 }
              ],
        featuredOrder: Number(raw.featuredOrder) || i + 1,
        stockStatus: raw.stockStatus || 'Đang sẵn hàng tại vựa'
      });
    }

    return { valid: true, products: normalized };
  } catch (err) {
    return {
      valid: false,
      error: `Lỗi cú pháp JSON: ${(err as Error).message}`
    };
  }
}

/**
 * Chuẩn hóa chuỗi tiếng Việt để tìm kiếm không phân biệt dấu và chữ hoa/thường.
 * Ví dụ: "Bề Bề Nõn Trứng" -> "be be non trung", "Đồ Khô" -> "do kho".
 */
export function normalizeVietnameseText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCategorySearchAliases(category: Product['category']): string {
  if (category === 'fresh') return 'tươi sống mới về trong ngày ghe lưới';
  if (category === 'frozen') return 'đông lạnh cấp đông sâu hút chân không';
  return 'đồ khô hải sản khô một nắng phơi nắng quà biếu';
}

export function getProductSearchableText(product: Product): string {
  const raw = [
    product.name,
    product.mobileName,
    product.subtitle,
    product.description,
    product.mobileDescription,
    product.badgeLeft,
    product.badgeRight,
    product.origin || '',
    product.sku || '',
    getCategorySearchAliases(product.category),
    ...(product.highlights || []),
    ...(product.bestDishes || [])
  ].join(' ');
  return normalizeVietnameseText(raw);
}

export function matchesProductQuery(product: Product, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  const searchable = getProductSearchableText(product);
  const words = searchable.split(/[^a-z0-9]+/).filter(Boolean);
  const tokens = normalizedQuery.split(' ').filter(Boolean);
  if (tokens.length === 0) return true;

  // Check exact word-boundary phrase first (e.g. "be be" must match adjacent words "be be", not "beo" + "ben")
  const paddedWords = ` ${words.join(' ')} `;
  if (paddedWords.includes(` ${tokens.join(' ')} `)) return true;

  // Multi-token unordered fallback: short tokens (<=2 chars like "ca", "be") match exact words;
  // longer tokens (>=3 chars) also allow prefix match for mid-word typing.
  const requiredCounts = new Map<string, number>();
  for (const token of tokens) {
    requiredCounts.set(token, (requiredCounts.get(token) || 0) + 1);
  }

  for (const [token, needed] of requiredCounts.entries()) {
    let matches = 0;
    for (const word of words) {
      if (word === token || (token.length >= 3 && word.startsWith(token))) {
        matches++;
      }
    }
    if (matches < needed) return false;
  }

  return true;
}

export function getSearchSuggestions(
  products: Product[],
  searchQuery: string,
  limit = 6
): Product[] {
  const normalizedQuery = normalizeVietnameseText(searchQuery);
  if (!normalizedQuery) return [];

  const matched = products.filter((p) => matchesProductQuery(p, normalizedQuery));
  matched.sort((a, b) => {
    const aName = normalizeVietnameseText(`${a.name} ${a.mobileName}`);
    const bName = normalizeVietnameseText(`${b.name} ${b.mobileName}`);
    const aNameHit = aName.includes(normalizedQuery) ? 0 : 1;
    const bNameHit = bName.includes(normalizedQuery) ? 0 : 1;
    if (aNameHit !== bNameHit) return aNameHit - bNameHit;
    return a.featuredOrder - b.featuredOrder;
  });
  return matched.slice(0, limit);
}

export function filterAndSortProducts(
  products: Product[],
  options: {
    category: ProductCategory;
    searchQuery: string;
    sortBy: SortOption;
  }
): Product[] {
  const normalizedQuery = normalizeVietnameseText(options.searchQuery);

  const filtered = products.filter((product) => {
    const matchesCategory =
      options.category === 'all' || product.category === options.category;
    if (!matchesCategory) return false;

    return matchesProductQuery(product, normalizedQuery);
  });

  const sorted = [...filtered];
  if (options.sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price || a.featuredOrder - b.featuredOrder);
  } else if (options.sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price || a.featuredOrder - b.featuredOrder);
  } else if (options.sortBy === 'rating-desc') {
    sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  } else {
    sorted.sort((a, b) => a.featuredOrder - b.featuredOrder);
  }

  return sorted;
}

export function addCartItem(
  cart: CartItem[],
  item: {
    productId: number;
    name: string;
    price: number;
    img: string;
    unit?: string;
    prepNote?: string;
    qty?: number;
  }
): CartItem[] {
  const addQty = item.qty ?? 1;
  const existingIndex = cart.findIndex(
    (c) =>
      c.name === item.name &&
      (c.prepNote || '') === (item.prepNote || '') &&
      c.price === item.price
  );

  if (existingIndex > -1) {
    return cart.map((c, idx) =>
      idx === existingIndex ? { ...c, qty: c.qty + addQty } : c
    );
  }

  return [
    ...cart,
    {
      id: Date.now() + Math.floor(Math.random() * 1000),
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: addQty,
      img: item.img,
      unit: item.unit || '/ kg',
      prepNote: item.prepNote
    }
  ];
}

export function updateCartItemQty(
  cart: CartItem[],
  itemId: number,
  delta: number
): CartItem[] {
  return cart
    .map((item) =>
      item.id === itemId ? { ...item, qty: item.qty + delta } : item
    )
    .filter((item) => item.qty > 0);
}

export function calculateCartTotals(cart: CartItem[]): {
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  amountToFreeShipping: number;
  freeShippingProgress: number;
  grandTotal: number;
} {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    totalItems,
    subtotal,
    shippingFee: 0,
    isFreeShipping: true,
    amountToFreeShipping: 0,
    freeShippingProgress: 100,
    grandTotal: subtotal
  };
}

export function validateVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s.-]/g, '');
  return /^(0|\+84)[35789]\d{8}$/.test(cleaned) || /^0\d{8,10}$/.test(cleaned);
}

export function validateCheckoutForm(
  input: CheckoutFormInput
): CheckoutValidationResult {
  const errors: CheckoutValidationResult['errors'] = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Vui lòng nhập họ và tên người nhận';
  }
  if (!input.phone || !validateVietnamesePhone(input.phone)) {
    errors.phone = 'Vui lòng nhập số điện thoại hợp lệ (10 số)';
  }
  if (!input.address || input.address.trim().length < 5) {
    errors.address = 'Vui lòng nhập địa chỉ nhận hàng chi tiết';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function buildZaloOrderMessage(
  cart: CartItem[],
  customer?: Partial<CheckoutFormInput>
): string {
  const totals = calculateCartTotals(cart);
  const itemsText = cart
    .map(
      (i) =>
        `- ${i.name} (Số lượng: ${i.qty} ${i.unit.replace('/', '').trim()})${
          i.prepNote ? ` [${i.prepNote}]` : ''
        } — Giá: Liên hệ`
    )
    .join('\n');

  const customerLine = customer?.phone
    ? `\nKhách hàng: ${customer.fullName || 'Khách đặt nhanh'} - SĐT: ${customer.phone}${
        customer.address ? ` - Đ/c: ${customer.address}` : ''
      }`
    : '';

  return `Chào Hải Sản Yến Hải (${STORE_PHONE_DISPLAY}), tôi muốn đặt và nhận báo giá ${totals.totalItems} phần hải sản:\n${itemsText}\nBáo giá: Liên hệ theo cân thực tế tại vựa.${customerLine}\nNhờ vựa tư vấn và báo giá giúp tôi!`;
}

export function getProductSlug(product: Product): string {
  return product.slug?.trim() || `san-pham-${product.id}`;
}

export function getProductRoutePath(product: Product): string {
  return `/san-pham/${getProductSlug(product)}`;
}

export function extractSlugFromPathname(pathname: string): string | null {
  const cleanPath = (pathname || '/').split('?')[0].split('#')[0];
  const match = cleanPath.match(/^\/san-pham\/([^/]+)\/?$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function findProductBySlug(
  products: Product[],
  slug: string | null | undefined
): Product | undefined {
  if (!slug) return undefined;
  return products.find((p) => getProductSlug(p) === slug);
}

