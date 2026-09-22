# Channel Topic Cards Visual Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade only the three topic cards below the existing `/channels` hero into screenshot-ready movie, music-memory, and daily-journal modules.

**Architecture:** Keep `ChannelsView`, its data, and the hero intact. Add semantic class names and small decorative markup inside the existing three articles, then implement the visual differentiation with native CSS, existing design tokens, and CSS-only ornaments; no new dependency, route, state, or image asset.

**Tech Stack:** Next.js 14, React 18, TypeScript, shared CSS in `app/globals.css`.

**Spec:** Current user request for the scoped `/channels` lower-card visual enhancement; the broader pasted Phase 5 document is background only and is explicitly out of scope for this task.

## Global Constraints

- Preserve the current warm yellow, cream white, light gold, and soft brown product language.
- Do not rewrite the Channels page or change the hero structure.
- Do not add dependencies, real media features, or unrelated Phase 5 interactions.
- Preserve the three-column desktop and one-column mobile flow with no horizontal overflow at 1600px, 1440px, and 390px.
- Use CSS-only decoration and existing inline icon primitives; do not create duplicate image assets.

---

### Task 1: Establish semantic card markup

**Files:**
- Modify: `components/qq/QQShell.tsx`

**Interfaces:**
- Consumes: existing `ChannelsView` topic copy and `Icon` component.
- Produces: `.topic-card--movie`, `.topic-card--music`, and `.topic-card--daily` hooks plus compact decorative regions for CSS.

- [x] Add a shared `.topic-card` class and one theme modifier to each existing article.
- [x] Keep every existing title, description, reply count, and timestamp unchanged.
- [x] Add presentation-only film, analog waveform, and journal details with `aria-hidden="true"` where appropriate.
- [x] Confirm the hero structure and content are unchanged.

### Task 2: Apply restrained visual differentiation

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing warm tokens and the semantic hooks from Task 1.
- Produces: three distinct but related topic-card treatments.

- [x] Give all cards shared radius, border, hierarchy, hover lift, and focus-within-safe motion.
- [x] Style the movie card with a small screen glow, film perforations, and ticket-like label.
- [x] Style the music card with an analog record/cassette motif, date label, and restrained waveform.
- [x] Style the daily card as cream paper with a memo label, ruled lines, and one small star accent.
- [x] Reuse the global `prefers-reduced-motion` coverage and keep ornament layers non-interactive.

### Task 3: Validate screenshot readiness

**Files:**
- Modify: `task_plan.md`
- Modify: `findings.md`
- Modify: `progress.md`

**Interfaces:**
- Consumes: the completed component/CSS changes.
- Produces: recorded visual and build evidence.

- [x] Run `npm run typecheck`, `npm run lint`, and `npm run build` sequentially.
- [x] Restart the port-3001 dev server without running `next build` concurrently.
- [x] Capture and inspect `/channels` at 1600×1000, 1440×1000, and 390×844.
- [x] Confirm no horizontal overflow, no broken image, and no hero regression.
