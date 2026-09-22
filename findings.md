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

## 2026-09-22 — Scoped Channels topic-card enhancement

- The current Channels hero is already screenshot-ready and must remain structurally unchanged; only the three `<article>` elements inside `.topic-grid` are in scope.
- Each topic card currently shares identical minimal markup and styling, so the three themes read as plain text cards despite already having useful copy and metadata.
- The existing Next.js/React stack and global CSS are sufficient; native CSS pseudo-elements and the existing `Icon` primitive avoid new dependencies or duplicate assets.
- The existing design system caps decorative density at 0–1 accent per small card. The chosen direction combines low-complexity editorial hierarchy with restrained dimensional layering, while retaining the established warm tokens instead of the search result's generic black/white palette.
- UI guidance emphasizes a 3→1 responsive grid, reserved decorative space, visible hierarchy, reduced-motion support, and no horizontal scrolling.
- The 1600px baseline confirms the hero is already strong, while the three equal white cards have no visual anchor beyond a small category chip; their lower half is visually sparse and the themes are not recognizable without reading.
- Headless Edge on this host can return before its screenshot file is flushed. The initial missing-file report was a timing artifact; polling the resolved output path is required for reliable captures.
- Post-implementation desktop captures at 1600px and 1440px show a clear movie-strip/ticket, analog record/archive label, and ruled daily-note treatment. The hero remains visually unchanged and all three cards stay within the shared warm product language.
- The first nominal 390px capture appeared to clip the movie visual, but CDP metrics identified a capture artifact: headless Edge enforced a 518px layout viewport and then cropped the bitmap to 390px.
- A true 390×844 device-emulated capture reports document `scrollWidth === clientWidth === 390`; `.topic-grid` spans 12–378px, the movie card spans 12–378px, and its visual spans 31–359px. The mobile layout has no horizontal overflow and keeps the film ticket inside the rounded card.
- Additional 390px scrolled captures confirm the vinyl/archive label and the ruled memo/star treatment remain legible, contained, and visually distinct in the one-column layout; metadata stays aligned at each card's lower edge.

## 2026-09-22 — Phase 5 interaction showcase

- Local `HEAD` is `8e8113a` with the completed Channels card work still uncommitted; that work must be preserved throughout this phase.
- `origin/main` is three commits ahead and differs from local `HEAD` only by four approved assets: `poke.webp`, `transfer.webp`, `voice-call.webp`, and `video-call.webp` under `public/characters/char/interaction-art/`.
- The remote assets are not referenced anywhere in the current remote or local application code; the commits only preserve/add the files.
- Current special-event UI is functional but intentionally basic: poke is a text pill, transfer is a yellow wallet card, voice call only inserts an ended-call record, and the video button has no handler. No call overlay exists.
- The event schema already supports both `call.voice.end` and `call.video.end`, so high-fidelity call demos need no schema expansion.
- The smallest accessible call architecture is a native modal `<dialog>` owned by one `ActiveCall` state. Native modality supplies focus containment and Escape semantics without a dialog dependency; labeled buttons and visible focus remain required.
- UI guidance supports restrained glass for overlays but warns against excessive blur. Phase 5 will keep content on opaque-enough cream surfaces, use existing focus rings, and respect the global reduced-motion rule.
- `git pull --ff-only origin main` fast-forwarded from `8e8113a` to `b528f01` without touching any uncommitted Channels or planning change.
- All four interaction files have valid RIFF/WEBP signatures and decode as the approved blond curly-haired character: a horizontal poke pose, coin/phone transfer pose, seated phone voice-call pose, and seated peace-sign video-call pose.
- Asset sizes are intentionally compact: poke 7,292 bytes, transfer 10,106 bytes, voice 11,312 bytes, and video 12,562 bytes.
- Runtime screenshot review confirms the dedicated transfer artwork reads clearly inside the amount/details card, while the ultra-wide poke artwork needs a full-width banner region rather than a narrow thumbnail.
- At 390px, the first poke banner rendered as a 2px line because the column flex container was shrinking the otherwise valid child content. Adding `flex: 0 0 auto` to the card fixes the root cause; its measured size is now about 338×123px.
- Native `<dialog>` provides a clean modal boundary for both call modes. Programmatically focusing the dialog itself avoids an unwanted initial control outline while preserving keyboard focus indicators when a user tabs into the controls.
- Fresh CDP checks at 1600px and an emulated 390×844 viewport show no document-level horizontal overflow. Voice and video artwork decode correctly, the video self-preview remains contained, and all four interaction-menu actions fit at 390px.
- After ending one voice and one video call, a hard reload restored the seeded poke/transfer plus two voice records and one video record from IndexedDB, confirming the new UI still uses the established event/persistence path.

## 2026-09-22 — Transparent interaction artwork repair

- The live transfer reference is not hardcoded in the card: `EventItem` reads `character.assets.interactionArt.transfer`, whose canonical default is `/characters/char/interaction-art/transfer.webp` in `stores/demoData.ts`.
- `LocalDatabase.loadWorkspace()` merges the canonical nested `interactionArt` defaults into older IndexedDB Character records, so the observed black background is not caused by a missing legacy path or a fallback override.
- Poke, transfer, voice-call, and video-call use their four matching dedicated files. Fallbacks point only to the approved chibi/Diary assets and run on load failure; no screenshot showed fallback use.
- The repository and full Git history contain no alternate transparent interaction filenames. The only unrelated legacy portrait is `public/assets/jiang-avatar.png`, and no current component references it.
- ImageMagick is not installed, so alpha verification will use the browser's own decoder/canvas against the exact served asset responses; this also checks the cache/request layer that users actually see.
- Browser canvas decoded the exact served files with cache disabled. All four interaction WebPs have zero transparent or semi-transparent pixels; opaque-black coverage is 51.39% for poke, 46.34% for transfer, 34.62% for voice-call, and 31.52% for video-call. Every corner is opaque black.
- The approved default, Diary, Zone, and Channel assets are also flattened/opaque, but their corners are clean white and they contribute no visible black blocks. This repair will change only the four confirmed black-background interaction assets.
- Direct visual inspection confirms the four black-background files contain the approved blond curly-haired character and the intended poses. Background extraction must preserve every character/detail pixel, pose, expression, accessory, and crop while removing only the black backdrop.
- A built-in background-extraction trial on `transfer.webp` created a new 1280px rendering and changed foreground details despite explicit preservation constraints. It is not acceptable for this identity-sensitive repair and was not copied into the workspace.
- A read-only shallow clone of the approved `ctlstmdmd/qqfriend` source at commit `094e531e...` contains only the canonical avatar, Diary, Zone, Channel, UI icons, and decorations. It has no interaction-art directory, transparent PNG originals, or alternate transfer/poke/call assets to reuse.
- UI guidance searches returned no verified sticker-specific match, so this repair follows the existing product rules: preserve intrinsic proportions, reserve layout space, use no new dependency, and verify the transparent result against the actual warm surfaces at desktop and mobile widths.
- A deterministic edge-connected extraction at RGB max ≤32 preserves the original 320×320 transfer pixels and internal black clothing/linework while making 49,451 background pixels transparent. A warm-surface composite proves the hard black rectangle is gone.
- The first deterministic test still shows a few dark WebP compression speckles around the silhouette. A slightly wider connected-background tolerance should be tested before accepting the final asset; the tolerance must remain edge-connected so black foreground interiors are not globally removed.
- Tolerance trials at 40 and 56 prove the upper bound: 40 begins opening holes in the black trousers, and 56 visibly erodes large foreground regions. The 32 threshold is the identity-preserving choice; at actual card scale its retained dark outline reads as normal line art rather than a rectangular matte.
- Applying the 32 edge-connected threshold to all four images produces transparent PNGs at the original dimensions: poke 420×140, and transfer/voice/video 320×320. A warm-background contact sheet shows the black rectangles are removed while poses, expressions, accessories, black clothing, and colored effects remain intact.
- Existing IndexedDB demo-character records can retain the old `.webp` paths. The prior nested merge placed persisted `interactionArt` after defaults, so stale paths would override newly configured transparent assets. The repair must prefer current canonical defaults for this four-field presentation mapping while leaving conversations, events, and other character data untouched.
- The final source mapping uses sibling `*-transparent.png` assets, and `LocalDatabase` now applies those four canonical presentation paths after stale persisted entries. A cache-bypassing reload proves the live Messages DOM requests `poke-transparent.png` and `transfer-transparent.png` rather than the old WebPs.
- Direct served-file audit confirms every active PNG returns HTTP 200 as `image/png`, keeps original dimensions, has transparent corners, and contains no opaque black background rectangle. The remaining opaque black pixels are interior character linework/clothing, not edge-connected backdrop.
- Fresh desktop screenshots show clean sticker-like poke/transfer cards and a transparent voice-call illustration. Fresh video-call screenshots at 1600px and true 390×844 show the transparent character against the intentional warm dialog backgrounds, no black box, and no horizontal overflow (`scrollWidth === innerWidth`).
- A final cache-bypassing Messages capture at a true 390×844 viewport requests `poke-transparent.png` and `transfer-transparent.png` from Next Image, shows both against their intended warm card surfaces without a matte, and reports `scrollWidth === innerWidth === 390`.

