# Legacy Prototype Analysis

The repository arrived as `Tavo_基昂's Regex _1xkLK.zip`. It is archived unchanged under `legacy/regex-original/` with an `index.json` inventory and twelve original JSON regex definitions. The old replacements render self-contained HTML/CSS/JavaScript inside SillyTavern; the new app treats those files as an input protocol, never as UI source.

| Legacy file | Observed role | Event mapping | Future surface |
| --- | --- | --- | --- |
| `tavo1_手机测试版.json` | Private chat container, message cards, composer actions | `message.*`, `interaction.*`, `call.*` | Messages / Chat |
| `tavo2_手机(群聊).json` | Group conversation renderer | `message.*` with group conversation id | Group Chat |
| `tavo3_我方消息.json` | User-side message marker | `message.text`, media variants | Composer |
| `tavo4_对方消息(通用).json` | Character-side message marker | `message.text`, media variants | Timeline |
| `tavo5_朋友圈.json` | Feed/post renderer and social actions | `zone.post`, `zone.like`, `zone.comment` | Zone |
| `tavo6_角色转账.json` | Character transfer card and action | `interaction.transfer` | Chat timeline |
| `tavo7_用户转账.json` | User transfer card and action | `interaction.transfer` | Chat timeline |
| `tavo8_查看帖子.json` | Forum thread renderer and reply action | `forum.post`, `forum.comment` | Channels |
| `tavo9_日记.json` | Diary marker and entry renderer | `diary.entry` | Zone / Diary |
| `tavo10_语音通话.json` | Text-mediated voice call UI | `call.voice.start/message/end` | Calls |
| `tavo11_视频通话.json` | Text-mediated video call UI | `call.video.start/message/end` | Calls |
| `tavo12_戳一戳.json` | Poke trigger and notice | `interaction.poke` | Chat timeline |

## Compatibility notes

- Regex captures are interpreted before any rendering. `core/legacy/LegacyParser.ts` currently covers common text chat, diary, and poke markers as a small foundation; each remaining marker can be added without coupling it to React.
- Legacy scripts use browser-side handlers and SillyTavern `triggerSlash` conventions. Those side effects become event dispatches in the app. The original `triggerSlash` calls are not executed by the new UI.
- Old HTML/CSS is evidence only. It is deliberately not imported into the new design system.
