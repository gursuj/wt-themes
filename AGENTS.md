# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, and others that read AGENTS.md) when working with code in this repository.

## What this is

Windows Terminal Themes (windowsterminalthemes.dev) — a site to preview and copy colour schemes for Windows Terminal. It's a Yarn workspaces monorepo with two packages:

- `app` — the React (Create React App + TypeScript) frontend
- `server` — an Express API that compiles the theme list

## Commands

Run from the repo root unless noted.

- `yarn start` — runs server + app together (`concurrently`)
- `yarn start:app` — app only (react-scripts, port 3000)
- `yarn start:server` — server only (port 3001), also regenerates `themes.json` first (`yarn get`)
- `yarn lint` — eslint over `app/src/**/*.js` (note: this glob only catches `.js`, not `.tsx`/`.ts`)
- `yarn test:dev` — full test suite: Jest unit tests then Cypress e2e
- `yarn ci` — what CI runs: builds the app, starts server+app, then runs the test suite

Inside `app/`:
- `yarn unit:watch` — Jest in watch mode (`react-scripts test --watchAll`)
- `yarn test:run` — Jest single run
- `yarn cy:open` — open Cypress interactively
- `yarn cy:run` — run Cypress headless
- To run a single Jest test file: `yarn test:run -- ColourTest` (react-scripts test filters by filename pattern)

Inside `server/`:
- `yarn dev` — regenerates `themes.json` then runs the server with nodemon (`isDev` flag skips GitHub API calls, reads local JSON instead)
- `yarn get` — just regenerates `themes.json` (`run-themes.js` → `get-themes.js`)
- Requires a GitHub token: create `.env.private` with `GITHUB_TOKEN=...` for non-CI runs (loaded via `custom-env`)

## Architecture

### Theme data pipeline

`themes.json` (repo root) is a generated artifact, not hand-edited. It's produced by `server/get-themes.js`:

1. Fetches every scheme file from `mbadolato/iTerm2-Color-Schemes` (windowsterminal format) via the GitHub API
2. Fetches `app/src/custom-colour-schemes.json` and merges in any theme not already present in the iTerm2 set
3. Attaches `meta` to each theme: `isDark` (via `get-contrast` luminance check against `#000`) and `credits` (matched by name from `app/src/credits.json` + `credits/manual-credits.json`)
4. Sorts alphabetically and writes the combined result to `./themes.json`

This runs on a daily cron (`server/server.js`, `node-cron`, midnight Europe/London) and is served at `/api/v1/themes`. In production the app calls a deployed AWS API Gateway URL instead (hardcoded in `app/src/App.tsx`); if that fetch fails, the app falls back to the bundled `app/src/backupthemes.json` snapshot via dynamic import.

**To add a new theme**: add it to `app/src/custom-colour-schemes.json` and optionally credit it in `app/src/credits.json`. Don't hand-edit `themes.json` or `backupthemes.json`.

### App state

`App.tsx` fetches themes and renders `Home` (or a `Skeleton` while loading). `Home` owns all real UI state via a single reducer in `components/Home/homeState.ts` (using `immer` for the draft updates), covering: active theme, filtered theme list (by light/dark shade), background colour, preview mode (`console` vs `colour`), screen size, and toast messages. Actions are typed in `src/types.d.ts` (`actionTypes`) — add new state transitions there and in the reducer's switch statement together.

`utils/setcolours.ts` pushes theme colours into CSS custom properties so component CSS Modules can consume them.

Preview rendering has two modes, each its own component:
- `ColourTest` — swatches of all 16 ANSI colours
- `ConsoleTest` — simulates terminal output using canned "commands" (`components/ConsoleTest/codeblocks.ts`, `methods.tsx`)

### Path aliases

`app/tsconfig.json` sets `baseUrl: "src"`, so imports like `components/Home/Home` and `utils/setcolours` are absolute from `src/` — not relative paths. Match this convention for new files.

### Credits data

`credits/` at the repo root holds source data for theme attribution (`auto-credits.json`, `manual-credits.json`, `iterm-credits.md`, plus `parse-iterm-credits.js` to regenerate from the iTerm2 repo's markdown). `app/src/credits.json` is the subset actually bundled with the app. `manual-credits.json` is for themes not sourced from iTerm2-Color-Schemes.

## Conventions

- Single quotes, semicolons, 2-space indent, trailing commas (ES5-style) — enforced by Prettier (`.prettierrc`) and eslint's `prettier` config
- `@typescript-eslint/explicit-function-return-type` is enforced (with allowances for expressions/typed function expressions) — annotate return types on named functions
- CSS Modules (`*.module.css`) alongside each component, not global stylesheets
- Jest coverage threshold is 90% lines/statements for `src/components/**`, enforced via `app/package.json`'s `"jest"` key (not a standalone `jest.config.js` — `react-scripts test` ignores those) plus `test:run`'s `--coverage` flag — new component code needs tests to match
