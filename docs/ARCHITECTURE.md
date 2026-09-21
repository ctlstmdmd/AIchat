# QQ Companion Architecture

QQ Companion is a social shell around a persistent character runtime. UI components dispatch intent; the event store is the shared source of truth; the AI gateway later consumes events and emits new events.

```text
React shell
  -> AppEvent validation
  -> EventStore (memory now, IndexedDB/Dexie later)
  -> prompt + memory context
  -> /api/ai/chat (provider adapters)
  -> ResponseInterpreter
  -> AppEvent[]
```

The current scaffold intentionally has no live model call. `MemoryEventStore`, `LegacyParser`, and `ResponseInterpreter` establish the seams for the next phase while mock data keeps the first screen demonstrable.

## Boundaries

- `components/`: presentation and user intent only.
- `core/events/`: event contracts and persistence interface.
- `core/legacy/`: compatibility parsing for SillyTavern output.
- `core/ai/`: model response interpretation; provider adapters will be added behind an API route.
- `stores/`: local demo state, independent of character definitions.
- `characters/`: reserved for importable packages; no character is hard-coded into a component API.
