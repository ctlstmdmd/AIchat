"use client";

import { useState } from "react";
import { conversations, navItems, messages } from "@/stores/mockData";

type View = "messages" | "contacts" | "zone" | "channels" | "profile" | "settings";

export function QQShell({ initialView = "messages" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [selected, setSelected] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");
  const current = conversations.find((item) => item.id === selected) ?? conversations[0];
  const selectView = (next: View) => setView(next);

  return <div className="app-shell">
    <aside className="rail" aria-label="Primary navigation">
      <div className="rail-logo" aria-label="QQ Companion">Q</div>
      <div className="rail-avatar">GU</div>
      <div className="rail-divider" />
      <nav className="rail-nav">
        {navItems.map((item) => <button className="rail-button" key={item.id} aria-current={view === item.id ? "page" : undefined} aria-label={item.label} onClick={() => selectView(item.id as View)}>{item.icon}{item.id === "messages" && <span>2</span>}</button>)}
      </nav>
      <div className="rail-bottom"><button className="rail-button" aria-label="Settings" aria-current={view === "settings" ? "page" : undefined} onClick={() => selectView("settings")}>⚙</button></div>
    </aside>

    {view === "messages" ? <aside className="secondary" aria-label="Conversations">
      <header className="secondary-header"><div className="eyebrow">QQ Companion</div><h1>Messages</h1><input className="search" placeholder="Search conversations" aria-label="Search conversations" /></header>
      <div className="conversation-list">{conversations.map((conversation) => <button key={conversation.id} className={`conversation ${selected === conversation.id ? "selected" : ""}`} onClick={() => setSelected(conversation.id)}>
        <span className={`avatar ${conversation.avatarTone}`} aria-hidden="true">{conversation.initials}<i className="status-dot" /></span><span className="conversation-copy"><span className="conversation-row"><span className="conversation-name">{conversation.name}</span><span className="conversation-time">{conversation.time}</span></span><span className="conversation-preview">{conversation.preview}</span></span>{conversation.unread && <i className="unread" aria-label="Unread" />}
      </button>)}</div>
    </aside> : <aside className="secondary"><header className="secondary-header"><div className="eyebrow">QQ Companion</div><h1>{navItems.find((item) => item.id === view)?.label ?? "Settings"}</h1></header><div className="empty-state">{view === "settings" ? "" : "This space is ready for the next phase."}</div></aside>}

    <main className="main">
      {view === "messages" ? <><header className="main-header"><div className="main-title"><span className={`avatar ${current.avatarTone}`} aria-hidden="true">{current.initials}<i className="status-dot" /></span><div><h2>{current.name}</h2><p>Online · Persistent companion</p></div></div><div className="header-actions"><button className="icon-button" aria-label="Start voice call">⌕</button><button className="icon-button" aria-label="Open companion profile">ⓘ</button></div></header><section className="timeline" aria-label="Message timeline"><div className="day-label">Today 22:30</div>{messages.map((message) => <div className={`message-row ${message.mine ? "mine" : ""}`} key={message.id}><span className={`avatar ${message.mine ? "friend" : "tavo"}`} aria-hidden="true">{message.mine ? "GU" : "基"}</span><div className="message-stack"><div className="message-meta">{message.mine ? "You" : "基昂"} · {message.time}</div><div className="bubble">{message.content}</div></div></div>)}<div className="event-card">◷ <span>Voice call · 8 min · Yesterday</span></div></section><form className="composer" onSubmit={(event) => { event.preventDefault(); setDraft(""); }}><button className="icon-button" type="button" aria-label="Add attachment">＋</button><input className="composer-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message 基昂..." aria-label="Message 基昂" /><button className="send-button" type="submit">Send</button></form></> : view === "settings" ? <SettingsPanel /> : <div className="empty-state"><div><h2>{navItems.find((item) => item.id === view)?.label}</h2><p>The social layer is scaffolded and connected to the shared event model.</p></div></div>}
    </main>
    <nav className="mobile-nav" aria-label="Mobile navigation">{[{ id: "messages", icon: "◌", label: "Messages" }, { id: "contacts", icon: "♧", label: "Contacts" }, { id: "zone", icon: "✦", label: "Zone" }, { id: "profile", icon: "○", label: "Profile" }].map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => selectView(item.id as View)}><strong>{item.icon}</strong>{item.label}</button>)}</nav>
  </div>;
}

function SettingsPanel() { return <div className="settings-wrap"><div className="eyebrow">Workspace settings</div><h2>AI Service</h2><p>Connect a provider profile when the runtime phase is enabled. This demo keeps secrets out of the client.</p><section className="settings-section"><h3>OpenAI Compatible</h3><p>Session-only configuration for portfolio demos and local development.</p><div className="field-grid"><div className="field"><label htmlFor="provider">Provider</label><select id="provider" defaultValue="openai"><option value="openai">OpenAI Compatible</option><option value="anthropic">Anthropic (planned)</option><option value="gemini">Gemini (planned)</option></select></div><div className="field"><label htmlFor="model">Model</label><input id="model" defaultValue="gpt-4o-mini" /></div><div className="field full"><label htmlFor="base-url">Base URL</label><input id="base-url" defaultValue="https://api.openai.com/v1" /></div><div className="field full"><label htmlFor="api-key">API key</label><input id="api-key" type="password" placeholder="Session only" /></div></div><div className="settings-note">▣ Your key is not committed or synced. Remember on this device will be added with an explicit local-storage opt-in.</div><div className="button-row"><button className="send-button" type="button">Test connection</button><button className="secondary-button" type="button">Save profile</button></div></section></div>; }
