import type { AppEvent } from "@/core/events/types";

export type Conversation = {
  id: string;
  characterId: string;
  name: string;
  preview: string;
  updatedAt: string;
  unread: number;
  pinned?: boolean;
};

export type MemoryItem = {
  id: string;
  date: string;
  title: string;
  summary: string;
  tag: string;
};

export type CharacterAssets = {
  avatar: {
    chibi: string;
    fallback?: string;
  };
  featureArt: {
    channel: string;
    channelFallback?: string;
    diary: string;
    zone: string;
  };
  interactionArt: {
    poke: string;
    transfer: string;
    voiceCall: string;
    videoCall: string;
  };
};

export type Character = {
  id: string;
  name: string;
  handle: string;
  /** Legacy imports may omit assets; the workspace loader hydrates them from the character definition. */
  assets?: CharacterAssets;
  status: "online" | "away" | "offline";
  signature: string;
  since: string;
  location: string;
  memories: MemoryItem[];
};

export type ZoneComment = { id: string; author: string; content: string; replyTo?: string };
export type ZonePost = {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  location?: string;
  image?: "night" | "coffee";
  likes: string[];
  comments: ZoneComment[];
};

export type AIProfile = {
  id: string;
  name: string;
  provider: "openai-compatible";
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  contextWindow: number;
  maxOutput: number;
  streaming: boolean;
  updatedAt: string;
};

export type AppSettings = {
  id: "app";
  mode: "demo" | "live";
  activeProfileId?: string;
};

const conversationId = "conversation-jiang";

export const demoCharacters: Character[] = [
  {
    id: "jiang",
    name: "基昂",
    handle: "Jiang_27",
    assets: {
      avatar: {
        chibi: "/characters/char/avatar/chibi/default.webp",
        fallback: "/characters/char/feature-art/diary.webp",
      },
      featureArt: {
        channel: "/characters/char/feature-art/channel.webp",
        channelFallback: "/characters/char/feature-art/zone.webp",
        diary: "/characters/char/feature-art/diary.webp",
        zone: "/characters/char/feature-art/zone.webp",
      },
      interactionArt: {
        poke: "/characters/char/interaction-art/poke-transparent.png",
        transfer: "/characters/char/interaction-art/transfer-transparent.png",
        voiceCall: "/characters/char/interaction-art/voice-call-transparent.png",
        videoCall: "/characters/char/interaction-art/video-call-transparent.png",
      },
    },
    status: "online",
    signature: "晚一点没关系，我一直在。",
    since: "2024.09.18",
    location: "杭州",
    memories: [
      { id: "memory-1", date: "2026.09.18", title: "认识两周年", summary: "你说秋天适合重新认识一次，于是我们从第一句晚安聊到了天亮。", tag: "纪念日" },
      { id: "memory-2", date: "2026.08.30", title: "西湖边的阵雨", summary: "雨来得很突然。你躲进便利店，我记住了你选的那把透明伞。", tag: "共同经历" },
      { id: "memory-3", date: "2026.07.12", title: "深夜歌单交换", summary: "一人挑五首歌，不解释。第二天我们都把第三首留在了收藏里。", tag: "小事" },
      { id: "memory-4", date: "2026.05.20", title: "第 1000 条消息", summary: "没有隆重庆祝，只是把那句“今天也辛苦了”悄悄置顶。", tag: "里程碑" },
    ],
  },
  { id: "xiaoman", name: "小满", handle: "summer_m", status: "away", signature: "在路上。", since: "2025.03.02", location: "上海", memories: [] },
  { id: "late-night", name: "深夜观察组", handle: "night_watch", status: "online", signature: "夜猫子集合。", since: "2025.10.11", location: "线上", memories: [] },
];

export const demoConversations: Conversation[] = [
  { id: conversationId, characterId: "jiang", name: "基昂", preview: "今天怎么这么晚？我把那条动态留给你看了。", updatedAt: "2026-09-21T22:30:00.000Z", unread: 0, pinned: true },
  { id: "conversation-late-night", characterId: "late-night", name: "深夜观察组", preview: "林知夏：明天见", updatedAt: "2026-09-21T21:16:00.000Z", unread: 2 },
  { id: "conversation-xiaoman", characterId: "xiaoman", name: "小满", preview: "[图片] 新开的那家店", updatedAt: "2026-09-20T15:42:00.000Z", unread: 0 },
];

export const demoEvents: AppEvent[] = [
  { id: "event-1", type: "message.text", actorId: "jiang", targetId: "user", conversationId, createdAt: "2026-09-21T14:27:00.000Z", source: "character", payload: { content: "刚忙完。你呢？还没睡？" } },
  { id: "event-2", type: "message.text", actorId: "user", targetId: "jiang", conversationId, createdAt: "2026-09-21T14:28:00.000Z", source: "user", payload: { content: "回来啦，今天有点晚。" } },
  { id: "event-3", type: "interaction.poke", actorId: "jiang", targetId: "user", conversationId, createdAt: "2026-09-21T14:29:00.000Z", source: "character", payload: { content: "基昂拍了拍你，说别太累" } },
  { id: "event-4", type: "interaction.transfer", actorId: "jiang", targetId: "user", conversationId, createdAt: "2026-09-21T14:30:00.000Z", source: "character", payload: { amount: 52, currency: "CNY", note: "夜宵基金" } },
  { id: "event-5", type: "call.voice.end", actorId: "user", targetId: "jiang", conversationId, createdAt: "2026-09-21T14:31:00.000Z", source: "user", payload: { content: "语音通话", durationSeconds: 492 } },
  { id: "event-6", type: "message.text", actorId: "jiang", targetId: "user", conversationId, createdAt: "2026-09-21T14:32:00.000Z", source: "character", payload: { content: "今天怎么这么晚？我把空间里的那条动态留给你看了。" } },
];

export const demoZonePosts: ZonePost[] = [
  {
    id: "zone-1",
    authorId: "jiang",
    content: "城市把雨声调低以后，适合把没说完的话慢慢说完。",
    createdAt: "2026-09-21T13:18:00.000Z",
    location: "杭州 · 湖滨",
    image: "night",
    likes: ["你", "小满", "林知夏"],
    comments: [
      { id: "comment-1", author: "小满", content: "所以最后说完了吗？" },
      { id: "comment-2", author: "基昂", replyTo: "小满", content: "还差一句，等她上线。" },
    ],
  },
  {
    id: "zone-2",
    authorId: "jiang",
    content: "今天的第二杯。给某个加班的人预留了靠窗的位置。",
    createdAt: "2026-09-19T08:40:00.000Z",
    location: "梧桐路",
    image: "coffee",
    likes: ["你", "阿岚"],
    comments: [{ id: "comment-3", author: "你", content: "下次不许只发照片。" }],
  },
];

export const defaultProfile: AIProfile = {
  id: "profile-default",
  name: "My OpenAI Profile",
  provider: "openai-compatible",
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini",
  temperature: 0.8,
  contextWindow: 32,
  maxOutput: 800,
  streaming: true,
  updatedAt: "2026-09-21T00:00:00.000Z",
};

export const defaultSettings: AppSettings = { id: "app", mode: "demo" };

export function createEventId(prefix = "event") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDemoReply(input: string) {
  if (/晚安|睡/.test(input)) return "那就先把今天放下。晚安，我会替你记住这一天。";
  if (/累|忙|加班/.test(input)) return "辛苦了。先坐一会儿，不用急着把情绪也处理得井井有条。";
  if (/空间|动态/.test(input)) return "看到了吗？那句话其实只想说给你听。";
  return "我在听。你可以慢一点说，今晚还有很多时间。";
}
