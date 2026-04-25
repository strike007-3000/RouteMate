# RouteMate Engineering Wiki 🛠️

Deep-dive documentation for RouteMate Architecture.

---

## 1. Timeline Data Intelligence

The itinerary engine uses a highly contextual logistical hierarchy to manage travel flows. Itinerary items carry classification, temporal, and directional metadata.

- **Category Mapping**: AI extracts entries into `Flight`, `Lodging`, `Food`, `Train`, `Activity`, or `Rental`.
- **Coordinate Fidelity**: Every item stores a `coordinates` object for point-to-point transit calculations.

### 1.1 Human-First Sorting System
To resolve chronological conflicts when times are identical or missing, the system uses a **6-rank logistical ranking sequence**:
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

---

## 2. Design System & Geometry

RouteMate follows a strict "Minimalist Premium" design system to ensure zero visual cognitive load.

- **The Sole Button Standard**: All primary actions must use the `.btn-primary` utility: `h-14`, `rounded-[24px]`, `border-2 border-primary`, and `tracking-[0.2em]`.
- **Zero-Jump Header Rhythm**: All 4 global navigation tabs share a synchronized `pt-[var(--header-pt)]` padding and a 4px gap between the brand and page title.
- **The 24px Rule**: All interactive containers, cards, and bento cards must use a standardized `rounded-[24px]` radius.
- **Intrinsic Sizing**: List items (e.g., in Account Hub) use `min-h-[64px]` and `py-4` instead of fixed heights to accommodate dynamic typography clamping.

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
