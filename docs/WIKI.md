# RouteMate Engineering Wiki 🛠️

Deep-dive documentation for RouteMate Architecture.

---

## 0. Tech Stack & API Surface

RouteMate is built on a hybrid architecture that balances local-first performance with live cloud intelligence.

### 0.1 Core Stack
- **Framework**: Next.js 14+ (App Router, Server Actions)
- **Authentication**: Clerk (Session Management & Social/Magic Links)
- **State Management**: Zustand (Global Store) + Dexie.js (Offline Persistence)
- **Styling**: Tailwind CSS + Framer Motion (Micro-animations)
- **Database**: IndexedDB (Local-First via Dexie)

### 0.2 API Service Layer
| Service | Purpose | Environment Variable |
| :--- | :--- | :--- |
| **Clerk** | Authentication Gateway | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` |
| **OpenRouter** | Primary AI Extraction | `OPENROUTER_API_KEY` |
| **Groq** | Failover AI / Llama 3.3 | `GROQ_API_KEY` |
| **Unsplash** | Luxury Imagery | `UNSPLASH_ACCESS_KEY` |
| **ORS (OpenRouteService)** | Geocoding & Local Routes | `NEXT_PUBLIC_ORS_API_KEY` |
| **WeatherStack** | Real-time Weather | `WEATHERSTACK_API_KEY` |
| **AviationStack** | Live Flight Tracking | `AVIATIONSTACK_API_KEY` |

### 0.3 Authentication Design & Identity (Embedded Flow)
To enforce the application's premium dark mode aesthetics, RouteMate uses embedded, custom-styled Clerk components rather than the hosted Clerk Account Portal. This keeps users completely on the primary domain (`routemate.top`) and maintains the bespoke look and feel.

- **Embedded Routes**:
  - **Login Route**: `/login` (renders `<SignIn />` component)
  - **Signup Route**: `/signup` (renders `<SignUp />` component)
- **Visual Overrides**: Both pages share custom layout styling wrapped in a dark container with background ambient radial glows (`bg-primary/20` and `blue-500/10`) and micro-animations (Framer Motion).
- **Component Styling**: Styled using Clerk's appearance configuration (aligned with the Stitch Design System):
  - **Card Container**: Glassmorphic styling (`!bg-zinc-950/60`, `backdrop-blur-xl`, `border-white/5`, `rounded-[24px]` radius, `!shadow-none`).
  - **Primary Buttons**: Custom `.btn-primary` overrides, presenting a sleek, borders-only button styling.
  - **Social Providers**: Configured for Google Sign-In with customized dark buttons.
- **Routing Configuration**: The login and signup redirects are configured both code-side (in `.env`) and in the Clerk Dashboard under **Component paths** to point to:
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup`
  - `Unauthorized sign-in redirect`: `https://routemate.top/login`

### 0.4 Dependency & Security Overrides
To resolve vulnerabilities in transitive dependencies (e.g. security warnings inside `uuid` imported by Clerk UI's Solana wallet adapters) and clean up deprecation warnings in builds, RouteMate enforces package-level overrides in `package.json`:
- **`uuid`**: Overridden to `^11.1.1` to patch moderate-severity bounds checks and deprecations.
- **`postcss`**: Overridden to `^8.5.10`.

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

### 1.3 Smart Paste & Date Hardening
AI-extracted itinerary entries can occasionally contain missing, malformed, or invalid date fields due to LLM hallucinations or incomplete input texts. The engine employs multiple layers of protection to guarantee stability:
- **Server-Side Sanitization**: The `/api/parse-itinerary` API inspects all generated `startTime` and `endTime` fields. If a date is unparseable or missing, it constructs a safe fallback string using the trip's start year (which is validated to be a 4-digit number, defaulting to the current calendar year if invalid/missing, e.g., `${rootYear}-01-01T12:00:00Z`). All final outputs are verified as valid ISO-8601 strings before delivery.
- **Client-Side Page Resiliency**: Standard components (`TripCard`, `TripHero`, `TimelinePage`) employ safe fallback guards and date-fns wrappers. If any corrupted or missing dates slip into IndexedDB, the UI safely renders these fields as `'TBD'` (To Be Determined) instead of raising unhandled `RangeError: Invalid time value` exceptions and crashing Next.js.
- **Client-Side Import Calculations**: When updating trip boundaries in `SmartPaste`, dates are checked against empty and malformed conditions. If `startDate` or `endDate` is empty, bounds are initialized properly instead of evaluating string comparisons against `undefined`.

---

## 2. Design System & Geometry (Nocturnal Velocity)

RouteMate follows a strict "Minimalist Premium" design system (named **Nocturnal Velocity**) to ensure zero visual cognitive load and a luxury feel.

### 2.1 CSS Theme Variables & Primitives
The application defines a dark-theme foundation in `src/app/globals.css` with the following variables:
- **Core Variables:**
  - `--background`: `#000000` (pitch black background)
  - `--foreground`: `#ffffff` (white high-contrast text)
  - `--primary`: `#3b82f6` (vibrant blue-500 action color)
  - `--border`: `rgba(255, 255, 255, 0.08)`
  - `--secondary`, `--muted`: `#18181b` (zinc-900 surface panels)
  - `--muted-foreground`: `#71717a` (zinc-500 text)
  - `--accent`: `#27272a` (zinc-800)
  - `--destructive`: `#ef4444` (red-500)
- **Glass Surfaces:**
  - `.glass`: `backdrop-blur-2xl border border-white/10 bg-zinc-950/60`
  - `.glass-card`: `backdrop-blur-xl border border-white/5 bg-zinc-900/40`
- **Atmospheric Glow:**
  - `.page-glow`: Injects a fixed, hardware-accelerated radial gradient (`rgba(59,130,246,0.08)`) at the top center of core views to add depth.
- **Scrollbar Control:**
  - `.no-scrollbar`: Hides scrollbars cross-browser while retaining scroll mechanics.

### 2.2 Visual Components
- **The Sole Button Standard (`.btn-primary`):** All primary actions must use the `.btn-primary` utility: `h-14`, `rounded-[24px]`, `border-2 border-primary`, and `tracking-[0.2em]`.
- **BottomNav Active Pill:** A sliding container background pill (`bg-primary/10 border border-primary/20 rounded-[16px]`) shifts behind the active menu tab. Inactive tabs use `text-zinc-600` instead of harsh opacities to ensure legibility.
- **Sonar Empty State:** The empty trips dashboard features 3 concentric rings pulsing at staggered intervals (`bg-primary/5`, `bg-primary/10`, `bg-primary/15`) centered around a bouncing white plane icon.
- **Semantic Settings Icons:** Settings items in the Account Hub render customized colored circular backdrops (10% background opacity, 20% border opacity) tailored to each item:
  - Personal: Blue-400 theme
  - Settings: Zinc-400 theme
  - Currency: Emerald-400 theme
  - Notifications: Amber-400 theme
  - Security: Purple-400 theme
  - Logout: Red-500 theme

### 2.3 Geometry & Layout Structure
- **The 24px Rule:** All interactive containers, cards, and bento cards must use a standardized `rounded-[24px]` radius.
- **Zero-Jump Header Rhythm:** All global navigation routes share a synchronized header layout. The header implements a **Scroll-Driven Animation** using native CSS scroll timelines (with a React-driven `scrollY` custom property fallback for unsupported browsers) that dynamically shrinks padding, transitions background blur opacity, and scales down the page title to maximize screen real estate when scrolling.
- **Intrinsic Sizing:** List items (e.g., in Account Hub) use `min-h-[64px]` and `py-4` instead of fixed heights to accommodate dynamic typography clamping.

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
- **User Keys**: Stored locally in the `routemate-settings` IndexedDB store (Zustand `persist`) or `localStorage` for Dev Settings, and injected per request.
- **Settings Store Schema Migration**: In version 1 of `routemate-settings`, any legacy default state that persisted `preferredAiProvider: 'OpenRouter'` (version 0) is dynamically migrated to an empty string `""` on rehydration. This permits the API gateway to correctly route to server-side preferences unless the user has explicitly selected a custom provider.

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

---

## 9. Explore Screen & Hybrid AI Discovery Engine (v3.9.1)

RouteMate v3.9.1 introduces a hybrid travel discovery and itinerary builder interface.

### 9.1 Database Store Migration (v7)
To support caching AI-discovered destinations locally, the database schema (Dexie.js) is migrated to version `7`. It defines the `destinations` table:
- **Index Definition**: `destinations: 'id, name, country, category'`
- **Attributes**: `id` (slug), `name`, `country`, `image` (dynamic Unsplash URL), `description`, `tags`, `category` (`Cities` | `Beaches` | `Nature` | `Culture`), and `highlights` (a nested array of `HighlightItem` points of interest).

### 9.2 API Discovery Endpoint
The POST endpoint `/api/explore-city` handles dynamic AI curations of un-seeded locations:
- **Load Balancing**: The execution queue prioritize **OpenRouter** models (`openrouter/free`, `meta-llama/llama-3.3-70b-instruct:free`, `google/gemma-3-27b-it:free`) to balance the developer keys, while the **Smart Paste** (`/api/parse-itinerary`) endpoint defaults to **Groq** models.
- **Structured System Prompt**: Commands the model to strictly generate a valid JSON matching the client's `Destination` interface.
- **Resilient Fallback**: Gracefully parses and defaults fields like `tags` and `category` to prevent UI parsing crashes. It also includes support for `MOCK_MODE` to allow full testing without live network calls.

### 9.3 Custom Itinerary Generation (Date & Vibe Wizard)
A wizard component parses user-selected dates and vibe tags (e.g. `Chill`, `Adventure`, `Foodie`, `Culture & History`) to automatically generate a trip outline.
- **Prompt Translation**: Builds a text prompt embedding selected dates and destination highlights. It maps this text request to `/api/parse-itinerary`.
- **Database Entry**: Inserts the new trip and generated itinerary activities into IndexedDB, then navigates the user to their new itinerary.


