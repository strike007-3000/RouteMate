# RouteMate Engineering Wiki 🛠️

Deep-dive documentation for RouteMate v2.1 Architecture.

---

## 1. Timeline Data Intelligence (v3 Schema)

Version 2.0 migrates the database to a grouped logic. Itinerary items now carry classification metadata.

- **Category Mapping**: AI extracts entries into `Flight`, `Lodging`, `Food`, `Train`, `Activity`, or `Rental`.
- **Coordinate Fidelity**: Every item stores a `coordinates` object (`{lat, lng}`) allowing the logistics engine to function without additional API lookups during the "Timeline Flow" view.

### Grouping Logic
To avoid timezone regressions (where items "disappear" across the UTC boundary), we use **String-Based Date Comparison**:
`format(parseISO(startTime), 'yyyy-MM-dd') === format(currentDay, 'yyyy-MM-dd')`.

---

## 2. The 50km Transit Rule

The logistics engine now features a switch logic based on distance thresholds calculated via the **Haversine Formula**.

```typescript
// Formula implementation in TransitCard.tsx
const R = 6371; // Earth's Radius (KM)
const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = R * c;
```

### Thresholds:
- **Intra-city (< 50km)**: Uses `travelmode=transit`. Best for subway/bus handoffs.
- **Inter-city (>= 50km)**: Uses `travelmode=driving`. Best for cross-city train/car connections.

### 2.1 Smart Origin Detection (Flight Segments)
To handle multi-leg journeys correctly, the engine identifies `Flight` segments and parses arrival destinations (e.g., "Oslo to Brussels") to use as the starting point for subsequent transit directions, bypassing the departure airport address.

---

## 3. UI/UX: Minimalist Premium Design

We follow a **"Quiet Luxury"** design philosophy:
- **Identity**: Centered/Left-aligned `ROUTEMATE` tag in `text-[10px] tracking-[0.5em]`.
- **Color Glows**: Category specific cards use `shadow-category/20` and `border-category/30` to provide visual grouping without excessive color noise.
- **16px Grid System**: Every component is strictly aligned to a 4-unit grid system (`p-4`, `gap-4`).
- **Compact Widget Bar (v2.1)**: Dashboard widgets use a single-row flex layout with `overflow-x-auto` to minimize vertical footprint while maintaining accessibility.

---

## 4. AI Prompt Engineering (Smart Add)

The extraction prompt in `/api/parse-itinerary` is hardened for JSON fidelity. 
- **Instruction**: Return ONLY a JSON array.
- **Classification Rules**: Explicit mapping for hotel -> Lodging, restaurant -> Food, etc.
- **Mock Fallback**: If no NVIDIA key is provided, the mock system provides `Extracted Event` samples to ensure the UI can be validated offline.
