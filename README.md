# Radio Unit

Radio Unit is a modular Node.js scaffold for building an AI-assisted radio workflow with music retrieval, voice generation, runtime orchestration, and a surface layer for interactive control.

The project is organized as a four-layer system:

- `01-external-context`: provider adapters, tests, and user-facing configuration templates
- `02-local-brain`: request routing, environment loading, scheduling hooks, and orchestration logic
- `03-runtime-aggregation`: prompt assets and runtime context assembly
- `04-surface`: HTTP contract and interactive surface files

## Highlights

- Provider-based architecture for music, model, and voice integrations
- Apple Music token generation support from MusicKit credentials
- Local routing layer for search, identity lookup, health checks, and runtime actions
- Prompt and context separation for easier experimentation
- Test coverage for provider modules

## Project Structure

```text
src/
  01-external-context/
    brain/
    music/
    user/
    voice/
  02-local-brain/
    context.js
    router.js
    scheduler.js
    tts.js
  03-runtime-aggregation/
    prompts/
  04-surface/
    http/
    pwa/
server.js
package.json
```

## Requirements

- Node.js 18 or newer

## Getting Started

1. Install dependencies if you add any runtime packages later.
2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Fill in the providers you want to use.
4. Start the local server:

```bash
npm run dev
```

The default server port is `4173`.

## Environment Variables

The example file documents the main integration points:

- model provider credentials
- TTS provider credentials
- Netease API base URL
- Apple Music developer token or MusicKit key settings

Do not commit your real `.env`, MusicKit private key, or any generated developer token.

## Scripts

```bash
npm run dev
npm run start
npm run test
```

## Notes

- `.env.example` is safe to share and contains placeholders only.
- The repository is structured to keep provider code, orchestration logic, and surface code separate.
- Some internal documentation and deployment-specific notes can stay local and do not need to be part of the first public publish.
