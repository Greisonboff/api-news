# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npm run dev` — run with hot reload (`tsx watch src/server.ts`) on `0.0.0.0:$PORT` (default 3030)
- `npm run build` / `npm start` — compile to `dist/` and run it
- `npm run typecheck` — `tsc --noEmit` (no lint setup)
- `npm test` — Vitest (`test/`), providers are mocked, no network calls
- Single test: `npx vitest run -t "nome do teste"`

Manual request: `curl "http://localhost:3030/news?limit=3" -H "x-api-key: $API_KEY_AUTH"`

## Environment

Loaded from `.env` via `dotenv/config` (first import in `src/server.ts`) and validated in `src/config/env.ts`, which throws at import time if a required variable is missing:

- `API_KEY_AUTH` (required) — expected value of the `x-api-key` header
- `IA_TOKEN_TAVILY` (required) — Tavily API key
- `PORT` (optional, default 3030)

Tests get these from `vitest.config.mts` (`test.env`).

## Architecture

Fastify 5 + TypeScript (CommonJS). `server.ts` → `app.ts` (`buildApp()`) → `routes/` → `controllers/` → `services/`. Tests call `buildApp({ logger: false })` and use `app.inject()`.

- **Rate limit**: `@fastify/rate-limit`, global, 30 req/min.
- **Auth** (`middleware/auth.ts`, constant-time compare) is an `onRequest` hook registered inside the `news` plugin, so it only covers `/news`. `/health` is public.
- **Validation**: JSON schemas in `routes/news.ts` for querystring (`limit` integer 1–10, default 1) and responses (200/500/502).
- **Provider fallback chain** (`controllers/news.controller.ts`): `[tavilySearch, wired]`, each called with `limit`; the first with `success: true` and non-empty `data` wins. There is intentionally no cache: every request must fetch fresh data. Each provider fetches a larger pool and returns `sample(pool, limit)` (`utils/sample.ts`), so repeated requests return different articles. Tavily uses `maxAgeHours: 0` (bypasses Tavily's server-side cache) and an English query, because its pt-BR news index returns too few results to sample from.
- Providers return `ProviderResult` (`types/news.ts`): `{ success, provider, message, data?: Article[], error? }`. They never throw and never log; the controller logs failures via `request.log`. New providers: follow this contract, normalize to `Article`, add to the `Provider` enum and the `providers` array, set a timeout on outbound requests.
- Public response is `News`: `{ success, provider, message, data: Article[] | null }`. HTTP status reflects the outcome (502 when all providers fail, 500 on unexpected error).
- Use `request.log` / `app.log` instead of `console`; never log tokens.

Response/log messages and the README are written in Brazilian Portuguese.
