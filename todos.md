# Todos

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

## Add new themes
either add these through [iTerm2 Color Schemes](https://github.com/mbadolato/iTerm2-Color-Schemes#contribute)
or dedicated branch that can be merged to upstream (by branching off last commit of upstream rather than my fork)
- https://github.com/rjcarneiro/windows-terminals
- https://terminalsplash.com/
