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

## 2. Hardening & Stability Rules
* **Deterministic IDs:** Always generate unique database keys using standard native browser `crypto.randomUUID()`. Do not use `Math.random()`.
* **Security:** Keep sensitive API keys in request headers, never append them directly as plain-text query strings in server calls.
* **Fallback Date Safeguards:** Always wrap date formatting in validation blocks. If a date is malformed or missing, fallback to rendering `'TBD'` rather than allowing the application UI to throw a fatal exception.

## 3. Workflow & Documentation Rules
* **Pull Requests (PRs):** Always create a new feature branch and open a Pull Request (PR) for your changes. Avoid pushing directly to the `main` branch unless explicitly authorized.
* **Issue Tracking:** If you encounter bugs, regressions, or type errors during development or testing, log them clearly and verify their resolution before completing tasks.
* **Documentation Maintenance:** Keep `README.md`, `docs/WIKI.md`, and metadata files completely in sync with any structural or API changes made during coding.
* **Versioning & Releases:** Ensure proper versioning and changelog entries are maintained correctly according to semantic release guidelines.
<!-- END:routemate-agent-rules -->
