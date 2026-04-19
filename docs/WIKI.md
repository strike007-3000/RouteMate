# RouteMate Engineering Wiki 🛠️

Welcome to the internal engineering wiki for RouteMate. This document serves as a deep dive into the architectural decisions and internal mechanics of the system as of v1.2.0.

---

## 1. Real-Time Reactivity (Dexie + LiveQuery)

RouteMate follows a **DB-First Architecture**. Instead of relying solely on a global state manager (Zustand) for transient data, we subscribe directly to the Promised-based IndexedDB via `useLiveQuery` from `dexie-react-hooks`.

### Why?
- **Persistence by Default**: Every change is instantly saved to the user's device.
- **Cross-Tab Synchronization**: Changes in one part of the app (e.g., Smart Add modal) reflect instantly across all other components (Header, Dashboard, Timeline) without manual state syncing.
- **Offline Reliability**: The app remains functional and reactive even with zero network connectivity.

```typescript
const points = useLiveQuery(() => 
  db.itineraryItems.where('tripId').equals(id).toArray()
) || [];
```

---

## 2. Magic Extraction (NVIDIA NIM)

The "Smart Add" feature utilizes the NVIDIA NIM API to parse unstructured travel text into a valid JSON itinerary schema.

### Prompt Logic
We use a high-instruction system prompt to ensure the AI returns ONLY the raw JSON array.
- **Fallback Mechanism**: If no API key is provided, the system enters **Mock Mode**, providing realistic extraction samples for JFK and CitizenM bookings to ensure the app remains usable for demo purposes.
- **Metadata Patching**: The extraction logic only overwrites the Trip Name and Destination if the current trip is still using "Project Defaults", ensuring user customizations are never accidentally destroyed.

---

## 3. Radar System & Logistics

The Radar tab is designed to solve the "last mile" travel gap.

### Geolocation Strategy
1. **Satellite Sync**: Attempts to fetch the browser's high-accuracy coordinates.
2. **Permission Denied Fallback**: If a user denies location access, the system checks for an `activeTrip`.
   - If an active trip exists, it shows transit hubs for that specific destination.
   - If no trip is active, it defaults to a curated list of **Global Strategic Hubs** (London St Pancras, Grand Central NYC, Tokyo Station).

---

## 4. Design System

RouteMate uses a custom **Glassmorphic Design System** built on Tailwind CSS:
- **Rich Aesthetics**: High use of `backdrop-blur-xl`, `border-white/5`, and `bg-zinc-900/50`.
- **Dynamic Grid**: The dashboard uses a responsive grid with fixed aspect ratios (`aspect-square` for small cards, `aspect-[2/1]` for featured status cards) to maintain a premium, data-driven look.

---

### Contributing to this Wiki
Contributions to this wiki are welcome! Please follow the `docs:` commit convention when updating this file.
