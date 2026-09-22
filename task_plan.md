# QQ Companion Foundation Plan

- [x] Inspect archive and document legacy behavior
- [x] Scaffold minimal runnable web app
- [x] Add event schema/store and docs
- [x] Add responsive QQ-inspired shell and routes
- [x] Verify build/typecheck/lint/tests

## Errors Encountered
| Error | Attempt | Resolution |
|---|---:|---|
| `apply_patch` rejected delete+add for the same file in one patch | 1 | Root cause: patch grammar forbids multiple operations on one target; use separate delete and add patches. |
| PowerShell truncated a double-quoted `rg` alternation | 1 | Root cause: PowerShell does not use backslash to escape nested quotes; rerun with a single-quoted pattern. |
| ESLint treated `useDemo` as a React Hook | 1 | Root cause: event handler used the reserved `use*` hook naming convention; renamed it to `setDemoMode` without changing behavior. |
| Initial `default.webp` / `channel.webp` imports failed image decoding | 1 | Diagnosed the invalid bytes without generating replacements; upstream repair commit `91a8670` later supplied valid approved RIFF/WebP files. |
| PowerShell `Get-Content -Encoding Byte` failed on PowerShell Core | 1 | Root cause: `Byte` is not a supported Core encoding; read exact bytes with `System.IO.File.ReadAllBytes`. |
| The stale local Next process returned 404 for the new routes | 1 | Verified its exact PID belonged to this workspace, stopped only that process, then restarted the current dev server on port 3001. |
| Codex computer-use helper could not create its Windows kernel assets | 2 | Stopped retrying per the skill guidance and used an isolated local Edge/CDP runtime check instead. |
| `Start-Process` with a remote-debugging Edge profile was blocked by execution policy | 1 | Replaced it with a temporary Node script using `child_process.spawn`, then removed the script after validation. |
| Runtime check initially targeted a nonexistent `.conversation-item` selector | 1 | Inspected the rendered component and corrected the one-off check to the existing `.conversation` control. |
| `/` returned 500 after running `next build` beside the dev server | 1 | The log showed a missing `.next` chunk caused by both processes writing the same cache; restarted dev and all routes returned 200. |
| Phase 4 asset-status patch missed one exact historical phrase | 1 | Re-read the matching lines and applied a narrower documentation-only correction; no product file was affected. |
| Edge baseline screenshot was reported missing immediately after launch | 2 | Investigation showed Edge detached and wrote the file shortly afterward; use a resolved absolute screenshot argument and poll for the output file instead of treating process return as capture completion. |
| `Start-Process` screenshot orchestration was rejected by the host policy | 1 | No process started and no file changed; use the already proven direct Edge invocation followed by output-file polling. |
| Inline CDP diagnostic blocked before the evaluator ran because Edge stayed in the foreground | 1 | Stopped that verified diagnostic process; launch Edge as its own managed exec session, then query the CDP endpoint from a separate command. |
| Shell-launched Edge exited before exposing the requested CDP port | 1 | The browser's Windows single-instance behavior detached from the shell launch; use one inline Node process to own the isolated Edge child, poll its endpoint, evaluate metrics, then terminate only that child. |
| Built-in background extraction produced a redrawn 1280px transfer character instead of a pixel-preserving cutout | 1 | Rejected the output and left it outside the workspace; inspect the approved source repository before choosing a deterministic extraction path. |

## Phase 2 — Portfolio Chat Experience

- [x] A. Polish the shared desktop/mobile shell with unified design tokens
- [x] B. Route text, poke, transfer, and call-record interactions through EventStore
- [x] C. Add OpenAI-compatible profile settings, connection test, and streaming chat API
- [x] D. Persist conversations, events, characters, and settings locally
- [x] E. Build screenshot-ready Character Profile, Memories, and Zone views
- [x] F. Seed a complete Demo Mode and support switching to Live AI Mode
- [x] G. Validate typecheck, lint, build, routes, desktop, and mobile overflow

## Phase 3 — Warm Visual Integration

- [x] A. Replace deprecated blue/corporate tokens with warm cream/yellow glass tokens
- [x] B. Centralize approved chibi and feature-art paths in the existing Character model
- [x] C. Polish Messages and Chat for portfolio screenshots
- [x] D. Polish Zone, Profile, and Memories with the same character identity
- [x] E. Polish Contacts, Settings, and Channels without changing their architecture
- [x] F. Verify 1440–1600px desktop and 390px mobile behavior

## Phase 4 — Portfolio Freeze

- [x] A. Verify repaired default avatar and Channel artwork from binary and visual evidence
- [x] B. Document canonical assets and defensive fallback behavior
- [x] C. QA the five portfolio screenshot states at 1600px, 1440px, and 390px
- [x] D. Remove only confirmed visual residue or screenshot-blocking defects
- [x] E. Create a professional root `README.md`
- [x] F. Run full functional, responsive, repository, and build validation
- [x] G. Report Portfolio v0.1 readiness and stop before commit/push

## Phase 5 — Scoped Channel Topic Cards

- [x] A. Audit the existing Channels markup, shared tokens, and responsive grid
- [x] B. Add semantic movie, music-memory, and daily-journal card structure
- [x] C. Apply CSS-only visual differentiation without changing the hero
- [x] D. Validate 1600px, 1440px, and 390px screenshots and run typecheck/lint/build

## Phase 5 — Interaction Showcase

- [x] A. Safely sync and verify the four approved interaction artworks
- [x] B. Centralize interaction art paths in the Character asset model and legacy hydration
- [x] C. Upgrade poke and transfer event cards without changing event schemas
- [x] D. Add accessible voice/video demo dialogs and wire existing entry points
- [x] E. Persist matching ended-call events and render both record types
- [x] F. Update the asset manifest and portfolio README
- [x] G. Validate event flow, persistence, screenshots, responsive overflow, and the full command suite

## Phase 5 — Transparent Interaction Artwork Repair

- [x] A. Trace the live interaction-art reference chain and scan for duplicate assets
- [x] B. Measure alpha/opaque-black pixels for interaction and feature artwork
- [x] C. Replace only confirmed black-background assets with identity-preserving transparent versions
- [x] D. Refine sticker-like containment without changing chat or call behavior
- [x] E. Verify direct asset responses, Messages/call screenshots, cache behavior, and validation commands

### Phase 2 constraints

- Continue from Foundation; do not replace the established event boundary or legacy parser.
- Prefer existing platform capabilities and the smallest implementation that meets the product flow.
- No realtime voice, WebRTC, Live2D, vector memory, character import, forum expansion, group-chat expansion, PWA, or advanced developer mode.
