# Todos

## Test tooling: coverage threshold isn't actually enforced

`app/jest.config.js` sets `collectCoverage: true` and a 90% lines/statements
threshold for `src/components/**`, but this does not apply when running
`yarn test:run` (`react-scripts test`).

- Confirmed by running `CI=true yarn test:run` — no coverage summary table
  is printed at all, despite `collectCoverage: true`.
- Root cause: Create React App's Jest runner (`react-scripts test`) does not
  read external `jest.config.js` files. It only accepts overrides via the
  `"jest"` key in `package.json`, or by ejecting.
- Practical effect: the "new component code needs 90% coverage" convention
  documented in the root `CLAUDE.md` isn't actually gated by CI/local test
  runs today. Don't treat "tests pass" as proof of coverage — check the
  test files directly.
- Possible fixes (not done, needs a decision):
  - Move the relevant options into `app/package.json`'s `"jest"` key so
    CRA picks them up, or
  - Add a separate script that runs Jest directly against
    `app/jest.config.js` (bypassing the `react-scripts test` wrapper) for
    a coverage-checking CI step.

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
