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

