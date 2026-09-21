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
