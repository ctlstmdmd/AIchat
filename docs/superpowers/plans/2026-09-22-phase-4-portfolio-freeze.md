# QQ Companion Phase 4 Portfolio Freeze Implementation Plan

> **For agentic workers:** Execute this plan inline and keep each step within the existing architecture. No sub-agent delegation is required.

**Goal:** Freeze QQ Companion as a coherent, screenshot-ready Portfolio MVP / v0.1 without expanding product scope.

**Architecture:** Preserve the existing `QQShell`, `AppEvent → BrowserEventStore → IndexedDB` flow, API routes, adapters, and `Character.assets` configuration. Make only evidence-backed asset documentation and visual polish changes, then add a root portfolio README and verify the complete product.

**Tech Stack:** Next.js 14, React 18, TypeScript, Zod, IndexedDB, CSS design tokens.

**Spec:** `C:/Users/guanguan/.codex/attachments/83b0cb7c-30c3-47e9-a52e-5f0c0f607990/pasted-text.txt`

## Global Constraints

- Do not generate or introduce a new character identity.
- Do not refactor stable Phase 2/3 systems or add major features.
- Do not use the compatibility-only black-haired avatar in active UI.
- Do not commit or push automatically.
- Keep port `3001` and preserve desktop/mobile routing and event interactions.

---

### Task 1: Verify and document repaired character assets

**Files:**
- Modify: `docs/UI_ASSET_MANIFEST.md`
- Modify: `findings.md`

**Interfaces:**
- Consumes: `Character.assets` paths in `stores/demoData.ts`
- Produces: explicit repaired-asset status and defensive fallback behavior

- [x] Inspect binary sizes, signatures, and hashes for all four character WebPs.
- [x] Record the initial invalid import diagnosis without generating replacements.
- [x] Verify repair commit `91a8670` supplies valid RIFF/WebP data for `default.webp` and `channel.webp`.
- [x] Confirm normal UI rendering uses the repaired primary assets with Diary/Zone retained only as defensive fallbacks.

### Task 2: Run five-screen visual QA and apply only blocking polish

**Files:**
- Modify only if evidence requires it: `app/globals.css`
- Modify only if evidence requires it: `components/qq/QQShell.tsx`

**Interfaces:**
- Consumes: existing warm design tokens and approved asset configuration
- Produces: screenshot-ready `/messages`, interaction menu, `/zone`, `/profile`, `/memories`

- [x] Capture and inspect 1600px screenshots of all five required states.
- [x] Inspect 1440px versions for clipping, balance, and dead space.
- [x] Inspect 390px conversation list, chat detail, back navigation, and overflow.
- [x] Search current product source for deprecated blue/green tokens and visual placeholder residue.
- [x] Apply only small CSS/markup corrections justified by observed defects.

### Task 3: Add the portfolio README

**Files:**
- Create: `README.md`
- Modify: `docs/UI_ASSET_MANIFEST.md`

**Interfaces:**
- Consumes: verified Phase 2/3 functionality and validation scripts
- Produces: accurate repository overview, architecture, setup, limitations, and screenshot plan

- [x] Describe the product, verified features, event/data/API architecture, and technical highlights.
- [x] Explain Demo Mode, Live AI Mode, local data boundaries, and legacy compatibility precisely.
- [x] Label status as `Portfolio MVP / v0.1` and list honest limitations.
- [x] Add local-development and validation commands.
- [x] Document `docs/screenshots/` and five future screenshot filenames without fabricating images.

### Task 4: Final verification and freeze report

**Files:**
- Modify: `task_plan.md`
- Modify: `progress.md`
- Modify: `findings.md`

**Interfaces:**
- Consumes: finished Phase 4 diff
- Produces: evidence-backed readiness report and safe-to-commit decision

- [x] Run sequentially: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.
- [x] Start `npm run dev` on port 3001 and verify all eight routes return HTTP 200.
- [x] Verify Demo text, poke, transfer, call record, reload persistence, approved identity, and 390px overflow.
- [x] Confirm no API key, `.env`, `node_modules`, `.next`, or temporary validation script is tracked.
- [x] Run `git diff --check`, inspect final `git status`, and stop before commit/push.
