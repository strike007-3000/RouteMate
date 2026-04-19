# Changelog

All notable changes to this project will be documented in this file.

## [2.4.0](https://github.com/strike007-3000/RouteMate/compare/v2.3.1...v2.4.0) (2026-04-19)


### Features

* release v2.7.0 with implicit hubs and dashboard image resilience ([c2a446b](https://github.com/strike007-3000/RouteMate/commit/c2a446b3c4744a0aadfb98602881ef7eba8f5455))
* release v2.7.1 stability patch - fixed reorder, routing, and extraction [skip ci] ([e40bfe2](https://github.com/strike007-3000/RouteMate/commit/e40bfe23bbfbf1df922b3f475c06ae05bee8dfb3))


### Bug Fixes

* v2.6.4 aesthetics & logic - repair manual reordering, glassmorphism, and trip card image fidelity ([66a2a2a](https://github.com/strike007-3000/RouteMate/commit/66a2a2a99ca3b72c4b40bf7c46d021c069246159))

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

## [2.3.0](https://github.com/strike007-3000/RouteMate/compare/v2.2.0...v2.3.0) (2026-04-19)

## [2.3.0](https://github.com/strike007-3000/RouteMate/compare/v2.2.0...v2.3.0) (2026-04-19)

### Features

* precision logic refactor v2.3.0 - pinpoint routing and category-rank sorting ([5b77fbd](https://github.com/strike007-3000/RouteMate/commit/5b77fbd18a9f0b237bd336aaee8bfe6d64d123e9))

## [2.3.0] - 2026-04-19

### 🎯 Precision Architecture
- **True Origin Routing**: Transit links now use the exact arrival airport or full street address of the previous item as the origin.
- **Category-Tiered sorting**: Implemented a 6-tier rank system to resolve chronological conflicts (Arrivals > Check-in > Activity > Departures).
- **Airport Code Badges**: Prominently display IATA codes (BRU, JFK) on flight cards for visual verification.

## [2.2.0] - 2026-04-19

### 📅 Itinerary Intelligence
- **Global Sorting Engine**: Implemented a multi-level sort (Date > Time > Category Priority) to ensure logical flow.
- **AI Lodging Split**: Multi-day stays are now automatically split into 'Check-in' and 'Check-out' events for better timeline bracketing.
- **Smart Entry Shortcuts**: Added quick-template buttons (✈️, 🏨, 🚆, 🍽️) for rapid manual entry.

### 🎭 Animation & UX
- **Layout Transitions**: Added framer-motion layout support so cards slide smoothly when the itinerary changes.

## [2.1.0] - 2026-04-19

### ✨ Interactive UX
- **Interactive New Trip Form**: Replaced instant placeholder creation with a premium Modal for destination and date capture.
- **Widget Bar Compression**: Redesigned the Dashboard Bento Grid into a compact, single-row widget bar to maximize vertical space.

### 🧠 Logistics Refinement
- **Smart Destination Arrival**: Fixed a critical routing bug where segments following a flight would incorrectly use the departure airport as the origin.
- **Robust Address Cleaning**: Enhanced address parsing to remove terminal descriptors and airline noise.

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

### 🛠️ Data Layer
- **Dexie v3 Schema**: Migrated `itineraryItems` to support `category` and `coordinates` metadata.
- **Failsafe Grouping**: Switched to string-based date comparison.

### 🔗 Navigation
- **Swapped Tabs**: Reordered bottom navigation for better ergonomics.
- **Contextual Back-Navigation**: Added intelligent back buttons.

---

## [1.2.0] - 2026-04-18
- Initial stable release with Multi-Trip management.
- Radar tab feature set (Geolocation-based transit hubs).
- Basic Unsplash image mapping.
