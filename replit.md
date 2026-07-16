# Echo Realm

**A Memory Keeper's Tale** — a retro terminal-style browser RPG. Explore a dying world, recover lost echoes, and battle creatures of the Void.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend (game) | React + Vite, TypeScript |
| Backend | Express 5, TypeScript, built with esbuild |
| Database | PostgreSQL (Replit managed), Drizzle ORM |
| Monorepo | pnpm workspaces |

## Artifacts

| Name | Path | Dev URL |
|------|------|---------|
| Echo Realm (game) | `artifacts/echo-realm` | port 19761 |
| API Server | `artifacts/api-server` | port 8080 |
| Mockup Sandbox | `artifacts/mockup-sandbox` | design canvas |

## Shared Libraries

- `lib/db` — Drizzle schema + PostgreSQL pool
- `lib/api-spec` — shared API type definitions
- `lib/api-zod` — Zod validators for the API
- `lib/api-client-react` — React Query hooks for the API

## Running the project

```bash
# Install all dependencies
pnpm install

# Push database schema
pnpm --filter @workspace/db run push

# Start the game (dev server)
pnpm --filter @workspace/echo-realm run dev

# Start the API server
pnpm --filter @workspace/api-server run dev
```

Workflows are pre-configured in Replit — just start them from the workflow panel.

## Environment variables / secrets

| Variable | Required by | Notes |
|----------|------------|-------|
| `DATABASE_URL` | API Server, db lib | Provided automatically by Replit's managed PostgreSQL |
| `SESSION_SECRET` | API Server | Set in Replit Secrets |

## Desktop build (Windows)

See `Desktop-Setup/README.md` for instructions on packaging Echo Realm as a Windows `.exe` using Electron.

## User preferences

- Keep the existing monorepo structure (pnpm workspaces).
- Do not restructure or migrate the stack unless explicitly requested.
