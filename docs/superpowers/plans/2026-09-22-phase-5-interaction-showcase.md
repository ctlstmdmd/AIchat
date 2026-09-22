# Phase 5 Interaction Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn transfer, poke, voice call, and video call into screenshot-ready character interactions by using the four approved remote artworks while preserving the existing event-driven chat and local persistence.

**Architecture:** Keep `BrowserEventStore` as the only persistence boundary for completed chat interactions. Add the four artwork paths to `Character.assets`, enrich existing event renderers, and use one native modal `<dialog>` component with a small discriminated `ActiveCall` state for voice/video demo experiences; no provider, database, or media-protocol change is required.

**Tech Stack:** Next.js 14, React 18, TypeScript, native HTML dialog, shared CSS in `app/globals.css`, existing IndexedDB/EventStore.

**Spec:** `C:/Users/guanguan/.codex/attachments/b48fa4ff-6c1d-4d47-bca2-f749948768c5/pasted-text.txt`

## Global Constraints

- Preserve the uncommitted Channels topic-card work and all Phase 2–4 behavior.
- Reuse only the approved blond curly-haired character art from `public/characters/char/interaction-art/`.
- Do not implement WebRTC, real voice/video media, a new backend, or a new state library.
- All completed poke, transfer, voice-call, and video-call records must continue through `AppEvent` and `BrowserEventStore`.
- Keep the established warm yellow, cream white, light gold, soft brown, restrained-glass product language.
- Keep desktop screenshot quality primary and verify a real 390px emulated viewport with no horizontal overflow.

---

### Task 1: Sync and centralize approved interaction assets

**Files:**
- Modify: `stores/demoData.ts`
- Modify if hydration needs nested merging: `core/persistence/LocalDatabase.ts`
- Modify: `docs/UI_ASSET_MANIFEST.md`

**Interfaces:**
- Consumes: remote files `poke.webp`, `transfer.webp`, `voice-call.webp`, and `video-call.webp`.
- Produces: `CharacterAssets.interactionArt` with `poke`, `transfer`, `voiceCall`, and `videoCall` string paths available to all UI renderers.

- [x] Run `git pull --ff-only origin main` only after confirming the remote diff contains the four asset files and no overlapping local path.
- [x] Verify each asset has a RIFF/WEBP signature, decodes visually, and preserves the approved character identity.
- [x] Add the exact four paths to `demoCharacters[0].assets.interactionArt`.
- [x] Ensure persisted legacy Character records hydrate the new nested asset mapping without clearing conversations or events.
- [x] Document the four semantic uses in `docs/UI_ASSET_MANIFEST.md`.

### Task 2: Upgrade poke and transfer event presentation

**Files:**
- Modify: `components/qq/QQShell.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `Character.assets.interactionArt.poke` and `.transfer` plus existing `interaction.poke` / `interaction.transfer` events.
- Produces: art-backed `.poke-event-card` and `.transfer-card` renderers without changing their event schemas.

- [x] Replace the plain poke pill with a compact horizontal interaction card containing `poke.webp`, visible event copy, and one reduced-motion-safe nudge animation.
- [x] Expand the transfer card into amount/details and artwork regions using `transfer.webp`, while retaining amount, note, wallet label, sender meta, and responsive width.
- [x] Keep both renderers resilient when a non-primary character has no interaction artwork.
- [x] Confirm the action menu still appends the same validated events and the timeline restores them after reload.

### Task 3: Add voice and video call demo dialogs

**Files:**
- Modify: `components/qq/Icon.tsx`
- Modify: `components/qq/QQShell.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `Character.assets.interactionArt.voiceCall` / `.videoCall`, existing header/menu entry points, and `call.voice.end` / `call.video.end` schemas.
- Produces: `type CallKind = "voice" | "video"`, `type ActiveCall = { kind: CallKind; startedAt: number }`, `startCall(kind)`, `finishCall(kind, durationSeconds)`, and `CallExperience`.

- [x] Add consistent inline SVG icons for microphone, speaker, camera, and camera-switch controls to the existing `Icon` family.
- [x] Change the header phone/video buttons and Profile call button to open the appropriate demo dialog instead of immediately writing a record.
- [x] Extend the interaction menu with explicit voice and video entries.
- [x] Build `CallExperience` as a native modal dialog with character name, status, live timer, approved illustration, labeled controls, pressed states, Escape handling, and a prominent hang-up button.
- [x] Give voice mode a warm frosted split layout and video mode an immersive artwork stage plus static self-preview.
- [x] On hang-up, append exactly one matching `call.voice.end` or `call.video.end` AppEvent and update the conversation preview.
- [x] Render both voice and video ended-call records distinctly in the timeline.

### Task 4: Document and validate the portfolio experience

**Files:**
- Modify: `README.md`
- Modify: `task_plan.md`
- Modify: `findings.md`
- Modify: `progress.md`

**Interfaces:**
- Consumes: completed Phase 5 UI.
- Produces: accurate portfolio documentation and fresh validation evidence.

- [x] Update README with the four high-fidelity interactions and clearly label voice/video as demo presentation states rather than real media calls.
- [x] Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` sequentially.
- [x] Restart the port-3001 dev server after build and verify `/messages`, `/profile`, and `/channels` return HTTP 200.
- [x] In an isolated browser profile, verify poke/transfer persistence and capture Messages, voice dialog, and video dialog at 1600px plus critical states at a real 390px viewport.
- [x] Confirm no broken image, incorrect character identity, horizontal overflow, untracked runtime checker, API key, or secret.
