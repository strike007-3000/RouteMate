# Changelog

All notable changes to this project will be documented in this file.

## [2.9.0](https://github.com/strike007-3000/RouteMate/compare/v2.8.0...v2.9.0) (2026-04-21)


### Features

* release v2.7.7 - dual-view distinction, intelligent routing, and ai extraction hardening ([5289cbb](https://github.com/strike007-3000/RouteMate/commit/5289cbbe9c474af3068fd1d0099f0d33ec1afb47))

## [2.8.1] - 2026-04-21

### 🌓 Dual-View Distinction (Summary vs. Logistics)
- **State-Driven UI**: Implemented a global view switcher allowing users to toggle between a high-level visual itinerary and a technical logistical timeline.
- **Summary Mode**: Focuses on emotional planning with image-forward "Day Cards," unified 32px radii, and suppressed connectors.
- **Logistics Mode**: Restores the 1px continuous thread, transit markers, and technical metadata.

### 📍 Intelligent 'Between-Stop' Directions
- **Contextual Routing**: The Map Pin now calculates directions **from the previous stop** to the current one, providing a seamless journey thread.
- **Hub Precision**: Integrated `getPreciseLocation` logic to ensure navigation routes specifically to **Airport Terminals** (IATA codes) rather than generic city pins.
- **Cross-Day Continuity**: Navigation logic now persists across day boundaries, routing your first activity of the day from the previous night's hotel.

### 🧠 AI Extraction Hardening (Llama 3.3 70B)
- **Primary Model Migration**: Switched to **Llama 3.3 70B** as the primary reasoning engine via OpenRouter.
- **JSON Object Mode**: Enabled `response_format: json_object` to eliminate markdown artifacts and 422 parsing errors.
- **Fuzzy Data Recovery**: Implemented a regex-based recovery layer to handle non-compliant LLM responses.

### 🌅 Luxury Magazine Imagery
- **Curated Filtering**: Updated the Unsplash engine with `featured=true` and `content_filter=high` to ensure a premium travel aesthetic.

## [2.8.0] - 2026-04-20

### Features
- immersive hero architecture & adaptive logistics engine v2.7.5 ([78b031e](https://github.com/strike007-3000/RouteMate/commit/78b031e4cb196ed184586231fff2903b4166917a))

### Bug Fixes
- import missing cn utility in EditTripModal ([5951e3e](https://github.com/strike007-3000/RouteMate/commit/5951e3ea36051c53a10e4f61544c7dcc561df150))

## [2.7.2] - 2026-04-20

### 🎨 Design System Synchronization (Signature Blue)
- **Unified Brand Identity**: Standardized the entire application on **RouteMate Blue (#3b82f6)**. Every button, indicator, and active state now shares a singular, vibrant identity.
- **The 24px Rule**: Audited and standardized all component geometry to a global `rounded-[24px]` radius and `px-6` spacing for a premium, cohesive feel.
- **No-Jump Navigation Header**: Implemented absolute horizontal alignment (`pl-16`) and fixed height (`h-20`) for the global `Header`. This ensures titles remain perfectly fixed during back-navigation, eliminating layout "jumps."
- **Dashboard Refinement**: Updated the `Countdown` widget to show the Trip Start Date when no upcoming stops are present.

### 🧠 Human-First Sorting Engine (Final Hardening)
- **1-6 Rank Hierarchy**: Refactored the internal ranking model to a streamlined 6-rank sequence:
  1. Check-out (Lodging)
  2. Departure (Flight/Train)
  3. Arrival
  4. Check-in (Lodging)
  5. Activities & Dining
  6. Return Flight (Anchor)
- **Smart Return-Flight Detection**: Introduced logic to automatically identifies "Home-bound" flights by comparing arrival cities to the trip's origin. Return flights are now forced to the absolute bottom of the timeline.
- **Home Base Suppression**: Origin cities now intelligently suppress redundant check-out/transit events on Day 1.

### 🤖 Smart Add Workflow & Feedback
- **RouteMate Success Toast**: Implemented a signature, high-fidelity custom notification component for extraction success feedback.
- **Enhanced Retry Logic**: The Smart Add modal now stays open on failure, preserving user text and displaying inline alerts (`AlertCircle`) for low-friction retrying.
- **UI Feedback**: Added an animated pulse effect to the extraction button during AI processing.

## [2.7.0] - 2026-04-19

### 🧠 The "Implicit Hub" Engine (Logistics Phase 2)
- **Implicit Airport Routing**: Refactored the core transit logic to treat airports as "Implicit Hubs." Directions now point directly from your hotel/home to the gate without redundant itinerary stops.
- **Ocean Crossing Suppressor**: Implemented a distance-based filter (>500km) to hide illogical driving connections across oceans when flights are detected.
- **Flight Migration Logic**: Upgraded the AI parser to anchor flights as the primary timeline events (Early Departure $\rightarrow$ Mid-day Arrival).

### 🛡️ Dashboard Resilience (Visual Pass 2)
- **Fail-Soft Imagery**: Added a robust `onError` fallback system in `TripCard.tsx`. If Unsplash fails, the dashboard automatically swaps to a vibrant, high-quality scenic asset. No more black cards.
- **Contrast Typography**: Applied high-contrast `drop-shadow-2xl` and `tracking-tighter` styles to all trip titles for maximum legibility over photography.

### 🧬 Temporal Logic & Hardening
- **Strict Sequencing**: Hardcoded logical ranks (Departure 08:00 > Check-out 10:00 > Arrival 14:00 > Check-in 16:00) to solve the 'Hotel-First' paradox.
- **Transactional Persistence**: Fixed an issue where manual reordering didn't persist correctly across sessions.

---

## [2.6.4] - 2026-04-19

### 🧠 Logic & Reordering (Fixing "Not Moving")
- **Wired Drag Handles**: Implemented `useDragControls` and attached it specifically to the **Vertical Grip (dots) icon**. Precision manual reordering is now fully enabled.
- **Unified Sorting**: Updated the core sorting engine to prioritize manual `sortOrder` as the primary tie-breaker for items with identical times.
- **Transactional Persistence**: Manual order changes are now persisted to Dexie v4.

### 💎 Visual Overhaul & Glassmorphism
- **Itinerary Header**: Implemented "Glassmorphism Overlay" for the title card using `backdrop-blur-2xl` on top of scenic hero images.
- **Hero Card Fidelity**: Optimized `TripCard.tsx` with dynamic `object-cover` and `animate-pulse` loading states.

### 🛡️ Build & Stability (The Hardening Pass)
- **Resolved ESLint Blockers**: Fixed 11 critical errors (React purity, cascading renders, any types, unescaped entities).
- **TypeScript Fidelity**: Migrated unsafe `any` records to strict `unknown` types with proper casting.
- **CI/CD Alignment**: Migrated `release-please.yml` to the official namespace to resolve deprecation warnings.
- **Fixed Missing Import**: Resolved `parseISO` build error in `BentoGrid.tsx` that was blocking production deployment.

### 🧬 Sequencing & Extraction Hardening
- **Mistral v4 Transition**: Successfully migrated to the **Mistral Small 4 (119B)** engine (`2603` snapshot).
- **Chronological Enforcement**: Refined system prompts to strictly lock **Hotel Check-ins at 15:00** and arrivals at 08:00.
- **Diagnostic Tooling**: Introduced `npm run test:integrity` to verify API connectivity and logic sequencing before deployment.

---

## [2.0.0] - 2026-04-19

### 🚀 Major Architectural Shift
- **Grouped Timeline**: Replaced the static Radar tab with a comprehensive, date-grouped accordion Timeline.
- **Accordion Physics**: Added smooth framer-motion slide animations and sticky date headers.
- **Smart Expansion**: Implemented logic to auto-expand "Today's" itinerary on initial view.

### 🧠 Intelligence Engines
- **50km Transit Rule**: Implemented Haversine distance calculations for dynamic transit/driving switching.
- **AI Extraction 2.0**: Upgraded Smart Add to extract high-precision data.
- **Address Hardening**: Automated address cleaning logic.

### 💎 Design & Branding
- **Minimalist Premium identity**: Standardized "ROUTEMATE" branding globally.
- **Category Glow System**: Color-coded cards for visual recognition.
- **UI Grid Alignment**: Standardized on a 16px grid system.

---

## [1.2.0] - 2026-04-18
- Initial stable release with Multi-Trip management.
- Radar tab feature set (Geolocation-based transit hubs).
- Basic Unsplash image mapping.
