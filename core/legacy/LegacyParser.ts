import type { AppEvent } from "../events/types";

const now = () => new Date().toISOString();
const id = () => `legacy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const make = <T extends AppEvent>(event: T): T => event;
const text = (content: string, actorId: string): AppEvent => make({ id: id(), type: "message.text", actorId, payload: { content }, createdAt: now(), source: "legacy" });

export function parseLegacyOutput(raw: string): AppEvent[] {
  const events: AppEvent[] = [];
  const push = (event: AppEvent) => events.push(event);

  for (const match of raw.matchAll(/\[我方消息\|([\s\S]*?)\|([^|\]]+)\]/g)) push(text(match[1], "user"));
  for (const match of raw.matchAll(/\[(?!(?:我方消息|对方转账|user转账|对方已接收转账|对方已退还转账)\|)([^|\]]+)\|([^|\]]+)\|([\s\S]*?)\|([^|\]]+)\]/g)) push(text(match[3], match[1] || "character"));

  for (const match of raw.matchAll(/\[对方转账\|([^|]+)\|([^|]+)\|([^\]]*)\]/g)) {
    const amount = Number(match[2].replace(/[^\d.]/g, ""));
    push(make({ id: id(), type: "interaction.transfer", actorId: "character", payload: { amount: Number.isFinite(amount) ? amount : 0, currency: "CNY", note: match[3] || undefined }, createdAt: now(), source: "legacy" }));
  }
  for (const match of raw.matchAll(/\[user转账给([^:]+):([^|\]]+)(?:\|([^\]]*))?\]/g)) {
    const amount = Number(match[2].replace(/[^\d.]/g, ""));
    push(make({ id: id(), type: "interaction.transfer", actorId: "user", targetId: match[1], payload: { amount: Number.isFinite(amount) ? amount : 0, currency: "CNY", note: match[3] || undefined }, createdAt: now(), source: "legacy" }));
  }

  const diary = raw.match(/<日记>([\s\S]*?)<\/日记>/);
  if (diary) push(make({ id: id(), type: "diary.entry", actorId: "character", payload: { content: diary[1].trim() }, createdAt: now(), source: "legacy" }));
  if (raw.match(/<戳一戳>[\s\S]*?<\/戳一戳>/)) push(make({ id: id(), type: "interaction.poke", actorId: "character", payload: { content: raw.match(/<戳一戳>([\s\S]*?)<\/戳一戳>/)?.[1] }, createdAt: now(), source: "legacy" }));

  const voice = raw.match(/\[语音通话中\]\s*名字：(.*?)\s*头像：(.*?)\s*内心：\s*([\s\S]*?)\s*内容：\s*([\s\S]*?)\s*\[\/语音通话中\]/);
  if (voice) push(make({ id: id(), type: "call.voice.message", actorId: "character", payload: { content: voice[4] }, createdAt: now(), source: "legacy" }));
  const video = raw.match(/\[视频通话中\]\s*名字：(.*?)\s*头像：(.*?)\s*内容：\s*([\s\S]*?)\s*\[\/视频通话中\]/);
  if (video) push(make({ id: id(), type: "call.video.message", actorId: "character", payload: { content: video[3] }, createdAt: now(), source: "legacy" }));

  return events;
}
