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
  STORE_FACEBOOK_URL,
  STORE_ZALO_URL
} from './lib/store-logic';

export function renderAppHtml(products: Product[] = PRODUCTS): string {
  return renderToString(<App initialProducts={products} />);
}

export function buildStoreJsonLd(
  products: Product[] = PRODUCTS,
  appUrl = ''
): string {
  const baseUrl = appUrl.replace(/\/$/, '');

  const productEntities = products.map((p, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'Product',
      '@id': `${baseUrl}/#${p.slug || `product-${p.id}`}`,
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
        url: `${baseUrl}/#${p.slug || `product-${p.id}`}`,
        price: '0',
        priceCurrency: 'VND',
        description: 'Giá: Liên hệ trực tiếp qua Hotline/Zalo 0356.136.859',
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Hải Sản Yến Hải'
        }
      }
    }
  }));

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
          'Hải Sản Yến Hải (Khu vực Trường Tiểu học xã Hoằng Trường — Thôn Trường Phúc, Xã Hoằng Tiến, Huyện Hoằng Hóa, Tỉnh Thanh Hóa) chuyên cung cấp sỉ & lẻ Mực Ống Biển Tươi, Cá Thu Phấn Cắt Khoanh Giữa, Bạch Tuộc Tươi, Tôm He Tôm Bộp Biển, Nõn Tôm Biển Hấp Bóc Sẵn, Bề Bề (Tôm Tít) Bóc Nõn Full Trứng và Cá Khô Rút Xương Phơi Nắng Tự Nhiên. Cam kết bao ăn 1 đổi 1, giao hàng toàn quốc.',
        url: baseUrl || 'https://haisanyenhai.vn',
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
