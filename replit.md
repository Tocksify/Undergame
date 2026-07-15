# Echo Realm

A Memory Keeper's Tale — a retro terminal-style RPG (movement, dialogue, battles) built as a Vite/React frontend with an Express API server and Postgres/Drizzle backend.

## Run & Operate

- `pnpm --filter @workspace/echo-realm run dev` — run the game frontend (workflow: `artifacts/echo-realm: web`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (workflow: `artifacts/api-server: API Server`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (already provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (`artifacts/echo-realm`), terminal/ASCII aesthetic
- API: Express 5 (`artifacts/api-server`)
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec, `lib/api-spec` -> `lib/api-client-react`)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/echo-realm/src/game/` — game engine, renderer, battle system, dialogue, constants (currently a small prototype: single short story, no shops/quests/save system yet)
- `artifacts/echo-realm/src/game/TouchControls.tsx` — on-screen D-pad/action buttons shown automatically on touch devices, mirrors the keyboard mapping in `engine.ts`
- `artifacts/api-server/src/` — Express routes/middlewares
- `lib/db/src/schema/` — Drizzle schema

## Architecture decisions

- The game currently runs entirely client-side with no persistence — no accounts, no save slots. Adding those requires wiring the existing API server + DB.

## Product

- Echo Realm is a short RPG prototype (movement, dialogue, one battle system). The user wants it expanded into a much longer game (3+ hours), with item tiers, shops, main/side quests, and save slots tied to accounts — tracked as follow-up tasks.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Status

All three workflows (Echo Realm frontend, API Server, Canvas/mockup-sandbox) are running, dependencies are installed, and the dev database schema has been pushed. Registration/login was verified working end-to-end.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
