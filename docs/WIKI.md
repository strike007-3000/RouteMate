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
6. **Rank 6: Return Flight** (Final home-bound anchor)

### 1.2 Smart Return-Flight Detection
The engine dynamically identifies the "Home Base" by analyzing the very first flight departure of the trip. 
- **Comparison Logic**: If a flight's `arrivalCity` matches the detected `homeBase`, it is marked as a **Return Flight**.
- **Priority Override**: Return flights are assigned a high tie-breaker rank (e.g., 1000) to ensure they always anchor the end of the trip.
- **Day 1 Exception**: Conversely, flight departures on Day 1 are assigned a negative rank (-100) to force them to the absolute top.

---

## 2. Design System & Geometry

RouteMate follows a strict "Minimalist Premium" design system to ensure zero visual cognitive load.

- **The 24px Rule**: All interactive containers, cards, and buttons must use a standardized `rounded-[24px]` radius.
- **Fixed X-Axis Navigation**: The global header uses a fixed `h-20` height with absolute horizontal alignment (`pl-16` for titles) to prevent horizontal layout shift ("jumping") during back-navigation.
- **Unified Action Blue**: The system uses `#3b82f6` (Blue-500) as the singular identity for primary actions, logic badges, and active-nav indicators.

---

## 3. Transit & Hub Logic

The logistics engine calculates distance thresholds using the **Haversine Formula**.
- **Contextual Labeling**: Segments heading to airports feature "NAVIGATE TO AIRPORT" labeling.
- **Hub Detection**: The engine uses `departureAirport` or `arrivalAirport` metadata to ensure routing points to specific terminals.

---

## 4. Smart Add Intelligence (AI Parsing)

The extraction prompt in `/api/parse-itinerary` handles logistical hardening:
- **Origin-Aware Extraction**: Specifically suppresses redundant check-out events for the starting city.
- **Success Feedback**: Integration with the custom Toast notification engine for immediate user validation.
- **Error Preservation**: Maintains user input and displays inline alerts if extraction fails, allowing for immediate retries.
