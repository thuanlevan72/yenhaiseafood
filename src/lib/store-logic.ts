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

  /** Thuộc tính `title` của thẻ <img> và thẻ link sản phẩm giúp Google Image Search hiểu rõ ngữ cảnh và giá bán */
  seoTitle?: string;

  /** Thuộc tính `alt` mô tả chi tiết hình ảnh thực tế của sản phẩm giúp tối ưu SEO Google Hình Ảnh và trình đọc màn hình */
  seoAlt?: string;

  /** Phân nhóm danh mục sản phẩm: 'fresh' (Tươi sống), 'frozen' (Đông lạnh), 'dried' (Đồ khô) */
  category: Exclude<ProductCategory, 'all'>;

  /** Giá bán thực tế hiện tại tính bằng VNĐ (VD: 320000 -> hiển thị 320.000₫) */
  price: number;

  /**
   * Cờ bật/tắt hiển thị giảm giá:
   * - `true`: Hiển thị giá gốc gạch ngang (`originalPrice`) kèm nhãn tiết kiệm để kích thích chốt sale.
   * - `false` (hoặc bỏ trống): Chỉ hiển thị giá bán chuẩn (`price`), ẩn hoàn toàn mọi thông tin giảm giá.
   */
  hasDiscount?: boolean;

  /** Giá gốc trước khi giảm (VNĐ). Chỉ hiển thị trên giao diện khi `hasDiscount === true` và `originalPrice > price` */
  originalPrice?: number;

  /** Đơn vị tính hiển thị trên bản Desktop (VD: "/ kg", "/ khay 500g", "/ kg (2 khay 500g)") */
  unit: string;

  /** Đơn vị tính ngắn gọn hiển thị trên bản Mobile (VD: "/ kg") */
  mobileUnit: string;

  /** Đường dẫn ảnh chụp thực tế của sản phẩm (VD: "/assets/aistudio/...") */
  image: string;

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

  /** Danh sách các tùy chọn sơ chế / đóng gói miễn phí để khách chọn trong hộp thoại xem nhanh */
  prepOptions: string[];

  /** Danh sách quy cách đóng gói (500g, 1kg...) và hệ số nhân giá (`priceMultiplier`) tương ứng */
  sizeOptions: { label: string; priceMultiplier: number }[];

  /** Thứ tự ưu tiên hiển thị khi sắp xếp theo chế độ "Nổi bật nhất" (số nhỏ đứng trước) */
  featuredOrder: number;

  /** Trạng thái tồn kho thực tế tại vựa (VD: "Mới về 25kg sáng nay tại vựa") */
  stockStatus: string;
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
  /** Giá bán trọn gói của Combo (VNĐ) */
  price: number;
  /** Cờ bật/tắt hiển thị giảm giá cho gói Combo (`true` mới hiện giá gạch ngang và nhãn tiết kiệm) */
  hasDiscount?: boolean;
  /** Giá gốc khi mua lẻ từng món (chỉ hiện khi `hasDiscount === true`) */
  originalPrice?: number;
  /** Nhãn thông báo trên góc ảnh Combo (VD: "Combo Gia Đình", "Combo Quà Biếu") */
  saveBadge: string;
  /** Nhãn phân loại đối tượng phù hợp (VD: "Phù hợp 4-6 người ăn") */
  tag: string;
  /** Đường dẫn ảnh đại diện của gói Combo */
  image: string;
}

export interface BioSample {
  id: string;
  title: string;
  titleColorClass: string;
  charCount: number;
  maxChars: number;
  content: string;
  recommended?: boolean;
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
export const STORE_ADDRESS = 'Xã Hoằng Tiến, Tỉnh Thanh Hóa';

export const HERO_BG_IMAGE =
  '/assets/aistudio/1794885567341_2584028512014311615_2584028512014311615_5156174eb2025c8d42ebf3d33900b3cf_ebfdf389.jpg';

export const PRODUCTS: Product[] = defaultProductsData as Product[];

export const INITIAL_CART: CartItem[] = [
  {
    id: 1,
    productId: 4,
    name: PRODUCTS[3].name,
    price: PRODUCTS[3].price,
    qty: 1,
    img: PRODUCTS[3].image,
    unit: PRODUCTS[3].unit,
    prepNote: PRODUCTS[3].prepOptions[0]
  },
  {
    id: 2,
    productId: 1,
    name: PRODUCTS[0].name,
    price: PRODUCTS[0].price,
    qty: 1,
    img: PRODUCTS[0].image,
    unit: PRODUCTS[0].unit,
    prepNote: PRODUCTS[0].prepOptions[0]
  },
  {
    id: 3,
    productId: 2,
    name: PRODUCTS[1].name,
    price: PRODUCTS[1].price,
    qty: 1,
    img: PRODUCTS[1].image,
    unit: PRODUCTS[1].unit,
    prepNote: PRODUCTS[1].prepOptions[0]
  }
];

export const COMBO_PACKAGES: ComboPackage[] = [
  {
    id: 'combo-bebe-muc-ca',
    title: 'Combo Gia Đình Hải Sản Tươi Ngọt (4-6 Người)',
    subtitle: 'Hỗ trợ làm sạch sẵn + Đóng thùng xốp giữ lạnh chuyên dụng giao tận nơi',
    itemsIncluded: [
      '1kg Bề Bề (Tôm Tít) Bóc Nõn Full Trứng (2 khay)',
      '1kg Mực Ống Biển Tươi Cấp Đông (Size Lớn)',
      '1kg Cá Thu Phấn Tươi Cắt Khoanh (Khoanh giữa)'
    ],
    price: 950000,
    hasDiscount: false,
    originalPrice: 950000,
    saveBadge: 'Combo Gia Đình',
    tag: 'Được đặt nhiều nhất tuần',
    image: PRODUCTS[3].image
  },
  {
    id: 'combo-gift-dock',
    title: 'Combo Lẩu Nướng & Quà Biếu Hải Sản Biển Hoằng Tiến',
    subtitle: 'Đóng thùng xốp hút chân không lịch sự đi biếu hoặc gửi xe toàn quốc',
    itemsIncluded: [
      '1kg Bạch Tuộc Biển Tươi Sống Đóng Khay',
      '1kg Bề Bề (Tôm Tít) Nõn Thịt Size Đại Mới Hấp',
      '1kg Cá Khô Rút Xương Phơi Nắng Tự Nhiên'
    ],
    price: 760000,
    hasDiscount: false,
    originalPrice: 760000,
    saveBadge: 'Combo Tiệc & Biếu',
    tag: 'Đặc sản Hoằng Tiến - Thanh Hóa',
    image: PRODUCTS[0].image
  }
];

export const BIO_SAMPLES: BioSample[] = [
  {
    id: 'bioText1',
    title: 'Mẫu 1: Trực diện, Chuyên nghiệp',
    titleColorClass: 'text-accent',
    charCount: 206,
    maxChars: 255,
    recommended: true,
    content:
      'Hải Sản Yến Hải chuyên cung cấp sỉ & lẻ đa dạng mặt hàng: Hải sản tươi sống về trong ngày, hải sản khô tuyển chọn và hàng đông lạnh chất lượng cao. Cam kết uy tín, bao tươi ngon. Liên hệ ngay!'
  },
  {
    id: 'bioText2',
    title: 'Mẫu 2: Nhấn mạnh quy mô đầy đủ',
    titleColorClass: 'text-ocean-blue',
    charCount: 217,
    maxChars: 255,
    content:
      'Cần hải sản gì, Yến Hải cũng có! Chúng tôi chuyên phân phối trọn gói hải sản: Tươi sống bơi tại hồ - Hàng khô hút chân không làm quà biếu - Hàng đông lạnh chuẩn xuất khẩu tiện lợi. Giao hàng tận nơi!'
  },
  {
    id: 'bioText3',
    title: 'Mẫu 3: Ngắn gọn, dễ nhớ',
    titleColorClass: 'text-fresh-green',
    charCount: 213,
    maxChars: 255,
    content:
      'Hải Sản Yến Hải - Thế giới hải sản thu nhỏ. Chuyên bán buôn, bán lẻ các loại hải sản: Tươi sống 100%, đồ khô một nắng đậm đà và hải sản cấp đông giữ trọn dinh dưỡng. Chất lượng loại 1, giá cả bình dân.'
  }
];

export const SEO_FAQS: SeoFaqItem[] = [
  {
    question:
      'Vựa Hải Sản Yến Hải ở đâu và đóng gói gửi hàng đi các tỉnh như thế nào?',
    answer:
      'Vựa Hải Sản Yến Hải đặt tại vùng biển Xã Hoằng Tiến, Tỉnh Thanh Hóa – nơi ghe thuyền cập bến mỗi sáng sớm. Tất cả mặt hàng tươi sống (Mực ống, Cá thu phấn, Bạch tuộc) và cấp đông (Bề bề bóc nõn full trứng, Khay VIP 500g) đều được đóng khay hút chân không, ủ đá lạnh trong thùng xốp chuyên dụng giao tận nơi tại Thanh Hóa và gửi xe/ship nhanh toàn quốc.'
  },
  {
    question: 'Chính sách "Bao ăn 1 đổi 1" tại Hải Sản Yến Hải áp dụng ra sao?',
    answer:
      'Cam kết chất lượng loại 1 từ biển Hoằng Tiến: Nếu hải sản khi nhận không tươi ngon, không đúng quy cách hoặc bề bề full trứng không chuẩn như mô tả, quý khách chỉ cần chụp ảnh/quay video gửi qua Zalo 0356.136.859 hoặc Facebook Hải Sản Yến Hải, vựa sẽ đổi mới 100% hoặc hoàn tiền ngay lập tức.'
  },
  {
    question:
      'Bề bề (tôm tít) bóc nõn full trứng và cá thu phấn cắt khoanh bảo quản được bao lâu?',
    answer:
      'Bề bề bóc nõn full trứng và cá thu phấn cắt khoanh đã được hấp sơ/cắt lát và cấp đông sâu hút chân không nên bảo quản ở ngăn đá tủ lạnh gia đình (-18°C) được từ 2 đến 3 tháng mà vẫn giữ nguyên 99% vị ngọt tự nhiên của biển Hoằng Tiến. Khi chế biến chỉ cần rã đông tự nhiên 10-15 phút.'
  },
  {
    question:
      'Vựa có hỗ trợ làm sạch, sơ chế sẵn và bỏ sỉ cho nhà hàng, khách du lịch không?',
    answer:
      'Có! Yến Hải miễn phí 100% công làm sạch túi mực, cắt khoanh, đóng khay 500g hút chân không làm quà biếu. Đồng thời vựa chuyên cung cấp sỉ & lẻ số lượng lớn Mực ống, Bề bề nõn, Cá thu khoanh, Bạch tuộc và Cá khô rút xương cho nhà hàng, quán ăn, khách du lịch biển Hải Tiến - Hoằng Tiến với giá gốc tận bến.'
  }
];

export const CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Chị Minh Thư',
    location: 'TP. Thanh Hóa',
    productBought: 'Bề Bề (Tôm Tít) Bóc Nõn Full Trứng',
    rating: 5,
    datePublished: '2026-11-10',
    comment:
      'Khay bề bề nõn full trứng của Yến Hải ở Hoằng Tiến đỉnh thật sự! Con nào cũng to đều, dọc sống lưng đầy gạch vàng béo ngậy. Mình mua 2kg về rim me cả nhà khen tấm tắc.'
  },
  {
    id: 'rev-2',
    author: 'Anh Hoàng Nam',
    location: 'Hà Nội',
    productBought: 'Mực Ống Biển Tươi Cấp Đông (Size Lớn)',
    rating: 5,
    datePublished: '2026-11-12',
    comment:
      'Đặt thùng hải sản từ vựa Yến Hải Hoằng Tiến gửi xe lên Hà Nội vẫn đông cứng tươi rói. Mực ống size lớn da nhấp nhánh, hấp gừng hành lên giòn sần sật, ngọt lịm.'
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
export const STANDARD_SHIPPING_FEE = 35000;

export function formatVND(amount: number): string {
  return `${Math.round(amount).toLocaleString('vi-VN')}₫`;
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
      const priceNum = Number(raw.price);
      if (!Number.isFinite(priceNum) || priceNum <= 0) {
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
          `${raw.name} - Giá ${formatVND(priceNum)} ${raw.unit || '/ kg'} | Hải Sản Yến Hải Hoằng Tiến Thanh Hóa`,
        seoAlt:
          raw.seoAlt ||
          `Hình ảnh thực tế ${raw.name} tươi ngon loại 1 tại Vựa Hải Sản Yến Hải xã Hoằng Tiến tỉnh Thanh Hóa`,
        category,
        price: priceNum,
        hasDiscount: Boolean(raw.hasDiscount),
        originalPrice: raw.originalPrice ? Number(raw.originalPrice) : undefined,
        unit: raw.unit || '/ kg',
        mobileUnit: raw.mobileUnit || raw.unit || '/ kg',
        image:
          raw.image ||
          '/assets/aistudio/1794885567341_2584028512014311615_2584028512014311615_5156174eb2025c8d42ebf3d33900b3cf_ebfdf389.jpg',
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
        prepOptions:
          Array.isArray(raw.prepOptions) && raw.prepOptions.length > 0
            ? raw.prepOptions
            : ['Đóng khay bảo quản lạnh tiêu chuẩn', 'Sơ chế làm sạch miễn phí'],
        sizeOptions:
          Array.isArray(raw.sizeOptions) && raw.sizeOptions.length > 0
            ? raw.sizeOptions
            : [
                { label: 'Khay 500g', priceMultiplier: 0.52 },
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

export function filterAndSortProducts(
  products: Product[],
  options: {
    category: ProductCategory;
    searchQuery: string;
    sortBy: SortOption;
  }
): Product[] {
  const query = options.searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      options.category === 'all' || product.category === options.category;
    if (!matchesCategory) return false;

    if (!query) return true;
    const searchable = [
      product.name,
      product.mobileName,
      product.description,
      product.subtitle,
      product.badgeLeft,
      product.badgeRight
    ]
      .join(' ')
      .toLowerCase();

    return searchable.includes(query);
  });

  const sorted = [...filtered];
  if (options.sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (options.sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price);
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

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee =
    subtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const grandTotal = Math.max(0, subtotal + shippingFee);

  return {
    totalItems,
    subtotal,
    shippingFee,
    isFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping,
    freeShippingProgress,
    grandTotal
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
        `- ${i.name} x${i.qty}: ${formatVND(i.price * i.qty)}${
          i.prepNote ? ` (${i.prepNote})` : ''
        }`
    )
    .join('\n');

  const customerLine = customer?.phone
    ? `\nKhách hàng: ${customer.fullName || 'Khách đặt nhanh'} - SĐT: ${customer.phone}${
        customer.address ? ` - Đ/c: ${customer.address}` : ''
      }`
    : '';

  return `Chào Hải Sản Yến Hải (${STORE_PHONE_DISPLAY}), tôi muốn đặt ${totals.totalItems} phần hải sản:\n${itemsText}\nTổng thanh toán: ${formatVND(
    totals.grandTotal
  )}.${customerLine}\nNhờ vựa tư vấn và giao hàng giúp tôi!`;
}
