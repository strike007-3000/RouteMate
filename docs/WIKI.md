# RouteMate Engineering Wiki 🛠️

Deep-dive documentation for RouteMate v2.3 Architecture.

---

## 1. Timeline Data Intelligence (v3 Schema)

Version 2.0 migrated the database to a grouped logic. Itinerary items now carry classification metadata.

- **Category Mapping**: AI extracts entries into `Flight`, `Lodging`, `Food`, `Train`, `Activity`, or `Rental`.
- **Coordinate Fidelity**: Every item stores a `coordinates` object (`{lat, lng}`) allowing the logistics engine to function without additional API lookups during the "Timeline Flow" view.

### Grouping Logic (v2.3)
To avoid timezone regressions, we use String-Based Date Comparison. v2.3 introduced a **Category-Rank Sorting System** that resolves chronological conflicts when times are identical (or missing):
- **Arrivals** (Rank 1-2): Always float to the top.
- **Check-in/Food/Activities** (Rank 3-4): Sandwiched in the middle.
- **Check-out/Departures** (Rank 5-6): Sunk to the bottom.

---

## 2. The 50km Transit Rule

The logistics engine now features a switch logic based on distance thresholds calculated via the **Haversine Formula**.

```typescript
// Formula implementation in TransitCard.tsx
const R = 6371; // Earth's Radius (KM)
const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(from.coordinates.lat * Math.PI / 180) * Math.cos(to.coordinates.lat * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = R * c;
```

### 2.1 True Origin Routing (v2.3)
Transit links are now context-aware. The engine identifies the `arrivalAirport` (if preceding item is a flight) or `fullAddress` of the previous item and injects it as the `origin` for the next Google Maps leg. This replaces city-level routing with pinpoint point-to-point accuracy.

---

## 3. UI/UX: Minimalist Premium Design

We follow a **"Quiet Luxury"** design philosophy:
- **Identity**: Centered/Left-aligned `ROUTEMATE` tag in `text-[10px] tracking-[0.5em]`.
- **Airport Code Badges (v2.3)**: Flight cards prominently display IATA codes (e.g., BRU) to provide visual confirmation of accurate landing data.
- **Compact Widget Bar (v2.1)**: Dashboard widgets use a single-row flex layout.
- **Layout Transitions (v2.2)**: Integrated `framer-motion` layout animations.

---

## 4. AI Prompt Engineering (Smart Add)

The extraction prompt in `/api/parse-itinerary` is hardened for accuracy. 
- **Precision Data (v2.3)**: Instructs the AI to capture `arrivalAirport`, `departureAirport`, and `fullAddress` metadata.
- **Sorting Metadata**: AI prefixes flight titles with "Arrival:" or "Departure:" to facilitate the Category-Rank engine.
- **Lodging Split (v2.2)**: Specifically instructs the AI to generate TWO distinct entries (Check-in/Check-out).
