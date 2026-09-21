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
| Approved `default.webp` / `channel.webp` failed image decoding | 1 | Their file headers are not RIFF/WebP while Zone/Diary are valid; inspect the approved source repository without generating replacements. |
| PowerShell `Get-Content -Encoding Byte` failed on PowerShell Core | 1 | Root cause: `Byte` is not a supported Core encoding; read exact bytes with `System.IO.File.ReadAllBytes`. |
| The stale local Next process returned 404 for the new routes | 1 | Verified its exact PID belonged to this workspace, stopped only that process, then restarted the current dev server on port 3001. |
| Codex computer-use helper could not create its Windows kernel assets | 2 | Stopped retrying per the skill guidance and used an isolated local Edge/CDP runtime check instead. |
| `Start-Process` with a remote-debugging Edge profile was blocked by execution policy | 1 | Replaced it with a temporary Node script using `child_process.spawn`, then removed the script after validation. |
| Runtime check initially targeted a nonexistent `.conversation-item` selector | 1 | Inspected the rendered component and corrected the one-off check to the existing `.conversation` control. |
| `/` returned 500 after running `next build` beside the dev server | 1 | The log showed a missing `.next` chunk caused by both processes writing the same cache; restarted dev and all routes returned 200. |

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

### Phase 2 constraints

- Continue from Foundation; do not replace the established event boundary or legacy parser.
- Prefer existing platform capabilities and the smallest implementation that meets the product flow.
- No realtime voice, WebRTC, Live2D, vector memory, character import, forum expansion, group-chat expansion, PWA, or advanced developer mode.
