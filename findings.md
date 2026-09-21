# Findings

## 2026-09-21 — Phase 2 baseline

- The app is Next.js 14 / React 18 / TypeScript with no client-state or IndexedDB dependency installed.
- `QQShell.tsx` currently owns the entire static UI; every route renders the same shell with an `initialView`.
- `MemoryEventStore` already validates `AppEvent` objects and is the correct boundary to preserve, but no UI currently dispatches events.
- The schema already covers text, poke, transfer, voice/video call lifecycle, Zone, diary, memory, and status events.
- Settings is a visual placeholder; no API routes, adapter, profile persistence, or streaming path exist yet.
- Existing routes are `/`, `/messages`, `/settings`, `/profile`, `/zone`, `/contacts`, and `/channels`; Memories needs a portfolio view/route.
- The repository currently tracks `.next`; its existing generated-file changes are unrelated and will be left alone.
- The current mobile CSS hides the chat main pane entirely, so a selected-conversation mobile state is required for functional chat at ~390px.
- The generated design-system match is a restrained Messenger-blue minimal system; its marketing-page pattern is intentionally excluded because this product is a desktop social client.
- An original project avatar for 基昂 was generated and copied to `public/assets/jiang-avatar.png`; the final prompt uses a calm editorial portrait, navy/slate palette, and no branding or text.

## 2026-09-21 — Stabilize + warm visual integration

- Checkpoint `dc09d39` is clean and is the baseline for this phase.
- `/memories` was the only linked portfolio route missing from `app/`; the shell already supports `initialView="memories"`.
- The checked-in CSS is still the old blue Foundation stylesheet and does not cover most Phase 2 component class names, so visual stabilization requires a full token-driven stylesheet replacement rather than component architecture changes.
- Forbidden generated paths and common secret patterns were not found in Git-tracked source during the initial audit.
- Remote commit `ea95102` fast-forwarded cleanly over the valid local work and supplied the approved blond chibi, Zone/Diary/Channel feature art, navigation/action icons, and restrained decorations.
- The incorrect black-haired chibi generated outside the repository in the prior attempt was deleted before this phase; no incorrect generated asset or mapping exists in the workspace.
- Asset integrity check: `feature-art/zone.webp` and `feature-art/diary.webp` are valid RIFF/WebP files showing the approved blond curly-haired identity. `avatar/chibi/default.webp` and `feature-art/channel.webp` do not have WebP headers and cannot be decoded by the image viewer; their source must be verified before UI integration.
- The same `default.webp` and `channel.webp` bytes are malformed in the approved source repository, so this workspace did not corrupt them. The UI keeps their canonical paths and falls back only to the approved valid Diary/Zone art.
- Runtime validation in a clean Edge profile seeded 6 demo events, persisted a new user text event plus character reply, persisted poke/transfer/call-record events, and restored all of them after reload.
- The old `public/assets/jiang-avatar.png` file remains in repository history for compatibility but no current page references it; runtime inspection found no `jiang-avatar` image source.
- Desktop screenshots at ~1600px and mobile screenshots at 390px show no document-level horizontal overflow. Mobile list-to-chat selection and back control are present.

