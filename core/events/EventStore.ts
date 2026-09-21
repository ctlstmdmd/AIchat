import type { AppEvent } from "./types";
import { validateEvent } from "./types";

export interface EventStore { append(event: AppEvent): Promise<void>; list(query?: { conversationId?: string; type?: AppEvent["type"] }): Promise<AppEvent[]>; }

export class MemoryEventStore implements EventStore {
  private readonly events: AppEvent[] = [];
  async append(event: AppEvent) { this.events.push(validateEvent(event)); }
  async list(query: { conversationId?: string; type?: AppEvent["type"] } = {}) { return this.events.filter((event) => (!query.conversationId || event.conversationId === query.conversationId) && (!query.type || event.type === query.type)); }
}
