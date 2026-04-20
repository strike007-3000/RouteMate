# RouteMate v2.7.5 - Immersive Travel Intelligence 🌌✨

RouteMate is a mobile-first, offline-capable travel intelligence application driven by a **Date-Grouped Intelligence Engine** that manages your entire travel flow.

![RouteMate Dashboard](file:///Users/shreyasgore/Code/RouteMate/docs/dashboard_v2.7.png)

## ✨ Core Features

### 🌅 Immersive Hero Architecture
A premium, full-bleed header system that connects the emotion of travel with the precision of logistics.
- **Triple-Gradient Logic**: Deep linear gradients ensure text contrast while maintaining image clarity.
- **Dynamic Metadata Hierarchy**: Destination name in sentence-case with uppercase tracking grid for dates, duration, and cost.
- **Contextual View Transitions**: Seamlessly transitions from Dashboard overview to detailed Timeline view.

### 📅 Adaptive Intelligence Engine
The system now proactively manages your trip window based on extracted data.
- **Anchor Year Logic**: Automatically anchors relative dates (e.g., "April 22nd") to your trip's start year (2026).
- **Auto-Extension (The return flight fix)**: Detects when prompts include activities beyond the current trip window and automatically extends the `endDate` in the database.
- **Sticky Geography**: Headers stick to the top during scroll, so you always know which day you're viewing.
- **Intelligence Badges**: Day headers show icon summaries (✈️ 🏨 🚆) for an instant visual overview.

### 🧠 Logistical Ranking (Human-First)
We've moved beyond simple sorting to a system that respects logical travel flow.
- **1-6 Rank Sequence**: Automatic sorting follows a proven sequence:
  1. Check-out (Lodging)
  2. Departure (Flight/Train)
  3. Arrival
  4. Check-in (Lodging)
  5. Activities & Dining
  6. Return Flight (Anchor)
- **Home Base Logic**: Identifies your origin city and intelligently suppresses redundant logistics for "Home."
- **Return Flight Detection**: Automatically anchors your final home-bound flight to the bottom of the itinerary.

### 🧠 Transit Intelligence (The 50km Rule)
Calculates physical distance between stops to provide the right handoff:
- **Local (< 50km)**: One-tap Smart Handoff to **Google Maps Transit**.
- **Inter-city (>= 50km)**: Suggests **Driving Directions** and updates the UI accordingly.
- **Contextual UI**: Cards heading to airports feature "NAVIGATE TO AIRPORT" labeling.

### 💎 Signature Design System (v2.7.5)
A hyper-consistent, premium visual identity designed for readability and speed.
- **Subtle Blue Pill Design**: All primary actions (Create Trip, View Timeline, Smart Add) use a high-fidelity glass style with `bg-blue-500/10` and `rounded-full` geometry.
- **Full-Bleed Spacing**: Reduced internal margins (`px-4`) and optimized bento-to-itinerary gaps for maximum screen utilization.
- **The 40px Rule**: Advanced modal radii (`rounded-[40px]`) for a smoother, organic tactile feel.
- **No-Jump Navigation**: Absolute-aligned headers ensure titles stay perfectly fixed during back-navigation.
- **Neon Glow Categories**: Signature glow effects for Flight, Lodging, Food, Activity, Train, and Rental.

### 🧠 Smart Add Workflow
Advanced AI extraction with human-centric feedback.
- **Extraction Engine**: Mistral-powered parsing of confirmation emails and booking details.
- **Success Toasts**: Immediate signature notifications for successful itinerary updates.
- **Retry Logic**: Modal-state preservation and inline alerts for failed extractions.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Dexie.js (IndexedDB)
- **AI**: NVIDIA NIM (Mistral Small / Large)
- **Imaging**: Unsplash API
- **Logistics**: OpenRouteService + Google Maps Handoff

## 🏗️ Architecture

```mermaid
graph TD
    A[User UI - Next.js] --> B[Zustand Trip Intelligence Store]
    A --> J[LiveQuery Subscriptions]
    J --> C[Dexie.js - Grouped & Manual Schema]
    B --> C
    C --> D[(Trips Table)]
    C --> E[(Itinerary Table - Categories & CustomOrder)]
    A --> F[NVIDIA NIM Core - Mistral Extraction]
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
