# QQ Companion Phase 2 Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing Foundation shell into a portfolio-ready social companion with event-driven chat, streaming OpenAI-compatible AI, durable local state, and polished profile/memory/Zone views.

**Architecture:** Keep the existing `AppEvent` contract as the only chat write path. Add a small native IndexedDB repository behind the existing `EventStore` interface, keep provider-specific request formatting in server routes, and let one client shell coordinate route views, demo/live mode, and streaming UI.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Zod, native IndexedDB, native Fetch/ReadableStream, CSS design tokens.

**Spec:** User-provided Phase A–F requirements in the 2026-09-21 task.

## Global Constraints

- Preserve the completed Foundation and existing legacy parser.
- Every sent or generated chat item is an `AppEvent` appended through `EventStore`.
- UI never calls a provider endpoint directly; it calls only `/api/ai/test` and `/api/ai/chat`.
- Secrets are never hard-coded or committed.
- Do not add realtime voice, WebRTC, Live2D, vector memory, character import, full forum/group chat, PWA, or advanced developer mode.
- Use shared design tokens and prevent horizontal overflow at 390px.

---

### Task 1: Local data and demo seed

**Files:**
- Create: `core/persistence/LocalDatabase.ts`
- Create: `stores/demoData.ts`
- Modify: `core/events/EventStore.ts`

**Interfaces:**
- Produces: `BrowserEventStore`, `loadWorkspace()`, `saveSetting()`, `seedDemoWorkspace()`.
- Persists: `events`, `conversations`, `characters`, and `settings` in IndexedDB.

- [ ] Add a native IndexedDB wrapper with versioned object stores and promise-based reads/writes.
- [ ] Add typed demo character, conversation, events, memories, and Zone posts.
- [ ] Implement a browser EventStore that validates on append and lists events in chronological order.
- [ ] Seed only when the stores are empty so refreshes preserve user changes.

### Task 2: Provider-neutral API boundary

**Files:**
- Create: `core/ai/types.ts`
- Create: `core/ai/OpenAICompatible.ts`
- Create: `app/api/ai/test/route.ts`
- Create: `app/api/ai/chat/route.ts`

**Interfaces:**
- Consumes: profile fields `baseUrl`, `apiKey`, `model`, `temperature`, `contextWindow`, `maxOutput`, `streaming`.
- Produces: JSON connection result and a UTF-8 streaming response.

- [ ] Validate URL, key, model, numeric limits, and message payloads at the route boundary.
- [ ] Test the configured provider via its models endpoint with a clear success/failure response.
- [ ] Translate provider SSE chunks into a provider-neutral text stream.
- [ ] Return non-streaming response content through the same browser-readable body contract.

### Task 3: Event-driven chat interaction

**Files:**
- Create: `components/qq/Icon.tsx`
- Rewrite: `components/qq/QQShell.tsx`

**Interfaces:**
- Consumes: `BrowserEventStore` and `/api/ai/chat`.
- Produces: `message.text`, `interaction.poke`, `interaction.transfer`, and `call.voice.end` events.

- [ ] Hydrate from IndexedDB and render only stored events.
- [ ] Append a user text event before starting either demo or live response.
- [ ] Stream live text into UI, then append the completed character event through EventStore.
- [ ] Add mock response fallback and event composer actions for poke, transfer, and call records.
- [ ] Add sending, streaming, empty-draft, and failure feedback states.

### Task 4: Portfolio views and settings

**Files:**
- Rewrite: `components/qq/QQShell.tsx`
- Create: `app/memories/page.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: Character Profile, Memories, Zone, Settings, and functional navigation states.

- [ ] Add Character Profile with avatar, status, actions, memory/albums/Zone/chat summaries.
- [ ] Add a dedicated Memories view using ordinary social-product language.
- [ ] Add high-fidelity Zone posts with images, likes, comments, and replies.
- [ ] Add AI profile fields, Test Connection, Save Profile, Set Active, and Demo/Live mode switch.
- [ ] Add mobile list/detail navigation and explicit back behavior.

### Task 5: Shared visual system and responsive polish

**Files:**
- Rewrite: `app/globals.css`
- Update: `docs/DESIGN_SYSTEM.md`

**Interfaces:**
- Consumes: `design-system/qq-companion/MASTER.md` with product-specific overrides.
- Produces: one token-driven 3-column desktop shell and responsive 390px layouts.

- [ ] Define semantic color, type, spacing, radius, shadow, and layout tokens.
- [ ] Polish rail, conversation states, header, timeline, bubbles, composer, cards, and forms.
- [ ] Use one consistent inline SVG icon system and accessible labels.
- [ ] Add restrained transitions, visible focus, reduced-motion handling, and no horizontal overflow.

### Task 6: Verification

**Files:**
- Modify: `task_plan.md`, `progress.md`, `findings.md`.

- [ ] Run `npm run typecheck` and record the fresh result.
- [ ] Run `npm run lint` and record the fresh result.
- [ ] Run `npm run build` and record the fresh result.
- [ ] Start `npm run dev` on port 3001 and inspect `/`, `/messages`, `/settings`, `/profile`, `/memories`, and `/zone`.
- [ ] Inspect approximately 1440px/1600px and 390px viewports for layout quality and horizontal overflow.
- [ ] Re-read the user requirements and report any remaining gaps explicitly.
