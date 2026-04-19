# Changelog

All notable changes to this project will be documented in this file.

## [2.3.2](https://github.com/strike007-3000/RouteMate/compare/v2.3.1...v2.3.2) (2026-04-19)


### Bug Fixes

* v2.6.4 aesthetics & logic - repair manual reordering, glassmorphism, and trip card image fidelity ([66a2a2a](https://github.com/strike007-3000/RouteMate/commit/66a2a2a99ca3b72c4b40bf7c46d021c069246159))

## [2.3.1](https://github.com/strike007-3000/RouteMate/compare/v2.3.0...v2.3.1) (2026-04-19)


### Bug Fixes

* resolve missing parseISO import for production build ([aa92537](https://github.com/strike007-3000/RouteMate/commit/aa9253722b7a38d04a5f7378dd034b18edc1fa6a))
* total production hardening - resolve build blockers, lint errors, and ci deprecations ([c48bd57](https://github.com/strike007-3000/RouteMate/commit/c48bd57089f3b0e918b888de4caaf6ee359bf962))
* v2.6.1 repairs AI failover and visual hero gradients ([d59e2db](https://github.com/strike007-3000/RouteMate/commit/d59e2dba159e97f6b085831ff372ce05e33311f2))

## [2.6.3] - 2026-04-19

### 🛡️ Build & Stability
- **Fixed Missing Import**: Resolved `parseISO` build error in `BentoGrid.tsx` that was blocking production deployment.

## [2.6.2] - 2026-04-19

### 🧬 Sequencing & extraction Hardening
- **Mistral v4 Transition**: Successfully migrated to the **Mistral Small 4 (119B)** engine (`2603` snapshot) to resolve 410 'Gone' errors and improve extraction speed.
- **Chronological Enforcement**: Refined system prompts to strictly lock **Hotel Check-ins at 15:00** and arrivals at 08:00, preventing itinerary overlaps.
- **Flat Array Enforcement**: Implemented strict JSON schema rules to prevent nested objects in AI responses.

### 🛡️ Diagnostic Tooling (Pre-Flight)
- **Integrity Utility**: Introduced `npm run test:integrity`, a robust diagnostic suite to verify API connectivity (Unsplash, ORS, NVIDIA) and logic sequencing before deployment.
- **Spatial Accuracy**: Verified **OpenRouteService (ORS)** geocoding and coordinate resolution.


## [2.6.1] - 2026-04-19

### 🛡️ AI Reliability & Failover
- **Mistral Large Fallback**: Implemented an automatic failover to **Mistral Large 3** if the primary Small model fails or returns malformed JSON.
- **Model ID Correction**: Standardized on full `mistralai/` identifiers for optimized NIM routing.

### 💎 Visual Hardening & Telemetry
- **Hero Gradient System**: Added premium sapphire-to-charcoal gradients behind all trip cards and timeline headers. No more "Black Cards" when Unsplash is unavailable.
- **Global Dashboard Telemetry**: Repaired the "Countdown" widget to scan for upcoming points across ALL trips when no specific trip is active.
- **Service Resilience**: Added a scenic fallback asset to the `UnsplashService`.

## [2.6.0] - 2026-04-19

### 🔀 Hybrid Intelligence (Manual Reordering)
- **Fluid Reorder API**: Integrated `framer-motion` Reorder API for "elastic" drag-and-drop timeline management.
- **Transactional Persistence**: Manual order changes are now persisted to Dexie v4 as a `sortOrder` override.
- **Visual Affordance**: Added dedicated **Grip Handles** to all itinerary cards for intuitive interaction.

### 🧠 Performance & Logic Hardening
- **Mistral Small Pivot**: Switched AI engine to `mistralai/mistral-small-3.1-24b-instruct-2503` for near-instant responses.
- **Smart Time Buffers**: Explicitly hardcoded logical offsets for time-less entries (Arrival 08:00 / Departure 20:00).
- **Dexie v4 Schema**: Upgraded database to support the manual sorting layer.

## [2.5.0] - 2026-04-19

### 📍 Intelligent Routing Refinement
- **Airport Precision**: Improved flight metadata extraction to capture specific terminals and gate locations.
- **Transit UX**: Enhanced `TransitCard` to handle ambiguous addresses with smarter Google Maps API parameters.

## [2.4.0] - 2026-04-19

### 🖼️ Unsplash Visual Suite
- **Hero Trip Cards**: Trip tiles now feature full-bleed destination imagery with layered gradient overlays.
- **Atmospheric Itinerary**: Added a blurred hero-background system with glassmorphism overlays for trip titles.
- **Dexie Image Cache**: Implemented an `UnsplashService` that caches destination imagery locally to minimize API hits.

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
