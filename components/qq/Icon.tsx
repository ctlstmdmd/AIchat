import type { SVGProps } from "react";

export type IconName =
  | "message" | "contacts" | "zone" | "channel" | "user" | "settings"
  | "search" | "phone" | "info" | "plus" | "send" | "back" | "more"
  | "image" | "smile" | "poke" | "wallet" | "clock" | "heart" | "comment"
  | "share" | "sparkle" | "memory" | "album" | "check" | "chevron" | "shield"
  | "radio" | "pin" | "close" | "moon";

export function Icon({ name, size = 20, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} {...common} {...props}>{paths[name]}</svg>;
}

const paths: Record<IconName, React.ReactNode> = {
  message: <><path d="M4 5.8A2.8 2.8 0 0 1 6.8 3h10.4A2.8 2.8 0 0 1 20 5.8v7.4a2.8 2.8 0 0 1-2.8 2.8H10l-4.7 3.2.9-3.3A2.8 2.8 0 0 1 4 13.2Z"/><path d="M8 8h8M8 11.5h5"/></>,
  contacts: <><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M16.5 14a4.5 4.5 0 0 1 4 4.5"/></>,
  zone: <><path d="m12 3 2.2 5 5.3.5-4 3.6 1.2 5.3-4.7-2.7-4.7 2.7 1.2-5.3-4-3.6 5.3-.5Z"/></>,
  channel: <><path d="M9 3 7 21M17 3l-2 18M4 9h16M3 15h16"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  phone: <path d="M5.4 3.5 8 3l2 5-2.3 1.5a14 14 0 0 0 6.8 6.8L16 14l5 2-.5 2.6a2.8 2.8 0 0 1-3 2.2C9.8 19.7 4.3 14.2 3.2 6.5a2.8 2.8 0 0 1 2.2-3Z"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.2v.1"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  send: <><path d="m21 3-7.8 18-2.8-7.4L3 10.8Z"/><path d="m10.4 13.6 4.2-4.2"/></>,
  back: <><path d="m14.5 5-7 7 7 7"/><path d="M8 12h12"/></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m4 17 4.5-4.5 3.5 3 2.5-2.5 5.5 5"/></>,
  smile: <><circle cx="12" cy="12" r="9"/><path d="M8.5 10h.01M15.5 10h.01M8.5 14a4.5 4.5 0 0 0 7 0"/></>,
  poke: <><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v8.5a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 5 17.6L3.5 15a1.7 1.7 0 0 1 2.7-2l2.8 2"/></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M16 10h5v5h-5a2.5 2.5 0 0 1 0-5ZM6 6V4h11"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>,
  heart: <path d="M20.8 5.8a5.1 5.1 0 0 0-7.2 0L12 7.4l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2l1.6 1.6L12 21l7.2-6.4 1.6-1.6a5.1 5.1 0 0 0 0-7.2Z"/>,
  comment: <path d="M20 15a3 3 0 0 1-3 3H9l-5 3 1.3-3.9A3 3 0 0 1 4 14.6V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z"/>,
  share: <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/></>,
  sparkle: <><path d="m12 3 1.2 4.3L17 9l-3.8 1.7L12 15l-1.2-4.3L7 9l3.8-1.7Z"/><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7Z"/></>,
  memory: <><path d="M6 3h10a3 3 0 0 1 3 3v15l-5-3-5 3V6a3 3 0 0 0-3-3Z"/><path d="M9 3H6a3 3 0 0 0-3 3v11h6"/></>,
  album: <><rect x="4" y="3" width="14" height="17" rx="2"/><path d="M8 7h6M8 11h6M8 15h4M18 7h2v11a2 2 0 0 1-2 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  shield: <><path d="M12 3 5 6v5c0 4.8 2.8 8.1 7 10 4.2-1.9 7-5.2 7-10V6Z"/><path d="m9 12 2 2 4-4"/></>,
  radio: <><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13"/></>,
  pin: <><path d="M14 4 20 10l-3 1-4 4 1 3-2 2-8-8 2-2 3 1 4-4Z"/><path d="m8 16-5 5"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  moon: <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"/>,
};
