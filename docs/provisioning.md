# Provisioning: Neon + Google OAuth

How to (re)run the cloud setup for this app, and where every credential in
`.env.local` comes from — for whoever has to rotate one later.

## Running it

```
./scripts/provision.sh
```

It's an interactive wizard: it opens each dashboard page in your browser,
tells you exactly what to click, and captures what you paste back into
`.env.local`. See `.env.example` for the full list of variables it produces.

**This is a human-only procedure.** It involves clicking through the Neon
and Google Cloud consoles, which cannot be scripted or delegated to an
agent — an account with billing/ownership implications is being created.

Re-running the script is safe. It reads `.env.local` first: for values tied
to a resource that would be duplicated by re-running the browser steps (the
Neon project, the Google OAuth client), it asks whether to keep what's
already there instead of walking through creation again. For every other
value, pressing Enter at a prompt keeps the current one.

## Why this shape

Background: `docs/adr/0001-neon-postgres-with-rls.md` (why Neon Postgres +
RLS) and `docs/adr/0002-neon-auth-google-only.md` (why Neon Auth, why
Google-only). This script provisions the accounts those ADRs assume exist;
it doesn't change how the app reads them — as of this ticket, `src/App.tsx`
doesn't consume any of these variables yet. That's later work.

## Where each value comes from, for rotation

| Variable | Source | Rotate by |
|---|---|---|
| `DATABASE_URL` | Neon console → project → Connection Details | Neon console → reset password on the role, then re-run the wizard's Stage 1 (it'll offer to keep the project, just paste the new string) |
| `NEON_PROJECT_ID` | Neon console → project settings, or the console URL | Doesn't rotate — identifies the project itself |
| `VITE_NEON_DATA_API_URL` | Neon console → project → Data API settings | Stable once the project exists; re-copy if Neon ever changes the endpoint |
| `VITE_NEON_AUTH_PROJECT_ID` | Neon console → Auth tab | Doesn't rotate — identifies the Neon Auth instance |
| `VITE_NEON_AUTH_PUBLISHABLE_KEY` | Neon console → Auth tab | Public by design; only rotate if Neon adds a rotation control (currently no known self-serve rotation) |
| `NEON_AUTH_SECRET_KEY` | Neon console → Auth tab (if shown; optional, not currently read by app code) | Neon console, if/when a rotation control exists |
| `GOOGLE_OAUTH_CLIENT_ID` | Google Cloud console → APIs & Services → Credentials | Doesn't rotate on its own — create a new OAuth client to replace it |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google Cloud console → APIs & Services → Credentials | Google Cloud console → the OAuth client → "Add secret" / reset, then update Neon Auth's Google provider config and re-run the wizard's Stage 4 |
| `GOOGLE_OAUTH_REDIRECT_URI_LOCAL` / `GOOGLE_OAUTH_REDIRECT_URI_PROD` | Shown by Neon's "enable Google sign-in" screen; registered on the Google OAuth client | Re-check both dashboards if either one ever changes its callback URL format |

If a credential in this table is compromised: rotate it at its source
(the row's "Rotate by" column), then re-run `./scripts/provision.sh` and
answer "no" (don't keep) at the relevant stage so the wizard walks you
through the replacement and writes the new value.

## Never commit `.env.local`

`.env`, `.env.local`, and `.env.*.local` are all covered by `.gitignore`.
`.env.example` lists every variable name with no real value and *is*
committed — keep it in sync whenever `scripts/provision.sh` adds or renames
a variable.
