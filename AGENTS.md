<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:routemate-agent-rules -->
# RouteMate Architectural & Workflow Rules

## 1. UI & Styling Rules
* **Theme & Color:** Ensure dark/black background themes (`bg-black`, `bg-zinc-950/60` with `backdrop-blur-xl`) with custom ambient radial glow overlays are preserved.
* **Standard Geometry:** Enforce `rounded-[24px]` radius for standard containers/cards and `rounded-[32px]` for trip summary cards. Never use generic or sharp browser-default corners.
* **Primary Actions:** All primary action buttons MUST use the `.btn-primary` utility class (`h-14`, `rounded-[24px]`, `border-2 border-primary`, and `tracking-[0.2em]`).
* **View Modes:** Respect global `viewMode` state. **Summary Mode** hides the vertical journey thread and the `TransitCard` widget (only map pins visible); **Logistics Mode** displays the 1px continuous thread, transit hubs, and full `TransitCard` widgets.

## 2. Hardening & Stability Rules
* **Deterministic IDs:** Always generate unique database keys using standard native browser `crypto.randomUUID()`. Do not use `Math.random()`.
* **Security:** Keep sensitive API keys in request headers, never append them directly as plain-text query strings in server/fetch calls.
* **Fallback Date Safeguards:** Always wrap date formatting in validation blocks. If a date is malformed or missing, fallback to rendering `'TBD'` rather than allowing the application UI to throw a fatal exception.

## 3. Workflow & Documentation Rules
* **Pull Requests (PRs):** Always create a new feature branch and open a Pull Request (PR) for your changes. Avoid pushing directly to the `main` branch unless explicitly authorized.
* **Issue Tracking:** If you encounter bugs, regressions, or type errors during development or testing, log them clearly and verify their resolution before completing tasks.
* **Documentation Maintenance:** Keep `README.md`, `docs/WIKI.md`, and metadata files completely in sync with any structural or API changes made during coding.
* **Versioning & Releases:** Ensure proper versioning and changelog entries are maintained correctly according to semantic release guidelines.

## 4. Core Intelligence & Logistics Rules
* **Two-Pass Sorting System:** When sorting timeline/itinerary events, use the two-pass architecture. Run a single $O(N)$ pre-calculation pass to resolve temporal metadata, followed by sorting on those keys.
* **Sorting Sequence Hierarchy:** 
  1. Rank 1: Check-out
  2. Rank 2: Departure
  3. Rank 3: Arrival
  4. Rank 4: Check-in
  5. Rank 5: Activities & Leisure
  6. Rank 2000: Return Flight Anchor (forced to bottom of trip)
* **Date Adjustments & Day 1 overrides:**
  * Flight departures on Day 1 receive rank `-100` to sit at the absolute top of the itinerary. Origin check-out events from the home city on Day 1 are suppressed.
  * If lodging check-in is missing a time (hallucinated as `00:00`), override it to the evening rank (18:00) to prevent morning overlaps.
* **Transit Suggestions (50km Rule):** If the Haversine distance between two consecutive stops is greater than 50km, default suggestions to **Driving Directions**; otherwise, default to **Transit**. Always calculate directions contextually from the previous stop (`prevPoint`).
* **Weather & Flight Triggers:**
  * **Next-Day Weather Rule:** Only fetch weather forecasts for the current day and the next day of the trip. Suppress future dates to minimize API load.
  * **24h Flight Rule:** Fetch live status details (gates, delays) only when the flight departure is within 24 hours.
* **AI Core Provider Load Balancing:** Direct all Smart Paste extractions to the **Groq** provider, and all dynamic Explore/City Discovery queries to **OpenRouter** to manage API quotas.
<!-- END:routemate-agent-rules -->
