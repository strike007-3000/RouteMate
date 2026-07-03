# RouteMate Design System

This document outlines the visual design system, tokens, utilities, and components of RouteMate.

## 1. Core Visual Tokens

### Colors
- **Background:** `#000000` (pitch black background for premium dark mode contrast)
- **Foreground:** `#ffffff` (high contrast white for maximum readability)
- **Primary:** `#3b82f6` (vibrant blue-500, used for primary actions, active indicators, and timeline highlights)
- **Primary Foreground:** `#ffffff`
- **Secondary:** `#18181b` (zinc-900, default dark container background)
- **Secondary Foreground:** `#ffffff`
- **Muted:** `#18181b` (zinc-900)
- **Muted Foreground:** `#71717a` (zinc-500, used for placeholder and secondary textual metadata)
- **Accent:** `#27272a` (zinc-800)
- **Accent Foreground:** `#ffffff`
- **Destructive:** `#ef4444` (red-500, semantic danger actions)
- **Destructive Foreground:** `#ffffff`

### Spatial Geometry & Containers
- **Card Radius:** `rounded-[24px]` (24px corner radius for standard component cards, e.g. TripCard, Settings Items)
- **Container Radius:** `rounded-[32px]` (32px corner radius for main layouts, modals, and summary blocks)
- **Interactive Button Height:** `h-14` (56px standard primary touch target height)
- **Global Page Gutter:** `px-6` (24px page edge margin)

---

## 2. Layout & Styling Classes

### `.glass`
- **Effect:** `backdrop-blur-2xl border border-white/10`
- **Background:** `rgba(9, 9, 11, 0.6)`
- **Usage:** Standard translucent elements, overlays, and floating headers.

### `.glass-card`
- **Effect:** `backdrop-blur-xl border border-white/5`
- **Background:** `rgba(18, 18, 22, 0.4)`
- **Usage:** Secondary layout panels and nested information cards.

### `.btn-primary`
- **Style:** Outlined primary color with active scaling and glow shadow.
- **Classes:** `h-14 rounded-[24px] border-2 border-primary text-primary bg-transparent font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:bg-primary/5`

### `.btn-secondary` (Secondary Actions)
- **Style:** Flat dark background button with active scaling and hover border transitions.
- **Classes:** `h-14 rounded-[24px] bg-zinc-900/50 border border-white/5 hover:border-primary/30 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-zinc-900 active:scale-95 transition-all`

### `.page-glow`
- **Style:** Subtle radial background overlay at the top center of the page.
- **Background:** `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%)`
- **Usage:** Root level wrapper of core pages (`trips`, `explore`, `account`, `timeline`) to add visual depth in dark mode.

### `.no-scrollbar`
- **Effect:** Completely hides browser scrollbars while retaining scroll mechanics.
- **Usage:** Category pill horizontal sliders, timeline lists, or modal viewport containers.

---

## 3. Component & State Visual Specifications

### BottomNav Navigation Pill
- **Active State:** Features a translucent background pill (`bg-primary/10 border border-primary/20 rounded-[16px]`) sliding smoothly behind the active icon using Framer Motion.
- **Active Label/Icon:** Colored in `text-primary`.
- **Inactive Label/Icon:** Colored in `text-zinc-600` for high contrast dark-mode legibility.

### Animated Sonar Empty State
- **Center Icon:** A pulsing plane (`animate-bounce`) inside a raised circular container (`bg-zinc-900 border border-white/10 shadow-primary/10`).
- **Ping Rings:** 3 concentric circles using staggered scale and opacity `animate-ping` transitions (`bg-primary/5`, `bg-primary/10`, `bg-primary/15`).

### Bento Grid Modules
- **Tiles:** Rounded containers (`rounded-[24px]`) with transparent backing (`bg-black/40 backdrop-blur-xl border border-white/5`) and micro-interactive highlights (`hover:border-primary/20 transition-all duration-300`).

### Account Settings Semantic Icons
- **Personal Info (User):** `text-blue-400` icon, `bg-blue-400/10` background, `border-blue-400/20` border.
- **App Settings (Settings):** `text-zinc-400` icon, `bg-zinc-400/10` background, `border-zinc-700/30` border.
- **Currency & Units (Globe):** `text-emerald-400` icon, `bg-emerald-400/10` background, `border-emerald-400/20` border.
- **Notification Settings (Bell):** `text-amber-400` icon, `bg-amber-400/10` background, `border-amber-400/20` border.
- **Privacy & Security (Shield):** `text-purple-400` icon, `bg-purple-400/10` background, `border-purple-400/20` border.
- **Logout (LogOut):** `text-red-500/80` icon, `bg-red-500/10` background, `border-red-500/20` border.
