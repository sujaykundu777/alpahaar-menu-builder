---
name: Warm Artisanal Culinary
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e5'
  on-surface: '#1b1b1e'
  on-surface-variant: '#59413a'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#8d7168'
  outline-variant: '#e1bfb5'
  surface-tint: '#ac3400'
  primary: '#9b2f00'
  on-primary: '#ffffff'
  primary-container: '#c2410c'
  on-primary-container: '#ffece7'
  inverse-primary: '#ffb59d'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#00622a'
  on-tertiary: '#ffffff'
  tertiary-container: '#007e37'
  on-tertiary-container: '#c1ffc6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#66ff8e'
  tertiary-fixed-dim: '#3de273'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005322'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sub-bilingual:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-desktop: 3rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system expresses the warmth, trust, and craftsmanship of a weekend artisanal kitchen. It balances the nostalgia of homemade Indian snacks and heritage sweets with modern digital ordering convenience. The emotional atmosphere is welcoming, reassuring, and tactile—evoking aroma, freshly ground spices, and kitchen countertop honesty.

### Visual Style
- **Aesthetic Movement:** Tactile Modern Warmth. Crisp, comfortable digital usability infused with organic culinary warmth.
- **Atmosphere:** Clean cream canvas, earthy spice accents, generous white space, and hearty typography. It avoids cold tech-driven minimalism in favor of a comforting, domestic hospitality tone.
- **Target Audience:** Multi-generational patrons ranging from young professionals seeking pure nostalgic home flavors to senior patrons (50+ years old) who demand high contrast, larger click zones, clear bilingual labeling (English and Devanagari Hindi subtitles), and frictionless ordering via WhatsApp.

## Colors

The palette is rooted in kitchen spices, slow cooking, and effortless messaging communication.

- **Primary (`#C2410C` — Terracotta / Warm Spice):** Anchors brand presence, key callouts, primary buttons, hero highlights, and essential interactive triggers. Conveys the earthy, oven-baked warmth of slow-roasted snacks.
- **Secondary (`#D97706` — Deep Turmeric / Saffron Amber):** Highlights seasonal specials, pre-order tags, sweet badges, ratings, and culinary notices.
- **Tertiary (`#25D366` — WhatsApp Emerald Green):** Dedicated action color for conversational ordering, direct chef chat, order confirmations, and instant status queries. Provides instant recognition and trusted utility.
- **Neutral Base & Backgrounds:**
  - `Canvas / Linen Base`: `#FFFDF9` (soft warm cream, preventing harsh blue-light screen fatigue).
  - `Surface Card Fill`: `#FFFFFF` with warm undertone borders (`#F3E8DC`).
  - `Text Neutral`: `#27272A` (deep warm charcoal, ensuring WCAG AAA legibility against cream backgrounds without the cold bite of `#000000`).
  - `Muted / Subtitle Neutral`: `#57534E` (warm stone for secondary weights, timestamps, and Hindi culinary subtexts).

## Typography

Typography prioritizes legibility, accessibility, and comfortable reading for older demographics. All baseline body text begins at a legible 16px/18px with relaxed line heights (1.5x - 1.6x) to facilitate scanning without eye strain.

### Bilingual Typesetting Rules
- **Primary English Header:** Rendered in `headline-md` or `headline-sm` with a solid weight of 600 or 700.
- **Secondary Hindi / Indic Sub-label:** Positioned directly beneath or adjacent in `body-sub-bilingual` using warm muted stone (`#57534E`) or saffron amber (`#D97706`). Ensures elder users recognize native names (e.g., "Mathri / मठरी", "Besan Ladoo / बेसन के लड्डू") instantly without mental translation lag.

## Layout & Spacing

The layout follows a fluid-responsive responsive model designed for seamless single-handed mobile usage, expanding into a relaxed, centered container grid on larger screens.

### Grid & Breakpoints
- **Mobile (< 768px):** Single-column layout with fixed bottom navigation or sticky WhatsApp checkout trays. Outer margin is `1rem` (16px) to maximize screen area for large touch items while maintaining breathable `space-md` gaps between cards.
- **Tablet (768px - 1024px):** 2-column card grid with `1.25rem` (20px) gutters. Outer margins expand to `2rem`.
- **Desktop (> 1024px):** Max container width capped at `1120px` to prevent excessive scanning widths. 3-column product cards with `2rem` gutters and centered layout structure.

### Spacing Rhythm
Vertical padding within interactive modules is intentionally generous. Lists, form fields, and batch cards utilize `space-md` and `space-lg` to create distinct visual islands, preventing accidental touches.

## Elevation & Depth

Visual hierarchy uses warm ambient lighting rather than cold drop shadows. Depth is communicated through warm boundary framing and soft, diffused underglows.

- **Level 0 (Flat / Canvas):** Base background `#FFFDF9`. No shadow.
- **Level 1 (Resting Cards & Items):** Card surface `#FFFFFF` bounded by a 1px solid hairline border in `#F3E8DC` with an ambient shadow: `0 4px 16px -2px rgba(194, 65, 12, 0.05), 0 2px 6px -1px rgba(39, 39, 42, 0.04)`.
- **Level 2 (Interactive Floating / Active State):** Raised cards on hover or focus: `0 10px 24px -4px rgba(194, 65, 12, 0.10), 0 4px 10px -2px rgba(39, 39, 42, 0.05)`.
- **Level 3 (Sticky Ordering Bar / Modals):** Floating WhatsApp bar, cart summaries, and dialogs: `0 16px 36px -6px rgba(39, 39, 42, 0.12), 0 0 0 1px rgba(243, 232, 220, 0.8)`.

## Shapes

The design uses a rounded, approachable geometry that communicates gentle homemade hospitality.

- **Cards & Sheets (`rounded-2xl` / 1.25rem):** Snacking product cards, batch status boxes, and testimonial callouts.
- **Buttons & Chips (`rounded-xl` / 1rem to Pill):** High-touch actionable elements use generous curvature for tactile, pressable affordance.
- **Badges & Quantities (Pill / Full Round):** Dietary tags (e.g., "Pure Ghee", "Gluten-Free", "Weekend Batch Only") use soft pills to distinguish meta-attributes from action buttons.

## Components

### Buttons & Action Bars
- **Touch Target:** Strict minimum height of `52px` (optimal `56px`) with horizontal padding of `24px` to support frictionless tapping for elder fingers.
- **Primary CTA (Terracotta Order Action):** Solid `#C2410C` background, `#FFFFFF` bold text, rounded at 14px. On press: subtle scale shift (0.98) with warm amber glow.
- **WhatsApp Direct Order CTA:** Vibrant `#25D366` background, `#FFFFFF` bold typography, accompanied by a clean WhatsApp icon. Emphasizes "Order via WhatsApp / व्हाट्सएप पर ऑर्डर करें" in explicit bilingual copy.
- **Secondary CTA:** Cream fill (`#FFF8F0`) with 1.5px `#C2410C` border and deep terracotta text.

### Product & Batch Cards
- **Card Structure:** White card (`#FFFFFF`) with 1.5px warm border (`#F3E8DC`) and `1.25rem` radius.
- **Image Header:** Rounded top edges with a soft warm gradient scrim for legibility of tags placed over photography.
- **Content Hierarchy:**
  1. Title in English (`headline-sm`, `#27272A`) paired with Hindi title below (`body-sub-bilingual`, `#D97706`).
  2. Weight and portion size indicated clearly (e.g., "250g / 500g Jar").
  3. Pre-order schedule badge: "Next Batch: Saturday Morning".
  4. Quick quantity stepper combined with an prominent "Add" CTA.

### Quantity Stepper (+ / -)
- Standalone minimum touch area of `48px x 48px` per plus/minus button.
- High-contrast charcoal glyphs with an off-white background (`#F5EBE1`) to prevent mistaps.

### Chips & Dietary Badges
- Pill-shaped tags with `8px` vertical and `14px` horizontal padding.
- Sweet badge: Soft warm amber background (`#FEF3C7`) with text `#92400E`.
- Savory / Snack badge: Soft terracotta background (`#FFEDD5`) with text `#9A3412`.
- Jain / Pure Veg indicator: Traditional green boxed square with solid green circle inside, accompanied by explicit text label.

### Input Fields & Steppers
- Height of `56px`, 1.5px border in `#D6D3D1`, filling with pure white.
- Clear, permanently visible float labels rather than vanishing placeholders to assist memory and clarity.
- Active focus state: 2px solid ring in `#C2410C` with an offset shadow.

### Sticky Weekend Pre-Order Bar
- Floats at the bottom viewport on mobile devices.
- Includes a live summary ("Weekend Batch: 78% Booked") alongside a direct one-tap WhatsApp quick-order button.