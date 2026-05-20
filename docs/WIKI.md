# RouteMate Engineering Wiki 🛠️

Deep-dive documentation for RouteMate Architecture.

---

## 0. Tech Stack & API Surface

RouteMate is built on a hybrid architecture that balances local-first performance with live cloud intelligence.

### 0.1 Core Stack
- **Framework**: Next.js 14+ (App Router, Server Actions)
- **State Management**: Zustand (Global Store) + Dexie.js (Offline Persistence)
- **Styling**: Tailwind CSS + Framer Motion (Micro-animations)
- **Database**: IndexedDB (Local-First via Dexie)

### 0.2 API Service Layer
| Service | Purpose | Environment Variable |
| :--- | :--- | :--- |
| **OpenRouter** | Primary AI Extraction | `OPENROUTER_API_KEY` |
| **Groq** | Failover AI / Llama 3.3 | `GROQ_API_KEY` |
| **Unsplash** | Luxury Imagery | `UNSPLASH_ACCESS_KEY` |
| **ORS (OpenRouteService)** | Geocoding & Local Routes | `NEXT_PUBLIC_ORS_API_KEY` |
| **WeatherStack** | Real-time Weather | `WEATHERSTACK_API_KEY` |
| **AviationStack** | Live Flight Tracking | `AVIATIONSTACK_API_KEY` |

---

## 1. Timeline Data Intelligence

The itinerary engine uses a highly contextual logistical hierarchy to manage travel flows. Itinerary items carry classification, temporal, and directional metadata.

- **Category Mapping**: AI extracts entries into `Flight`, `Lodging`, `Food`, `Train`, `Activity`, or `Rental`.
- **Coordinate Fidelity**: Every item stores a `coordinates` object for point-to-point transit calculations.

### 1.1 Human-First Sorting System (Optimized v3.3)
To ensure maximum performance and logical consistency, the engine uses a **two-pass sorting architecture**:
1. **Pass 1 (Pre-calculation)**: Generates a temporary metadata object for every item, resolving dates, normalizing titles, and determining logistical ranks in a single $O(N)$ pass.
2. **Pass 2 (Sort)**: Performs the final sort using the pre-calculated keys, minimizing expensive operations like `new Date()` or `format()` during the $O(N \log N)$ comparison phase.

The logistical ranking sequence remains:
1. **Rank 1: Check-out** (Departure from lodging)
2. **Rank 2: Departure** (Flight takeoff or Train departure)
3. **Rank 3: Arrival** (Landing or station arrival)
4. **Rank 4: Check-in** (Arrival at new lodging)
5. **Rank 5: Activities & Leisure** (Food, attractions, rentals)
6. **Rank 2000: Return Flight Anchor** (Home-bound arrivals forced to the absolute bottom)

### 1.2 Smart Return-Flight Detection
The engine dynamically identifies the "Home Base" by analyzing the very first flight departure of the trip. 
- **Comparison Logic**: If a flight's `arrivalCity` matches the detected `homeBase`, it is marked as a **Return Flight**.
- **Priority Override**: Return flights are assigned a high tie-breaker rank (2000) to ensure they always anchor the end of the trip.
- **Day 1 Exception**: Conversely, flight departures on Day 1 are assigned a negative rank (-100) to force them to the absolute top.
- **Origin Suppression**: Specifically suppresses redundant check-out events from the home city on Day 1.
- **Midnight Lodging Rule**: If a `Lodging` check-in has a time of exactly `00:00` (often from AI date-only extractions), the system overrides the explicit time and uses the **Evening Rank** (18:00) to prevent it from overlapping with morning flights.

---

## 2. Design System & Geometry

RouteMate follows a strict "Minimalist Premium" design system to ensure zero visual cognitive load.

- **The Sole Button Standard**: All primary actions must use the `.btn-primary` utility: `h-14`, `rounded-[24px]`, `border-2 border-primary`, and `tracking-[0.2em]`.
- **Zero-Jump Header Rhythm**: All global navigation routes share a synchronized header layout. The header implements a **Scroll-Driven Animation** using native CSS scroll timelines (with a React-driven `scrollY` custom property fallback for unsupported browsers) that dynamically shrinks padding, transitions background blur opacity, and scales down the page title to maximize screen real estate when scrolling.
- **The 24px Rule**: All interactive containers, cards, and bento cards must use a standardized `rounded-[24px]` radius.
- **Intrinsic Sizing**: List items (e.g., in Account Hub) use `min-h-[64px]` and `py-4` instead of fixed heights to accommodate dynamic typography clamping.

### 2.1 Premium Mobile Gestures (Swipe-to-Delete)
Itinerary stops in the timeline support horizontal swiping for quick management:
- **Gesture Mechanics**: Powered by Framer Motion's `drag="x"`. Dragging left reveals a high-contrast red delete zone (`w-28`) containing a trash icon and a "Confirm?" label.
- **Confirmation Mirroring**: Swiping past a `-40px` offset triggers the same 3-second confirmation grace period as clicking the default delete button. During this state, the card automatically animates and locks to `-112px` left, prompting the user to tap the revealed background zone or the card's red confirmation button to delete. Swiping right resets the confirmation loop.

---

## 2.2 View Transitions (Morphing Page Navigation)
Navigation between dashboard pages and sub-pages uses the browser's native **View Transitions API**:
- **Morphing Assets**: The trip cover image (`trip-image-[id]`) and trip destination title (`trip-title-[id]`) carry shared transition tokens across the `TripCard` and `TripHero` layout elements.
- **Trigger Loop**: All page navigation hooks in `<BottomNav />` and card click handlers are wrapped in `document.startViewTransition(...)` to morph assets seamlessly instead of doing a hard jump.

---

## 3. Transit & Hub Logic

The logistics engine calculates distance thresholds using the **Haversine Formula**.
- **The 50km Rule**: If the distance between two stops is > 50km, the system suggests **Driving Directions**; otherwise, it defaults to **Transit**.
- **Contextual Routing**: Navigation logic is **context-aware**. It retrieves the `prevPoint` from the previous stop (even across day boundaries) to calculate the route, ensuring a continuous journey thread.
- **Hub Detection**: The engine uses `departureAirport` or `arrivalAirport` metadata to ensure routing points to specific terminals rather than generic city pins.

---

## 4. UI State & View Modes

RouteMate utilizes a global `viewMode` state (`summary` | `logistics`) to manage cognitive load:
- **Summary Mode**: High-level itinerary focus. Uses full-bleed imagery Day Cards with `rounded-[32px]` containers and suppresses the vertical journey thread. The `TransitCard` widget is intelligently hidden to prioritize scannability; only native circular map pins are shown.
- **Logistics Mode**: Technical travel focus. Enables the **1px Continuous Thread** and surfaces transitHubs, logistical markers, and full `TransitCard` routing widgets (with Google Maps handoff, times, and distances).

---

## 5. Smart Add Intelligence (Multi-Provider AI)

The extraction prompt in `/api/parse-itinerary` handles logistical hardening via a **Dual-Provider Stack**:
- **Dynamic Configurable Routing**: The execution queue dynamically re-sorts itself. It checks the local client's "Preferred AI" toggle (`x-preferred-ai`), falls back to the server's `PRIMARY_AI_PROVIDER` environment variable, and defaults to OpenRouter.
- **Provider Architecture**:
    - **OpenRouter** (`openrouter/free`, `llama-3.3-70b-instruct:free`).
    - **Groq** (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`).
- **Tiered Resilience Layer**:
    1. **Primary Pass**: Attempts extraction via the preferred provider's fastest model.
    2. **Failover Loop**: If a provider returns a 429 or invalid JSON, the engine automatically traverses the dynamically sorted queue to the next available provider/model.
    3. **Backoff Logic**: Implements a short 800ms backoff between provider shifts to respect rate-limit headers.
- **Headers & Config**: 
    - `x-user-openrouter-key`: For OpenRouter access.
    - `x-user-groq-key`: For Groq access.
    - `x-preferred-ai`: Injected per request based on user's Dev Settings or Settings Modal.
- **User Keys**: Stored locally in the `routemate-settings` IndexedDB store or `localStorage` for Dev Settings, and injected per request.

---

## 6. Weather Intelligence (WeatherStack)

The system provides localized forecasts for packing and situational awareness.
- **Optimization (Next-Day Rule)**: Weather is only fetched for the **current day** and **next day** of the trip. Forecasts further in the future are suppressed to optimize API consumption and ensure accuracy.
- **Contextual Anchoring**: The `WeatherWidget` identifies the forecast city using the `address` of the first itinerary item of the day.

---

## 7. Live Flight Logistics (AviationStack)

Real-time flight tracking uses a proximity-triggered execution layer.
- **Proximity Trigger (24h Rule)**: Live status (gates, terminals, delays) is only fetched when a flight is within **24 hours** of its scheduled departure. 
- **Route-Based Search**: If a `flightNumber` is missing, the system uses the AI-extracted `dep_iata` and `arr_iata` codes to find matching flights for that day. 
- **Metadata Synchronization**: Selecting a flight from the suggestion list dynamically updates the `itineraryItem` metadata via the `updatePointMetadata` store action.

---

## 8. Security & Performance (v3.3 Hardening)

The v3.3 release introduced critical hardening to the service layer to ensure production readiness.

### 8.1 Parallel Processing (Promise.all)
To minimize latency during transit calculations, the `OpenRouteServiceProvider` utilizes `Promise.all()` to fetch geocoding data for both origin and destination points simultaneously. This reduces the time-to-first-byte (TTFB) for routing suggestions by approximately 50%.

### 8.2 Header-Based Authentication
Sensitive API keys (specifically for OpenRouteService) have been moved from query parameters to the `Authorization` header. This follows security best practices by preventing API keys from being logged in plain text in server logs or network proxies.

### 8.3 Client-Safe Configuration
Environment variables follow the `NEXT_PUBLIC_` prefix convention where client-side visibility is required (e.g., for direct browser-to-API transit calculations). The `TransitService` implements a fallback mechanism to support both local development and production environments.

### 8.4 Deterministic ID Generation
All transient itinerary items and transit suggestions use `crypto.randomUUID()` for ID generation. This ensures enterprise-grade collision resistance compared to `Math.random()`, which is critical for local IndexedDB stability.

