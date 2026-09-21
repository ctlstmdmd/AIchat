import type { AppEvent, EventType } from "@/core/events/types";
import { validateEvent } from "@/core/events/types";
import { parseLegacyOutput } from "@/core/legacy/LegacyParser";

export function interpretResponse(raw: string): AppEvent[] {
  try {
    const parsed = JSON.parse(raw) as { events?: Array<{ type: EventType; content?: string; payload?: Record<string, unknown> }> };
    if (Array.isArray(parsed.events)) return parsed.events.flatMap((event, index) => {
      try {
        return [validateEvent({ id: `ai_${Date.now()}_${index}`, type: event.type, actorId: "character", payload: event.payload ?? { content: event.content ?? "" }, createdAt: new Date().toISOString(), source: "character" })];
      } catch { return []; }
    });
  } catch { /* Raw model output falls through to legacy compatibility. */ }
  return parseLegacyOutput(raw);
}
