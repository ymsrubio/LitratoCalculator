---
status: accepted
---

# Neon Auth, with Google as the only sign-in method

Row-Level Security needs a trusted issuer of signed JWTs to identify the user, so
an auth provider is the other half of the security model recorded in ADR-0001. We
chose **Neon Auth** — Neon's managed service built on Better Auth — with **Google
OAuth as the only sign-in method** for v1.

## Why Neon Auth

It keeps identity in the same Postgres database as the application data, under the
`neon_auth` schema, so user records are ordinary rows that RLS policies and SQL
joins can reach. It is also the same vendor as the database, meaning one
integration, one dashboard, and one bill.

**Clerk was the serious alternative** and is the more battle-tested product, with a
more polished prebuilt login UI. It was rejected because it would introduce a
second vendor to solve a problem we do not have: our accounts are single-owner, so
we rarely need to look up who owns a Job, which removes most of the benefit of
Clerk's richer user management.

The accepted risk is that **Neon Auth is in Beta**, and it supports AWS regions
only. This was a deliberate risk-tolerance decision rather than a technical one;
Better Auth underneath is well established, so the beta label applies to Neon's
managed wrapper rather than to the authentication logic itself. If Neon Auth
proves unstable, Clerk remains the fallback.

## Why Google only

Every forgotten password is a support request from a non-technical user, and
account recovery is the most common way such a user loses access to an app
permanently. Google sign-in removes passwords, password reset, and email
verification from the product entirely, and our users are already signed into
Google on the phones they will use. Email and password can be added later if
someone actually asks for it.

## Consequences

Auth providers carry unusually heavy lock-in: user accounts live with the
provider, and while OAuth links can often be rematched by email address, password
hashes generally cannot be exported. In practice, changing this decision later
means asking every existing user to sign up again. It should be treated as
effectively permanent once real users exist.
