export const navItems = [
  { id: "messages", label: "Messages", icon: "◌" },
  { id: "contacts", label: "Contacts", icon: "♧" },
  { id: "zone", label: "Zone", icon: "✦" },
  { id: "channels", label: "Channels", icon: "#" },
  { id: "profile", label: "Profile", icon: "○" }
] as const;

export const conversations = [
  { id: "tavo", name: "基昂", initials: "基", avatarTone: "tavo", time: "22:30", preview: "今天怎么这么晚？", unread: true },
  { id: "group", name: "深夜观察组", initials: "深", avatarTone: "group", time: "21:16", preview: "林知夏：明天见", unread: true },
  { id: "friend", name: "小满", initials: "满", avatarTone: "friend", time: "Mon", preview: "图片", unread: false }
];

export const messages = [
  { id: "m1", mine: false, time: "22:29", content: "刚忙完。你呢？还没睡？" },
  { id: "m2", mine: true, time: "22:30", content: "回来啦，今天有点晚。" },
  { id: "m3", mine: false, time: "22:30", content: "今天怎么这么晚？我把空间里的那条动态留给你看了。" }
];
