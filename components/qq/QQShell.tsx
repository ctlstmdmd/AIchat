"use client";

/* eslint-disable @next/next/no-img-element -- tiny local SVG decoration; character/media assets use next/image. */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AppEvent } from "@/core/events/types";
import { BrowserEventStore } from "@/core/events/EventStore";
import { loadWorkspace, saveConversation, saveProfile, saveSetting, seedDemoWorkspace } from "@/core/persistence/LocalDatabase";
import {
  createEventId, defaultProfile, defaultSettings, demoCharacters, demoConversations, demoZonePosts, getDemoReply,
  type AIProfile, type AppSettings, type Character, type Conversation, type ZonePost,
} from "@/stores/demoData";
import { Icon, type IconName } from "@/components/qq/Icon";

type View = "messages" | "contacts" | "zone" | "channels" | "profile" | "memories" | "settings";
type Workspace = Awaited<ReturnType<typeof loadWorkspace>>;

const navItems: Array<{ id: View; label: string; icon: IconName; href: string; asset?: string }> = [
  { id: "messages", label: "消息", icon: "message", href: "/messages", asset: "/ui/icons/nav/message.svg" },
  { id: "contacts", label: "联系人", icon: "contacts", href: "/contacts", asset: "/ui/icons/nav/contacts.svg" },
  { id: "zone", label: "空间", icon: "zone", href: "/zone", asset: "/ui/icons/nav/zone.svg" },
  { id: "channels", label: "频道", icon: "channel", href: "/channels", asset: "/ui/icons/nav/channel.svg" },
  { id: "memories", label: "回忆", icon: "memory", href: "/memories" },
  { id: "profile", label: "资料", icon: "user", href: "/profile" },
];

export function QQShell({ initialView = "messages" }: { initialView?: View }) {
  const router = useRouter();
  const store = useMemo(() => new BrowserEventStore(), []);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [selectedId, setSelectedId] = useState(demoConversations[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    let active = true;
    void seedDemoWorkspace().then(loadWorkspace).then((data) => active && setWorkspace(data)).catch(() => active && setNotice("本地数据加载失败，请刷新后重试。"));
    return () => { active = false; };
  }, []);

  const conversations = workspace?.conversations ?? demoConversations;
  const characters = workspace?.characters ?? demoCharacters;
  const character = characters.find((item) => item.id === "jiang") ?? demoCharacters[0];
  const selectedConversation = conversations.find((item) => item.id === selectedId) ?? conversations[0];
  const selectedCharacter = characters.find((item) => item.id === selectedConversation?.characterId) ?? character;
  const visibleEvents = (workspace?.events ?? []).filter((event) => event.conversationId === selectedId);
  const filteredConversations = conversations.filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()));
  const settings = workspace?.settings ?? defaultSettings;
  const profile = workspace?.profile ?? defaultProfile;
  const zonePosts = workspace?.zonePosts ?? demoZonePosts;

  async function appendEvent(event: AppEvent) {
    await store.append(event);
    setWorkspace((current) => current ? { ...current, events: [...current.events, event].sort((a, b) => a.createdAt.localeCompare(b.createdAt)) } : current);
  }

  async function updateConversation(content: string, actor: "user" | "character") {
    if (!selectedConversation) return;
    const next = { ...selectedConversation, preview: actor === "user" ? `你：${content}` : content, updatedAt: new Date().toISOString(), unread: 0 };
    await saveConversation(next);
    setWorkspace((current) => current ? { ...current, conversations: [next, ...current.conversations.filter((item) => item.id !== next.id)] } : current);
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || sending || !selectedConversation) return;
    setDraft("");
    setNotice(undefined);
    setSending(true);
    const userEvent: AppEvent = {
      id: createEventId(), type: "message.text", actorId: "user", targetId: selectedConversation.characterId,
      conversationId: selectedConversation.id, createdAt: new Date().toISOString(), source: "user", payload: { content },
    };
    try {
      await appendEvent(userEvent);
      await updateConversation(content, "user");
      if (settings.mode === "live") await streamLiveReply([...visibleEvents, userEvent], profile, selectedConversation);
      else {
        await new Promise((resolve) => window.setTimeout(resolve, 680));
        await appendCharacterMessage(getDemoReply(content), selectedConversation);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "消息发送失败，请稍后重试。");
    } finally {
      setSending(false);
      setStreamingText("");
    }
  }

  async function appendCharacterMessage(content: string, conversation: Conversation) {
    const replyEvent: AppEvent = {
      id: createEventId(), type: "message.text", actorId: conversation.characterId, targetId: "user",
      conversationId: conversation.id, createdAt: new Date().toISOString(), source: "character", payload: { content }, memoryWeight: 0.45,
    };
    await appendEvent(replyEvent);
    await updateConversation(content, "character");
  }

  async function streamLiveReply(events: AppEvent[], activeProfile: AIProfile, conversation: Conversation) {
    if (!activeProfile.apiKey) throw new Error("Live AI 模式尚未配置 API Key，请先前往设置。");
    const messages = [
      { role: "system" as const, content: `你是 ${selectedCharacter.name}。保持自然、克制、亲近的中文聊天语气，每次回复不超过三段。` },
      ...events.filter((item): item is Extract<AppEvent, { type: "message.text" }> => item.type === "message.text").map((item) => ({
        role: item.source === "user" ? "user" as const : "assistant" as const,
        content: item.payload.content,
      })),
    ];
    const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: activeProfile, messages }) });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "AI 服务请求失败。" })) as { error?: string };
      throw new Error(error.error ?? "AI 服务请求失败。");
    }
    if (!response.body) throw new Error("AI 服务没有返回可读取的内容。");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let complete = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      complete += decoder.decode(value, { stream: true });
      setStreamingText(complete);
    }
    complete += decoder.decode();
    if (!complete.trim()) throw new Error("AI 服务返回了空内容。");
    await appendCharacterMessage(complete.trim(), conversation);
  }

  async function addSpecialEvent(type: "interaction.poke" | "interaction.transfer" | "call.voice.end") {
    if (!selectedConversation) return;
    const shared = { id: createEventId(), actorId: "user", targetId: selectedConversation.characterId, conversationId: selectedConversation.id, createdAt: new Date().toISOString(), source: "user" as const };
    const event: AppEvent = type === "interaction.poke"
      ? { ...shared, type, payload: { content: `你拍了拍${selectedCharacter.name}` } }
      : type === "interaction.transfer"
        ? { ...shared, type, payload: { amount: 52, currency: "CNY", note: "请你喝咖啡" } }
        : { ...shared, type, payload: { content: "语音通话", durationSeconds: 128 } };
    await appendEvent(event);
    await updateConversation(type === "interaction.poke" ? `[拍一拍] 你拍了拍${selectedCharacter.name}` : type === "interaction.transfer" ? "[转账] ¥52.00" : "[通话] 02:08", "user");
    setActionMenu(false);
    setNotice(type === "call.voice.end" ? "已添加一条演示通话记录" : undefined);
  }

  async function updateSettings(next: AppSettings, nextProfile?: AIProfile) {
    await saveSetting(next);
    if (nextProfile) await saveProfile(nextProfile);
    setWorkspace((current) => current ? { ...current, settings: next, profile: nextProfile ?? current.profile } : current);
  }

  return <div className={`app-shell ${chatOpen ? "mobile-chat-open" : ""}`}>
    <Rail current={initialView} mode={settings.mode} />
    {initialView === "messages"
      ? <ConversationPane conversations={filteredConversations} selectedId={selectedId} search={search} onSearch={setSearch} onSelect={(id) => { setSelectedId(id); setChatOpen(true); }} characters={characters} />
      : <SectionPane view={initialView} character={character} />}
    <main className="main">
      {initialView === "messages" && selectedConversation
        ? <ChatView conversation={selectedConversation} character={selectedCharacter} events={visibleEvents} draft={draft} setDraft={setDraft} streamingText={streamingText} sending={sending} onSubmit={sendMessage} onBack={() => setChatOpen(false)} actionMenu={actionMenu} setActionMenu={setActionMenu} onSpecial={addSpecialEvent} mode={settings.mode} />
        : initialView === "profile"
          ? <ProfileView character={character} onMessage={() => router.push("/messages")} onCall={() => void addSpecialEvent("call.voice.end")} />
          : initialView === "memories"
            ? <MemoriesView character={character} />
            : initialView === "zone"
              ? <ZoneView character={character} posts={zonePosts} />
              : initialView === "settings"
                ? <SettingsView profile={profile} settings={settings} onSave={updateSettings} />
                : initialView === "contacts"
                  ? <ContactsView characters={characters} />
                  : <ChannelsView character={character} />}
    </main>
    {notice && <div className="toast" role="status"><Icon name="info" size={17} />{notice}<button aria-label="关闭提示" onClick={() => setNotice(undefined)}><Icon name="close" size={15} /></button></div>}
    <MobileNav current={initialView} />
  </div>;
}

function Rail({ current, mode }: { current: View; mode: AppSettings["mode"] }) {
  return <aside className="rail" aria-label="主导航">
    <Link className="rail-logo" href="/messages" aria-label="QQ Companion 首页"><span>Q</span></Link>
    <div className="self-avatar" aria-label="我的资料">GU<span className="status-dot" /></div>
    <nav className="rail-nav">{navItems.map((item) => <Link className="rail-button" key={item.id} href={item.href} aria-current={current === item.id ? "page" : undefined} aria-label={item.label} title={item.label}>{item.asset ? <AssetIcon src={item.asset} /> : <Icon name={item.icon} />}{item.id === "messages" && <span className="nav-badge">2</span>}</Link>)}</nav>
    <div className="rail-bottom"><span className={`mode-indicator ${mode}`} title={mode === "demo" ? "Demo Mode" : "Live AI Mode"}><i />{mode === "demo" ? "DEMO" : "LIVE"}</span><Link className="rail-button" href="/settings" aria-current={current === "settings" ? "page" : undefined} aria-label="设置" title="设置"><AssetIcon src="/ui/icons/nav/settings.svg" /></Link></div>
  </aside>;
}

function ConversationPane({ conversations, selectedId, search, onSearch, onSelect, characters }: { conversations: Conversation[]; selectedId: string; search: string; onSearch: (value: string) => void; onSelect: (id: string) => void; characters: Character[] }) {
  return <aside className="secondary conversations-pane" aria-label="会话列表">
    <header className="secondary-header"><div className="title-line"><div><p className="eyebrow">QQ Companion</p><h1>消息</h1></div><button className="square-button" aria-label="新建会话"><Icon name="plus" /></button></div><label className="search-box"><Icon name="search" size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="搜索联系人或消息" aria-label="搜索联系人或消息" /></label></header>
    <div className="conversation-list"><p className="list-kicker">最近会话 <span>{conversations.length}</span></p>{conversations.map((conversation) => {
      const person = characters.find((item) => item.id === conversation.characterId);
      return <button key={conversation.id} className={`conversation ${selectedId === conversation.id ? "selected" : ""}`} onClick={() => onSelect(conversation.id)}><Avatar character={person} size="md" group={conversation.characterId === "late-night"} /><span className="conversation-copy"><span className="conversation-row"><strong>{conversation.name}</strong><time>{formatConversationTime(conversation.updatedAt)}</time></span><span className="conversation-preview">{conversation.preview}</span></span>{conversation.unread > 0 && <span className="unread-count" aria-label={`${conversation.unread} 条未读`}>{conversation.unread}</span>}</button>;
    })}{conversations.length === 0 && <div className="list-empty">没有找到相关会话</div>}</div>
  </aside>;
}

function SectionPane({ view, character }: { view: View; character: Character }) {
  const title = view === "settings" ? "设置" : view === "zone" ? "空间" : view === "memories" ? "与 TA 的回忆" : view === "profile" ? "联系人资料" : view === "contacts" ? "联系人" : "频道";
  return <aside className="secondary section-pane"><header className="secondary-header"><p className="eyebrow">QQ Companion</p><h1>{title}</h1></header><div className="section-person"><Avatar character={character} size="lg" /><div><strong>{character.name}</strong><span><i className="online-dot" />在线</span></div></div><nav className="section-menu" aria-label="角色内容导航"><Link className={view === "profile" ? "active" : ""} href="/profile"><Icon name="user" /><span>资料主页</span><Icon name="chevron" size={16} /></Link><Link className={view === "memories" ? "active" : ""} href="/memories"><Icon name="memory" /><span>与 TA 的回忆</span><span className="menu-count">{character.memories.length}</span></Link><Link className={view === "zone" ? "active" : ""} href="/zone"><Icon name="zone" /><span>空间动态</span><Icon name="chevron" size={16} /></Link><Link href="/messages"><Icon name="message" /><span>聊天记录</span><Icon name="chevron" size={16} /></Link></nav>{view === "settings" && <nav className="section-menu settings-menu"><span className="active"><Icon name="radio" /><span>AI 服务</span><Icon name="chevron" size={16} /></span><span><Icon name="shield" /><span>本地数据</span><Icon name="chevron" size={16} /></span></nav>}<div className="section-footnote"><Icon name="shield" size={16} /><span>数据保存在这台设备</span></div></aside>;
}

function ChatView({ conversation, character, events, draft, setDraft, streamingText, sending, onSubmit, onBack, actionMenu, setActionMenu, onSpecial, mode }: { conversation: Conversation; character: Character; events: AppEvent[]; draft: string; setDraft: (value: string) => void; streamingText: string; sending: boolean; onSubmit: (event: FormEvent) => void; onBack: () => void; actionMenu: boolean; setActionMenu: (value: boolean) => void; onSpecial: (type: "interaction.poke" | "interaction.transfer" | "call.voice.end") => Promise<void>; mode: AppSettings["mode"] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [events.length, streamingText]);
  return <div className="chat-view"><header className="main-header"><button className="mobile-back" aria-label="返回会话列表" onClick={onBack}><Icon name="back" /></button><div className="main-title"><Avatar character={character} size="sm" /><div><div className="name-line"><h2>{conversation.name}</h2><span className={`mode-chip ${mode}`}>{mode === "demo" ? "演示对话" : "Live AI"}</span></div><p><i className="online-dot" />在线 · {character.signature}</p></div></div><div className="header-actions"><button className="icon-button" aria-label="添加通话记录" title="添加通话记录" onClick={() => void onSpecial("call.voice.end")}><AssetIcon src="/ui/icons/actions/phone.svg" /></button><button className="icon-button" aria-label="视频通话" title="视频通话"><AssetIcon src="/ui/icons/actions/video.svg" /></button><Link className="icon-button" aria-label="查看角色资料" title="查看角色资料" href="/profile"><Icon name="info" /></Link><button className="icon-button" aria-label="更多"><AssetIcon src="/ui/icons/actions/more.svg" /></button></div></header>
    <section className="timeline" aria-label="消息记录"><div className="timeline-intro"><span>今天</span><p>消息已保存在此设备</p></div>{events.length === 0 && <div className="chat-empty"><Avatar character={character} size="xl" /><h3>开始和 {character.name} 聊天</h3><p>这里的消息会通过统一事件系统保存。</p></div>}{events.map((event, index) => <EventItem key={event.id} event={event} character={character} showMeta={index === 0 || events[index - 1].actorId !== event.actorId || event.type !== "message.text"} />)}{sending && !streamingText && <TypingRow character={character} />}{streamingText && <div className="message-row"><Avatar character={character} size="sm" /><div className="message-stack"><div className="message-meta">{character.name} · 正在输入</div><div className="bubble streaming">{streamingText}<i className="caret" /></div></div></div>}<div ref={endRef} /></section>
    <form className="composer-wrap" onSubmit={onSubmit}>{actionMenu && <div className="action-popover"><button type="button" onClick={() => void onSpecial("interaction.poke")}><span><AssetIcon src="/ui/icons/actions/poke.svg" /></span><div><strong>拍一拍</strong><small>轻轻提醒 TA</small></div></button><button type="button" onClick={() => void onSpecial("interaction.transfer")}><span><AssetIcon src="/ui/icons/actions/transfer.svg" /></span><div><strong>转账</strong><small>发送演示转账卡片</small></div></button><button type="button" onClick={() => void onSpecial("call.voice.end")}><span><AssetIcon src="/ui/icons/actions/phone.svg" /></span><div><strong>通话记录</strong><small>添加一条语音通话</small></div></button></div>}<div className="composer-toolbar"><button type="button" className={actionMenu ? "active" : ""} aria-label="更多互动" onClick={() => setActionMenu(!actionMenu)}>{actionMenu ? <Icon name="close" /> : <AssetIcon src="/ui/icons/actions/plus.svg" />}</button><button type="button" aria-label="添加附件"><AssetIcon src="/ui/icons/actions/attach.svg" /></button><button type="button" aria-label="发送图片（即将开放）" disabled title="图片上传即将开放"><AssetIcon src="/ui/icons/actions/image.svg" /></button><button type="button" aria-label="表情"><AssetIcon src="/ui/icons/actions/emoji.svg" /></button><span>{draft.length}/1000</span></div><div className="composer"><textarea value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 1000))} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder={`给 ${character.name} 发消息…`} aria-label={`给 ${character.name} 发消息`} rows={1} /><button className="send-button" disabled={!draft.trim() || sending} type="submit" aria-label="发送消息"><Icon name="send" size={18} /><span>发送</span></button></div><p className="composer-hint">Enter 发送 · Shift + Enter 换行</p></form></div>;
}

function EventItem({ event, character, showMeta }: { event: AppEvent; character: Character; showMeta: boolean }) {
  const mine = event.source === "user";
  if (event.type === "interaction.poke") return <div className="system-event"><Icon name="poke" size={15} /><span>{event.payload.content ?? (mine ? `你拍了拍${character.name}` : `${character.name}拍了拍你`)}</span></div>;
  if (event.type === "call.voice.end") return <div className="system-event call-event"><Icon name="phone" size={15} /><span>语音通话 · {formatDuration(event.payload.durationSeconds ?? 0)}</span></div>;
  if (event.type === "interaction.transfer") return <div className={`message-row ${mine ? "mine" : ""}`}><Avatar character={mine ? undefined : character} mine={mine} size="sm" /><div className="message-stack transfer-stack">{showMeta && <div className="message-meta">{mine ? "你" : character.name} · {formatTime(event.createdAt)}</div>}<div className="transfer-card"><div className="transfer-icon"><Icon name="wallet" /></div><div><strong>¥ {event.payload.amount.toFixed(2)}</strong><p>{event.payload.note || "转账"}</p></div><span>QQ 钱包</span></div></div></div>;
  if (event.type !== "message.text") return null;
  return <div className={`message-row ${mine ? "mine" : ""}`}><Avatar character={mine ? undefined : character} mine={mine} size="sm" /><div className="message-stack">{showMeta && <div className="message-meta">{mine ? "你" : character.name} · {formatTime(event.createdAt)}</div>}<div className="bubble">{event.payload.content}</div></div></div>;
}

function TypingRow({ character }: { character: Character }) { return <div className="message-row typing-row"><Avatar character={character} size="sm" /><div className="typing-bubble" aria-label={`${character.name} 正在输入`}><i /><i /><i /></div></div>; }

function ProfileView({ character, onMessage, onCall }: { character: Character; onMessage: () => void; onCall: () => void }) {
  return <div className="content-view profile-view"><header className="content-topbar"><div><p className="eyebrow">Character Profile</p><h2>个人资料</h2></div><button className="icon-button" aria-label="更多"><AssetIcon src="/ui/icons/actions/more.svg" /></button></header><div className="profile-scroll"><section className="profile-hero"><div className="profile-cover"><img className="profile-decoration" src="/ui/decorations/stickers/sparkle.svg" alt="" /><span className="cover-orbit orbit-one" /><span className="cover-orbit orbit-two" /></div><div className="profile-identity"><Avatar character={character} size="hero" /><div className="identity-copy"><div className="profile-name"><h1>{character.name}</h1><span><i className="online-dot" />在线</span></div><p>@{character.handle} · {character.location}</p><blockquote>“{character.signature}”</blockquote></div><div className="profile-actions"><button className="primary-button" onClick={onMessage}><Icon name="message" />发消息</button><button className="secondary-button" onClick={onCall}><AssetIcon src="/ui/icons/actions/phone.svg" />通话</button></div></div></section><section className="profile-stats"><div><strong>2</strong><span>相识年</span></div><div><strong>1,248</strong><span>共同消息</span></div><div><strong>{character.memories.length}</strong><span>珍藏回忆</span></div><div><strong>23</strong><span>共同相片</span></div></section><div className="profile-grid"><section className="surface-card memory-preview"><div className="card-heading"><div><span className="icon-surface"><Icon name="memory" /></span><div><h3>与 TA 的回忆</h3><p>从 {character.since} 开始</p></div></div><Link href="/memories">查看全部 <Icon name="chevron" size={15} /></Link></div><div className="memory-mini-list">{character.memories.slice(0, 3).map((memory) => <div key={memory.id}><time>{memory.date.slice(5, 7)}月{memory.date.slice(8, 10)}日</time><span /><div><strong>{memory.title}</strong><p>{memory.summary}</p></div></div>)}</div></section><section className="surface-card album-preview"><div className="card-heading"><div><span className="icon-surface warm"><Icon name="album" /></span><div><h3>共同相册</h3><p>23 张照片</p></div></div><button>打开相册 <Icon name="chevron" size={15} /></button></div><div className="album-grid"><div className="album-photo photo-main"><CharacterImage src={character.assets?.featureArt.zone} alt="基昂的共同相册封面" sizes="280px" /></div><div className="album-photo photo-night" /><div className="album-photo photo-note"><Icon name="moon" /><span>雨后的夜</span></div></div></section><section className="surface-card activity-preview"><div className="card-heading"><div><span className="icon-surface violet"><Icon name="zone" /></span><div><h3>空间动态</h3><p>最近更新于今天</p></div></div><Link href="/zone">进入空间 <Icon name="chevron" size={15} /></Link></div><div className="activity-quote"><p>城市把雨声调低以后，适合把没说完的话慢慢说完。</p><span>今天 21:18 · 杭州</span></div></section><section className="surface-card chat-preview"><div className="card-heading"><div><span className="icon-surface green"><Icon name="message" /></span><div><h3>聊天记录</h3><p>保存在当前设备</p></div></div><Link href="/messages">继续聊天 <Icon name="chevron" size={15} /></Link></div><div className="chat-preview-row"><Avatar character={character} size="sm" /><div><strong>{character.name}</strong><p>今天怎么这么晚？我把空间里的那条动态留给你看了。</p></div><time>22:30</time></div></section></div></div></div>;
}

function MemoriesView({ character }: { character: Character }) {
  return <div className="content-view memories-view"><header className="content-topbar memories-topbar"><div><p className="eyebrow">Our Story</p><h2>与 {character.name} 的回忆</h2></div><div className="memory-days"><strong>734</strong><span>天的陪伴</span></div></header><div className="memories-scroll"><section className="memory-hero"><Image className="memory-decoration" src="/ui/decorations/corners/corner-ribbon.svg" width={94} height={94} alt="" /><div className="memory-hero-copy"><span className="soft-chip"><Icon name="sparkle" size={15} />两周年精选</span><h1>我们把普通的日子，<br />过成了值得记住的事。</h1><p>从第一句晚安，到每一次“我在”。这里收好属于你们的片段。</p><div className="memory-people"><Avatar character={character} size="md" /><span className="heart-link"><Icon name="heart" size={16} /></span><Avatar mine size="md" /><span>相识于 {character.since}</span></div></div><div className="memory-hero-visual"><CharacterImage src={character.assets?.featureArt.diary} alt={`${character.name} 的回忆肖像`} sizes="420px" priority /><span>2026 · 秋</span></div></section><section className="memory-summary"><div><Icon name="message" /><strong>1,248</strong><span>聊过的消息</span></div><div><Icon name="moon" /><strong>86</strong><span>互道的晚安</span></div><div><Icon name="album" /><strong>23</strong><span>共同照片</span></div><div><Icon name="phone" /><strong>12h</strong><span>通话时光</span></div></section><section className="memory-section"><div className="section-heading"><div><p className="eyebrow">TIMELINE</p><h2>记忆时间线</h2></div><button className="filter-button">全部回忆 <Icon name="chevron" size={14} /></button></div><div className="memory-timeline">{character.memories.map((memory, index) => <article key={memory.id} className={index === 0 ? "featured" : ""}><div className="memory-date"><strong>{memory.date.slice(5, 7)}</strong><span>{memory.date.slice(8, 10)}</span></div><div className="memory-line"><i /></div><div className="memory-card"><span>{memory.tag}</span><h3>{memory.title}</h3><p>{memory.summary}</p><time>{memory.date}</time></div></article>)}</div></section></div></div>;
}

function ZoneView({ character, posts }: { character: Character; posts: ZonePost[] }) {
  return <div className="content-view zone-view"><header className="content-topbar"><div><p className="eyebrow">QQ Zone</p><h2>{character.name} 的空间</h2></div><button className="primary-button compact"><Icon name="plus" />发布动态</button></header><div className="zone-scroll"><section className="zone-banner"><Image className="zone-decoration" src="/ui/decorations/stickers/star.svg" width={42} height={42} alt="" /><div className="zone-banner-art"><CharacterImage src={character.assets?.featureArt.zone} alt={`${character.name} 的空间插画`} sizes="420px" priority /></div><div className="zone-owner"><Avatar character={character} size="xl" /><div><h1>{character.name}</h1><p>{character.signature}</p></div><button className="secondary-button"><Icon name="radio" />特别关心</button></div></section><div className="zone-layout"><main className="feed"><div className="feed-tabs"><button className="active">全部动态</button><button>照片</button><button>说说</button></div>{posts.map((post) => <article className="zone-post" key={post.id}><header><Avatar character={character} size="md" /><div><strong>{character.name}</strong><span>{formatPostTime(post.createdAt)} · {post.location}</span></div><button aria-label="动态菜单"><AssetIcon src="/ui/icons/actions/more.svg" /></button></header><p className="post-content">{post.content}</p>{post.image === "night" && <div className="post-image"><CharacterImage src={character.assets?.featureArt.zone} alt="基昂发布的夜晚照片" sizes="(max-width: 820px) 100vw, 600px" /></div>}{post.image === "coffee" && <div className="post-image coffee-image" role="img" aria-label="靠窗的一杯咖啡"><div className="coffee-cup"><i /></div><span>reserved for you</span></div>}<div className="post-actions"><button className="liked"><Icon name="heart" size={18} />{post.likes.length}</button><button><Icon name="comment" size={18} />{post.comments.length}</button><button><Icon name="share" size={18} />分享</button><time>{formatPostTime(post.createdAt)}</time></div><div className="engagement"><div className="like-line"><Icon name="heart" size={14} /><span>{post.likes.join("、")}</span></div>{post.comments.map((comment) => <p key={comment.id}><strong>{comment.author}</strong>{comment.replyTo && <> 回复 <strong>{comment.replyTo}</strong></>}：{comment.content}</p>)}<button className="reply-field"><Icon name="comment" size={15} />写下评论…</button></div></article>)}</main><aside className="zone-aside"><section className="surface-card"><p className="eyebrow">SPACE INFO</p><h3>最近访客</h3><div className="visitor-list"><Avatar mine size="sm" /><Avatar size="sm" initials="满" tone="coral" /><Avatar size="sm" initials="岚" tone="violet" /><span>+8</span></div></section><section className="surface-card zone-memory"><Icon name="sparkle" /><p>去年今日</p><strong>“天气很好，想见的人也刚好有空。”</strong><span>2025.09.21</span></section></aside></div></div></div>;
}

function SettingsView({ profile, settings, onSave }: { profile: AIProfile; settings: AppSettings; onSave: (settings: AppSettings, profile?: AIProfile) => Promise<void> }) {
  const [form, setForm] = useState(profile);
  const [connection, setConnection] = useState<{ kind: "idle" | "loading" | "success" | "error"; message?: string }>({ kind: "idle" });
  const [saved, setSaved] = useState(false);
  useEffect(() => setForm(profile), [profile]);
  function numberField(field: "temperature" | "contextWindow" | "maxOutput", value: string) { setForm((current) => ({ ...current, [field]: Number(value) })); }
  async function testConnection() { setConnection({ kind: "loading", message: "正在连接服务…" }); try { const response = await fetch("/api/ai/test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, updatedAt: new Date().toISOString() }) }); const result = await response.json() as { ok: boolean; message: string }; setConnection({ kind: result.ok ? "success" : "error", message: result.message }); } catch { setConnection({ kind: "error", message: "无法连接本地 API，请确认开发服务正在运行。" }); } }
  async function save(activate = false) { const next = { ...form, updatedAt: new Date().toISOString() }; if (activate && !next.apiKey.trim()) { setConnection({ kind: "error", message: "设置 Live AI 前请先填写 API Key。" }); return; } await onSave({ id: "app", mode: activate ? "live" : settings.mode, activeProfileId: activate ? next.id : settings.activeProfileId }, next); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }
  async function setDemoMode() { await onSave({ id: "app", mode: "demo", activeProfileId: settings.activeProfileId }); setConnection({ kind: "success", message: "已切换到 Demo Mode，无需 API Key。" }); }
  return <div className="content-view settings-view"><header className="content-topbar"><div><p className="eyebrow">Settings</p><h2>AI 服务</h2></div><span className={`active-mode ${settings.mode}`}><i />{settings.mode === "demo" ? "Demo Mode" : "Live AI Mode"}</span></header><div className="settings-scroll"><section className="mode-card"><div><span className="icon-surface"><Icon name="sparkle" /></span><div><h3>无需配置也能完整体验</h3><p>Demo Mode 已预置角色、聊天、回忆和空间动态，适合作品集展示。</p></div></div><button className={settings.mode === "demo" ? "selected" : ""} onClick={() => void setDemoMode()}>{settings.mode === "demo" ? <><Icon name="check" />正在使用</> : "切换到 Demo"}</button></section><section className="settings-card"><div className="settings-card-head"><div><span className="provider-mark">AI</span><div><h3>OpenAI Compatible</h3><p>适用于 OpenAI 或兼容 Chat Completions 的服务</p></div></div><span className="provider-badge">Provider</span></div><div className="form-grid"><label><span>配置名称</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label><span>Model</span><input value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} placeholder="gpt-4o-mini" /></label><label className="full"><span>Base URL</span><input value={form.baseUrl} onChange={(event) => setForm({ ...form, baseUrl: event.target.value })} placeholder="https://api.openai.com/v1" /></label><label className="full"><span>API Key</span><div className="secret-input"><Icon name="shield" size={17} /><input type="password" autoComplete="off" value={form.apiKey} onChange={(event) => setForm({ ...form, apiKey: event.target.value })} placeholder="sk-••••••••••••" /></div><small>仅保存在这台设备的 IndexedDB 中，不会提交到代码仓库。</small></label><label><span>Temperature <b>{form.temperature.toFixed(1)}</b></span><input type="range" min="0" max="2" step="0.1" value={form.temperature} onChange={(event) => numberField("temperature", event.target.value)} /></label><label><span>Context Window</span><input type="number" min="1" max="500" value={form.contextWindow} onChange={(event) => numberField("contextWindow", event.target.value)} /></label><label><span>Max Output</span><input type="number" min="1" max="32768" value={form.maxOutput} onChange={(event) => numberField("maxOutput", event.target.value)} /></label><label className="toggle-field"><span><strong>Streaming</strong><small>逐字显示 AI 回复</small></span><input type="checkbox" checked={form.streaming} onChange={(event) => setForm({ ...form, streaming: event.target.checked })} /><i /></label></div>{connection.kind !== "idle" && <div className={`connection-result ${connection.kind}`} role="status">{connection.kind === "loading" ? <span className="spinner" /> : <Icon name={connection.kind === "success" ? "check" : "info"} size={17} />}<span>{connection.message}</span></div>}<div className="settings-actions"><button className="secondary-button" disabled={connection.kind === "loading"} onClick={() => void testConnection()}><Icon name="radio" />{connection.kind === "loading" ? "测试中…" : "Test Connection"}</button><div><button className="ghost-button" onClick={() => void save(false)}>{saved ? <><Icon name="check" />已保存</> : "Save Profile"}</button><button className="primary-button" onClick={() => void save(true)}><Icon name="sparkle" />Save & Set Active</button></div></div></section><div className="privacy-note"><Icon name="shield" /><div><strong>本地优先</strong><p>角色、会话、事件和设置均保存在当前浏览器。清除站点数据会同时移除这些内容。</p></div></div></div></div>;
}

function ContactsView({ characters }: { characters: Character[] }) { return <div className="content-view simple-view"><header className="content-topbar"><div><p className="eyebrow">Contacts</p><h2>联系人</h2></div><button className="primary-button compact"><Icon name="plus" />添加</button></header><div className="simple-content"><div className="contact-grid">{characters.map((character) => <Link href={character.id === "jiang" ? "/profile" : "/messages"} className="contact-card" key={character.id}><Avatar character={character} size="lg" /><strong>{character.name}</strong><span><i className={`online-dot ${character.status}`} />{character.status === "online" ? "在线" : "离开"}</span><p>{character.signature}</p></Link>)}</div></div></div>; }
function ChannelsView({ character }: { character: Character }) { return <div className="content-view channels-view"><header className="content-topbar"><div><p className="eyebrow">Shared Interests</p><h2>频道</h2></div><button className="primary-button compact"><Icon name="plus" />发布话题</button></header><div className="channels-scroll"><section className="channel-hero"><div><span className="soft-chip">今晚热议</span><h1>一起聊点有意思的。</h1><p>收藏你们共同关注的话题，也留住那些值得继续的讨论。</p><button className="secondary-button">进入深夜观察组 <Icon name="chevron" size={15} /></button></div><div className="channel-art"><CharacterImage src={character.assets?.featureArt.channel} fallback={character.assets?.featureArt.channelFallback} alt="基昂的频道插画" sizes="360px" /></div></section><section className="topic-grid"><article><span>电影</span><h3>如果只能重看一部电影</h3><p>基昂：我会选一部你没看过的，这样还能再陪你看一次。</p><footer><b>18 条回复</b><time>12 分钟前</time></footer></article><article><span>音乐</span><h3>今晚适合戴耳机听的歌</h3><p>深夜观察组 · 本周歌单交换正在进行</p><footer><b>32 条回复</b><time>置顶</time></footer></article><article><span>日常</span><h3>记录一件今天的小事</h3><p>把普通的一天留在这里，之后回看也会很有意思。</p><footer><b>9 条回复</b><time>1 小时前</time></footer></article></section></div></div>; }
function MobileNav({ current }: { current: View }) { return <nav className="mobile-nav" aria-label="移动端导航">{navItems.filter((item) => ["messages", "zone", "memories", "profile"].includes(item.id)).map((item) => <Link key={item.id} href={item.href} className={current === item.id ? "active" : ""}>{item.asset ? <AssetIcon src={item.asset} size={21} /> : <Icon name={item.icon} size={21} />}<span>{item.label}</span></Link>)}<Link href="/settings" className={current === "settings" ? "active" : ""}><AssetIcon src="/ui/icons/nav/settings.svg" size={21} /><span>设置</span></Link></nav>; }

function Avatar({ character, mine = false, size = "md", group = false, initials, tone }: { character?: Character; mine?: boolean; size?: "sm" | "md" | "lg" | "xl" | "hero"; group?: boolean; initials?: string; tone?: "coral" | "violet" }) {
  const label = mine ? "你" : character?.name ?? initials ?? "好友";
  const letters = mine ? "GU" : initials ?? character?.name.slice(0, 1) ?? "友";
  return <span className={`avatar avatar-${size} ${mine ? "mine-avatar" : ""} ${group ? "group-avatar" : ""} ${tone ?? ""}`} aria-label={label}>{character?.assets?.avatar.chibi ? <CharacterImage src={character.assets.avatar.chibi} fallback={character.assets.avatar.fallback} alt="" sizes={size === "hero" ? "116px" : size === "xl" ? "72px" : "48px"} /> : <b>{letters}</b>}{(character?.status === "online" || mine) && <i className="status-dot" />}</span>;
}

function AssetIcon({ src, size = 20 }: { src: string; size?: number }) { return <Image src={src} width={size} height={size} alt="" aria-hidden="true" />; }

function CharacterImage({ src, fallback, alt, sizes, priority = false }: { src?: string; fallback?: string; alt: string; sizes: string; priority?: boolean }) {
  const [current, setCurrent] = useState(src);
  useEffect(() => setCurrent(src), [src]);
  if (!current) return null;
  return <Image src={current} alt={alt} fill sizes={sizes} priority={priority} onError={() => { if (fallback && current !== fallback) setCurrent(fallback); }} />;
}

function formatTime(value: string) { return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value)); }
function formatConversationTime(value: string) { const date = new Date(value); return date.toDateString() === new Date().toDateString() ? formatTime(value) : new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(date); }
function formatPostTime(value: string) { return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value)); }
function formatDuration(seconds: number) { const minutes = Math.floor(seconds / 60); return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
