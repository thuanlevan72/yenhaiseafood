---
name: "Yen Hai Seafood"
description: "Fresh coastal seafood e-commerce and multi-channel order experience for Hai San Yen Hai"
---

## Overview

Hải Sản Yến Hải is a premier seafood brand in Vietnam specializing in three product pillars: Live Seafood ("Hàng đang bơi", caught daily with 1-to-1 freshness guarantee), Flash-Frozen Seafood (deep frozen at sea preserving 99% nutrition and natural sweetness), and Sun-Dried Specialty Seafood (naturally sun-cured, vacuum packed for premium gifting). 

The visual style is maritime, energetic, and clean: crisp ocean navy and deep sea blues paired with vibrant lobster coral red for appetite appeal and urgent actions, balanced with fresh white water surfaces and warm sandy neutrals.

## Colors

The palette draws inspiration from the open sea and coastal seafood markets: deep ocean navy anchors authority, coral vermilion drives appetite and order conversions, and aqua mist provides fresh category highlights.

- **Primary:** Deep oceanic navy representing seafood origin and professional credibility.
- **Secondary / Accent:** Vibrant coral red representing fresh lobster, shrimp, and appetizing promotions.
- **Tertiary:** Aqua cyan representing clean oxygenated fresh seawater tanks.

```yaml
colors:
  accent: "#E04F36"
  accent-hover: "#C93B24"
  fresh-green: "#16A34A"
  ocean-blue: "#0284C7"
  gold-star: "#F59E0B"
  light:
    primary: "#0A2540"
    on-primary: "#FFFFFF"
    primary-container: "#E8F0FE"
    on-primary-container: "#0A2540"
    secondary: "#E04F36"
    on-secondary: "#181818"
    secondary-container: "#FEE2E2"
    on-secondary-container: "#991B1B"
    surface: "#FFFFFF"
    on-surface: "#1E293B"
    surface-container: "#F8FAFC"
    surface-container-high: "#F1F5F9"
    outline: "#CBD5E1"
    outline-variant: "#E2E8F0"
  dark:
    primary: "#93C5FD"
    on-primary: "#0B2545"
    primary-container: "#1E3A8A"
    on-primary-container: "#DBEAFE"
    secondary: "#FCA5A5"
    on-secondary: "#7F1D1D"
    secondary-container: "#991B1B"
    on-secondary-container: "#FEE2E2"
    surface: "#0F172A"
    on-surface: "#F8FAFC"
    surface-container: "#1E293B"
    surface-container-high: "#334155"
    outline: "#64748B"
    outline-variant: "#475569"
```

## Typography

The typography pairs **Poppins** for clean, appetizing display headings and modern clarity with **Lato** for high-density readable product specs, pricing, and multi-channel badges. Vietnamese diacritics are cleanly rendered.

```yaml
typography:
  display-lg:
    fontFamily: "Poppins"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 48px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Poppins"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 36px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Poppins"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: -0.25px
  headline-lg-mobile:
    fontFamily: "Poppins"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 32px
    letterSpacing: 0px
  headline-md:
    fontFamily: "Poppins"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
  title-lg:
    fontFamily: "Poppins"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
  title-md:
    fontFamily: "Poppins"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
  body-lg:
    fontFamily: "Lato"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: "Lato"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 22px
  body-sm:
    fontFamily: "Lato"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
  label-lg:
    fontFamily: "Poppins"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  label-md:
    fontFamily: "Poppins"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.25px
  label-sm:
    fontFamily: "Lato"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
```

## Layout & Spacing

A 12-column responsive layout spanning standard container widths (`max-w-7xl` ~ 1280px) for desktop with fluid padding on mobile (16px edge padding).

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 16px
  gutter-lg: 24px
  gutter-xl: 32px
  section: 48px
  page-margin: 24px
```

## Elevation & Depth

Surfaces employ subtle maritime crispness: soft ambient elevation (`0 4px 20px -2px rgba(10, 37, 64, 0.06)`) on product cards and floating checkout/cart elements, paired with clean crisp borders (`outline-variant`) so seafood imagery pops with appetizing vibrancy.

## Shapes

Organic friendly rounding that feels welcoming for a family-owned commercial seafood brand.

```yaml
rounded:
  sm: 6px
  DEFAULT: 10px
  md: 14px
  lg: 20px
  xl: 28px
  full: 9999px
```

## Motion & Micro-interaction

Crisp transitions for instant feedback when adding items to cart, opening quick-order modals, or toggling between categories.

```yaml
motion:
  state-change:
    duration: 150ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 250ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

- **Tone of voice:** Trustworthy, passionate, hospitable, and proudly authentic ("Bao tươi - Bao ngon - Giao hỏa tốc").
- **Key Categories:**
  1. 🦐 Hải Sản Tươi Sống (Đang bơi tại hồ, bao ăn 1 đổi 1, sơ chế miễn phí)
  2. ❄️ Hải Sản Đông Lạnh (Cấp đông sâu tại tàu, giữ trọn 99% vị ngọt, chuẩn xuất khẩu)
  3. 🦑 Hải Sản Khô Tuyển Chọn (Phơi tự nhiên đủ nắng, hút chân không, chuẩn quà biếu)
- **Call to actions:** "Thêm vào giỏ", "Mua ngay", "Gọi Hotline: 0988.xxx.xxx", "Chat Zalo tư vấn", "Nhắn Messenger".

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Modal** → `@components/modal.html`: `modal-standard`, `modal-alert`, `modal-drawer`
