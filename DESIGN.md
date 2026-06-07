---
name: TerraBook
colors:
  surface: '#f7faf8'
  surface-dim: '#d7dbd9'
  surface-bright: '#f7faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f2'
  surface-container: '#ebefed'
  surface-container-high: '#e6e9e7'
  surface-container-highest: '#e0e3e1'
  on-surface: '#181c1c'
  on-surface-variant: '#414943'
  inverse-surface: '#2d3130'
  inverse-on-surface: '#eef1ef'
  outline: '#717972'
  outline-variant: '#c1c9c1'
  surface-tint: '#3b674f'
  primary: '#00301c'
  on-primary: '#ffffff'
  primary-container: '#1a4731'
  on-primary-container: '#86b598'
  inverse-primary: '#a1d1b4'
  secondary: '#006d37'
  on-secondary: '#ffffff'
  secondary-container: '#6bfe9c'
  on-secondary-container: '#00743a'
  tertiary: '#29292b'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f3f41'
  on-tertiary-container: '#acaaac'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bdeecf'
  primary-fixed-dim: '#a1d1b4'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#234f38'
  secondary-fixed: '#6bfe9c'
  secondary-fixed-dim: '#4ae183'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#005228'
  tertiary-fixed: '#e4e2e4'
  tertiary-fixed-dim: '#c8c6c8'
  on-tertiary-fixed: '#1b1b1d'
  on-tertiary-fixed-variant: '#474649'
  background: '#f7faf8'
  on-background: '#181c1c'
  surface-variant: '#e0e3e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The design system is engineered for a premium sports terrain reservation platform, balancing high-performance utility with an elite, members-only atmosphere. The target audience includes athletic club managers and discerning sports enthusiasts who value efficiency and prestige.

The visual style is **Corporate Modern with a Luxury SaaS aesthetic**. It emphasizes precision through a clean 12-column structure while maintaining a welcoming, organic feel through a nature-inspired palette. The interface avoids the "busy" look of traditional booking software, opting instead for high-end minimalism characterized by generous whitespace, subtle depth, and a complete absence of harsh, high-contrast borders. The emotional response should be one of confidence, tranquility, and exclusivity.

## Colors

The palette is anchored in **Deep Forest Green**, providing an authoritative and grounded foundation that evokes the terrain itself. **Emerald Accent** is used sparingly for high-value interactions, such as "Success" states and "Book Now" calls to action.

- **Primary (#1A4731):** Used for navigation backgrounds, primary buttons, and headings.
- **Secondary (#2ECC71):** Used for highlights, active status indicators, and positive reinforcement.
- **Neutral Background (#F7FAF8):** A soft off-white used for the global page background to reduce eye strain and enhance the premium feel.
- **Surface (#FFFFFF):** Pure white is reserved for cards and modular containers to create a "lifted" appearance against the off-white background.
- **Text (#1C1C1E):** A dark charcoal used for maximum legibility without the harshness of pure black.

## Typography

The typography utilizes **Plus Jakarta Sans** for its modern, airy, and friendly geometric proportions. The typeface’s open apertures ensure high legibility even in data-dense booking tables.

The hierarchy is built on a "Mobile-First Refinement" logic. Display and Headline styles use tighter letter spacing and heavier weights to command attention, while body text maintains a generous 1.5x line height (24px on a 16px base) to ensure a breezy, uncrowded reading experience. Labels use a slightly bolder weight and subtle tracking to differentiate them from prose.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column fluid grid** for mobile. The layout philosophy is centered on "Internal Breathing Room"—ensuring that no element is cramped against its container.

- **Desktop:** 12 columns, 16px gutters, 24px side margins. Max-width container of 1440px.
- **Tablet:** 8 columns, 16px gutters, 24px side margins.
- **Mobile:** 4 columns, 12px gutters, 16px side margins.

Horizontal spacing between logical sections should default to `xxl` (48px) to reinforce the premium, unhurried brand narrative. Vertical rhythm is maintained through an 8px base grid, ensuring all components align to a consistent mathematical scale.

## Elevation & Depth

To achieve the "Luxury SaaS" aesthetic, depth is created through **Tonal Layering** and **Ambient Shadows** rather than lines.

- **Level 0 (Base):** Soft Off-White (#F7FAF8).
- **Level 1 (Cards/Sidebar):** Pure White (#FFFFFF) with a very soft, diffused shadow.
- **Shadow Profile:** `0px 4px 20px rgba(26, 71, 49, 0.05)`. Notice the use of the primary color in the shadow tint to keep it organic and warm.
- **Interactions:** Hovering over a card should increase the shadow spread and slightly lift the element (`y-offset` from 4px to 8px), suggesting tactility.

Avoid borders for container separation. Use background color shifts and subtle shadows to define boundaries.

## Shapes

The shape language is defined by a consistent **12px radius (rounded-lg)**. This specific value is chosen to bridge the gap between "technical" and "approachable."

- **Cards & Modals:** Always use the 12px (1rem) corner radius.
- **Buttons & Inputs:** Follow the 12px standard for a cohesive look.
- **Pills/Badges:** Use a fully rounded (pill) style to distinguish status indicators from clickable components.
- **Icons:** Should feature slightly rounded terminals and corners to match the UI container language.

## Components

### Buttons & Inputs
- **Primary Button:** Deep Forest Green background, white text, 12px radius. High padding (12px 24px).
- **Secondary Button:** Emerald Accent background for "Book" actions.
- **Inputs:** Pure white background, subtle 1px border in a very light grey-green, 12px radius. On focus, the border transitions to Deep Forest Green with a soft Emerald glow (outer shadow).

### Sidebar & Navigation
- **Sidebar:** Pure white background, right-side subtle shadow (no border). Icons use Deep Forest Green. Active state indicated by a vertical Emerald bar on the left and a subtle light green background fill.

### Data Tables
- **Alternating Rows:** Use #FFFFFF for odd rows and #F7FAF8 for even rows. No vertical or horizontal grid lines; let the color shifts define the rows.
- **Header:** Sticky header with a transparent blur effect or a solid Deep Forest Green with white text for high contrast.

### Badges & Chips
- **Status Pills:** "Available" (Emerald background, 10% opacity, solid Emerald text). "Unavailable" (Dark Charcoal background, 10% opacity, solid Charcoal text).
- **Pricing Chips:** Small, bold, Deep Forest Green containers with white text, positioned in the top right of terrain cards.

### Form Cards
- Elements are grouped in 12px rounded white cards with generous internal padding (24px). Use clear `label-sm` typography for field titles to maintain an organized, professional appearance.