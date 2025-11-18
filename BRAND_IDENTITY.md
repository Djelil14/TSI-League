# TSI League - Brand Identity Guide

## 🎨 Visual Identity

### League Name
**Thunder Strike International (TSI)**

### Mission Statement
"Delivering world-class professional basketball competition with unmatched energy, passion, and global reach."

### Brand Personality
- **Bold:** Confident, powerful, dominant
- **Dynamic:** Fast-paced, exciting, energetic
- **Global:** International appeal, diverse
- **Premium:** High-quality, professional, elite

---

## 🎨 Color System

### Primary Colors

**Brand Red** - Main brand color
```
HEX: #EF4444
RGB: 239, 68, 68
Tailwind: brand-primary-500
Usage: Primary buttons, CTAs, accents, logos
```

**Dark Navy** - Authority & sophistication
```
HEX: #1E293B
RGB: 30, 41, 59
Tailwind: brand-secondary-800
Usage: Text, backgrounds, secondary elements
```

**Championship Gold** - Excellence & achievement
```
HEX: #F59E0B
RGB: 245, 158, 11
Tailwind: brand-accent-500
Usage: Highlights, awards, special features
```

### Secondary Palette

Full scales available in Tailwind config:
- `brand-primary-{50-950}` - Red spectrum
- `brand-secondary-{50-950}` - Navy/slate spectrum
- `brand-accent-{50-950}` - Gold spectrum

### Gradient Combinations

1. **Primary Gradient** (Buttons, CTAs)
   ```
   linear-gradient(135deg, #EF4444, #DC2626)
   ```

2. **Court Gradient** (Hero sections, backgrounds)
   ```
   linear-gradient(135deg, #EF4444, #B91C1C)
   ```

3. **Premium Gradient** (Special elements, logos)
   ```
   linear-gradient(135deg, #EF4444, #F59E0B)
   ```

---

## ✍️ Typography

### Font Families

**Display Font: Bebas Neue**
- Usage: Headlines, team names, player numbers, statistics
- Weight: 400 (Regular)
- Characteristics: Bold, condensed, impactful
- Letter-spacing: 0.05em (uppercase tracking)

**Body Font: Inter**
- Usage: Body text, UI, navigation, descriptions
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Characteristics: Clean, modern, highly readable

### Type Scale

```
h1: 3rem - 4.5rem (48px - 72px)
h2: 2.5rem - 3.75rem (40px - 60px)
h3: 2rem - 3rem (32px - 48px)
Body: 1rem (16px)
Small: 0.875rem (14px)
Tiny: 0.75rem (12px)
```

### Usage Examples

```tsx
// Headlines
<h1 className="font-display text-6xl uppercase tracking-wide">
  TSI LEAGUE
</h1>

// Stats/Numbers
<div className="font-display text-5xl font-bold">
  28.4 PPG
</div>

// Body Text
<p className="font-sans text-base">
  Regular paragraph content
</p>
```

---

## 🎯 Logo System

### Primary Logo

**Icon Mark:**
- Bold "T" letter
- White color on gradient background
- Gradient: #EF4444 → #F59E0B
- Shape: Rounded square (border-radius: 0.5rem)
- Optional glow effect for digital use

**Full Logo Lockup:**
```
[Icon] TSI LEAGUE
       Thunder Strike International
```

### Logo Variations

1. **Full Color** - Primary use
2. **White** - Dark backgrounds
3. **Black** - Light backgrounds
4. **Monochrome** - Single color applications

### Logo Clear Space
Minimum clear space: 0.5x the height of the icon

### Minimum Size
- Digital: 32px height
- Print: 0.5 inch height

---

## 🎨 UI Design Patterns

### Cards
- Rounded corners: 12px (rounded-xl)
- Shadow: Subtle elevation
- Hover: Scale transform + shadow increase
- Border: 1px solid in light mode, transparent in dark

### Buttons
- Border radius: 8px (rounded-lg)
- Padding: 0.5rem 1rem (md size)
- Font: Inter Medium
- Transition: All properties 200ms
- Focus ring: 2px brand-primary-500

### Spacing System
Uses Tailwind's default 4px scale:
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Shadows
```
sm:   0 1px 2px rgba(0,0,0,0.05)
md:   0 4px 6px rgba(0,0,0,0.07)
lg:   0 10px 15px rgba(0,0,0,0.1)
glow: 0 0 20px rgba(239,68,68,0.5)
```

---

## 🌗 Dark Mode

### Philosophy
Dark mode is the DEFAULT theme - designed for premium, immersive viewing experience.

### Background Colors
- **Dark:** #0F172A (brand-secondary-900)
- **Slightly Lighter:** #1E293B (brand-secondary-800)
- **Cards:** #1E293B with subtle border

### Text Colors
- **Primary:** #FFFFFF (white)
- **Secondary:** #CBD5E1 (brand-secondary-300)
- **Muted:** #64748B (brand-secondary-500)

### Contrast
All text meets WCAG AA standards for contrast ratios.

---

## 📱 Responsive Design

### Breakpoints
```
sm:  640px  - Mobile landscape
md:  768px  - Tablet
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large
```

### Mobile-First Approach
Design for mobile first, enhance for larger screens.

---

## 🎬 Motion & Animation

### Principles
- **Purposeful:** Motion should enhance understanding
- **Quick:** 150-300ms for most transitions
- **Smooth:** Use ease-in-out curves

### Common Animations
```css
Hover Scale:    transform: scale(1.05)
Fade In:        opacity: 0 → 1
Slide Up:       translateY(20px) → 0
```

### Transition Timing
- Micro-interactions: 150ms
- UI elements: 200-300ms
- Page transitions: 400-500ms

---

## ✅ Best Practices

### Do's
✅ Use gradients for special elements and CTAs
✅ Maintain consistent spacing rhythm
✅ Use Bebas Neue for impact, Inter for readability
✅ Provide dark mode variants for all components
✅ Use red (#EF4444) sparingly for maximum impact
✅ Ensure proper contrast ratios

### Don'ts
❌ Don't mix too many colors in one design
❌ Don't use body text smaller than 14px
❌ Don't ignore dark mode considerations
❌ Don't overuse gradients
❌ Don't violate logo clear space requirements
❌ Don't use low-contrast color combinations

---

## 📐 Component Examples

### Match Score Card
```
[Badge: LIVE]

Team A    98
    Q3 5:32
Team B    95

[View Details Button]
```

### Player Stat Card
```
[Player Photo]
#23 Jordan Matthews
Phoenix Storm

28.4 PPG  5.2 APG  6.1 RPG
```

### Team Card
```
[Team Logo]
Phoenix Storm
35-12  •  1st in West

[View Team Button]
```

---

**Last Updated:** January 2025
**Version:** 1.0
**Maintained by:** TSI Design Team
