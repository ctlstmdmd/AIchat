import type { ChatMessage, ValidAIProfile } from "@/core/ai/types";
import { ProviderError } from "@/core/ai/types";

function endpoint(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, "")}/${path}`;
}

function headers(profile: ValidAIProfile) {
  return { Authorization: `Bearer ${profile.apiKey}`, "Content-Type": "application/json" };
}

async function readProviderError(response: Response) {
  try {
    const body = await response.json() as { error?: { message?: string }; message?: string };
    return body.error?.message ?? body.message ?? `Provider returned ${response.status}.`;
  } catch {
    return `Provider returned ${response.status}.`;
  }
}

export async function testOpenAIConnection(profile: ValidAIProfile) {
  const response = await fetch(endpoint(profile.baseUrl, "models"), {
    method: "GET",
    headers: headers(profile),
    cache: "no-store",
  });
  if (!response.ok) throw new ProviderError(await readProviderError(response), response.status);
  return { ok: true, message: `Connected to ${new URL(profile.baseUrl).host}.` };
}

function trimContext(messages: ChatMessage[], contextWindow: number) {
  const system = messages.find((message) => message.role === "system");
  const dialogue = messages.filter((message) => message.role !== "system").slice(-contextWindow);
  return system ? [system, ...dialogue] : dialogue;
}

export async function chatOpenAICompatible(profile: ValidAIProfile, messages: ChatMessage[]) {
  const response = await fetch(endpoint(profile.baseUrl, "chat/completions"), {
    method: "POST",
    headers: headers(profile),
    body: JSON.stringify({
      model: profile.model,
      messages: trimContext(messages, profile.contextWindow),
      temperature: profile.temperature,
      max_tokens: profile.maxOutput,
      stream: profile.streaming,
    }),
  });
  if (!response.ok) throw new ProviderError(await readProviderError(response), response.status);

  if (!profile.streaming) {
    const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = body.choices?.[0]?.message?.content;
    if (!content) throw new ProviderError("The provider returned an empty response.");
    return new Response(content, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  if (!response.body) throw new ProviderError("The provider did not return a response stream.");
  const upstream = response.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let pending = "";

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await upstream.read();
      if (done) {
        if (pending.trim()) parseLines(pending, controller, encoder);
        controller.close();
        return;
      }
      pending += decoder.decode(value, { stream: true });
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() ?? "";
      parseLines(lines.join("\n"), controller, encoder);
    },
    cancel() { void upstream.cancel(); },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

function parseLines(source: string, controller: ReadableStreamDefaultController<Uint8Array>, encoder: TextEncoder) {
  for (const line of source.split(/\r?\n/)) {
    const value = line.trim();
    if (!value.startsWith("data:")) continue;
    const data = value.slice(5).trim();
    if (!data || data === "[DONE]") continue;
    try {
      const chunk = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) controller.enqueue(encoder.encode(content));
    } catch { /* Ignore provider keep-alives and non-content SSE frames. */ }
  }
}
