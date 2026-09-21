# QQ Companion — Warm Social Design System

## Product language

QQ Companion is a warm personal social client, not an AI dashboard. Its visual identity combines familiar QQ-inspired information density with cream paper, butter-yellow highlights, restrained frosted glass, and the approved blond curly-haired chibi character.

Keywords: warm, intimate, personal, playful but mature, cream white, butter yellow, soft glass, rounded geometry, social memory.

Avoid: messenger blue, enterprise green CTA, cold SaaS panels, excessive gradients, heavy blur, neon, pink dating-app styling, sticker overload, or children’s-game styling.

## Semantic tokens

| Role | Value |
|---|---|
| Page background | `#FFFDF7` |
| Secondary background | `#FFF9EB` |
| Cream surface | `#FFF8E7` |
| Character yellow | `#FFD96A` |
| Soft yellow | `#FFE9A3` |
| Pale yellow | `#FFF2C8` |
| Strong text | `#3B3428` |
| Secondary text | `#776B59` |
| Muted text | `#9C907E` |
| Warm border | `rgba(181,145,69,.16)` |
| Online state | `#69A56D` |

The canonical CSS variables live in `app/globals.css`. Components consume semantic tokens instead of raw blue/green product colors.

## Glass and depth

Primary frosted panels use translucent white or cream, an opaque-enough fallback, a white highlight border, and at most `blur(18px) saturate(120%)`. Text-bearing bubbles and inputs use less blur than large structural panels.

```css
background: rgba(255,255,255,.62);
backdrop-filter: blur(18px) saturate(120%);
border: 1px solid rgba(255,255,255,.72);
box-shadow: 0 12px 40px rgba(145,110,35,.09);
```

## Layout

- Desktop: 76px navigation rail, 316px social list/section pane, flexible main content.
- Screenshot target: 1440–1600px.
- Mobile: list → selected chat detail with an explicit back button and a five-item bottom navigation.
- Mobile target: 390px, with no horizontal overflow.

## Messaging

- Character bubble: translucent warm yellow, asymmetric top-left corner.
- User bubble: translucent cream-white, asymmetric top-right corner.
- Composer: frosted cream surface with approved action icons.
- Decorations stay outside ordinary chat bubbles.
- Poke, transfer, and call records remain AppEvent-driven.

## Character assets

The Character model is the single source of truth through `character.assets`.

- Official avatar: `/characters/char/avatar/chibi/default.webp`
- Zone: `/characters/char/feature-art/zone.webp`
- Diary/memory: `/characters/char/feature-art/diary.webp`
- Channels: `/characters/char/feature-art/channel.webp`

The imported avatar and Channel files currently fail WebP decoding in both this repository and the source repository. The UI therefore falls back only to other approved same-identity assets (`diary.webp` for avatar and `zone.webp` for Channel) until those two upstream files are replaced. `public/assets/jiang-avatar.png` is compatibility-only and must not be the displayed identity.

## Approved UI assets

- Navigation: `public/ui/icons/nav/`
- Chat actions: `public/ui/icons/actions/`
- Decorative accents: `public/ui/decorations/stickers/` and `public/ui/decorations/corners/`

Decorative density: 2–5 accents on a large screen, 0–1 per small card, normally none in a chat bubble.

## Interaction

- Hover: 120–180ms.
- Panel transitions: 180–240ms.
- Selected conversations change background without layout shift.
- Poke may use one short micro-bounce/flash only.
- Respect `prefers-reduced-motion`.
- All icon-only controls require accessible labels and visible keyboard focus.
