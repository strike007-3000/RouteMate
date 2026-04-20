# RouteMate v2.7.1 - The Hybrid Travel Engine 🌍✨

RouteMate is a mobile-first, offline-capable travel intelligence application. Version 2.0 introduced a massive architectural shift from simple itineraries to a **Date-Grouped Intelligence Engine** that manages your entire travel flow.

![RouteMate v2.7 Dashboard](file:///Users/shreyasgore/Code/RouteMate/docs/dashboard_v2.7.png)

## ✨ New in v2.0-v2.2

### 📅 Date-Grouped Timeline (The Accordion)
Replaced the static Radar tab with a high-performance, date-grouped timeline.
- **Smart Expansion**: Automatically expands "Today's" plans on load.
- **Sticky Geography**: Headers stick to the top during scroll, so you always know which day you're viewing.
- **Category Summary**: Day headers show icon badges (✈️ 🏨 🚆) for an instant itinerary overview.

### 🧠 Transit Intelligence (The 50km Rule)
Our new logistics engine calculates physical distance between stops using the **Haversine Formula**:
- **Local (< 50km)**: One-tap Smart Handoff to **Google Maps Transit**.
- **Inter-city (>= 50km)**: Automatically suggests **Driving Directions** and updates the UI to "Inter-city Connection."

### 💎 Category Intelligence & Glow
Itinerary points are now classified into 6 smart categories: `Flight`, `Lodging`, `Food`, `Activity`, `Train`, and `Rental`.
- **Unique Visual Identity**: Each category has a signature neon glow (Blue/Green/Amber/Purple).
- **AI-Powered Extraction**: NVIDIA NIM high-fidelity coordinate extraction for precise routing.

### 🎨 Minimalist Premium Branding
Uniform, high-end "ROUTEMATE" signature across all screens with contextual back-navigation. v2.1 introduced a **Compact Widget Row** to optimize itinerary real estate.

### 📅 Interactive Creation (v2.1)
Replaced instant placeholders with a premium **New Trip Modal** to capture precise destinations and dates before planning begins.

### 🎯 Hybrid Intelligence (v2.7.1 Stability Patch)
We've moved beyond purely automatic sorting to a system that respects your manual intent.
- **Precision Reordering**: Fully restored Framer Motion drag-and-drop handles. Manual order now overrides predicted times within a day.
- **Logical Flow**: Automatic sorting now follows a proven "Travel Day" sequence (Checkout -> Departure -> Arrival -> Checkin).
- **Hardened Routing**: Google Maps links now accurately identify arrival hubs and exact place names, resolving all airport-to-hotel loops.
- **Unsplash Visual Engine**: Trips feature high-fidelity destination imagery with atmospheric glassmorphism.
- **Mistral Small 4 (119B) Core**: Ultra-fast AI extraction with 2026-hardened chronological buffers and strict key validation.
- **Persistent Local Cache**: Manual sort orders and images are saved directly to **Dexie v4**.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + Framer Motion (Accordion & Reorder)
- **Database**: Dexie.js (IndexedDB) v4 (Manual Sorting Support)
- **AI**: NVIDIA NIM (Mistral Small 4 119B Instruct / Mistral Large 3 Fallback)
- **Imaging**: Unsplash API (Landscape Architecture)
- **Logistics**: OpenRouteService (ORS) + Google Maps Handoff + Haversine Logic

## 🏗️ Architecture v2.7

```mermaid
graph TD
    A[User UI - Next.js 16] --> B[Zustand Trip Intelligence Store]
    A --> J[LiveQuery Subscriptions]
    J --> C[Dexie.js v4 - Grouped & Manual Schema]
    B --> C
    C --> D[(Trips Table)]
    C --> E[(Itinerary v4 Table - Categories & CustomOrder)]
    A --> F[NVIDIA NIM Core - Mistral v4 Extraction]
    A --> G[Logistics Engine - 50km Rule]
    A --> K[Unsplash Image Engine - Caching Service]
    G --> L[OpenRouteService - Geocoding & Local Routes]
    G --> H[Google Maps - Transit & Driving Handoff]
```

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/strike007-3000/RouteMate.git
   npm install
   ```
2. **Environment**:
   Add `NVIDIA_API_KEY`, `UNSPLASH_ACCESS_KEY`, and `ORS_API_KEY` to your `.env`.
3. **Pre-flight Integrity Check**:
   Before deploying or testing, verify your configuration and AI logic:
   ```bash
   npm run test:integrity
   ```
4. **Run**:
   ```bash
   npm run dev
   ```

---
Built with ❤️ for travelers who value intelligence and design.
