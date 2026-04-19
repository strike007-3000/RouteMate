# Changelog

All notable changes to this project will be documented in this file.

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
