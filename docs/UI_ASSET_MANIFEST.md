# QQ Companion UI Asset Manifest

## Visual system

统一视觉关键词：

- 黄白风
- 奶油黄
- 奶白
- 暖棕描边
- 轻毛玻璃
- 磨砂半透明
- Q 版贴纸感
- 可爱但不幼稚
- QQ 社交感

## Batch 01 — Navigation

本批对应主导航，不是功能大插画：

| Asset | Purpose | UI placement |
| --- | --- | --- |
| `public/ui/icons/nav/message.svg` | 消息 / 切换聊天 | Desktop left rail, mobile bottom nav |
| `public/ui/icons/nav/contacts.svg` | 联系人 | Desktop left rail, mobile bottom nav |
| `public/ui/icons/nav/zone.svg` | QQ 空间 / 动态 | Main nav, Zone entry |
| `public/ui/icons/nav/channel.svg` | 频道 / 社群 | Main nav, Channel entry |
| `public/ui/icons/nav/call.svg` | 通话 | Main nav, Call entry |
| `public/ui/icons/nav/settings.svg` | 设置 | Main nav, Settings entry |

## Distinction from character feature art

Navigation icons live under:

`public/ui/icons/nav/`

Character-specific large Q-version illustrations should live under:

`public/characters/char/feature-art/`

Examples:

- transfer.png
- poke.png
- call.png
- zone.png
- diary.png
- channel.png
- memory.png

Do not mix module hero illustrations with navigation icons.

## Character asset integrity

The approved character identity remains the blond, curly-haired chibi used by the imported set. Character paths are centralized in `stores/demoData.ts`; components must not substitute `public/assets/jiang-avatar.png` or hardcode a second identity.

| Canonical asset | Integrity | Active behavior |
| --- | --- | --- |
| `public/characters/char/avatar/chibi/default.webp` | Valid RIFF/WebP, repaired in `91a8670` | Normal avatar for Messages and Profile |
| `public/characters/char/feature-art/channel.webp` | Valid RIFF/WebP, repaired in `91a8670` | Dedicated Channel feature artwork |
| `public/characters/char/feature-art/diary.webp` | Valid RIFF/WebP | Memories art and defensive avatar fallback |
| `public/characters/char/feature-art/zone.webp` | Valid RIFF/WebP | Zone art and defensive Channel fallback |

### Interaction artwork

These approved assets remain centralized under `Character.assets.interactionArt`; chat and call components consume the mapping instead of hardcoding a second character identity.

| Canonical asset | Active behavior |
| --- | --- |
| `public/characters/char/interaction-art/poke-transparent.png` | Transparent poke sticker in the message-timeline banner |
| `public/characters/char/interaction-art/transfer-transparent.png` | Transparent character sticker inside the enriched transfer card |
| `public/characters/char/interaction-art/voice-call-transparent.png` | Transparent primary artwork for the voice-call demo dialog |
| `public/characters/char/interaction-art/video-call-transparent.png` | Transparent primary artwork for the video-call demo dialog |

All four active interaction files retain the approved source pixels and include genuine alpha transparency. The older sibling WebPs are flattened black-background source files and are intentionally no longer referenced. `CharacterImage` keeps approved avatar/feature-art paths only as defensive recovery if a future asset request fails; normal rendering uses the dedicated transparent interaction artwork.

## CSS-only components

Do **not** save the following as raster images:

- chat bubble backgrounds
- search field backgrounds
- buttons
- online/read/draft/important pills
- timestamps
- unread-count labels
- ordinary text

These should remain responsive HTML/CSS components.
