# Sonic Particles Front-End

Sonic Particles Front-End is a dark Apple Music playback surface built around the original particle artwork visual treatment. It combines the visual control panel, Apple Music search and library browsing, artwork-driven particle rendering, and a floating playback overlay in one front-end-focused package.

## What It Includes

- Original particle visual behavior with Apple Music artwork as the image source
- Apple Music connection flow with a dedicated fallback login surface
- Search for songs, albums, and playlists from both catalog and library
- Drill into albums and playlists to choose a specific track
- Floating player overlay with progress, volume, shuffle, repeat, favorite, and transport controls
- Fullscreen mode plus toggleable sidebar and player visibility

## Main Front-End Files

```text
src/04-surface/pwa/
  index.html
  styles.css
  app.js
  apple-music-login.html
  apple-music-login.js
```

## Requirements

- Node.js 18 or newer
- Apple Music developer credentials or a pre-generated developer token

## Local Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in the Apple Music values you want to use:

- `APPLE_MUSIC_DEVELOPER_TOKEN`
- or `APPLE_MUSIC_TEAM_ID`, `APPLE_MUSIC_KEY_ID`, and `APPLE_MUSIC_PRIVATE_KEY_PATH`
- `APPLE_MUSIC_STOREFRONT`
- `APPLE_MUSIC_TOKEN_ORIGIN`

3. Start the local server:

```bash
npm run dev
```

The surface is served on port `4173` by default unless `PORT` is overridden.

## Available Scripts

```bash
npm run dev
npm run start
npm run test
```

## Notes

- Keep real tokens, private keys, and `.env` values out of git.
- `.env.example` contains placeholders only.
- The Apple Music identity flow uses the local server endpoints exposed by `server.js`.
