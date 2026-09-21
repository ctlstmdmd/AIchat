import { NextResponse } from "next/server";
import { aiProfileSchema, ProviderError } from "@/core/ai/types";
import { testOpenAIConnection } from "@/core/ai/OpenAICompatible";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const profile = aiProfileSchema.parse(await request.json());
    return NextResponse.json(await testOpenAIConnection(profile));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection test failed.";
    const status = error instanceof ProviderError ? error.status : 400;
    return NextResponse.json({ ok: false, message }, { status });
  }
}
