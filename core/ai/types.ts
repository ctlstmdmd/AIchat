import { z } from "zod";

export const aiProfileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  provider: z.literal("openai-compatible"),
  baseUrl: z.string().url(),
  apiKey: z.string().min(1, "API key is required."),
  model: z.string().min(1, "Model is required."),
  temperature: z.number().min(0).max(2),
  contextWindow: z.number().int().min(1).max(500),
  maxOutput: z.number().int().min(1).max(32768),
  streaming: z.boolean(),
  updatedAt: z.string(),
});

export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1),
});

export const chatRequestSchema = z.object({
  profile: aiProfileSchema,
  messages: z.array(chatMessageSchema).min(1).max(500),
});

export type ValidAIProfile = z.infer<typeof aiProfileSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export class ProviderError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message);
  }
}
