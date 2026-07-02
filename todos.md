# Todos

## Test tooling: coverage threshold now actually enforced (2026-07-02)

Fixed: `app/jest.config.js` was dead — CRA's `react-scripts test` never
reads standalone `jest.config.js` files, only the `"jest"` key in
`package.json` (confirmed via `CI=true yarn test:run` printing no coverage
table despite `collectCoverage: true`). Moved `collectCoverageFrom`,
`coveragePathIgnorePatterns`, and `coverageThreshold` (90% lines/statements)
into `app/package.json`'s `"jest"` key, added `--coverage` to the
`test:run` script, and deleted the now-unused `app/jest.config.js`.

Enforcing it for real exposed that actual coverage was only ~34.5% against
the documented 90% target, so `yarn ci` would have started failing.
Closed the gap by adding tests for every under-covered component
(ColourTest, ConsoleTest, ThemeSelect, Toast, Toggle/Toggles, MoreContent,
Home, homeState reducer cases, homeMethods, consoleMethods) — coverage is
now ~98.6% lines/statements and `yarn workspace @windowsterminalthemes/app
test:run` passes clean.

## Random theme feature — test coverage added (2026-07-02)

Added alongside the `RANDOM` action (dropdown/button/shortcut to jump to a
random theme within the current light/dark filter):

- `app/src/components/Home/Home.test.js`: reducer test for the `RANDOM`
  case (mocks `Math.random` to check both ends of the filtered list) and a
  test that the `R` keyboard shortcut dispatches `{type: 'RANDOM'}`.
- `app/cypress/integration/themes.spec.js`:
  - random button visibility (`should default to theme in param for
    sharing` / `UI always be visible` tests)
  - random pick stays within the current filtered (light/dark) theme list
  - `R` keyboard shortcut selects a theme within the filtered list
- Fixed a pre-existing Cypress test (`should select next/previous with
  keyboard [A] and [D]`) whose "type anything else, shouldn't change theme"
  junk-key string included `r` — this would have broken once `R` became a
  meaningful shortcut, since typing it mid-string now changes the theme.

## Optional: free deployment path for a fork/clone

The live site (`windowsterminalthemes.dev`) deploys the frontend to GitHub
Pages (`yarn workspace @windowsterminalthemes/app deploy`, via `gh-pages`,
domain set in `app/public/CNAME`) and serves themes in production from a
hardcoded AWS API Gateway URL (`App.tsx`), backed by a Lambda in the
separate `atomcorp/terminal-api` repo — not part of this codebase.

To deploy a fork for free without needing an AWS account:

- Frontend: `yarn workspace @windowsterminalthemes/app deploy` already
  does GitHub Pages for free (drop `app/public/CNAME` if no custom domain
  is wanted). Netlify/Vercel free tiers also work for the CRA build.
- Backend: not strictly needed — `App.tsx` already falls back to the
  bundled `app/src/backupthemes.json` snapshot if the API fetch fails.
  Cheapest path: skip a live API, and instead refresh
  `app/src/backupthemes.json` on a schedule via a free GitHub Actions
  cron job that runs `yarn get` (`server/get-themes.js`) and commits the
  result, then redeploy.
- If a live daily-refreshing API is wanted instead, AWS Lambda + API
  Gateway's free tier (1M Lambda requests/month; API Gateway free for 12
  months then pennies at this traffic) covers it — would need porting
  `server/get-themes.js` into a Lambda handler and swapping `node-cron`
  for an EventBridge scheduled rule.
