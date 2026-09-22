# QQ Companion

QQ Companion is a QQ-inspired AI companion and social interaction prototype built as a standalone web application. It evolves a legacy SillyTavern regex-based character interaction system into a typed, event-driven product with local persistence and an optional OpenAI-compatible runtime.

The repository is currently a Portfolio MVP / v0.1 focused on a polished, immediately explorable demo.

## Overview

The application presents one persistent character across chat, profile, memories, QQ Zone, contacts, and shared-interest channels. Demo Mode ships with a complete local scenario, while Live AI Mode lets a user connect an OpenAI-compatible endpoint without changing the UI or event model.

## Key Features

- QQ-style three-column desktop shell and responsive mobile navigation
- Character chat with Demo and Live AI modes
- OpenAI-compatible connection test and streaming chat gateway
- Event-driven text, illustrated poke and transfer interactions, and persisted call records
- Screenshot-ready voice and video call demo experiences with local controls and timers
- Character Profile, Memories, QQ Zone, Contacts, and Channels views
- Local-first conversations, events, characters, and settings in IndexedDB
- Legacy SillyTavern-style response compatibility
- Centralized character asset configuration with defensive visual fallbacks

## Architecture

User interactions are normalized before they are persisted or interpreted:

```text
React UI
  ↓
AppEvent (Zod validation)
  ↓
BrowserEventStore
  ↓
IndexedDB
```

Live AI requests stay behind the application boundary:

```text
Browser
  ↓
Next.js API routes
  ↓
OpenAI-compatible provider adapter
```

`LegacyParser` converts supported legacy outputs into structured events. `ResponseInterpreter` separates structured model responses from legacy text, and `Character.assets` keeps avatar and feature-art paths out of individual page components.

## Technical Highlights

- Next.js 14 and React 18
- TypeScript and Zod runtime validation
- Native IndexedDB persistence
- Streaming API responses with readable streams
- Event-driven interaction architecture
- Responsive, token-driven CSS without a component framework dependency

## Demo Mode

Demo Mode requires no API key. It seeds a character, conversation history, memories, Zone posts, and examples of poke, transfer, and call-record events so the complete portfolio flow is available immediately. From Messages, the phone and video actions open polished local-only call demos; hanging up writes the matching voice or video record through the same event system and IndexedDB persistence layer.

## Live AI Mode

Settings accepts an OpenAI-compatible Base URL, API key, model, temperature, context window, output limit, and streaming preference. Connection tests use `/api/ai/test`; chat requests use `/api/ai/chat` and are forwarded by the server route to the configured provider.

No API key is included in the repository.

## Privacy and Local Data

Conversations, events, characters, and settings are stored in the current browser's IndexedDB. Clearing site data removes that local state.

When Live AI Mode is used, the selected conversation context and configured credentials are sent through this application's API route to the chosen compatible provider. The project does not claim that provider traffic remains local.

## Legacy Compatibility

The original interaction system relied on SillyTavern regex transforms. `LegacyParser` preserves that history by recognizing supported legacy formats and converting them into validated `AppEvent` records, allowing old character interactions to enter the same store used by the modern UI.

## Portfolio Screenshots

Screenshots are intentionally not fabricated or committed yet. The planned repository location is `docs/screenshots/` with these final captures:

| Screen | Planned filename |
| --- | --- |
| Character conversation | `messages-chat.png` |
| Interaction event menu | `chat-actions.png` |
| Voice call demo | `voice-call.png` |
| Video call demo | `video-call.png` |
| QQ Zone | `zone.png` |
| Character Profile | `profile.png` |
| Memories | `memories.png` |

## Current Status

**Portfolio MVP / v0.1**

Current limitations:

- Some Zone, album, channel, and social write controls are presentation-only prototypes.
- Voice and video are intentionally high-fidelity local demo experiences; realtime media and WebRTC are outside the Portfolio MVP scope.
- Diary content appears within the memory experience but does not yet have a standalone full page.
- Live AI Mode requires a valid compatible provider and credentials.

The approved default avatar and dedicated Channel artwork were repaired in commit `91a8670` and now render directly. Diary and Zone remain configured only as defensive fallbacks.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Validation

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Future Roadmap

- Standalone Diary experience
- Richer call runtime
- Social interaction write flows
- Memory summarization
- Character package import/export
- Additional AI provider adapters
