# Event Schema

Every cross-module interaction is an `AppEvent` with a discriminated `type`. The runtime validates events with Zod at the store boundary.

Supported event types include message text/image/sticker/voice/location, poke and transfer, voice/video call lifecycle, zone post/like/comment, diary entry, forum post/comment, memory creation, and status changes.

Required envelope fields are `id`, `type`, `actorId`, `payload`, `createdAt`, and `source`. Optional fields are `targetId`, `conversationId`, and `memoryWeight` (0..1). `createdAt` is an ISO datetime and `payload` is intentionally open per event type while the concrete event payloads are progressively tightened.

Event rules:

1. User-facing controls dispatch events; they do not call an AI provider.
2. The store is the durable hand-off point for chat, Zone, calls, diary, and memory.
3. Character context receives relevant events through a retrieval layer, not by reading UI state.
4. Legacy output enters through `LegacyParser` with `source: "legacy"`.
