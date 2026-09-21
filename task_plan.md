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

## Phase 2 — Portfolio Chat Experience

- [ ] A. Polish the shared desktop/mobile shell with unified design tokens
- [ ] B. Route text, poke, transfer, and call-record interactions through EventStore
- [ ] C. Add OpenAI-compatible profile settings, connection test, and streaming chat API
- [ ] D. Persist conversations, events, characters, and settings locally
- [ ] E. Build screenshot-ready Character Profile, Memories, and Zone views
- [ ] F. Seed a complete Demo Mode and support switching to Live AI Mode
- [ ] G. Validate typecheck, lint, build, routes, desktop, and mobile overflow

### Phase 2 constraints

- Continue from Foundation; do not replace the established event boundary or legacy parser.
- Prefer existing platform capabilities and the smallest implementation that meets the product flow.
- No realtime voice, WebRTC, Live2D, vector memory, character import, forum expansion, group-chat expansion, PWA, or advanced developer mode.
