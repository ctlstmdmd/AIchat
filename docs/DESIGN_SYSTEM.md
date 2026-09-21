# QQ-inspired Design System

The visual language is a light, dense social product: cool neutral surfaces, one clear QQ-blue accent, compact rows, and restrained shadows. It is not a phone-shell skin or an AI dashboard.

## Tokens

Tokens live in `app/globals.css`: `--accent`, `--app-bg`, `--panel-bg`, `--hover`, `--text`, `--text-secondary`, `--border`, `--radius`, `--shadow`, rail width, and secondary pane width. Components consume tokens rather than duplicating colors.

## Layout

Desktop uses a 68px primary rail, a 292px conversation pane, and a flexible content pane. Below 820px the rail and main pane become mobile-first views with a fixed four-item bottom navigation and no horizontal overflow.

## Interaction

Selected, hover, unread, online, empty, and focused states are represented in the shell. Icon buttons have accessible labels; controls keep visible focus outlines via browser defaults and accent focus shadows. Motion is limited to short color/shadow transitions.
