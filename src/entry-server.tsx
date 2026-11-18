import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import {
  Product,
  PRODUCTS,
  REAL_VIDEOS,
  SEO_FAQS,
  CUSTOMER_REVIEWS,
  STORE_PHONE,
  STORE_PHONE_DISPLAY,
  STORE_FACEBOOK_URL,
  STORE_ZALO_URL,
  extractSlugFromPathname,
  findProductBySlug,
  getProductRoutePath,
  getProductSlug
} from './lib/store-logic';

export function renderAppHtml(
  products: Product[] = PRODUCTS,
  pathname = '/'
): string {
  return renderToString(
    <App initialProducts={products} initialPath={pathname} />
  );
}

export function buildProductDetailJsonLd(
  product: Product,
  appUrl = ''
): string {
  const baseUrl = appUrl.replace(/\/$/, '');
  const productPath = getProductRoutePath(product);
  const fullUrl = `${baseUrl}${productPath}`;
  const categoryLabel =
    product.category === 'fresh'
      ? 'Hải Sản Tươi Sống'
      : product.category === 'frozen'
      ? 'Hải Sản Đông Lạnh'
      : 'Hải Sản Khô';

  const productNode: Record<string, unknown> = {
    '@type': 'Product',
    '@id': `${fullUrl}#product`,
    url: fullUrl,
    sku: product.sku || `YH-SP-0${product.id}`,
    name: product.name,
    description: product.description,
    image: [`${baseUrl}${product.image}`],
    brand: {
      '@type': 'Brand',
      name: 'Hải Sản Yến Hải'
    },
    category: categoryLabel,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.rating),
      bestRating: '5',
      worstRating: '1',
      reviewCount: String(product.reviewsCount)
    },
    review: CUSTOMER_REVIEWS.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author
      },
      datePublished: r.datePublished,
      reviewBody: r.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating),
        bestRating: '5'
      }
    })),
    offers: {
      '@type': 'Offer',
      url: fullUrl,
      price: '0',
      priceCurrency: 'VND',
      description: `Giá: Liên hệ trực tiếp qua Hotline/Zalo ${STORE_PHONE_DISPLAY}`,
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Hải Sản Yến Hải',
        telephone: `+84${STORE_PHONE.replace(/^0/, '')}`
      }
    }
  };

  if (product.videoUrl) {
    productNode.subjectOf = {
      '@type': 'VideoObject',
      name: product.name,
      description: product.description,
      thumbnailUrl: [`${baseUrl}${product.image}`],
      contentUrl: `${baseUrl}${product.videoUrl}`,
      uploadDate: '2026-11-16'
    };
  }

  const graph: unknown[] = [
    productNode,
    {
      '@type': 'BreadcrumbList',
      '@id': `${fullUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ Hải Sản Yến Hải',
          item: `${baseUrl}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryLabel,
          item: `${baseUrl}/#catalog`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: fullUrl
        }
      ]
    }
  ];

  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': graph
    },
    null,
    2
  );
}

export function buildStoreJsonLd(
  products: Product[] = PRODUCTS,
  appUrl = ''
): string {
  const baseUrl = appUrl.replace(/\/$/, '');

  const productEntities = products.map((p, idx) => {
    const itemUrl = `${baseUrl}/san-pham/${getProductSlug(p)}`;
    return {
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        '@id': `${itemUrl}#product`,
        url: itemUrl,
        sku: p.sku || `YH-SP-0${p.id}`,
        name: p.name,
        description: p.description,
        image: [`${baseUrl}${p.image}`],
        ...(p.videoUrl
          ? {
              subjectOf: {
                '@type': 'VideoObject',
                name: p.name,
                description: p.description,
                thumbnailUrl: [`${baseUrl}${p.image}`],
                contentUrl: `${baseUrl}${p.videoUrl}`,
                uploadDate: '2026-11-16'
              }
            }
          : {}),
        brand: {
          '@type': 'Brand',
          name: 'Hải Sản Yến Hải'
        },
        category:
          p.category === 'fresh'
            ? 'Hải Sản Tươi Sống'
            : p.category === 'frozen'
            ? 'Hải Sản Đông Lạnh'
            : 'Hải Sản Khô',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(p.rating),
          bestRating: '5',
          worstRating: '1',
          reviewCount: String(p.reviewsCount)
        },
        offers: {
          '@type': 'Offer',
          url: itemUrl,
          price: '0',
          priceCurrency: 'VND',
          description: `Giá: Liên hệ trực tiếp qua Hotline/Zalo ${STORE_PHONE_DISPLAY}`,
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Hải Sản Yến Hải'
          }
        }
      }
    };
  });

  const videoEntities = REAL_VIDEOS.map((vid) => ({
    '@type': 'VideoObject',
    '@id': `${baseUrl}/#${vid.id}`,
    name: vid.title,
    description: vid.description,
    thumbnailUrl: [`${baseUrl}${vid.thumbnailUrl}`],
    contentUrl: `${baseUrl}${vid.videoUrl}`,
    uploadDate: vid.uploadDate,
    publisher: {
      '@type': 'Organization',
      name: 'Hải Sản Yến Hải'
    }
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': `${baseUrl}/#store`,
        name: 'Hải Sản Yến Hải — Vựa Hải Sản Tươi Sống, Đông Lạnh & Đồ Khô',
        alternateName: 'Yến Hải Seafood Hoằng Tiến Hoằng Hóa Thanh Hóa',
        description:
          'Hải Sản Yến Hải (Gần Trường Tiểu học xã Hoằng Trường — Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa) chuyên cung cấp sỉ & lẻ Mực Ống Biển Tươi, Cá Thu Phấn Cắt Khoanh Giữa, Bạch Tuộc Tươi, Tôm He Tôm Bộp Biển, Nõn Tôm Biển Hấp Bóc Sẵn, Bề Bề (Tôm Tít) Bóc Nõn Full Trứng và Cá Khô Rút Xương Phơi Nắng Tự Nhiên. Cam kết bao ăn 1 đổi 1, giao hàng toàn quốc.',
        url: baseUrl || 'https://yenhaiseafood.vercel.app',
        logo: `${baseUrl || 'https://yenhaiseafood.vercel.app'}/logo.jpg`,
        telephone: `+84${STORE_PHONE.replace(/^0/, '')}`,
        sameAs: [STORE_FACEBOOK_URL, STORE_ZALO_URL],
        priceRange: 'Giá: Liên hệ',
        openingHours: 'Mo-Su 05:30-22:00',
        hasMap:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4462.189218912266!2d105.94396553823036!3d19.872130916226837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31365b42bdaaaaab%3A0x1824cd045891010!2zVHLGsOG7nW5nIFRp4buDdSBo4buNYyBIb-G6sW5nIFRyxrDhu51uZw!5e0!3m2!1svi!2s!4v1794905171675!5m2!1svi!2s',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 19.8721309,
          longitude: 105.9439655
        },
        image: products.map((p) => `${baseUrl}${p.image}`),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Thôn Trường Phúc, Xã Hoằng Tiến',
          addressLocality: 'Huyện Hoằng Hóa',
          addressRegion: 'Thanh Hóa',
          postalCode: '440000',
          addressCountry: 'VN'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          reviewCount: '1392'
        },
        review: CUSTOMER_REVIEWS.map((r) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: r.author
          },
          datePublished: r.datePublished,
          reviewBody: r.comment,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(r.rating),
            bestRating: '5'
          }
        })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Danh Mục Hải Sản Yến Hải Hôm Nay',
          itemListElement: productEntities
        }
      },
      ...videoEntities,
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Trang chủ Hải Sản Yến Hải',
            item: `${baseUrl}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Hải Sản Biển Hoằng Tiến - Hoằng Hóa - Thanh Hóa',
            item: `${baseUrl}/#catalog`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Video Thực Tế Tại Vựa Yến Hải',
            item: `${baseUrl}/#videoSection`
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Bản Đồ Vị Trí Vựa Hải Sản Yến Hải',
            item: `${baseUrl}/#mapSection`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        mainEntity: SEO_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };

  return JSON.stringify(schema, null, 2);
}

export function buildPageJsonLd(
  products: Product[] = PRODUCTS,
  pathname = '/',
  appUrl = ''
): string {
  const slug = extractSlugFromPathname(pathname);
  if (slug !== null) {
    const product = findProductBySlug(products, slug);
    if (product) {
      return buildProductDetailJsonLd(product, appUrl);
    }
  }
  return buildStoreJsonLd(products, appUrl);
}
