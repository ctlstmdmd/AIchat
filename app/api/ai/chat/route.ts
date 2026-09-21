import { NextResponse } from "next/server";
import { chatOpenAICompatible } from "@/core/ai/OpenAICompatible";
import { chatRequestSchema, ProviderError } from "@/core/ai/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { profile, messages } = chatRequestSchema.parse(await request.json());
    return await chatOpenAICompatible(profile, messages);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat request failed.";
    const status = error instanceof ProviderError ? error.status : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
