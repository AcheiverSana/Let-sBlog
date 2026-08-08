# E2E Tests (Playwright)

End-to-end tests for the Let'sBlog app, driving the real client UI in a browser.

## Setup

```bash
cd e2e
npm install
npm run install:browsers   # downloads Chromium/Firefox/WebKit
```

## Running

By default the config boots the Vite dev server for you (`../client`, port `5173`)
and tears it down after the run — you don't need anything else running for the
core suite (`navigation`, `auth` validation, `posts` filters, `protected-routes`).

```bash
npm test                 # headless, all browsers
npm run test:headed      # see the browser
npm run test:ui          # interactive UI mode
npm run report           # open the last HTML report
```

Run a single file or grep by title:

```bash
npx playwright test tests/navigation.spec.js
npx playwright test -g "sign in"
```

### Against an already-running app

If you already have `client` (and optionally `api`) running, point the tests
at it instead of letting Playwright manage the dev server:

```bash
E2E_BASE_URL=http://localhost:5173 E2E_SKIP_WEBSERVER=1 npm test
```

### Full-stack tests (require a live API + database)

A few tests are skipped by default because they need a real API and MongoDB
connection (e.g. actually creating a user, or viewing a specific post):

```bash
# Sign up -> sign in happy path
E2E_FULL_STACK=1 npm test tests/auth.spec.js

# Viewing a real post page
E2E_POST_SLUG=my-existing-post-slug npm test tests/posts.spec.js
```

## What's covered

- `navigation.spec.js` – header/footer render, nav links, search bar routing.
- `auth.spec.js` – sign up/sign in form rendering, client-side validation
  errors, invalid-credentials error alert, and (opt-in) a real sign up →
  sign in flow.
- `posts.spec.js` – home page hero/CTA, search page filters and URL state,
  (opt-in) a real post page.
- `protected-routes.spec.js` – anonymous users get redirected away from
  `/dashboard`, `/create-post`, `/update-post/:id`.

## Notes

- Tests avoid depending on seeded database content by default so they can run
  against a totally empty database. Anything that needs real data is gated
  behind an env var and skipped otherwise.
- `playwright.config.js` runs against Chromium, Firefox, WebKit, and a mobile
  Chrome viewport. Trim the `projects` array if you only need one.
