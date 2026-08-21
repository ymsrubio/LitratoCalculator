---
status: accepted
---

# Neon Postgres with Row-Level Security

The app is becoming multi-tenant: any photobooth operator can sign up, and no user
may ever see another user's Jobs. We chose **Neon Postgres**, with isolation
enforced by **Row-Level Security** policies keyed to the signed-in user's JWT, and
the browser talking to the database directly through the Neon Data API. This
reverses the project's previous standing rule that no database or backend would
ever be introduced.

## Considered options

**Supabase** was the obvious default and is architecturally near-identical, but its
free plan caps you at 2 active projects, which is a real constraint across several
side projects. Neon's free plan allows 100.

**Cloudflare D1** was seriously considered. It was rejected because D1 is only
reachable through a Workers binding — never from a browser — and SQLite has no
Row-Level Security. Choosing it would have meant writing and maintaining our own
Workers API, adding a separate auth library, and enforcing tenant isolation in
application code, where a single forgotten `WHERE user_id = ?` leaks every user's
data. That is roughly two to three extra weeks of work in exchange for accepting
the weaker security model.

## Consequences

Isolation is enforced by the database rather than by our code, so an application
bug cannot leak another tenant's rows. The trade-off is that **RLS policies become
security-critical infrastructure**: a missing or wrong policy is a data breach, not
a bug, so every new table holding user data must have its policies written and
verified as part of the same change that creates it.

Because the browser holds a direct connection to Postgres, the JWT is the entire
security boundary. Nothing may be trusted from the client beyond what its signed
token asserts.
