# RouteMate Design System & Guidelines 🌌✨

RouteMate is built on a "Minimalist Premium" mobile-first aesthetic with rich dark backgrounds, glassmorphic elements, vibrant accents, and strict geometric consistency.

## 🎨 Color Tokens
- **Background**: `#000000` (Pure pitch black for OLED devices)
- **Foreground**: `#ffffff` (White)
- **Card Background**: `#09090b` (Zinc-950)
- **Glass Card Background**: `rgba(18, 18, 22, 0.4)`
- **Glass Overlay**: `rgba(9, 9, 11, 0.6)`
- **Primary Accent**: `#3b82f6` (Vibrant blue)
- **Secondary Accent**: `#f59e0b` (Amber-500 for alerts/drafts)
- **Border**: `rgba(255, 255, 255, 0.08)`

## 📐 Shape & Geometry
- **Main Container Corners**: `rounded-[32px]` (`32px` or `2rem`)
- **Card Corners**: `rounded-[24px]` (`24px` or `1.5rem`)
- **Control/Modal Corners**: `rounded-[24px]` (`24px` or `1.5rem`)
- **Inner Buttons & Badges**: `rounded-full` or `rounded-xl`
- **Intrinsic Sizing**: List items must be minimum `min-h-[64px]` with `py-4` vertical padding.

## ✍️ Typography
- **Headings**: `font-black text-white tracking-tighter` (Inter or Geist Sans fallback)
- **Subheadings / Section titles**: `text-[10px] font-black text-white uppercase tracking-[0.4em]`
- **Body & Captions**: `text-zinc-400 font-medium`

## 🕹️ Interactive Elements
- **The Sole Button Standard**: Primary actions must use the `.btn-primary` utility: height `h-14`, `rounded-[24px]`, border `border-2 border-primary`, text tracking `tracking-[0.2em]`, text size `text-[11px]`, bold uppercase tracking.
- **Zero-Jump Header Rhythm**: Sticky header with brand brand-gap `4px` and synchronized padding.
