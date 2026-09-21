# AI Provider Boundary

The first live integration will expose `POST /api/ai/test`, `GET /api/ai/models`, and `POST /api/ai/chat`. The browser will send a profile id and conversation context to the server route; a provider adapter will own authentication, streaming, and vendor-specific request formats.

The intended interface is:

```ts
interface LLMProvider {
  testConnection(): Promise<boolean>;
  listModels?(): Promise<Model[]>;
  chat(request: ChatRequest): AsyncIterable<ChatChunk>;
}
```

OpenAI Compatible is the first adapter. Anthropic and Gemini remain reserved. API keys must stay server-side for portfolio mode; BYOK is session-only by default and must never be synced to a public database. No provider call is made in this phase.
