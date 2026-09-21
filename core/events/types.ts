import { z } from "zod";

const base = {
  id: z.string().min(1),
  actorId: z.string().min(1),
  targetId: z.string().min(1).optional(),
  conversationId: z.string().min(1).optional(),
  createdAt: z.string().datetime(),
  source: z.enum(["user", "character", "system", "legacy"]),
  memoryWeight: z.number().min(0).max(1).optional(),
};

const textPayload = z.object({ content: z.string() });
const mediaPayload = z.object({ url: z.string().optional(), caption: z.string().optional(), content: z.string().optional() });
const transferPayload = z.object({ amount: z.number().nonnegative(), currency: z.string().default("CNY"), note: z.string().optional() });
const callPayload = z.object({ content: z.string().optional(), durationSeconds: z.number().int().nonnegative().optional() });
const socialPayload = z.object({ content: z.string().optional(), postId: z.string().optional(), commentId: z.string().optional() });

export const appEventSchema = z.discriminatedUnion("type", [
  z.object({ ...base, type: z.literal("message.text"), payload: textPayload }),
  z.object({ ...base, type: z.literal("message.image"), payload: mediaPayload }),
  z.object({ ...base, type: z.literal("message.sticker"), payload: mediaPayload }),
  z.object({ ...base, type: z.literal("message.voice"), payload: callPayload }),
  z.object({ ...base, type: z.literal("message.location"), payload: z.object({ name: z.string(), latitude: z.number().optional(), longitude: z.number().optional() }) }),
  z.object({ ...base, type: z.literal("interaction.poke"), payload: z.object({ content: z.string().optional() }) }),
  z.object({ ...base, type: z.literal("interaction.transfer"), payload: transferPayload }),
  z.object({ ...base, type: z.literal("call.voice.start"), payload: callPayload }),
  z.object({ ...base, type: z.literal("call.voice.message"), payload: callPayload }),
  z.object({ ...base, type: z.literal("call.voice.end"), payload: callPayload }),
  z.object({ ...base, type: z.literal("call.video.start"), payload: callPayload }),
  z.object({ ...base, type: z.literal("call.video.message"), payload: callPayload }),
  z.object({ ...base, type: z.literal("call.video.end"), payload: callPayload }),
  z.object({ ...base, type: z.literal("zone.post"), payload: socialPayload }),
  z.object({ ...base, type: z.literal("zone.like"), payload: socialPayload }),
  z.object({ ...base, type: z.literal("zone.comment"), payload: socialPayload }),
  z.object({ ...base, type: z.literal("diary.entry"), payload: z.object({ content: z.string(), date: z.string().optional(), mood: z.string().optional(), weather: z.string().optional() }) }),
  z.object({ ...base, type: z.literal("forum.post"), payload: socialPayload }),
  z.object({ ...base, type: z.literal("forum.comment"), payload: socialPayload }),
  z.object({ ...base, type: z.literal("memory.created"), payload: z.object({ content: z.string(), category: z.string().optional() }) }),
  z.object({ ...base, type: z.literal("status.changed"), payload: z.object({ status: z.string(), label: z.string().optional() }) }),
]);

export type AppEvent = z.infer<typeof appEventSchema>;
export type EventType = AppEvent["type"];
export type EventSource = AppEvent["source"];

export function validateEvent(input: unknown): AppEvent {
  return appEventSchema.parse(input);
}
