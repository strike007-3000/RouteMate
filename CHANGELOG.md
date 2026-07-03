# Changelog

All notable changes to this project will be documented in this file.

## [3.18.0](https://github.com/strike007-3000/RouteMate/compare/v3.17.0...v3.18.0) (2026-07-03)


### Features

* align itinerary generation with AI Builder inputs & fix images ([#67](https://github.com/strike007-3000/RouteMate/issues/67)) ([e0f523f](https://github.com/strike007-3000/RouteMate/commit/e0f523f0c546424f9c74c6775651fd10ef7db82f))

## [3.17.0](https://github.com/strike007-3000/RouteMate/compare/v3.16.0...v3.17.0) (2026-06-02)


### Features

* **explore:** enhance fallback city curation with interactive settings, progressive loading, and db guardrails ([#65](https://github.com/strike007-3000/RouteMate/issues/65)) ([b4445ed](https://github.com/strike007-3000/RouteMate/commit/b4445edf2b2413575b2c35257e019b1ce6ec69b1))

## [3.17.0](https://github.com/strike007-3000/RouteMate/compare/v3.16.0...v3.17.0) (2026-06-02)

### Features

* **explore:** Enhance fallback AI city exploration pipeline with interactive travel intent collection, selectable vibe/mood modifier chips, and database commit guardrails.
* **explore:** Implement multi-stage progressive loading indicator representing pipeline curations in real-time.
* **explore:** Add a transient-state preview card for user validation ("Confirm & Save" vs "Re-roll") before committing to Dexie IndexedDB destinations store.

## [3.16.0](https://github.com/strike007-3000/RouteMate/compare/v3.15.0...v3.16.0) (2026-06-02)


### Features

* **brand:** create brand landing page and add policy links to auth page footers ([fb0b133](https://github.com/strike007-3000/RouteMate/commit/fb0b133d65a15f563ecd36f28845da5b88a2dfb7))
* integrate global brand differentiation and compliance updates ([bd35992](https://github.com/strike007-3000/RouteMate/commit/bd359922203b0fb3784aedfa469e571f7f1cd8f1))
* **brand:** create brand landing page and add policy links to auth p… ([4e34522](https://github.com/strike007-3000/RouteMate/commit/4e34522b5c68cbc9ad79f20d907ba25e62e35ff1))


### Bug Fixes

* **brand:** correct Google logo SVG brand colors for login and signup buttons ([db10192](https://github.com/strike007-3000/RouteMate/commit/db10192ba1a228f036f315016dccd54d1899e595))
* **brand:** sync package-lock.json and correct proxy.ts middleware convention docs ([4d3c228](https://github.com/strike007-3000/RouteMate/commit/4d3c22830f4c779f7eb1ad31d1e40a95a32cf08c))
* **compliance:** exhaustive brand sweep to routemate.top ([#64](https://github.com/strike007-3000/RouteMate/issues/64)) ([b964917](https://github.com/strike007-3000/RouteMate/commit/b964917792a04ca75ec016aea9cf937fbcbf2786))

## [3.16.0](https://github.com/strike007-3000/RouteMate/compare/v3.15.1...v3.16.0) (2026-06-01)

### Features

* **rsc:** refactor page routes (`/trips`, `/radar`, `/trip/[id]`, `/trip/[id]/timeline`, `/explore`, `/account`) into lightweight React Server Component shells with co-located Client Component implementations.
* **images:** upgrade raw `<img>` tags to Next.js `<Image>` components with automatic formatting, optimized remote pattern domains, and experimental package imports in `next.config.ts`.
* **images:** implement secure backend image retrieval route `/api/unsplash-image` to fetch scenic imagery via Unsplash proxy without exposing keys to browser static bundles.
* **ai:** enforce zero temperature for OpenRouter and Groq city discovery and itinerary parsing calls to lock output schema structures.
* **id:** replace random ID generations in parsing routes with native `crypto.randomUUID()` to harden IndexedDB local record creation.
* **store:** optimize timeline reorder hooks by destructuring and wrapping actions cleanly at the page level.

## [3.15.1](https://github.com/strike007-3000/RouteMate/compare/v3.15.0...v3.15.1) (2026-06-01)

### Features

* **brand:** replace default root route redirect with a premium, brand-compliant homepage listing app functionality.
* **brand:** add easily accessible privacy policy and terms links footer to the landing page, login page, and signup page.
* **middleware:** resolve Next.js 16 double-resolution warnings by ensuring `src/proxy.ts` is the single, primary middleware config entrypoint.

## [3.15.0](https://github.com/strike007-3000/RouteMate/compare/v3.14.0...v3.15.0) (2026-05-31)


### Features

* **account:** fix bottom sheet containment and add prebaked avatars … ([3379b63](https://github.com/strike007-3000/RouteMate/commit/3379b6387056137a8736ec2598f683b575264736))
* **account:** fix bottom sheet containment and add prebaked avatars selection grid ([dd9b8ce](https://github.com/strike007-3000/RouteMate/commit/dd9b8cefb7e2ca8a420bbae9e4870a483d7f3493))


### Bug Fixes

* **account:** change bottom sheets to fixed viewport bottom and center-constrain to 500px width ([64dbc9e](https://github.com/strike007-3000/RouteMate/commit/64dbc9e17a2c115ff4fd98ab3631dad494ca9557))

## [3.14.1](https://github.com/strike007-3000/RouteMate/compare/v3.14.0...v3.14.1) (2026-05-31)

### Features

* **account:** add prebaked avatar grid to Personal Info settings panel to allow users to choose from static minimalist design assets.
* **account:** fix bottom sheet stretching by using absolute positioning inside the constrained page container.

## [3.14.0](https://github.com/strike007-3000/RouteMate/compare/v3.13.1...v3.14.0) (2026-05-31)


### Features

* **account:** Account Hub — full working screen ([6e710e6](https://github.com/strike007-3000/RouteMate/commit/6e710e66ba6da12a9217ef7015ceefccaa91cff2))
* **account:** implement Account Hub — full working screen ([506c2d1](https://github.com/strike007-3000/RouteMate/commit/506c2d1decc98d54f6cd6b16d45749ee063e1678))
* wrap start script with run-with-infisical.js wrapper ([208f353](https://github.com/strike007-3000/RouteMate/commit/208f35360166977d3267bcbdbe284595f2e7307c))


### Bug Fixes

* **account:** preserve lastName on save & apply defaultViewMode on timeline init ([34069b3](https://github.com/strike007-3000/RouteMate/commit/34069b34de6716136a00b13d5acfdd8421f9592c))
* **scripts:** forward extra CLI args through infisical wrapper ([80c38cb](https://github.com/strike007-3000/RouteMate/commit/80c38cb655480fbc596f111e9126e5546edb0c38))

## [3.13.1](https://github.com/strike007-3000/RouteMate/compare/v3.11.0...v3.12.0) (2026-05-31)


### Features

* add automatic fallback wrapper for infisical cli on dev/build ([119ef84](https://github.com/strike007-3000/RouteMate/commit/119ef846a9cb46812dab1b41dda2317531865882))
* **auth:** custom step-based sign-in and sign-up with email OTP validation ([ce53023](https://github.com/strike007-3000/RouteMate/commit/ce5302307b67f948a7f223a71e2439e88ec79983))
* **auth:** redesign login and signup screens with custom step-based OTP flow ([249a8a3](https://github.com/strike007-3000/RouteMate/commit/249a8a39774b4947d699cc9201477a42c123cbb5))
* wrap next dev and build scripts with infisical run ([cc44a07](https://github.com/strike007-3000/RouteMate/commit/cc44a0709c13ddd2577fd2ecec50113b5467a3f8))


### Bug Fixes

* **auth:** add client-side hydration guards for custom hooks ([cabf8f0](https://github.com/strike007-3000/RouteMate/commit/cabf8f0f3a6f83e34e81747e4cd2c73c4ea537f1))
* **auth:** add client-side hydration guards for custom hooks ([a46abb3](https://github.com/strike007-3000/RouteMate/commit/a46abb335ab64ea4d1d25dbc7ecd5ee9c3841a5a))
* **auth:** add sso-callback route to handle Google OAuth callback redirects ([20c214a](https://github.com/strike007-3000/RouteMate/commit/20c214a5028b096b4d4f7e6eb0bbb92d2612f162))
* **auth:** add sso-callback route to handle Google OAuth redirection ([4f08cf9](https://github.com/strike007-3000/RouteMate/commit/4f08cf98e3d1dcf5e94479cd6413c813631719e6))
* **auth:** explicitly pass publishableKey to ClerkProvider and add diagnostic console logs ([f4942f4](https://github.com/strike007-3000/RouteMate/commit/f4942f4b635c18aac155910f19c0333b4a3cd63f))
* **auth:** explicitly pass publishableKey to ClerkProvider and add diagnostic console logs ([c7c7625](https://github.com/strike007-3000/RouteMate/commit/c7c76252ad6249f67de706c5cb77311a6961758b))
* **auth:** import hooks from @clerk/nextjs/legacy and remove console logs ([a8b1434](https://github.com/strike007-3000/RouteMate/commit/a8b143450f02174e2584ea0590e0cc8fd84ff5bc))
* **auth:** render loading spinner instead of null while Clerk initializes ([188ad56](https://github.com/strike007-3000/RouteMate/commit/188ad566972a2da906078f7a9d429897a1f5bce4))
* **auth:** render loading spinner instead of null while Clerk initializes ([05ce06c](https://github.com/strike007-3000/RouteMate/commit/05ce06c9f0d2013f1ce4f997e228045f05a0cef4))

## [3.11.0](https://github.com/strike007-3000/RouteMate/compare/v3.10.0...v3.11.0) (2026-05-31)


### Features

* design review and nocturnal velocity design system integration ([58c9de1](https://github.com/strike007-3000/RouteMate/commit/58c9de1d16aaeea0ca23fc988a6461a2872c857f))
* design review and nocturnal velocity design system integration ([83eefac](https://github.com/strike007-3000/RouteMate/commit/83eefac55b6d8ecc72337aa4049af986b3d66bf0))

## [3.11.0](https://github.com/strike007-3000/RouteMate/compare/v3.10.0...v3.11.0) (2026-05-31)


### Features

* **design:** implement design review and Nocturnal Velocity design system integration ([83eefac](https://github.com/strike007-3000/RouteMate/commit/83eefac))

## [3.10.0](https://github.com/strike007-3000/RouteMate/compare/v3.9.1...v3.10.0) (2026-05-31)


### Features

* add Google Login OAuth verification details and routes ([f46853b](https://github.com/strike007-3000/RouteMate/commit/f46853bea84e188ff006fefca3500ce1a3b64cd2))
* add Google OAuth verification files and routes ([e863ec9](https://github.com/strike007-3000/RouteMate/commit/e863ec93fa6852963c60d56f77a8e628d105466a))
* add interactive developer script to fetch and update landmark images from unsplash ([d3c274f](https://github.com/strike007-3000/RouteMate/commit/d3c274fc5045bd8c63c7d40df98f6bbee107b5e3))


### Bug Fixes

* align seeder script query filters with UnsplashService and commit first-run image updates ([6b98a66](https://github.com/strike007-3000/RouteMate/commit/6b98a66a7e550586d009f985a2f80bf2e31deb25))
* construct unsplash URLs from raw base URL instead of photo.id only ([235d3b1](https://github.com/strike007-3000/RouteMate/commit/235d3b1b6ba6e287f72e75bf691a54c81c21a3ce))
* remove featured filter and target city+country landmark for precise unsplash searches ([dff0f8a](https://github.com/strike007-3000/RouteMate/commit/dff0f8af1f7a4ded8f2325d13008a4479ae2b883))
* restore 7 broken seed city images due to Unsplash rate limit ([5432915](https://github.com/strike007-3000/RouteMate/commit/54329156dbd68114e509190fd8b60c1c095e2cd7))
* restore seed destinations with correct timestamp-prefixed Unsplash URLs ([8e9078d](https://github.com/strike007-3000/RouteMate/commit/8e9078d864a2b88f9e3864e2637bc88b75a0c900))
* update all city seed images to high quality verified URLs ([0115c94](https://github.com/strike007-3000/RouteMate/commit/0115c942bc38ae619f20eade4919b5cd45831591))
* update seed destinations with high-fidelity landmark images from updated script ([854c0ed](https://github.com/strike007-3000/RouteMate/commit/854c0edc7e5ce8d043638d231e64edc267c7494d))

## [3.9.1](https://github.com/strike007-3000/RouteMate/compare/v3.9.0...v3.9.1) (2026-05-30)


### Bug Fixes

* **explore:** rename Sydney Coast to Sydney in seedDestinations ([083d733](https://github.com/strike007-3000/RouteMate/commit/083d7339e3e59074c72a2d714600afc749cea57d))
* update barcelona and brussels images to official sagrada familia and atomium photos ([3eb4ab0](https://github.com/strike007-3000/RouteMate/commit/3eb4ab020c7640f2d39216873406a132a7f58413))
* update broken unsplash image links for barcelona and brussels ([111e828](https://github.com/strike007-3000/RouteMate/commit/111e8286eb0e79726874797e920e30e27e833d94))

## [3.9.0](https://github.com/strike007-3000/RouteMate/compare/v3.8.0...v3.9.0) (2026-05-30)


### Features

* **explore:** implement hybrid AI city discovery, details drawers, s… ([96c9036](https://github.com/strike007-3000/RouteMate/commit/96c90364bbb5a395e81b03846be7b3dd7b69b8b0))
* **explore:** implement hybrid AI city discovery, details drawers, search/filters, and custom date trip builder ([6560ea6](https://github.com/strike007-3000/RouteMate/commit/6560ea60145580057da82b6dad01e9df2632b70c))

## [3.6.0](https://github.com/strike007-3000/RouteMate/compare/v3.5.0...v3.6.0) (2026-05-30)


### Features

* migrate authentication to Clerk, add proxy.ts, clean up old endpoints ([3715881](https://github.com/strike007-3000/RouteMate/commit/37158818b02921ed240bb7ac2034d8f414b411fa))


### Bug Fixes

* **build:** correct NextRequest import and wrap verify page in Suspense boundary ([07bb317](https://github.com/strike007-3000/RouteMate/commit/07bb3170816715dca4acd37336c3ab82fe5fb847))
* **settings:** migrate legacy preferredAiProvider default to empty string ([1105eae](https://github.com/strike007-3000/RouteMate/commit/1105eae5f85fa6221226de7de229e10a09924f27))
* **smart-paste:** resolve date parsing crashes and preference overrides ([0029714](https://github.com/strike007-3000/RouteMate/commit/002971499327df308ec6ac2625259e7f20b68070))
* **smart-paste:** resolve date parsing crashes and preference overrides ([a117a7f](https://github.com/strike007-3000/RouteMate/commit/a117a7f082a892bfc00d81ce3712dc737f66ede3))

## [3.5.0](https://github.com/strike007-3000/RouteMate/compare/v3.4.0...v3.5.0) (2026-05-30)


### Features

* align all screens to design system guidelines ([848cb21](https://github.com/strike007-3000/RouteMate/commit/848cb21ccbba013a4a75708f6990e6a1cbb65618))
* align all screens to design system guidelines ([b3a36e8](https://github.com/strike007-3000/RouteMate/commit/b3a36e80ccbb8d1f6f4edcd8668c3aa46d6508fd))

## [3.4.0](https://github.com/strike007-3000/RouteMate/compare/v3.3.5...v3.4.0) (2026-05-20)


### Features

* implement scroll-driven shrinking header, swipe-to-delete gestures, and view transitions ([d254d3a](https://github.com/strike007-3000/RouteMate/commit/d254d3a0b741da4654c9564478098442905a6f4b))


### Bug Fixes

* harden timeline sorting and AI date extraction against malformed/invalid dates ([f8eb6b6](https://github.com/strike007-3000/RouteMate/commit/f8eb6b6567b27bed980629415cebbff4f375478a))

## [3.3.1] - 2026-04-26

### 🛡️ Security & Architecture Hardening
- **Enhanced Security**: Moved ORS API keys from URL parameters to `Authorization` headers to prevent sensitive data leakage in logs.
- **Client-Safe Config**: Renamed and synchronized environment variables to `NEXT_PUBLIC_ORS_API_KEY` for cross-context compatibility (Browser + Server).
- **Parallel Processing**: Upgraded `OpenRouteServiceProvider` to use `Promise.all()` for geocoding, cutting transit calculation latency in half.
- **Architectural Refactor**: Extracted the complex `sortItinerary` engine from the Zustand store into a standalone utility for improved testability and cleaner core logic.
- **Collision Resistance**: Replaced all `Math.random()` ID generation with `crypto.randomUUID()` for enterprise-grade ID stability.


## [3.3.0] - 2026-04-26

### 🚀 Performance & Resilience Pass
- **Optimized Sorting Engine**: Implemented a pre-calculation pass in the `sortItinerary` store action. This reduces sort complexity by generating metadata once per item, drastically improving UI responsiveness on busy timelines.
- **Server-Side Safety**: Fixed a critical singleton crash in the `TransitService` by removing illegal browser global access (`localStorage`/`window`) during API route execution.
- **Transactional Hardening**: Wrapped all Dexie.js database operations in strict `try-catch` blocks with standardized error logging to prevent silent failures and UI hangs.

### 🧬 Logistical Logic Refinement
- **Long-Distance Transit**: Re-calibrated the "Ocean Crossing" suppression threshold from 500km to 2000km, enabling valid cross-country land transit and driving suggestions.
- **Manual Order Stability**: Fixed a tie-breaking issue where manual `sortOrder` values were not correctly overriding logistical ranks in edge cases.


## [3.2.0] - 2026-04-25

### 📝 Manual Itinerary Editing
- **Metadata Control**: Introduced a new "Edit" modal allowing users to manually update flight numbers, airlines, and confirmation codes after extraction.
- **Action Bar Update**: Added a sleek pencil icon to the timeline item action bar for quick access to metadata refinement.

### 🛡️ Hardening & Sorting Refinement
- **Midnight Lodging Fix**: Optimized the sorting engine to treat `00:00` lodging entries as "Evening" check-ins, preventing them from overlapping with morning flights on Day 1.
- **Runtime Resilience**: Hardened the entire React tree against malformed external API data (AviationStack/WeatherStack) to prevent "page couldn't load" errors.

## [3.1.0] - 2026-04-25

### ⛅ Real-Time Weather Integration (WeatherStack)
- **Context-Aware Forecasts**: Implemented a dynamic `WeatherWidget` in the Summary view day headers.
- **API Optimization**: Configured logic to only fetch weather for the current and next day, significantly reducing API usage.
- **Seamless UI**: Integrated a sleek, glassmorphic weather pill next to each day title.

### ✈️ Live Flight Tracking (AviationStack)
- **Proactive Logistics**: Replaced static flight times with live status updates (Green/Red indicators), gate numbers, and terminal info.
- **Route-Based Search**: Implemented a fallback search engine that finds flights by departure/arrival airports if the flight number is missing.
- **One-Tap Selection**: Users can now select their specific flight from a suggested list to "lock in" real-time tracking metadata.

### 🛠️ Codebase Hardening & Audit Fixes
- **Cascading Render Fixes**: Eliminated all React synchronous `setState` warnings in high-traffic components.
- **Zero Lint Errors**: Fully resolved all remaining TypeScript `any` type violations and implicit errors.
- **Integrity Refactor**: Updated internal integrity scripts to be non-interactive and CI-compatible.

## [3.0.3] - 2026-04-25

### 🧠 Configurable AI Architecture (Local & Production)
- **Dynamic Provider Routing**: Implemented a global execution queue that dynamically sorts based on user preference, checking client headers before falling back to Vercel's `PRIMARY_AI_PROVIDER` environment variable.
- **Developer Settings Hub**: Integrated a "Preferred AI" toggle (`OpenRouter` vs `Groq`) directly into the local `/account` page for instant, zero-reload AI extraction testing.

### 💎 Timeline UI/UX Refinements
- **Two-Tap Deletion Safety**: Replaced jarring browser confirmation popups with an elegant inline "Two-Tap" deletion button (Trash icon expands to a red "Confirm?" pill) for specific itinerary items.
- **Progressive Disclosure**: The large `TransitCard` widget is now intelligently hidden when viewing the high-level **Summary** tab, only rendering in the **Logistics** tab to reduce visual clutter while preserving functionality.
- **Extraction Hardening**: Removed testing instructions from the system prompt that caused the AI to hallucinate unrequested flights, and enforced strict title-case sanitization to ensure perfect UI styling.

### 🛡️ Multi-Provider AI Resilience (Groq Integration)
- **Groq Failover Stack**: Integrated Groq as a secondary AI provider. If OpenRouter's free tier is rate-limited (429), the system now automatically fails over to Groq's high-speed inference engine.
- **Provider Failover Logic**: Implemented a global execution queue that traverses both OpenRouter and Groq model pools until a valid extraction is secured.
- **Enhanced Settings UI**: Added a dedicated Groq API Key field in the Account Hub to empower users with a "Safety Net" provider.
- **Reduced Latency Retries**: Optimized backoff timings during cross-provider failovers to maintain a responsive user experience.

## [3.0.1] - 2026-04-25

### 🧠 Free Model Reliability Pass
- **Tiered AI Resilience**: Implemented a hardened fallback system for AI extraction. If the primary free model router (`openrouter/free`) returns unparseable or malformed data, the system now automatically retries using verified high-quality free models like **Hermes 3** and **Gemma 3**.
- **Verified Free Model Stack**: Removed outdated/non-existent Gemini free identifiers and replaced them with currently available, high-performance free models on OpenRouter.
- **Improved JSON Validation**: Added a strict JSON parsing and validation step in the API layer to detect and recover from model hallucinations or truncation.

## [3.0.0] - 2026-04-22

### 🏛️ Unified Architecture (Version 1.0 Ready)
- **Header Hierarchy**: Standardized global headers to a strict `ROUTEMATE / [Page Title]` hierarchy across all tabs (My Trips, Itinerary, Explore, Account Hub).
- **Navigation Loop Resolved**: Renamed the bottom navigation tab to **ITINERARY** and removed recursive dashboard loops for a more linear, intuitive flow.
- **Relocated DEV Mode**: Moved the environment indicator to the far right for a cleaner, production-ready aesthetic.

### 🛡️ Text Protection Layers (100% Visibility)
- **The Scrim**: Implemented a professional `from-black/60 via-transparent to-black/90` linear gradient overlay in the Trip Hero to ensure text legibility over any background.
- **Dynamic Shadows**: Applied `drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]` to all metadata text for a "bulletproof" readable edge.
- **Glassmorphism Spec**: Refined Bento cards with `bg-black/40 backdrop-blur-xl` for maximum clarity over busy photography.

### 🧠 Smart Extraction 2.0 (Resilience Pass)
- **Pure-Free AI Stack**: Migrated the OpenRouter engine to a zero-cost stack (`openrouter/auto:free`) to prevent credit depletion during testing.
- **Mock AI Mode**: Introduced a developer toggle in **Account Settings** that simulates full AI extraction without an API key.
- **Adaptive Boundaries**: The timeline now automatically stretches its start/end dates to accommodate extracted points that fall outside the original trip window.
- **Auto-Expansion**: Implemented logic to automatically "pop open" days that receive new items from a Smart Extraction.

### 🧬 Content & Polish
- **The Verb Strip**: Added an aggressive entity-first title sanitizer that strips helper verbs (e.g., "Departure from", "Stay at") to focus on location names.
- **Sticky Day Headers**: Added sticky positioning to day anchors in the Summary view to keep users grounded during long-scroll sessions.
- **Empty State UX**: Replaced dead-end icons with proactive CTAs and "Version 1.0" instructional copy.

## [2.9.0] - 2026-04-21
### Features
* release v2.8.1 - dual-view distinction, intelligent routing, and ai extraction hardening ([5289cbb](https://github.com/strike007-3000/RouteMate/compare/v2.8.0...v2.9.0))

## [2.8.1] - 2026-04-21

### 🌓 Dual-View Distinction (Summary vs. Logistics)
- **State-Driven UI**: Implemented a global view switcher allowing users to toggle between a high-level visual itinerary and a technical logistical timeline.
- **Summary Mode**: Focuses on emotional planning with image-forward "Day Cards," unified 32px radii, and suppressed connectors.
- **Logistics Mode**: Restores the 1px continuous thread, transit markers, and technical metadata.

### 📍 Intelligent 'Between-Stop' Directions
- **Contextual Routing**: The Map Pin now calculates directions **from the previous stop** to the current one, providing a seamless journey thread.
- **Hub Precision**: Integrated `getPreciseLocation` logic to ensure navigation routes specifically to **Airport Terminals** (IATA codes) rather than generic city pins.
- **Cross-Day Continuity**: Navigation logic now persists across day boundaries, routing your first activity of the day from the previous night's hotel.

### 🧠 AI Extraction Hardening (Llama 3.3 70B)
- **Primary Model Migration**: Switched to **Llama 3.3 70B** as the primary reasoning engine via OpenRouter.
- **JSON Object Mode**: Enabled `response_format: json_object` to eliminate markdown artifacts and 422 parsing errors.
- **Fuzzy Data Recovery**: Implemented a regex-based recovery layer to handle non-compliant LLM responses.

### 🌅 Luxury Magazine Imagery
- **Curated Filtering**: Updated the Unsplash engine with `featured=true` and `content_filter=high` to ensure a premium travel aesthetic.

## [2.8.0] - 2026-04-20

### Features
- immersive hero architecture & adaptive logistics engine v2.7.5 ([78b031e](https://github.com/strike007-3000/RouteMate/commit/78b031e4cb196ed184586231fff2903b4166917a))

### Bug Fixes
- import missing cn utility in EditTripModal ([5951e3e](https://github.com/strike007-3000/RouteMate/commit/5951e3ea36051c53a10e4f61544c7dcc561df150))

## [2.7.2] - 2026-04-20

### 🎨 Design System Synchronization (Signature Blue)
- **Unified Brand Identity**: Standardized the entire application on **RouteMate Blue (#3b82f6)**. Every button, indicator, and active state now shares a singular, vibrant identity.
- **The 24px Rule**: Audited and standardized all component geometry to a global `rounded-[24px]` radius and `px-6` spacing for a premium, cohesive feel.
- **No-Jump Navigation Header**: Implemented absolute horizontal alignment (`pl-16`) and fixed height (`h-20`) for the global `Header`. This ensures titles remain perfectly fixed during back-navigation, eliminating layout "jumps."
- **Dashboard Refinement**: Updated the `Countdown` widget to show the Trip Start Date when no upcoming stops are present.

### 🧠 Human-First Sorting Engine (Final Hardening)
- **1-6 Rank Hierarchy**: Refactored the internal ranking model to a streamlined 6-rank sequence:
  1. Check-out (Lodging)
  2. Departure (Flight/Train)
  3. Arrival
  4. Check-in (Lodging)
  5. Activities & Dining
  6. Return Flight (Anchor)
- **Smart Return-Flight Detection**: Introduced logic to automatically identifies "Home-bound" flights by comparing arrival cities to the trip's origin. Return flights are now forced to the absolute bottom of the timeline.
- **Home Base Suppression**: Origin cities now intelligently suppress redundant check-out/transit events on Day 1.

### 🤖 Smart Add Workflow & Feedback
- **RouteMate Success Toast**: Implemented a signature, high-fidelity custom notification component for extraction success feedback.
- **Enhanced Retry Logic**: The Smart Add modal now stays open on failure, preserving user text and displaying inline alerts (`AlertCircle`) for low-friction retrying.
- **UI Feedback**: Added an animated pulse effect to the extraction button during AI processing.

## [2.7.0] - 2026-04-19

### 🧠 The "Implicit Hub" Engine (Logistics Phase 2)
- **Implicit Airport Routing**: Refactored the core transit logic to treat airports as "Implicit Hubs." Directions now point directly from your hotel/home to the gate without redundant itinerary stops.
- **Ocean Crossing Suppressor**: Implemented a distance-based filter (>500km) to hide illogical driving connections across oceans when flights are detected.
- **Flight Migration Logic**: Upgraded the AI parser to anchor flights as the primary timeline events (Early Departure $\rightarrow$ Mid-day Arrival).

### 🛡️ Dashboard Resilience (Visual Pass 2)
- **Fail-Soft Imagery**: Added a robust `onError` fallback system in `TripCard.tsx`. If Unsplash fails, the dashboard automatically swaps to a vibrant, high-quality scenic asset. No more black cards.
- **Contrast Typography**: Applied high-contrast `drop-shadow-2xl` and `tracking-tighter` styles to all trip titles for maximum legibility over photography.

### 🧬 Temporal Logic & Hardening
- **Strict Sequencing**: Hardcoded logical ranks (Departure 08:00 > Check-out 10:00 > Arrival 14:00 > Check-in 16:00) to solve the 'Hotel-First' paradox.
- **Transactional Persistence**: Fixed an issue where manual reordering didn't persist correctly across sessions.

---

## [2.6.4] - 2026-04-19

### 🧠 Logic & Reordering (Fixing "Not Moving")
- **Wired Drag Handles**: Implemented `useDragControls` and attached it specifically to the **Vertical Grip (dots) icon**. Precision manual reordering is now fully enabled.
- **Unified Sorting**: Updated the core sorting engine to prioritize manual `sortOrder` as the primary tie-breaker for items with identical times.
- **Transactional Persistence**: Manual order changes are now persisted to Dexie v4.

### 💎 Visual Overhaul & Glassmorphism
- **Itinerary Header**: Implemented "Glassmorphism Overlay" for the title card using `backdrop-blur-2xl` on top of scenic hero images.
- **Hero Card Fidelity**: Optimized `TripCard.tsx` with dynamic `object-cover` and `animate-pulse` loading states.

### 🛡️ Build & Stability (The Hardening Pass)
- **Resolved ESLint Blockers**: Fixed 11 critical errors (React purity, cascading renders, any types, unescaped entities).
- **TypeScript Fidelity**: Migrated unsafe `any` records to strict `unknown` types with proper casting.
- **CI/CD Alignment**: Migrated `release-please.yml` to the official namespace to resolve deprecation warnings.
- **Fixed Missing Import**: Resolved `parseISO` build error in `BentoGrid.tsx` that was blocking production deployment.

### 🧬 Sequencing & Extraction Hardening
- **Mistral v4 Transition**: Successfully migrated to the **Mistral Small 4 (119B)** engine (`2603` snapshot).
- **Chronological Enforcement**: Refined system prompts to strictly lock **Hotel Check-ins at 15:00** and arrivals at 08:00.
- **Diagnostic Tooling**: Introduced `npm run test:integrity` to verify API connectivity and logic sequencing before deployment.

---

## [2.0.0] - 2026-04-19

### 🚀 Major Architectural Shift
- **Grouped Timeline**: Replaced the static Radar tab with a comprehensive, date-grouped accordion Timeline.
- **Accordion Physics**: Added smooth framer-motion slide animations and sticky date headers.
- **Smart Expansion**: Implemented logic to auto-expand "Today's" itinerary on initial view.

### 🧠 Intelligence Engines
- **50km Transit Rule**: Implemented Haversine distance calculations for dynamic transit/driving switching.
- **AI Extraction 2.0**: Upgraded Smart Add to extract high-precision data.
- **Address Hardening**: Automated address cleaning logic.

### 💎 Design & Branding
- **Minimalist Premium identity**: Standardized "ROUTEMATE" branding globally.
- **Category Glow System**: Color-coded cards for visual recognition.
- **UI Grid Alignment**: Standardized on a 16px grid system.

---

## [1.2.0] - 2026-04-18
- Initial stable release with Multi-Trip management.
- Radar tab feature set (Geolocation-based transit hubs).
- Basic Unsplash image mapping.
