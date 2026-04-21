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
- **Summary Mode**: High-level itinerary focus. Uses full-bleed imagery Day Cards with `rounded-[32px]` containers and suppresses the vertical journey thread.
- **Logistics Mode**: Technical travel focus. Enables the **1px Continuous Thread** and surfaces transitHubs/logistical markers in full detail.

---

## 5. Smart Add Intelligence (OpenRouter AI)

The extraction prompt in `/api/parse-itinerary` handles logistical hardening via the **OpenRouter Stack**:
- **Primary Model**: `meta-llama/llama-3.3-70b-instruct:free`.
- **JSON Object Mode**: Forces `response_format: { type: 'json_object' }` to eliminate markdown artifacts.
- **Fuzzy Data Recovery**: Uses a layered regex approach to recover valid JSON structures from text-padded LLM responses.
- **Headers**: Requires `HTTP-Referer` and `X-Title` for OpenRouter compliance.
- **User Keys**: Injected via `x-user-openrouter-key` from the global `routemate-settings` store.
