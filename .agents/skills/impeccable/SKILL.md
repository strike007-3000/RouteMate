---
name: impeccable-style
description: Provides guidelines and commands from Impeccable.style for styling, designing, and polishing UI components in this workspace.
---

# Impeccable Style Design Skill

This skill allows the agent to apply the "Impeccable" styling methodology (start, iterate, polish, maintain) to the project, adhering strictly to the branding rules of RouteMate.

## Core Phases & Commands

### 1. Context Selection
- **Init**: Use `/impeccable init` to align context. Ensure `PRODUCT.md` and `DESIGN.md` are present.
- **Context Files**:
  - `PRODUCT.md`: Defines SREs/travelers on call, calm tone, anti-references (e.g. purple gradients, default browser styling).
  - `DESIGN.md`: References the RouteMate design system (pitch black background `#000000`, card background `#09090b`, rounded corners `32px` / `24px`, primary action button `.btn-primary`).

### 2. Refinement & Iteration
- **Named Edits**:
  - `/impeccable typeset <target>`: Refine typography (letter-spacing, uppercase tracking, Geist/Inter fallbacks).
  - `/impeccable layout <target>`: Optimize spatial relations, grids, flexbox alignment.
  - `/impeccable colorize <target>`: Enforce OLED/dark mode compatibility and vibrant secondary accents.
  - `/impeccable animate <target>`: Add subtle micro-animations for interactive elements.
  - `/impeccable bolder <target>` / `/impeccable quieter <target>`: Tune design intensity up or down.
- **Exploration**:
  - `/impeccable live`: Launch live picker on localhost dev server.
  - `/impeccable critique`: Audit visual appeal, contrast, and alignment.

### 3. Pre-Ship Checklist
- `/impeccable audit <target>`: Score design along accessibility, performance, responsive layout, and anti-patterns (0 to 4).
- `/impeccable clarify <target>`: Refine microcopy, error states, empty-state labels.
- `/impeccable harden <target>`: Stress-test long text, offline, overflow layouts.

### 4. Maintenance
- `/impeccable extract`: Consolidate duplicated styles into reusable tailwind components/utilities.
- `/impeccable document`: Keep `DESIGN.md` in sync with real codebase changes.
