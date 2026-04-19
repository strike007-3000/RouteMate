# Changelog

All notable changes to this project will be documented in this file.

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

## [2.1.0](https://github.com/strike007-3000/RouteMate/compare/v2.0.0...v2.1.0) (2026-04-19)


### Features

* itinerary ux refinement v2.1.0 - interactive trip creation, compact widgets, and smart transit logic ([66c0344](https://github.com/strike007-3000/RouteMate/commit/66c034470aae4a891185a697eae241b205cb50cb))

## [2.1.0] - 2026-04-19

### ✨ Interactive UX
- **Interactive New Trip Form**: Replaced instant placeholder creation with a premium Modal for destination and date capture.
- **Widget Bar Compression**: Redesigned the Dashboard Bento Grid into a compact, single-row widget bar to maximize vertical space.

### 🧠 Logistics Refinement
- **Smart Destination Arrival**: Fixed a critical routing bug where segments following a flight would incorrectly use the departure airport as the origin. The system now parses flight destinations (e.g., "Oslo to Brussels") to provide accurate "Airport to Hotel" directions.
- **Robust Address Cleaning**: Enhanced address parsing to remove terminal descriptors and airline noise from Google Maps Deep-links.

### 🛠️ Technical Debt
- **Schema Alignment**: Synchronized `package-lock.json` metadata with the core intelligence schema.

---

## [2.0.0] - 2026-04-19

### 🚀 Major Architectural Shift
- **Grouped Timeline**: Replaced the static Radar tab with a comprehensive, date-grouped accordion Timeline.
- **Accordion Physics**: Added smooth framer-motion slide animations and sticky date headers for longer trips.
- **Smart Expansion**: Implemented logic to auto-expand "Today's" itinerary on initial view.

### 🧠 Intelligence Engines
- **50km Transit Rule**: Implemented Haversine distance calculations to dynamically switch between Google Maps Transit (<50km) and Driving Mode (>=50km).
- **AI Extraction 2.0**: Upgraded Smart Add to extract high-precision lat/lng coordinates and multi-category metadata.
- **Address Hardening**: Automated address cleaning logic to prevent malformed Google Maps deep-links.

### 💎 Design & Branding
- **Minimalist Premium identity**: Standardized "ROUTEMATE" branding globally.
- **Category Glow System**: Color-coded cards (Blue/Green/Amber/Purple) for instant visual recognition.
- **UI Grid Alignment**: Standardized on a 16px grid system for all major components and headers.

### 🛠️ Data Layer
- **Dexie v3 Schema**: Migrated `itineraryItems` to support `category` and `coordinates` metadata.
- **Failsafe Grouping**: Switched to string-based date comparison to solve timezone-related data visibility bugs.

### 🔗 Navigation
- **Swapped Tabs**: Reordered bottom navigation for better ergonomics (Timeline now in center).
- **Contextual Back-Navigation**: Added intelligent back buttons to internal headers.

---

## [1.2.0] - 2026-04-18
- Initial stable release with Multi-Trip management.
- Radar tab feature set (Geolocation-based transit hubs).
- Basic Unsplash image mapping.
