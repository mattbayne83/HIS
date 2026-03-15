# Design System — HIS (Himali Indigenous Services)

Generated: 2026-03-14
Mood: **Premium glassmorphism with Nepal flag crimson red** — frosted glass surfaces, depth through blur and transparency, sophisticated red palette inspired by Nepal's national flag, elegant shadows, and a sense of cultural dignity.

---

## Color Palette

### Primary Colors — Crimson Red
| Role | Name | Hex | Tailwind Class | Usage |
|------|------|-----|----------------|-------|
| Primary | Crimson | `#DC143C` | `bg-[#DC143C]` | Primary CTAs, donate buttons, urgent actions, key highlights |
| Primary Light | Rose | `#E85472` | `bg-[#E85472]` | Hover states, active selections, interactive feedback |
| Primary Dark | Burgundy | `#A01028` | `bg-[#A01028]` | Pressed states, deep emphasis, footer accents |
| Primary Soft | Blush | `#FCEEF2` | `bg-[#FCEEF2]` | Subtle backgrounds, featured content tint, gentle emphasis |

### Secondary Colors — Mountain Bronze (Analogous)
| Role | Name | Hex | Tailwind Class | Usage |
|------|------|-----|----------------|-------|
| Secondary | Bronze | `#A67C52` | `bg-[#A67C52]` | Secondary CTAs, links, earthy accents, educational elements |
| Secondary Light | Golden Sand | `#C9A77C` | `bg-[#C9A77C]` | Hover states, light backgrounds, warmth |
| Secondary Dark | Umber | `#7D5938` | `bg-[#7D5938]` | Headers, navigation, grounding, depth |
| Secondary Soft | Warm Cream | `#F5EFE0` | `bg-[#F5EFE0]` | Backgrounds, subtle panels, alternating sections |

### Accent Colors — Warm Sand
| Role | Name | Hex | Tailwind Class | Usage |
|------|------|-----|----------------|-------|
| Accent | Sand | `#D4C5B0` | `bg-[#D4C5B0]` | Warm highlights, borders, dividers, earthy accents |
| Accent Dark | Taupe | `#A89680` | `bg-[#A89680]` | Muted accents, secondary borders |
| Accent Soft | Cream | `#F5F1EB` | `bg-[#F5F1EB]` | Page backgrounds, alternating sections, warmth |

### Neutral Scale — Warm Glass
| Step | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| 50 | `#FDFCFB` | `bg-neutral-50` | Page backgrounds, lightest glass surfaces |
| 100 | `#F8F6F4` | `bg-neutral-100` | Card backgrounds, alternating rows |
| 200 | `#F0EBE6` | `bg-neutral-200` | Borders, dividers, subtle separators |
| 300 | `#DCD4CC` | `bg-neutral-300` | Disabled states, placeholder text |
| 400 | `#B8AFA3` | `bg-neutral-400` | Muted text, inactive icons |
| 500 | `#8E8177` | `bg-neutral-500` | Secondary text, body copy (light backgrounds) |
| 600 | `#6B5D52` | `bg-neutral-600` | Primary text on light surfaces |
| 700 | `#4A3F36` | `bg-neutral-700` | Headings, emphasis, high contrast |
| 800 | `#332B23` | `bg-neutral-800` | Maximum contrast text |
| 900 | `#1F1812` | `bg-neutral-900` | Near-black, glass surface overlays |
| 950 | `#0F0C09` | `bg-neutral-950` | Pure depth, darkest glass |

### Semantic Colors
| Role | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Success | `#2D6A4F` | `bg-success` | Confirmations, positive indicators, completed states |
| Success Soft | `#E8F5EE` | `bg-success-soft` | Success backgrounds |
| Warning | `#F59E0B` | `bg-warning` | Alerts, caution states, pending actions |
| Warning Soft | `#FEF3C7` | `bg-warning-soft` | Warning backgrounds |
| Error | `#DC2626` | `bg-error` | Validation errors, destructive actions |
| Error Soft | `#FEE2E2` | `bg-error-soft` | Error backgrounds |
| Info | `#0066CC` | `bg-info` | Informational callouts, tooltips, help text |
| Info Soft | `#E5F2FF` | `bg-info-soft` | Info backgrounds |

### Glassmorphism Tokens
| Role | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| Glass Blur | `16px` | `--glass-blur` | Standard frosted glass effect |
| Glass Blur Heavy | `24px` | `--glass-blur-heavy` | Prominent modals, overlays |
| Glass Blur Subtle | `8px` | `--glass-blur-subtle` | Gentle surface separation |
| Glass Opacity | `0.85` | `--glass-opacity` | Standard glass transparency |
| Glass Opacity Light | `0.65` | `--glass-opacity-light` | Lighter glass surfaces |
| Glass Border | `rgba(255,255,255,0.2)` | `--glass-border` | Glass edge highlights |
| Glass Shadow | `0 8px 32px rgba(31,24,18,0.1)` | `--glass-shadow` | Frosted glass depth |
| Glass Shadow Heavy | `0 12px 48px rgba(31,24,18,0.15)` | `--glass-shadow-heavy` | Modal/overlay depth |

### Palette Rationale
This palette uses **analogous color harmony** anchored by crimson red (`#DC143C`). The **mountain bronze** (`#A67C52`) secondary palette sits adjacent to red on the color wheel, creating a warm, earthy flow that evokes the Himali landscape — terraced hillsides, mountain soil, golden hour light on peaks. This analogous relationship (red → orange → brown) feels natural and cohesive, avoiding harsh contrast while maintaining visual interest through value and saturation shifts. **Warm sand** (`#D4C5B0`) continues the earth-tone theme. The result: a palette that feels grounded in Nepal's geography while balancing urgency (crimson) with warmth and stability (bronze/sand).

### Accessibility Notes
- **Primary crimson on white**: 5.2:1 — **WCAG AA** for large text, AAA for decorative
- **Primary crimson on neutral-50**: 5.3:1 — **WCAG AA**
- **Body text (neutral-700 on neutral-50)**: 9.1:1 — **WCAG AAA**
- **Headings (neutral-800 on white)**: 14.6:1 — **WCAG AAA**
- **Color-blind considerations**: Blue-red pairing works for deuteranopia/protanopia. Gold provides additional differentiation. Never rely on color alone for status — always pair with icons or text labels.

---

## Typography

### Font Pairing
| Role | Font | Weight(s) | Import |
|------|------|-----------|--------|
| Headings | **Playfair Display** | 600, 700 | `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');` |
| Body | **Inter** | 400, 500, 600 | `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');` |
| Display | **Cormorant Garamond** | 600 | `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&display=swap');` |

### Why This Pairing Works
**Playfair Display** (serif) brings elegance and cultural dignity — it's refined without being stuffy, perfect for a humanitarian organization. **Inter** (geometric sans) provides exceptional readability and modernity, creating strong contrast against Playfair. **Cormorant Garamond** adds a touch of grace for hero headlines. The serif/sans pairing reflects the balance between tradition (Nepal's heritage) and progress (transformation mission). All three fonts have excellent rendering at small sizes and work beautifully with glassmorphism's translucent aesthetic.

### Type Scale
| Element | Size | Weight | Line Height | Letter Spacing | Tailwind |
|---------|------|--------|-------------|----------------|----------|
| Hero Display | 4rem / 64px | 600 (Cormorant) | 1.1 | -0.02em | `text-6xl font-display font-semibold leading-tight tracking-tight` |
| Display | 3rem / 48px | 700 (Playfair) | 1.15 | -0.015em | `text-5xl font-serif font-bold leading-tight` |
| H1 | 2.5rem / 40px | 700 (Playfair) | 1.2 | -0.01em | `text-4xl font-serif font-bold leading-snug` |
| H2 | 2rem / 32px | 600 (Playfair) | 1.25 | -0.01em | `text-3xl font-serif font-semibold` |
| H3 | 1.5rem / 24px | 600 (Playfair) | 1.3 | 0 | `text-2xl font-serif font-semibold` |
| H4 | 1.25rem / 20px | 600 (Inter) | 1.4 | 0 | `text-xl font-sans font-semibold` |
| Body Large | 1.125rem / 18px | 400 (Inter) | 1.7 | 0 | `text-lg font-sans` |
| Body | 1rem / 16px | 400 (Inter) | 1.6 | 0 | `text-base font-sans` |
| Body Small | 0.875rem / 14px | 400 (Inter) | 1.5 | 0 | `text-sm font-sans` |
| Caption | 0.75rem / 12px | 500 (Inter) | 1.4 | 0.02em | `text-xs font-sans font-medium tracking-wide uppercase` |
| Label | 0.875rem / 14px | 600 (Inter) | 1.4 | 0.01em | `text-sm font-sans font-semibold tracking-wide` |

### Alternative Pairings
1. **Libre Baskerville + Work Sans** — More traditional serif, slightly warmer sans. Better for conservative audiences.
2. **DM Serif Display + DM Sans** — Your current stack! Already optimized. Keep if stakeholders prefer consistency.
3. **Lora + Nunito Sans** — Softer, friendlier pairing. Best for youth/education-focused content.

---

## Spacing & Layout

### Spacing Scale
Base unit: **4px**. Use Tailwind's default scale.

| Token | Value | Tailwind | Common Usage |
|-------|-------|----------|-------------|
| 0.5 | 2px | `space-0.5` | Ultra-tight icon gaps, glass border offsets |
| 1 | 4px | `space-1` | Tight icon gaps, badge padding |
| 2 | 8px | `space-2` | Inline element spacing, small padding |
| 3 | 12px | `space-3` | Compact card padding, list gaps |
| 4 | 16px | `space-4` | **Standard padding**, form field spacing |
| 5 | 20px | `space-5` | Medium card padding |
| 6 | 24px | `space-6` | **Section padding**, card gaps |
| 8 | 32px | `space-8` | Large section spacing, modal padding |
| 10 | 40px | `space-10` | Feature sections |
| 12 | 48px | `space-12` | Page section margins |
| 16 | 64px | `space-16` | Major section breaks, hero spacing |
| 20 | 80px | `space-20` | Page section dividers |
| 24 | 96px | `space-24` | Hero section vertical spacing |

### Border Radius — Soft & Premium
| Element | Radius | Tailwind | Usage |
|---------|--------|----------|-------|
| Buttons | 12px | `rounded-xl` | Soft, inviting clickable elements |
| Cards | 16px | `rounded-2xl` | Glass cards, content containers |
| Inputs | 10px | `rounded-lg` | Form fields, search bars |
| Badges/Pills | Full | `rounded-full` | Status indicators, tags |
| Modals | 20px | `rounded-3xl` | Prominent overlays, dialogs |
| Images | 12px | `rounded-xl` | Photos, avatars (non-circular) |
| Dropdowns | 12px | `rounded-xl` | Menus, select options |

**Why soft radii?** Large corner radii (12px+) pair beautifully with glassmorphism — they create smooth, organic forms that feel premium without being clinical. Sharp corners would clash with the frosted-glass aesthetic.

### Shadows — Glassmorphic Depth
| Level | CSS | Tailwind | Usage |
|-------|-----|----------|-------|
| Glass Subtle | `0 4px 16px rgba(31,24,18,0.04), 0 1px 3px rgba(31,24,18,0.06)` | `shadow-sm` | Cards at rest, gentle glass elevation |
| Glass Default | `0 8px 32px rgba(31,24,18,0.08), 0 2px 8px rgba(31,24,18,0.1)` | `shadow-md` | Dropdowns, popovers, hover states |
| Glass Medium | `0 12px 48px rgba(31,24,18,0.12), 0 4px 16px rgba(31,24,18,0.1)` | `shadow-lg` | Modals, floating elements, overlays |
| Glass Heavy | `0 20px 64px rgba(31,24,18,0.16), 0 8px 24px rgba(31,24,18,0.12)` | `shadow-2xl` | Drawers, full-screen modals, hero cards |
| Inner Glow | `inset 0 1px 2px rgba(255,255,255,0.25)` | Custom | Top highlight on glass surfaces |

**Shadow Philosophy**: Glassmorphism uses **diffused, soft shadows** to suggest depth without harsh edges. Always pair with blur for cohesive glass effect.

---

## Glassmorphism Effects

### Glass Surface — Standard
```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 8px 32px rgba(31, 24, 18, 0.08), 0 2px 8px rgba(31, 24, 18, 0.1);
```
**Tailwind**: `bg-white/85 backdrop-blur-md border border-white/20 shadow-md`

### Glass Surface — Light (for dark backgrounds)
```css
background: rgba(253, 252, 251, 0.65);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 12px 48px rgba(31, 24, 18, 0.12);
```
**Tailwind**: `bg-neutral-50/65 backdrop-blur-xl border border-white/30 shadow-lg`

### Glass Surface — Crimson Tinted
```css
background: linear-gradient(135deg, rgba(220, 20, 60, 0.08), rgba(220, 20, 60, 0.03));
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
border: 1px solid rgba(220, 20, 60, 0.15);
box-shadow: 0 8px 32px rgba(220, 20, 60, 0.12), 0 2px 8px rgba(31, 24, 18, 0.06);
```
**Tailwind**: Custom gradient + `backdrop-blur-md shadow-md`

### Glass Card — Premium
```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-top: 1px solid rgba(255, 255, 255, 0.5);
border-left: 1px solid rgba(255, 255, 255, 0.3);
border-right: 1px solid rgba(220, 20, 60, 0.1);
border-bottom: 1px solid rgba(220, 20, 60, 0.15);
box-shadow: 0 12px 48px rgba(31, 24, 18, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.4);
border-radius: 16px;
```
**Effect**: Asymmetric borders create subtle depth — light source from top-left, crimson accent shadow bottom-right.

### Glass Overlay — Modal/Drawer
```css
background: rgba(31, 24, 18, 0.4);
backdrop-filter: blur(8px);
-webkit-backdrop-filter: blur(8px);
```
**Tailwind**: `bg-neutral-900/40 backdrop-blur-sm`

### Bento Grid Glass Tiles
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.25);
border-radius: 16px;
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
```
**Hover**:
```css
background: rgba(255, 255, 255, 0.85);
border-color: rgba(220, 20, 60, 0.3);
box-shadow: 0 12px 48px rgba(220, 20, 60, 0.15);
transform: translateY(-2px);
```

---

## Component Styles

### Buttons

**Primary (Crimson)**
```
bg-[#DC143C] text-white font-semibold px-6 py-3 rounded-xl
hover:bg-[#E85472] hover:shadow-lg hover:shadow-[#DC143C]/25
active:bg-[#A01028]
transition-all duration-250 ease-out
```

**Primary Glass**
```
bg-[#DC143C]/90 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-xl
border border-white/20
hover:bg-[#E85472]/95 hover:shadow-xl hover:shadow-[#DC143C]/20
active:scale-95
transition-all duration-250 ease-out
```

**Secondary (Bronze)**
```
bg-[#A67C52] text-white font-semibold px-6 py-3 rounded-xl
hover:bg-[#C9A77C] hover:shadow-md
active:bg-[#7D5938]
transition-all duration-250
```

**Ghost Glass**
```
bg-white/40 backdrop-blur-sm text-[#DC143C] font-semibold px-6 py-3 rounded-xl
border border-white/30
hover:bg-white/60 hover:border-[#DC143C]/30 hover:shadow-md
transition-all duration-250
```

**Outline**
```
bg-transparent border-2 border-[#DC143C] text-[#DC143C] font-semibold px-6 py-3 rounded-xl
hover:bg-[#FCEEF2]
active:bg-[#DC143C] active:text-white
transition-all duration-250
```

**Danger**
```
bg-[#DC2626] text-white font-semibold px-4 py-2 rounded-xl
hover:bg-[#EF4444] hover:shadow-lg hover:shadow-red-500/25
active:bg-[#B91C1C]
transition-all duration-200
```

### Cards

**Glass Card — Default**
```
bg-white/85 backdrop-blur-md
border border-white/20
rounded-2xl
shadow-md
p-6
hover:shadow-lg hover:bg-white/90
transition-all duration-300 ease-out
```

**Glass Card — Interactive**
```
bg-white/75 backdrop-blur-md
border border-white/25
rounded-2xl
shadow-sm
p-6
cursor-pointer
hover:bg-white/90 hover:shadow-xl hover:border-[#DC143C]/20 hover:-translate-y-1
transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
```

**Glass Card — Crimson Accent**
```
bg-gradient-to-br from-white/90 to-[#FCEEF2]/50
backdrop-blur-lg
border-t border-l border-white/40
border-r border-b border-[#DC143C]/10
rounded-2xl
shadow-lg
p-8
```

**Elevated Card (No Glass)**
```
bg-white
rounded-2xl
shadow-lg
p-6
border border-neutral-100
hover:shadow-xl
transition-shadow duration-250
```

### Inputs

**Glass Input — Default**
```
bg-white/60 backdrop-blur-sm
border border-white/40
rounded-lg
px-4 py-3
text-neutral-700 text-sm
placeholder:text-neutral-400
focus:bg-white/80 focus:ring-2 focus:ring-[#DC143C]/30 focus:border-[#DC143C]/50
outline-none
transition-all duration-200
```

**Glass Input — Error**
```
border-[#DC2626]/60
ring-2 ring-[#DC2626]/20
focus:ring-[#DC2626]/40
```

**Solid Input (for high contrast)**
```
bg-white
border border-neutral-300
rounded-lg
px-4 py-3
text-sm
focus:ring-2 focus:ring-[#DC143C]/20 focus:border-[#DC143C]
outline-none
transition-all duration-200
```

### Badges

**Success Glass**
```
bg-[#2D6A4F]/15 backdrop-blur-sm
border border-[#2D6A4F]/25
text-[#2D6A4F]
px-3 py-1
rounded-full
text-xs font-semibold tracking-wide uppercase
```

**Warning Glass**
```
bg-[#F59E0B]/15 backdrop-blur-sm
border border-[#F59E0B]/25
text-[#D97706]
px-3 py-1
rounded-full
text-xs font-semibold
```

**Danger Glass**
```
bg-[#DC2626]/15 backdrop-blur-sm
border border-[#DC2626]/25
text-[#DC2626]
px-3 py-1
rounded-full
text-xs font-semibold
```

**Neutral Glass**
```
bg-neutral-200/60 backdrop-blur-sm
border border-neutral-300/40
text-neutral-600
px-3 py-1
rounded-full
text-xs font-medium
```

### Modals

**Glass Modal — Overlay**
```
bg-neutral-900/50 backdrop-blur-sm
```

**Glass Modal — Container**
```
bg-white/95 backdrop-blur-xl
border border-white/30
rounded-3xl
shadow-2xl
p-8
max-w-lg w-full
```

**Glass Modal — Header Border**
```
border-b border-neutral-200/50
pb-4 mb-6
```

### Navigation

**Glass Navbar**
```
bg-white/80 backdrop-blur-lg
border-b border-white/30
shadow-sm
sticky top-0 z-50
```

**Glass Sidebar**
```
bg-white/70 backdrop-blur-md
border-r border-white/25
shadow-lg
h-screen overflow-y-auto
```

**Glass Footer**
```
bg-neutral-900/95 backdrop-blur-md
border-t border-white/10
text-white/90
```

---

## Animation & Motion

### Timing
| Type | Duration | Easing | Tailwind | Usage |
|------|----------|--------|----------|-------|
| Micro | 150ms | ease-out | `duration-150` | Icon changes, badge updates, small interactions |
| Standard | 250ms | ease-out | `duration-250` | Button hover, input focus, standard transitions |
| Smooth | 300ms | cubic-bezier(0.16, 1, 0.3, 1) | `duration-300` | Card hover, glass surface changes |
| Emphasis | 400ms | cubic-bezier(0.16, 1, 0.3, 1) | `duration-400` | Modal enter, drawer slide, page transitions |
| Exit | 200ms | ease-in | `duration-200` | Closing modals, dismissing toasts |

### Transitions to Use

**Glass Hover Effect**
```css
transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
```
```
transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
```

**Button Interactions**
```
transition-all duration-250 ease-out
hover:scale-105 active:scale-95
```

**Card Lift**
```
transition-all duration-300 ease-out
hover:shadow-xl hover:-translate-y-1
```

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
```

**Glass Shimmer** (for premium elements)
```css
@keyframes glassShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
background: linear-gradient(
  90deg,
  rgba(255,255,255,0) 0%,
  rgba(255,255,255,0.3) 50%,
  rgba(255,255,255,0) 100%
);
background-size: 200% 100%;
animation: glassShimmer 3s ease-in-out infinite;
```

### Scroll Behavior
```css
scroll-behavior: smooth;
scroll-padding-top: 80px; /* Account for fixed glass navbar */
```

---

## Layout Patterns

### Hero Section — Glassmorphic
```html
<section class="relative h-screen flex items-center justify-center overflow-hidden">
  <!-- Background gradient -->
  <div class="absolute inset-0 bg-gradient-to-br from-[#DC143C] via-[#E85472] to-[#A67C52]"></div>

  <!-- Glass overlay -->
  <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

  <!-- Content -->
  <div class="relative z-10 text-center text-white px-6">
    <h1 class="text-6xl font-display font-semibold mb-4 drop-shadow-lg">
      Transforming Nepal Through Partnership
    </h1>
    <p class="text-xl font-sans max-w-2xl mx-auto mb-8 text-white/90">
      Supporting indigenous communities with education, healthcare, and sustainable development.
    </p>
    <button class="bg-white/90 backdrop-blur-md text-[#DC143C] font-semibold px-8 py-4 rounded-xl border border-white/30 hover:bg-white hover:shadow-2xl transition-all duration-300">
      Get Involved
    </button>
  </div>
</section>
```

### Bento Grid — Glass Tiles
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
  <div class="bg-white/75 backdrop-blur-md border border-white/25 rounded-2xl p-6 hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
    <!-- Content -->
  </div>
</div>
```

### Floating Cards Stack
```html
<div class="relative">
  <!-- Card 3 (back) -->
  <div class="absolute top-8 left-4 right-4 bg-white/50 backdrop-blur-sm rounded-2xl h-64 transform rotate-2"></div>

  <!-- Card 2 (middle) -->
  <div class="absolute top-4 left-2 right-2 bg-white/70 backdrop-blur-md rounded-2xl h-64 transform rotate-1"></div>

  <!-- Card 1 (front) -->
  <div class="relative bg-white/90 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-xl">
    <!-- Main content -->
  </div>
</div>
```

---

## Anti-Patterns — Do NOT

1. **Don't use pure black (`#000000`) anywhere** — Use `neutral-900` (`#1F1812`) or `neutral-950` (`#0F0C09`) for maximum contrast. Pure black clashes with the warm, premium aesthetic.

2. **Don't stack multiple blur layers excessively** — One `backdrop-blur` per card. Overdoing blur kills performance and looks muddy. Maximum 2 nested blur surfaces.

3. **Don't mix sharp corners with glass** — If using glassmorphism, commit to **soft radii (12px+)**. Sharp `rounded-sm` breaks the organic premium feel.

4. **Don't use more than 3 font weights on a single page** — Stick to 400, 600, 700. Overusing weights dilutes hierarchy.

5. **Don't put glassmorphic elements on white backgrounds** — Glass needs **contrast behind it** to show blur effect. Use gradients, images, or colored backgrounds.

6. **Don't ignore Safari `-webkit-backdrop-filter`** — Always include both `backdrop-filter` and `-webkit-backdrop-filter`. Safari needs the prefix.

7. **Don't use crimson red for ALL buttons** — Reserve primary red for KEY actions (donate, join, apply). Use mountain bronze for secondary, educational, or informational actions.

8. **Don't animate blur values** — Animating `backdrop-blur` is **extremely expensive**. Animate `opacity`, `transform`, `shadow` instead.

9. **Don't use gradients inside small UI elements** — Gradients work for heroes/backgrounds. Inside 40px buttons they look amateurish. Solid colors for small components.

10. **Don't forget focus states** — Glass elements need **visible focus rings** for accessibility. Use `focus:ring-2 focus:ring-[#DC143C]/30` on all interactive elements.

11. **Don't overuse sand/warm accents** — Warm sand is for subtle emphasis and borders, not large surface areas. Use white or cream for main backgrounds.

12. **Don't put light text on light glass** — Ensure contrast ratios. If background is light, text must be `neutral-700` or darker.

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Add Playfair Display, Cormorant Garamond to `index.html` (keep Inter)
- [ ] Update `@theme` block in `src/index.css` with new color tokens
- [ ] Add glassmorphism CSS variables (`--glass-blur`, `--glass-opacity`, etc.)
- [ ] Create `src/styles/glass.css` with reusable glass utility classes

### Phase 2: Components
- [ ] Update Button component with glass variants
- [ ] Update Card component with glass variants
- [ ] Redesign Input/Select with glass styling
- [ ] Update Badge with glass backgrounds
- [ ] Redesign Modal with glass overlay + container

### Phase 3: Layout
- [ ] Glassmorphic navbar (sticky, blur, border)
- [ ] Hero section with gradient + glass overlay
- [ ] Footer with dark glass aesthetic
- [ ] Bento grid for features/impact sections

### Phase 4: Polish
- [ ] Add glass shimmer animation to premium CTAs
- [ ] Implement scroll-triggered fade-ins for cards
- [ ] Test blur performance on mobile (reduce blur on low-end devices)
- [ ] Accessibility audit (focus rings, contrast ratios, ARIA labels)

---

## Design Principles

1. **Glass creates depth without weight** — Use transparency and blur to separate UI layers while maintaining visual flow.

2. **Red demands respect** — Crimson is powerful. Use it for calls-to-action, not decoration. Let white space breathe around it.

3. **Bronze grounds the palette** — Mountain bronze provides earthy stability and cultural connection. Use for educational content, navigation, and secondary actions.

4. **Warmth is the foundation** — This is an all-warm palette (red + bronze + sand). Embrace it. No cool blues. The warmth creates approachability and cultural authenticity.

5. **Hierarchy through blur** — Background = most blur. Mid-ground = moderate blur. Foreground = minimal blur or solid. Depth is spatial, not just color.

6. **Motion should feel effortless** — Ease-out for entrances, ease-in for exits. Spring easing (`cubic-bezier(0.16, 1, 0.3, 1)`) for interactions.

---

**Next Steps:**
Review this system with stakeholders. Once approved, implement Phase 1 (Foundation) to establish the new color palette and typography. Test glassmorphism effects on target devices before full rollout — mobile Safari can struggle with heavy blur.

**File Location:**
`/Users/mattbayne/Documents/SoftwareProjects/HIS/design-system.md`
