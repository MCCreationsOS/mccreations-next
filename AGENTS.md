<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This repo is a single **Next.js 16 (App Router, Turbopack, React 19)** frontend named MCCreations. There is no local backend — the app fetches all data from the hosted API defined in `next.config.js` (`DATA_URL` / `LOGGING_URL` point at `https://api2.mccreations.net`). No `.env` file is required to run; those URLs are baked into `next.config.js`. Anonymous browsing (home, maps/datapacks/resourcepacks listings, search, and creation detail pages) works out of the box against the live API. Actions requiring auth (sign in/up, upload, dashboard writes) hit the production API and need real credentials/keys, so they won't work locally without them.

Services & commands (see `package.json`):
- Dev server: `npm run dev` (Next + Turbopack) → http://localhost:3000. The app is internationalized; routes are locale-prefixed, e.g. `/en-US/`, `/en-US/maps`. Bare paths like `/maps` 307-redirect and a wrong locale like `/en` renders not_found — always use the full `en-US` locale prefix.
- Build: `npm run build`. Production start: `npm run start`.
- Lint: there is **no ESLint config or `lint` script** in this repo (`eslint-config-next` is installed but unused), and `next lint` was removed in Next 16 — there is currently no working lint command.
- Tests: there is **no test framework/script** configured.

Gotchas:
- `next dev`/`next build` auto-generate/rewrite `AGENTS.md` (the `nextjs-agent-rules` block), `CLAUDE.md`, and modify `next-env.d.ts` (`.next/dev/types/...`). These appear as uncommitted changes on every run; this is expected. Sentry may also print harmless deprecation warnings on startup.
