# Changelog

All notable changes to this project will be documented in this file.

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
