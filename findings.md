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
- The initial asset import contained invalid `avatar/chibi/default.webp` and `feature-art/channel.webp` bytes; repair commit `91a8670` later replaced both with valid approved RIFF/WebP files.
- Diary/Zone fallbacks remain configured only as defensive recovery paths. Current normal rendering uses the dedicated default avatar and Channel artwork.
- Runtime validation in a clean Edge profile seeded 6 demo events, persisted a new user text event plus character reply, persisted poke/transfer/call-record events, and restored all of them after reload.
- The old `public/assets/jiang-avatar.png` file remains in repository history for compatibility but no current page references it; runtime inspection found no `jiang-avatar` image source.
- Desktop screenshots at ~1600px and mobile screenshots at 390px show no document-level horizontal overflow. Mobile list-to-chat selection and back control are present.

## 2026-09-22 — Phase 4 portfolio freeze

- Phase 4 began at `f3a2196`; asset repair commit `91a8670` was later synced without overwriting the local Phase 4 work.
- `default.webp` is now a valid 7,518-byte RIFF/WebP with SHA-256 `D466039BB2CD128BB319ACFB83EC40DBD8A7CD4B47384D1A6F495242340F9004` and decodes as the approved blond curly-haired chibi avatar.
- `channel.webp` is now a valid 16,968-byte RIFF/WebP with SHA-256 `36420A90B21F97C44675DC055C91142ED391FD60F580837ED529DAE6A89E5EB9` and decodes as the dedicated approved social/channel illustration.
- Diary and Zone remain valid approved assets. Their configured fallbacks are retained only as defensive recovery paths, not as the normal avatar or Channel visuals.
- Browser QA at exact 1600×1000, 1440×1000, and 390×844 found no document-level horizontal overflow, no unresolved broken images, and no active reference to `jiang-avatar.png`.
- Messages and the interaction-menu state are visually coherent at both desktop widths; the menu exposes exactly 拍一拍、转账、通话记录 with approved icons. Mobile list/detail navigation remains legible and the menu fits inside 390px.
- Profile and Memories retain strong character focus and consistent cream/yellow hierarchy at all checked widths; no screenshot-blocking defect was observed.
- Zone reads as a social feed, but the hero's translucent owner strip blurs the underlying illustration into a conspicuous gray smear on desktop and mobile. This is a real screenshot-quality defect caused by `backdrop-filter`, not a broken image.
- A nested `.coffee-cup` decorative element reports local overflow (`120px` content inside `95px`) but does not increase document width; review its intentional pseudo-element before deciding whether to change it.
- Zone's hero defect was fixed at the source by removing the owner strip's background blur, reserving a fixed clean art area, and using a nearly opaque cream owner surface. Follow-up screenshots show the full approved character art without the gray smear at 1600px, 1440px, and 390px.
- The coffee-cup overflow is the intentional CSS handle drawn by `::after`; it remains contained by the parent post image and requires no change.
- Fresh isolated runtime verification persisted and re-rendered a user text event, generated a Demo character reply, and stored `interaction.poke`, `interaction.transfer`, and `call.voice.end`; IndexedDB contained 11 events after reload.
- Post-repair browser screenshots confirm Messages and Profile render the repaired blond curly-haired `default.webp` avatar directly, while Channels renders the repaired dedicated `channel.webp` social illustration. No broken-image icon, black-haired character, Diary avatar fallback, or Zone channel fallback is visible.

